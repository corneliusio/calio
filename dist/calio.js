function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
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
        if (iterations[i])
            iterations[i].d(detaching);
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
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
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
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
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
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
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
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

const globals = (typeof window !== 'undefined' ? window : global);

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
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if ($$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
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
        return format(this.timestamp(), mask);
    }

    clone() {
        return new LilEpoch(this.timestamp());
    }

    toString() {
        return this.value.toString();
    }
}

/* src/components/Day.svelte generated by Svelte v3.20.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-1l2ul15-style";
	style.textContent = ".calio-day{cursor:pointer;color:var(--color, #333)}.calio-day:hover{color:var(--color-hover, var(--color, #333));background:var(--bg-hover, #EEE)}.calio-day.is-today{font-weight:900}.calio-day.is-prev,.calio-day.is-next{color:var(--color-inactive, #CCC);background:var(--bg-inactive, transparent)}.calio-day.is-disabled{pointer-events:none;color:var(--color-disabled, var(--color-inactive, #CCC));background:var(--bg-disabled, transparent);opacity:var(--opacity-disabled, 0.5)}.calio-day.is-ranged{color:var(--color-ranged, var(--color-active, white));background:var(--bg-ranged, var(--bg-active, rgba(100, 149, 237, 0.66)))}.calio-day.is-active{color:var(--color-active, white);background:var(--bg-active, rgb(100, 149, 237))}";
	append(document.head, style);
}

function create_fragment(ctx) {
	let span;
	let t_value = /*day*/ ctx[0].date() + "";
	let t;
	let span_class_value;
	let dispose;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", span_class_value = "calio-day " + /*classes*/ ctx[1]);
		},
		m(target, anchor, remount) {
			insert(target, span, anchor);
			append(span, t);
			if (remount) dispose();
			dispose = listen(span, "click", /*click_handler*/ ctx[13]);
		},
		p(ctx, [dirty]) {
			if (dirty & /*day*/ 1 && t_value !== (t_value = /*day*/ ctx[0].date() + "")) set_data(t, t_value);

			if (dirty & /*classes*/ 2 && span_class_value !== (span_class_value = "calio-day " + /*classes*/ ctx[1])) {
				attr(span, "class", span_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(span);
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	const today = new LilEpoch();
	const dispatch = createEventDispatcher();
	let { view = new LilEpoch() } = $$props;
	let { selection = [] } = $$props;
	let { disabled = [] } = $$props;
	let { day } = $$props;
	let { min } = $$props;
	let { max } = $$props;
	let { mode } = $$props;
	const click_handler = event => dispatch("select", day);

	$$self.$set = $$props => {
		if ("view" in $$props) $$invalidate(4, view = $$props.view);
		if ("selection" in $$props) $$invalidate(3, selection = $$props.selection);
		if ("disabled" in $$props) $$invalidate(5, disabled = $$props.disabled);
		if ("day" in $$props) $$invalidate(0, day = $$props.day);
		if ("min" in $$props) $$invalidate(6, min = $$props.min);
		if ("max" in $$props) $$invalidate(7, max = $$props.max);
		if ("mode" in $$props) $$invalidate(8, mode = $$props.mode);
	};

	let isActive;
	let isDisabled;
	let isRanged;
	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*selection, day*/ 9) {
			 $$invalidate(9, isActive = (() => {
				$$invalidate(3, selection = new Array().concat(selection).filter(Boolean));
				return selection.find(s => day.isSame(s));
			})());
		}

		if ($$self.$$.dirty & /*disabled, day, min, max*/ 225) {
			 $$invalidate(10, isDisabled = (() => {
				return disabled.find(d => d.isSame && d.isSame(day)) || min && day.isBefore(min) || max && day.isAfter(max);
			})());
		}

		if ($$self.$$.dirty & /*mode, selection, day*/ 265) {
			 $$invalidate(11, isRanged = (() => {
				if (mode === "range" && selection) {
					let [start, end] = selection;

					if (start && end) {
						return day.isAfter(start) && day.isBefore(end);
					}
				}

				return false;
			})());
		}

		if ($$self.$$.dirty & /*day, view, isDisabled, isRanged, isActive*/ 3601) {
			 $$invalidate(1, classes = [
				day.isSame(today) && "is-today",
				view && view.endOfMonth().isBefore(day) && "is-next",
				view && view.startOfMonth().isAfter(day) && "is-prev",
				isDisabled && "is-disabled",
				isRanged && "is-ranged",
				isActive && "is-active"
			].filter(Boolean).join(" "));
		}
	};

	return [
		day,
		classes,
		dispatch,
		selection,
		view,
		disabled,
		min,
		max,
		mode,
		isActive,
		isDisabled,
		isRanged,
		today,
		click_handler
	];
}

