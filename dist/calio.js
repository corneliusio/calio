function noop() {}

function assign(tar, src) {
	for (const k in src) tar[k] = src[k];
	return tar;
}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

function run_all(fns) {
	fns.forEach(run);
}

function is_function(thing) {
	return typeof thing === 'function';
}

function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function append(target, node) {
	target.appendChild(node);
}

function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

function detach(node) {
	node.parentNode.removeChild(node);
}

function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

function element(name) {
	return document.createElement(name);
}

function text(data) {
	return document.createTextNode(data);
}

function space() {
	return text(' ');
}

function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

function children(element) {
	return Array.from(element.childNodes);
}

function set_data(text, data) {
	data = '' + data;
	if (text.data !== data) text.data = data;
}

function custom_event(type, detail) {
	const e = document.createEvent('CustomEvent');
	e.initCustomEvent(type, false, false, detail);
	return e;
}

let current_component;

function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error(`Function called outside component initialization`);
	return current_component;
}

function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

function createEventDispatcher() {
	const component = current_component;

	return (type, detail) => {
		const callbacks = component.$$.callbacks[type];

		if (callbacks) {
			// TODO are there situations where events could be dispatched
			// in a server (non-DOM) environment?
			const event = custom_event(type, detail);
			callbacks.slice().forEach(fn => {
				fn.call(component, event);
			});
		}
	};
}

const dirty_components = [];

const resolved_promise = Promise.resolve();
let update_scheduled = false;
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];

function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

function tick() {
	schedule_update();
	return resolved_promise;
}

function add_binding_callback(fn) {
	binding_callbacks.push(fn);
}

function add_render_callback(fn) {
	render_callbacks.push(fn);
}

function flush() {
	const seen_callbacks = new Set();

	do {
		// first, call beforeUpdate functions
		// and update components
		while (dirty_components.length) {
			const component = dirty_components.shift();
			set_current_component(component);
			update(component.$$);
		}

		while (binding_callbacks.length) binding_callbacks.shift()();

		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		while (render_callbacks.length) {
			const callback = render_callbacks.pop();
			if (!seen_callbacks.has(callback)) {
				callback();

				// ...so guard against infinite loops
				seen_callbacks.add(callback);
			}
		}
	} while (dirty_components.length);

	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}

	update_scheduled = false;
}

function update($$) {
	if ($$.fragment) {
		$$.update($$.dirty);
		run_all($$.before_render);
		$$.fragment.p($$.dirty, $$.ctx);
		$$.dirty = null;

		$$.after_render.forEach(add_render_callback);
	}
}

let outros;

function group_outros() {
	outros = {
		remaining: 0,
		callbacks: []
	};
}

function check_outros() {
	if (!outros.remaining) {
		run_all(outros.callbacks);
	}
}

function on_outro(callback) {
	outros.callbacks.push(callback);
}

function get_spread_update(levels, updates) {
	const update = {};

	const to_null_out = {};
	const accounted_for = { $$scope: 1 };

	let i = levels.length;
	while (i--) {
		const o = levels[i];
		const n = updates[i];

		if (n) {
			for (const key in o) {
				if (!(key in n)) to_null_out[key] = 1;
			}

			for (const key in n) {
				if (!accounted_for[key]) {
					update[key] = n[key];
					accounted_for[key] = 1;
				}
			}

			levels[i] = n;
		} else {
			for (const key in o) {
				accounted_for[key] = 1;
			}
		}
	}

	for (const key in to_null_out) {
		if (!(key in update)) update[key] = undefined;
	}

	return update;
}

function mount_component(component, target, anchor) {
	const { fragment, on_mount, on_destroy, after_render } = component.$$;

	fragment.m(target, anchor);

	// onMount happens after the initial afterUpdate. Because
	// afterUpdate callbacks happen in reverse order (inner first)
	// we schedule onMount callbacks before afterUpdate callbacks
	add_render_callback(() => {
		const new_on_destroy = on_mount.map(run).filter(is_function);
		if (on_destroy) {
			on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});

	after_render.forEach(add_render_callback);
}

function destroy(component, detaching) {
	if (component.$$) {
		run_all(component.$$.on_destroy);
		component.$$.fragment.d(detaching);

		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		component.$$.on_destroy = component.$$.fragment = null;
		component.$$.ctx = {};
	}
}

function make_dirty(component, key) {
	if (!component.$$.dirty) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty = blank_object();
	}
	component.$$.dirty[key] = true;
}

function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
	const parent_component = current_component;
	set_current_component(component);

	const props = options.props || {};

	const $$ = component.$$ = {
		fragment: null,
		ctx: null,

		// state
		props: prop_names,
		update: noop,
		not_equal: not_equal$$1,
		bound: blank_object(),

		// lifecycle
		on_mount: [],
		on_destroy: [],
		before_render: [],
		after_render: [],
		context: new Map(parent_component ? parent_component.$$.context : []),

		// everything else
		callbacks: blank_object(),
		dirty: null
	};

	let ready = false;

	$$.ctx = instance
		? instance(component, props, (key, value) => {
			if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
				if ($$.bound[key]) $$.bound[key](value);
				if (ready) make_dirty(component, key);
			}
		})
		: props;

	$$.update();
	ready = true;
	run_all($$.before_render);
	$$.fragment = create_fragment($$.ctx);

	if (options.target) {
		if (options.hydrate) {
			$$.fragment.l(children(options.target));
		} else {
			$$.fragment.c();
		}

		if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
		mount_component(component, options.target, options.anchor);
		flush();
	}

	set_current_component(parent_component);
}

class SvelteComponent {
	$destroy() {
		destroy(this, true);
		this.$destroy = noop;
	}

	$on(type, callback) {
		const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
		callbacks.push(callback);

		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	$set() {
		// overridden by instance, if it has props
	}
}

const token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhsTt])\1?|[LloS]|"[^"]*"|'[^']*'/g;
const formats = {
    masks: {
        default: 'ddd mmm dd yyyy 00:00:00',
        shortDate: 'm/d/yy',
        mediumDate: 'mmm d, yyyy',
        longDate: 'mmmm d, yyyy',
        fullDate: 'dddd, mmmm d, yyyy',
        isoDate: 'yyyy-mm-dd',
        isoDateTime: "yyyy-mm-dd'T'00:00:00",
        isoUtcDateTime: "yyyy-mm-dd'T'00:00:00'Z'"
    },
    i18n: {
        dayNames: [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
            'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
        ],
        monthNames: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ]
    }
};

function pad(val, len = 2) {
    val = `${val}`;
    while (val.length < len) {
        val = `0${val}`;
    }

    return val;
}