class Day extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1l2ul15-style")) add_css();

		init(this, options, instance, create_fragment, safe_not_equal, {
			view: 4,
			selection: 3,
			disabled: 5,
			day: 0,
			min: 6,
			max: 7,
			mode: 8
		});
	}
}

/* src/components/Calio.svelte generated by Svelte v3.20.1 */

const { Boolean: Boolean_1 } = globals;

function add_css$1() {
	var style = element("style");
	style.id = "svelte-1uuu3r4-style";
	style.textContent = ".calio{display:-ms-inline-grid;display:inline-grid;-ms-grid-columns:(var(--size-x, var(--size, 2.25em)))[7];grid-template-columns:repeat(7, var(--size-x, var(--size, 2.25em)));grid-auto-rows:var(--size-y, var(--size, 2em));line-height:var(--size-y, var(--size, 2em));text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.calio-head{color:var(--color, #333);font-weight:bold}";
	append(document.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[31] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[31] = list[i];
	return child_ctx;
}

// (2:4) {#each computed.headers as day}
function create_each_block_1(ctx) {
	let span;
	let t_value = /*day*/ ctx[31] + "";
	let t;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", "calio-head");
		},
		m(target, anchor) {
			insert(target, span, anchor);
			append(span, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*computed*/ 8 && t_value !== (t_value = /*day*/ ctx[31] + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(span);
		}
	};
}

// (5:4) {#each dates as day}
function create_each_block(ctx) {
	let current;
	const day_spread_levels = [{ day: /*day*/ ctx[31] }, /*props*/ ctx[2]];

	function select_handler(...args) {
		return /*select_handler*/ ctx[29](/*day*/ ctx[31], ...args);
	}

	let day_props = {};

	for (let i = 0; i < day_spread_levels.length; i += 1) {
		day_props = assign(day_props, day_spread_levels[i]);
	}

	const day = new Day({ props: day_props });
	day.$on("select", select_handler);

	return {
		c() {
			create_component(day.$$.fragment);
		},
		m(target, anchor) {
			mount_component(day, target, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			const day_changes = (dirty[0] & /*dates, props*/ 20)
			? get_spread_update(day_spread_levels, [
					dirty[0] & /*dates*/ 16 && { day: /*day*/ ctx[31] },
					dirty[0] & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
				])
			: {};

			day.$set(day_changes);
		},
		i(local) {
			if (current) return;
			transition_in(day.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(day.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(day, detaching);
		}
	};
}

function create_fragment$1(ctx) {
	let div;
	let t;
	let current;
	let each_value_1 = /*computed*/ ctx[3].headers;
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = /*dates*/ ctx[4];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div, "class", "calio");
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(div, null);
			}

			append(div, t);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			/*div_binding*/ ctx[30](div);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty[0] & /*computed*/ 8) {
				each_value_1 = /*computed*/ ctx[3].headers;
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
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

			if (dirty[0] & /*dates, props, select*/ 21) {
				each_value = /*dates*/ ctx[4];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			each_blocks = each_blocks.filter(Boolean_1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			/*div_binding*/ ctx[30](null);
		}
	};
}

function dispatchEvents(dispatch, el, key, data) {
	if (data && typeof data.clone === "function") {
		data = data.clone();
	} else if (Array.isArray(data)) {
		data = data.map(d => {
			return typeof d.clone === "function" ? d.clone() : d;
		});
	}

	if (el) {
		el.parentNode.dispatchEvent(new CustomEvent(`calio:${key}`, { detail: data }));
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
		return [day.clone()];
	}

	selection = [...selection, day.clone()].sort((a, b) => {
		return a.timestamp() - b.timestamp();
	});

	// if (strict) {
	//     let [ start, end ] = selection,
	//         isInvalid = end && !!disabled.find(d => {
	//             return d.isAfter(start) && d.isBefore(end);
	//         });
	//     if (isInvalid) {
	//         return null;
	//     }
	// }
	return selection;
}

function updateMulti(day, current, limit) {
	let selection = new Array().concat(current).filter(Boolean) || [],
		index = selection.findIndex(s => s.isSame(day));

	if (index > -1) {
		selection.splice(index, 1);
		return selection;
	} else if (!limit || selection.length < limit) {
		selection = [...selection, day.clone()].sort((a, b) => {
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
	? day instanceof LilEpoch
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
	let { headers = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] } = $$props;
	let { mode = "single" } = $$props;
	let { strict = false } = $$props;
	let { disabled = [] } = $$props;
	let { value = null } = $$props;
	let { limit = null } = $$props;
	let { min = null } = $$props;
	let { max = null } = $$props;

	onMount(() => {
		$$invalidate(24, view);
		$$invalidate(23, selection);
		new Array().concat(value).forEach(v => select(v));

		tick().then(() => {
			view && dispatchEvents(dispatcher, el, "view", view);
			selection && dispatchEvents(dispatcher, el, "selection", selection);
		});
	});

	function watchInvalidDates({ min, max, disabled }) {
		// eslint-disable-next-line complexity
		tick().then(() => {
			min && min.isAfter(view.clone().endOfMonth()) && goTo(min);
			max && max.isBefore(view) && goTo(max);

			if (mode === "single" && selection) {
				min && min.isAfter(selection) && select(min);
				max && max.isBefore(selection) && select(max);
				disabled.find(disabled => disabled.isSame(selection)) && $$invalidate(23, selection = null);
			} else if (selection && selection.length) {
				min && $$invalidate(23, selection = selection.filter(s => min.isBefore(s)));
				max && $$invalidate(23, selection = selection.filter(s => max.isAfter(s)));

				disabled.length && $$invalidate(23, selection = selection.filter(s => {
					return !disabled.find(disabled => disabled.isSame(s));
				}));

				if (mode === "range" && strict && selection.length === 2) {
					disabled.find(disabled => disabled.isBetween(...selection)) && $$invalidate(23, selection = null);
				}
			}
		});
	}

	function makeDates(view, disabled) {
		let current = view.clone().startOfMonth(), dates = [], dayOfFirst, dayOfLast;
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

		for (let i = 1; i < 7 - dayOfLast; i++) {
			dates.push(current.clone().date(i));
		}

		return dates;
	}

	function select(day) {
		day = makeMyDay(day);

		if (day) {
			if (computed.disabled.find(d => d.isSame(day)) || computed.min && day.isBefore(computed.min) || computed.max && day.isAfter(computed.max)) {
				return;
			}

			switch (mode) {
				case "range":
					$$invalidate(23, selection = updateRange(day, selection, strict, computed.disabled));
					break;
				case "multi":
					$$invalidate(23, selection = updateMulti(day, selection, limit));
					break;
				default:
					$$invalidate(23, [selection, view] = updateSingle(day, view), selection, $$invalidate(24, view));
					break;
			}
		}
	}

	function goToYear(y) {
		$$invalidate(24, view = view.clone().year(y));
	}

	function goToNextYear() {
		$$invalidate(24, view = view.clone().addYear());
	}

	function goToLastYear() {
		$$invalidate(24, view = view.clone().subYear());
	}

	function goToMonth(m) {
		$$invalidate(24, view = view.clone().startOfMonth().month(m - 1));
	}

	function goToNextMonth() {
		$$invalidate(24, view = view.clone().startOfMonth().addMonth());
	}

	function goToLastMonth() {
		$$invalidate(24, view = view.clone().startOfMonth().subMonth());
	}

	function goToThisMonth() {
		$$invalidate(24, view = today.clone().startOfMonth());
	}

	function goToSelection() {
		if (mode === "single" && selection) {
			$$invalidate(24, view = selection.clone().startOfMonth());
		}
	}

	function goTo(day) {
		day = makeMyDay(day);

		if (day) {
			$$invalidate(24, view = day.clone().startOfMonth());
		}
	}

	const select_handler = (day, event) => select(day);

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(1, el = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("headers" in $$props) $$invalidate(5, headers = $$props.headers);
		if ("mode" in $$props) $$invalidate(6, mode = $$props.mode);
		if ("strict" in $$props) $$invalidate(7, strict = $$props.strict);
		if ("disabled" in $$props) $$invalidate(8, disabled = $$props.disabled);
		if ("value" in $$props) $$invalidate(9, value = $$props.value);
		if ("limit" in $$props) $$invalidate(10, limit = $$props.limit);
		if ("min" in $$props) $$invalidate(11, min = $$props.min);
		if ("max" in $$props) $$invalidate(12, max = $$props.max);
	};

	let dates;

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*min, max, headers, disabled*/ 6432) {
			 $$invalidate(3, computed = {
				min: makeMyDay(min),
				max: makeMyDay(max),
				headers: headers.length
				? new Array(7).fill("", 0, 7).map((n, i) => headers[i] || n)
				: [],
				disabled: new Array().concat(disabled).filter(Boolean).map(makeMyDay)
			});
		}

		if ($$self.$$.dirty[0] & /*view, computed*/ 16777224) {
			 $$invalidate(4, dates = makeDates(view, computed.disabled));
		}

		if ($$self.$$.dirty[0] & /*computed, selection, view, mode*/ 25165896) {
			 $$invalidate(2, props = {
				disabled: computed.disabled,
				min: computed.min,
				max: computed.max,
				selection,
				view,
				mode
			});
		}

		if ($$self.$$.dirty[0] & /*el, selection*/ 8388610) {
			 dispatchEvents(dispatcher, el, "selection", selection);
		}

		if ($$self.$$.dirty[0] & /*el, view*/ 16777218) {
			 dispatchEvents(dispatcher, el, "view", view);
		}

		if ($$self.$$.dirty[0] & /*computed, selection*/ 8388616) {
			 watchInvalidDates(computed);
		}

		if ($$self.$$.dirty[0] & /*el, props, computed, selection, view, headers, mode, strict, disabled, value, limit, min, max, dates*/ 25174014) {
			 if (process.env.NODE_ENV === "testing") {
				setContext("el", el);
				setContext("props", props);
				setContext("computed", computed);
				setContext("selection", selection);
				setContext("view", view);
				setContext("headers", headers);
				setContext("mode", mode);
				setContext("strict", strict);
				setContext("disabled", disabled);
				setContext("value", value);
				setContext("limit", limit);
				setContext("min", min);
				setContext("max", max);
				setContext("dates", dates);
			}
		}
	};

	return [
		select,
		el,
		props,
		computed,
		dates,
		headers,
		mode,
		strict,
		disabled,
		value,
		limit,
		min,
		max,
		makeMyDay,
		goToYear,
		goToNextYear,
		goToLastYear,
		goToMonth,
		goToNextMonth,
		goToLastMonth,
		goToThisMonth,
		goToSelection,
		goTo,
		selection,
		view,
		today,
		dispatcher,
		watchInvalidDates,
		makeDates,
		select_handler,
		div_binding
	];
}

class Calio extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1uuu3r4-style")) add_css$1();

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				headers: 5,
				mode: 6,
				strict: 7,
				disabled: 8,
				value: 9,
				limit: 10,
				min: 11,
				max: 12,
				select: 0,
				makeMyDay: 13,
				goToYear: 14,
				goToNextYear: 15,
				goToLastYear: 16,
				goToMonth: 17,
				goToNextMonth: 18,
				goToLastMonth: 19,
				goToThisMonth: 20,
				goToSelection: 21,
				goTo: 22
			},
			[-1, -1]
		);
	}

	get select() {
		return this.$$.ctx[0];
	}

	get makeMyDay() {
		return makeMyDay;
	}

	get goToYear() {
		return this.$$.ctx[14];
	}

	get goToNextYear() {
		return this.$$.ctx[15];
	}

	get goToLastYear() {
		return this.$$.ctx[16];
	}

	get goToMonth() {
		return this.$$.ctx[17];
	}

	get goToNextMonth() {
		return this.$$.ctx[18];
	}

	get goToLastMonth() {
		return this.$$.ctx[19];
	}

	get goToThisMonth() {
		return this.$$.ctx[20];
	}

	get goToSelection() {
		return this.$$.ctx[21];
	}

	get goTo() {
		return this.$$.ctx[22];
	}
}

class index {
    constructor(el, props = {}) {
        const target = (typeof el === 'string')
            ? document.querySelector(el)
            : el;

        return new Calio({
            target, props
        });
    }
}

export default index;