function format(date, mask = 'default') {

    if (typeof date === 'object' && 'timestamp' in date) {
        date = date.timestamp();
    }

    date = date instanceof Date ? date : new Date(date);
    mask = `${formats.masks[mask] || mask || formats.masks.default}`;

    let d = date.getUTCDate(),
        D = date.getUTCDay(),
        m = date.getUTCMonth(),
        y = date.getUTCFullYear(),
        flags = {
            d: d,
            dd: pad(d),
            ddd: formats.i18n.dayNames[D],
            dddd: formats.i18n.dayNames[D + 7],
            m: m + 1,
            mm: pad(m + 1),
            mmm: formats.i18n.monthNames[m],
            mmmm: formats.i18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            S: [ 'th', 'st', 'nd', 'rd' ][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
        };

    return mask.replace(token, $0 => {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
}

class LilEpoch {

    constructor(...args) {
        const [ a, b, c ] = args;

        if (args.length > 1) {
            this.value = new Date(a, b, c || 1);
        } else if (a instanceof LilEpoch) {
            this.value = a.clone().value;
        } else if (a instanceof Date) {
            this.value = a;
        } else if ([ 'number', 'string' ].includes(typeof a)) {
            this.value = new Date(a);
        } else {
            this.value = new Date();
        }

        this.value.setUTCHours(0);
        this.value.setUTCMinutes(0);
        this.value.setUTCSeconds(0);
        this.value.setUTCMilliseconds(0);
    }

    year(y = null) {

        if (y !== null) {
            this.value.setUTCFullYear(y);

            return this;
        }

        return this.value.getUTCFullYear();
    }

    month(m = null) {

        if (m !== null) {
            this.value.setUTCMonth(m);

            return this;
        }

        return this.value.getUTCMonth();
    }

    date(d = null) {

        if (d !== null) {
            this.value.setUTCDate(d);

            return this;
        }

        return this.value.getUTCDate();
    }

    addDay(d = 1) {
        this.date(this.date() + d);

        return this;
    }

    addMonth(m = 1) {
        this.month(this.month() + m);

        return this;
    }

    addYear(y = 1) {
        this.year(this.year() + y);

        return this;
    }

    subDay(d = 1) {
        this.date(this.date() - d);

        return this;
    }

    subMonth(m = 1) {
        this.month(this.month() - m);

        return this;
    }

    subYear(y = 1) {
        this.year(this.year() - y);

        return this;
    }

    dayOfWeek() {
        return this.value.getUTCDay();
    }

    endOfMonth() {
        this.addMonth();
        this.date(0);

        return this;
    }

    startOfMonth() {
        this.date(1);

        return this;
    }

    isAfter(day) {
        return this.value > day.value;
    }

    isBefore(day) {
        return this.value < day.value;
    }

    isSame(day) {
        return this.year() === day.year()
            && this.month() === day.month()
            && this.date() === day.date();
    }

    isBetween(day1, day2) {
        return (this.isAfter(day1) && this.isBefore(day2))
            || (this.isAfter(day2) && this.isBefore(day1));
    }

    isSameMonth(day) {
        return this.year() === day.year()
            && this.month() === day.month();
    }

    isSameYear(day) {
        return this.year() === day.year();
    }

    timestamp() {
        return this.value.getTime();
    }

    format(mask) {
        return format(this.timestamp(), mask, true);
    }

    clone() {
        return new LilEpoch(this.timestamp());
    }

    toString() {
        return this.value.toString();
    }
}

/* src/components/Day.svelte generated by Svelte v3.2.2 */

function add_css() {
	var style = element("style");
	style.id = 'svelte-1mp2c5z-style';
	style.textContent = ".calio-day.svelte-1mp2c5z{cursor:pointer;color:var(--color, #333)}.calio-day.svelte-1mp2c5z:hover{color:var(--color-hover, var(--color, #333));background:var(--bg-hover, #EEE)}.calio-day.is-today.svelte-1mp2c5z{font-weight:900}.calio-day.is-prev.svelte-1mp2c5z,.calio-day.is-next.svelte-1mp2c5z{color:var(--color-inactive, #CCC);background:var(--bg-inactive, transparent)}.calio-day.is-disabled.svelte-1mp2c5z{pointer-events:none;color:var(--color-disabled, var(--color-inactive, #CCC));background:var(--bg-disabled, transparent);opacity:var(--opacity-disabled, 0.5)}.calio-day.is-ranged.svelte-1mp2c5z{color:var(--color-ranged, var(--color-active, white));background:var(--bg-ranged, var(--bg-active, rgba(100, 149, 237, 0.66)))}.calio-day.is-active.svelte-1mp2c5z{color:var(--color-active, white);background:var(--bg-active, rgb(100, 149, 237))}";
	append(document.head, style);
}

function create_fragment(ctx) {
	var span, t_value = ctx.day.date(), t, span_class_value, dispose;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			span.className = span_class_value = "calio-day " + ctx.classes + " svelte-1mp2c5z";
			dispose = listen(span, "click", ctx.click_handler);
		},

		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},

		p(changed, ctx) {
			if ((changed.day) && t_value !== (t_value = ctx.day.date())) {
				set_data(t, t_value);
			}

			if ((changed.classes) && span_class_value !== (span_class_value = "calio-day " + ctx.classes + " svelte-1mp2c5z")) {
				span.className = span_class_value;
			}
		},

		i: noop,
		o: noop,

		d(detaching) {
			if (detaching) {
				detach(span);
			}

			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	

    const today = new LilEpoch();
    const dispatch = createEventDispatcher();

    let { view = new LilEpoch(), selection = [], disabled = [], day, min, max, mode } = $$props;

	function click_handler(event) {
		return dispatch('select', day);
	}

	$$self.$set = $$props => {
		if ('view' in $$props) $$invalidate('view', view = $$props.view);
		if ('selection' in $$props) $$invalidate('selection', selection = $$props.selection);
		if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
		if ('day' in $$props) $$invalidate('day', day = $$props.day);
		if ('min' in $$props) $$invalidate('min', min = $$props.min);
		if ('max' in $$props) $$invalidate('max', max = $$props.max);
		if ('mode' in $$props) $$invalidate('mode', mode = $$props.mode);
	};

	let isActive, isDisabled, isRanged, classes;

	$$self.$$.update = ($$dirty = { selection: 1, day: 1, disabled: 1, min: 1, max: 1, mode: 1, view: 1, isDisabled: 1, isRanged: 1, isActive: 1 }) => {
		if ($$dirty.selection || $$dirty.day) { $$invalidate('isActive', isActive = (() => {
                $$invalidate('selection', selection = new Array().concat(selection).filter(Boolean));
        
                return selection.find(s => day.isSame(s));
            })()); }
		if ($$dirty.disabled || $$dirty.day || $$dirty.min || $$dirty.max) { $$invalidate('isDisabled', isDisabled = (() => {
                return (disabled.find(d => d.isSame && d.isSame(day)))
                    || (min && day.isBefore(min))
                    || (max && day.isAfter(max));
            })()); }
		if ($$dirty.mode || $$dirty.selection || $$dirty.day) { $$invalidate('isRanged', isRanged = (() => {
                if (mode === 'range' && selection) {
                    let [ start, end ] = selection;
        
                    if (start && end) {
                        return day.isAfter(start) && day.isBefore(end);
                    }
                }
        
                return false;
            })()); }
		if ($$dirty.day || $$dirty.view || $$dirty.isDisabled || $$dirty.isRanged || $$dirty.isActive) { $$invalidate('classes', classes = [
                day.isSame(today) && 'is-today',
                view && view.endOfMonth().isBefore(day) && 'is-next',
                view && view.startOfMonth().isAfter(day) && 'is-prev',
                isDisabled && 'is-disabled',
                isRanged && 'is-ranged',
                isActive && 'is-active'
            ].filter(Boolean).join(' ')); }
	};

	return {
		dispatch,
		view,
		selection,
		disabled,
		day,
		min,
		max,
		mode,
		classes,
		click_handler
	};
}

class Day extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1mp2c5z-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, ["view", "selection", "disabled", "day", "min", "max", "mode"]);
	}
}

/* src/components/Calio.svelte generated by Svelte v3.2.2 */

function add_css$1() {
	var style = element("style");
	style.id = 'svelte-4rx1aq-style';
	style.textContent = ".calio.svelte-4rx1aq{display:-ms-inline-grid;display:inline-grid;-ms-grid-columns:(var(--size-x, var(--size, 2.25em)))[7];grid-template-columns:repeat(7, var(--size-x, var(--size, 2.25em)));grid-auto-rows:var(--size-y, var(--size, 2em));line-height:var(--size-y, var(--size, 2em));text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.calio-head.svelte-4rx1aq{color:var(--color, #333);font-weight:bold}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.day = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.day = list[i];
	return child_ctx;
}

// (2:4) {#each computed.headers as day}
function create_each_block_1(ctx) {
	var span, t_value = ctx.day, t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			span.className = "calio-head svelte-4rx1aq";
		},

		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},

		p(changed, ctx) {
			if ((changed.computed) && t_value !== (t_value = ctx.day)) {
				set_data(t, t_value);
			}
		},

		d(detaching) {
			if (detaching) {
				detach(span);
			}
		}
	};
}

// (5:4) {#each dates as day}
function create_each_block(ctx) {
	var current;

	var day_spread_levels = [
		{ day: ctx.day },
		ctx.props
	];

	function select_handler(...args) {
		return ctx.select_handler(ctx, ...args);
	}

	let day_props = {};
	for (var i = 0; i < day_spread_levels.length; i += 1) {
		day_props = assign(day_props, day_spread_levels[i]);
	}
	var day = new Day({ props: day_props });
	day.$on("select", select_handler);

	return {
		c() {
			day.$$.fragment.c();
		},

		m(target, anchor) {
			mount_component(day, target, anchor);
			current = true;
		},

		p(changed, new_ctx) {
			ctx = new_ctx;
			var day_changes = (changed.dates || changed.props) ? get_spread_update(day_spread_levels, [
				(changed.dates) && { day: ctx.day },
				(changed.props) && ctx.props
			]) : {};
			day.$set(day_changes);
		},

		i(local) {
			if (current) return;
			day.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			day.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			day.$destroy(detaching);
		}
	};
}

function create_fragment$1(ctx) {
	var div, t, current;

	var each_value_1 = ctx.computed.headers;

	var each_blocks_1 = [];

	for (var i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	var each_value = ctx.dates;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	function outro_block(i, detaching, local) {
		if (each_blocks[i]) {
			if (detaching) {
				on_outro(() => {
					each_blocks[i].d(detaching);
					each_blocks[i] = null;
				});
			}

			each_blocks[i].o(local);
		}
	}

	return {
		c() {
			div = element("div");

			for (var i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}
			div.className = "calio svelte-4rx1aq";
		},

		m(target, anchor) {
			insert(target, div, anchor);

			for (var i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div, null);
			}

			append(div, t);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			add_binding_callback(() => ctx.div_binding(div, null));
			current = true;
		},

		p(changed, ctx) {
			if (changed.computed) {
				each_value_1 = ctx.computed.headers;

				for (var i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(changed, child_ctx);
					} else {
						each_blocks_1[i] = create_each_block_1(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(div, t);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}
				each_blocks_1.length = each_value_1.length;
			}

			if (changed.dates || changed.props) {
				each_value = ctx.dates;

				for (var i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
						each_blocks[i].i(1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].i(1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();
				for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
				check_outros();
			}

			if (changed.items) {
				ctx.div_binding(null, div);
				ctx.div_binding(div, null);
			}
		},

		i(local) {
			if (current) return;
			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

			current = true;
		},

		o(local) {
			each_blocks = each_blocks.filter(Boolean);
			for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

			current = false;
		},

		d(detaching) {
			if (detaching) {
				detach(div);
			}

			destroy_each(each_blocks_1, detaching);

			destroy_each(each_blocks, detaching);

			ctx.div_binding(null, div);
		}
	};
}

function dispatchEvents(dispatch, el, key, data) {
    if (data && typeof data.clone === 'function') {
        data = data.clone();
    } else {
        data = Array.isArray(data)
            ? [ ...data ]
            : { ...data };
    }

    if (el) {
        el.parentNode.dispatchEvent(new CustomEvent(`calio:${key}`, {
            detail: data
        }));
    }

    dispatch(key, data);
}

function updateRange(day, current, strict, disabled) {
    let selection = new Array().concat(current).filter(Boolean) || [],
        index = selection.findIndex(s => s.isSame(day));

    if (index > -1) {
        selection.splice(index, 1);

        return selection;
    } else if (selection.length > 1) {
        return [ day.clone() ];
    }

    selection = [ ...selection, day.clone() ].sort((a, b) => {
        return a.timestamp() - b.timestamp();
    });

    if (strict) {
        let [ start, end ] = selection,
            isInvalid = end && !!disabled.find(d => {
                return d.isAfter(start) && d.isBefore(end);
            });

        if (isInvalid) {
            return;
        }
    }

    return selection;
}

function updateMulti(day, current, limit) {
    let selection = new Array().concat(current).filter(Boolean) || [],
        index = selection.findIndex(s => s.isSame(day));

    if (index > -1) {
        selection.splice(index, 1);

        return selection;
    } else if (!limit || selection.length < limit) {
        selection = [ ...selection, day.clone() ].sort((a, b) => {
            return a.timestamp() - b.timestamp();
        });

        return selection;
    }

    return selection;
}

function updateSingle(day, view) {
    return [
        day.clone(),
        !view.isSameMonth(day)
            ? day.clone().startOfMonth()
            : view
    ];
}

function makeMyDay(day = null) {
    return day
        ? (day instanceof LilEpoch)
            ? day
            : Array.isArray(day)
                ? new LilEpoch(...day)
                : new LilEpoch(day)
        : null;
}

function instance$1($$self, $$props, $$invalidate) {
	

    const today = new LilEpoch();
    const dispatcher = createEventDispatcher();

    let el;
    let props;
    let computed;
    let selection = null;
    let view = new LilEpoch();

    let { headers = [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ], mode = 'single', strict = false, disabled = [], value = null, limit = null, min = null, max = null } = $$props;

    onMount(() => {
        $$invalidate('view', view);
        $$invalidate('selection', selection);
        new Array().concat(value).forEach(v => select(v));

        tick().then(() => {
            view && dispatchEvents(dispatcher, el, 'view', view);
            selection && dispatchEvents(dispatcher, el, 'selection', selection);
        });
    });

    function watchInvalidDates({ min, max, disabled }) {
        // eslint-disable-next-line complexity
        tick().then(() => {
            min && min.isAfter(view.clone().endOfMonth()) && goTo(min);
            max && max.isBefore(view) && goTo(max);
            if (mode === 'single' && selection) {
                min && min.isAfter(selection) && select(min);
                max && max.isBefore(selection) && select(max);
                disabled.find(disabled => disabled.isSame(selection)) && (selection = null); $$invalidate('selection', selection);
            } else if (selection && selection.length) {
                min && (selection = selection.filter(s => min.isBefore(s))); $$invalidate('selection', selection);
                max && (selection = selection.filter(s => max.isAfter(s))); $$invalidate('selection', selection);
                disabled.length && (selection = selection.filter(s => {
                    return !disabled.find(disabled => disabled.isSame(s));
                })); $$invalidate('selection', selection);

                if (mode === 'range' && strict && selection.length === 2) {
                    disabled.find(disabled => disabled.isBetween(...selection)) && (selection = null); $$invalidate('selection', selection);
                }
            }
        });
    }

    function makeDates(view, disabled) {
        let current = view.clone().startOfMonth(),
            dates = [],
            dayOfFirst,
            dayOfLast;

        dayOfFirst = current.dayOfWeek();

        for (let i = 0; i < dayOfFirst; i++) {
            dates.unshift(current.clone().date(-i));
        }

        current.endOfMonth();

        for (let i = 1, days = current.date(); i <= days; i++) {
            dates.push(current.clone().date(i));
        }

        dayOfLast = current.dayOfWeek();
        current.startOfMonth().addMonth();

        for (let i = 1; i < (7 - dayOfLast); i++) {
            dates.push(current.clone().date(i));
        }

        return dates;
    }

    function select(day) {
        day = makeMyDay(day);

        if (day) {
            if (computed.disabled.find(d => d.isSame(day))
                || (computed.min && day.isBefore(computed.min))
                || (computed.max && day.isAfter(computed.max))) {
                return;
            }

            switch (mode) {
                case 'range' :
                    $$invalidate('selection', selection = updateRange(day, selection, strict, computed.disabled));
                    break;
                case 'multi' :
                    $$invalidate('selection', selection = updateMulti(day, selection, limit));
                    break;
                default :
                    [ selection, view ] = updateSingle(day, view); $$invalidate('selection', selection); $$invalidate('view', view);
                    break;
            }
        }
    }

    function goToYear(y) {
        $$invalidate('view', view = view.clone().year(y));
    }

    function goToNextYear() {
        $$invalidate('view', view = view.clone().addYear());
    }

    function goToLastYear() {
        $$invalidate('view', view = view.clone().subYear());
    }

    function goToMonth(m) {
        $$invalidate('view', view = view.clone().startOfMonth().month(m - 1));
    }

    function goToNextMonth() {
        $$invalidate('view', view = view.clone().startOfMonth().addMonth());
    }

    function goToLastMonth() {
        $$invalidate('view', view = view.clone().startOfMonth().subMonth());
    }

    function goToThisMonth() {
        $$invalidate('view', view = today.clone().startOfMonth());
    }

    function goToSelection() {
        if (mode === 'single' && selection) {
            $$invalidate('view', view = selection.clone().startOfMonth());
        }
    }

    function goTo(day) {
        day = makeMyDay(day);

        if (day) {
            $$invalidate('view', view = day.clone().startOfMonth());
        }
    }

	function select_handler({ day }, event) {
		return select(day);
	}

	function div_binding($$node, check) {
		el = $$node;
		$$invalidate('el', el);
	}

	$$self.$set = $$props => {
		if ('headers' in $$props) $$invalidate('headers', headers = $$props.headers);
		if ('mode' in $$props) $$invalidate('mode', mode = $$props.mode);
		if ('strict' in $$props) $$invalidate('strict', strict = $$props.strict);
		if ('disabled' in $$props) $$invalidate('disabled', disabled = $$props.disabled);
		if ('value' in $$props) $$invalidate('value', value = $$props.value);
		if ('limit' in $$props) $$invalidate('limit', limit = $$props.limit);
		if ('min' in $$props) $$invalidate('min', min = $$props.min);
		if ('max' in $$props) $$invalidate('max', max = $$props.max);
	};

	let dates;

	$$self.$$.update = ($$dirty = { min: 1, max: 1, headers: 1, disabled: 1, view: 1, computed: 1, selection: 1, mode: 1, el: 1 }) => {
		if ($$dirty.min || $$dirty.max || $$dirty.headers || $$dirty.disabled) { $$invalidate('computed', computed = {
                min: makeMyDay(min),
                max: makeMyDay(max),
                headers: headers.length
                    ? new Array(7).fill('', 0, 7).map((n, i) => headers[i] || n)
                    : [],
                disabled: new Array()
                    .concat(disabled)
                    .filter(Boolean)
                    .map(makeMyDay)
            }); }
		if ($$dirty.view || $$dirty.computed) { $$invalidate('dates', dates = makeDates(view, computed.disabled)); }
		if ($$dirty.computed || $$dirty.selection || $$dirty.view || $$dirty.mode) { $$invalidate('props', props = {
                disabled: computed.disabled,
                min: computed.min,
                max: computed.max,
                selection,
                view,
                mode
            }); }
		if ($$dirty.el || $$dirty.selection) { dispatchEvents(dispatcher, el, 'selection', selection); }
		if ($$dirty.el || $$dirty.view) { dispatchEvents(dispatcher, el, 'view', view); }
		if ($$dirty.computed) { watchInvalidDates(computed); }
	};

	return {
		el,
		props,
		computed,
		headers,
		mode,
		strict,
		disabled,
		value,
		limit,
		min,
		max,
		select,
		goToYear,
		goToNextYear,
		goToLastYear,
		goToMonth,
		goToNextMonth,
		goToLastMonth,
		goToThisMonth,
		goToSelection,
		goTo,
		dates,
		select_handler,
		div_binding
	};
}

class Calio extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-4rx1aq-style")) add_css$1();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["headers", "mode", "strict", "disabled", "value", "limit", "min", "max", "select", "makeMyDay", "goToYear", "goToNextYear", "goToLastYear", "goToMonth", "goToNextMonth", "goToLastMonth", "goToThisMonth", "goToSelection", "goTo"]);
	}

	get select() {
		return this.$$.ctx.select;
	}

	get makeMyDay() {
		return makeMyDay;
	}

	get goToYear() {
		return this.$$.ctx.goToYear;
	}

	get goToNextYear() {
		return this.$$.ctx.goToNextYear;
	}

	get goToLastYear() {
		return this.$$.ctx.goToLastYear;
	}

	get goToMonth() {
		return this.$$.ctx.goToMonth;
	}

	get goToNextMonth() {
		return this.$$.ctx.goToNextMonth;
	}

	get goToLastMonth() {
		return this.$$.ctx.goToLastMonth;
	}

	get goToThisMonth() {
		return this.$$.ctx.goToThisMonth;
	}

	get goToSelection() {
		return this.$$.ctx.goToSelection;
	}

	get goTo() {
		return this.$$.ctx.goTo;
	}
}

class index {
    constructor(el, data = {}) {
        const options = [ 'headers', 'mode', 'strict', 'disabled', 'value', 'limit', 'min', 'max' ];
        const target = (typeof el === 'string')
            ? document.querySelector(el)
            : el;

        return new Calio({
            target,
            props: Object.keys(data)
                .filter(key => options.includes(key))
                .reduce((obj, key) => (obj[key] = data[key], obj), {})
        });
    }
}

export default index;
