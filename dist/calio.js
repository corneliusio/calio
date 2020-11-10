function noop() { }
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
function empty() {
    return text('');
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
class HtmlTag {
    constructor(html, anchor = null) {
        this.e = element('div');
        this.a = anchor;
        this.u(html);
    }
    m(target, anchor = null) {
        for (let i = 0; i < this.n.length; i += 1) {
            insert(target, this.n[i], anchor);
        }
        this.t = target;
    }
    u(html) {
        this.e.innerHTML = html;
        this.n = Array.from(this.e.childNodes);
    }
    p(html) {
        this.d();
        this.u(html);
        this.m(this.t, this.a);
    }
    d() {
        this.n.forEach(detach);
    }
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

const token = /s{1,2}|m{1,2}|h{1,4}|Do|D{1,4}|Mo|M{1,4}|YY(?:YY)?|[aA]|"[^"]*"|'[^']*'/g;
const formats = {
    masks: {
        default: 'DDD MMM DD YYYY hhh:mm:ss',
        shortDate: 'M/D/YY',
        mediumDate: 'MMM D, YYYY',
        longDate: 'MMMM D, YYYY',
        fullDate: 'DDDD, MMMM D, YYYY',
        isoDate: 'YYYY-MM-DD',
        isoDateTime: "YYYY-MM-DD'T'hh:mm:ss",
        isoUtcDateTime: "YYYY-MM-DD'T'hh:mm:ss'Z'"
    },
    words: {
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
    date = date instanceof Date ? date : new Date(date);
    mask = `${formats.masks[mask] || mask || formats.masks.default}`;

    let d = date.getDate(),
        s = date.getSeconds(),
        m = date.getMinutes(),
        h = date.getHours(),
        D = date.getDay(),
        M = date.getMonth(),
        Y = date.getFullYear(),
        a = h > 11 ? 'pm' : 'am',
        o = n => {
            return [ 'th', 'st', 'nd', 'rd' ][n % 10 > 3 ? 0 : (n % 100 - n % 10 !== 10) * n % 10];
        },
        flags = {
            s: s,
            ss: pad(s),
            m: m,
            mm: pad(m),
            h: h,
            hh: pad(h),
            hhh: h % 12 || 12,
            hhhh: pad(h % 12 || 12),
            a: a,
            A: a.toUpperCase(),
            D: d,
            Do: `${d}${o(d)}`,
            DD: pad(d),
            DDD: formats.words.dayNames[D],
            DDDD: formats.words.dayNames[D + 7],
            M: M + 1,
            Mo: `${M + 1}${o(M + 1)}`,
            MM: pad(M + 1),
            MMM: formats.words.monthNames[M],
            MMMM: formats.words.monthNames[M + 12],
            YY: String(Y).slice(2),
            YYYY: Y
        };

    return mask.replace(token, $0 => {
        return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
}

class Epoch {
    constructor(...args) {
        const [ Y, M, D, h, m, s ] = args;

        if (args.length > 1) {
            this.value = new Date(Y, M, D || 1, h || 0, m || 0, s || 0);
        } else if (Y instanceof Epoch) {
            this.value = Y.clone().value;
        } else if (Y instanceof Date) {
            this.value = Y;
        } else if ([ 'number', 'string' ].includes(typeof Y)) {
            this.value = new Date(Y);
        } else if (Array.isArray(Y) && Y.filter(Boolean).length) {
            this.value = new Date(...Y);
        } else {
            this.value = new Date();
        }

        if (typeof Y === 'string') {
            this.value.setHours(
                this.value.getHours() + (this.value.getTimezoneOffset() / 60)
            );
        }

        this.value.setSeconds(0);
        this.value.setMilliseconds(0);
    }

    year(y = null) {
        if (y !== null) {
            this.value.setFullYear(y);

            return this;
        }

        return this.value.getFullYear();
    }

    month(m = null) {
        if (m !== null) {
            this.value.setMonth(m);

            return this;
        }

        return this.value.getMonth();
    }

    date(d = null) {
        if (d !== null) {
            this.value.setDate(d);

            return this;
        }

        return this.value.getDate();
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
        return this.value.getDay();
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
        return format(this.value, mask);
    }

    clone() {
        return new Epoch(this.timestamp());
    }

    toString() {
        return this.value.toString();
    }

    get length() {
        return 1;
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
	let dispose;

	return {
		c() {
			span = element("span");
			t = text(t_value);
			attr(span, "class", /*classes*/ ctx[1]);
		},
		m(target, anchor, remount) {
			insert(target, span, anchor);
			append(span, t);
			if (remount) dispose();
			dispose = listen(span, "click", /*click_handler*/ ctx[14]);
		},
		p(ctx, [dirty]) {
			if (dirty & /*day*/ 1 && t_value !== (t_value = /*day*/ ctx[0].date() + "")) set_data(t, t_value);

			if (dirty & /*classes*/ 2) {
				attr(span, "class", /*classes*/ ctx[1]);
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
	const today = new Epoch();
	const dispatch = createEventDispatcher();
	let { day } = $$props;
	let { props } = $$props;
	const click_handler = event => dispatch("select", day);

	$$self.$set = $$props => {
		if ("day" in $$props) $$invalidate(0, day = $$props.day);
		if ("props" in $$props) $$invalidate(3, props = $$props.props);
	};

	let selection;
	let disabled;
	let min;
	let max;
	let mode;
	let view;
	let isActive;
	let isDisabled;
	let isRanged;
	let classes;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*props*/ 8) {
			 $$invalidate(4, { selection, disabled, min, max, mode, view } = props, selection, ($$invalidate(5, disabled), $$invalidate(3, props)), ($$invalidate(6, min), $$invalidate(3, props)), ($$invalidate(7, max), $$invalidate(3, props)), ($$invalidate(8, mode), $$invalidate(3, props)), ($$invalidate(9, view), $$invalidate(3, props)));
		}

		if ($$self.$$.dirty & /*selection, day*/ 17) {
			 $$invalidate(10, isActive = (() => {
				return new Array().concat(selection).filter(Boolean).find(s => day.isSame(s));
			})());
		}

		if ($$self.$$.dirty & /*disabled, day, min, max*/ 225) {
			 $$invalidate(11, isDisabled = (() => {
				return disabled.find(d => d.isSame && d.isSame(day)) || min && day.isBefore(min) || max && day.isAfter(max);
			})());
		}

		if ($$self.$$.dirty & /*mode, selection, day*/ 273) {
			 $$invalidate(12, isRanged = (() => {
				if (mode === "range" && selection) {
					let [start, end] = selection;

					if (start && end) {
						return day.isAfter(start) && day.isBefore(end);
					}
				}

				return false;
			})());
		}

		if ($$self.$$.dirty & /*day, view, isDisabled, isRanged, isActive*/ 7681) {
			 $$invalidate(1, classes = [
				"calio-day",
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
		props,
		selection,
		disabled,
		min,
		max,
		mode,
		view,
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
		init(this, options, instance, create_fragment, safe_not_equal, { day: 0, props: 3 });
	}
}

/* src/components/Dates.svelte generated by Svelte v3.20.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[7] = list[i];
	return child_ctx;
}

// (1:0) {#each dates as day}
function create_each_block(ctx) {
	let current;

	function select_handler(...args) {
		return /*select_handler*/ ctx[6](/*day*/ ctx[7], ...args);
	}

	const day = new Day({
			props: {
				day: /*day*/ ctx[7],
				props: /*props*/ ctx[0]
			}
		});

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
			const day_changes = {};
			if (dirty & /*dates*/ 2) day_changes.day = /*day*/ ctx[7];
			if (dirty & /*props*/ 1) day_changes.props = /*props*/ ctx[0];
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
	let each_1_anchor;
	let current;
	let each_value = /*dates*/ ctx[1];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, each_1_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (dirty & /*dates, props, dispatch*/ 7) {
				each_value = /*dates*/ ctx[1];
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
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach(each_1_anchor);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { props } = $$props;
	const dispatch = createEventDispatcher();
	let { view, disabled } = {};

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

	const select_handler = (day, event) => dispatch("select", day);

	$$self.$set = $$props => {
		if ("props" in $$props) $$invalidate(0, props = $$props.props);
	};

	let dates;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*props*/ 1) {
			 $$invalidate(3, { view, disabled } = props, view, ($$invalidate(4, disabled), $$invalidate(0, props)));
		}

		if ($$self.$$.dirty & /*view, disabled*/ 24) {
			 $$invalidate(1, dates = makeDates(view));
		}
	};

	return [props, dates, dispatch, view, disabled, makeDates, select_handler];
}

class Dates extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { props: 0 });
	}
}

/* src/components/Headers.svelte generated by Svelte v3.20.1 */

function create_fragment$2(ctx) {
	let html_tag;

	return {
		c() {
			html_tag = new HtmlTag(/*markup*/ ctx[0], null);
		},
		m(target, anchor) {
			html_tag.m(target, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) html_tag.d();
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { headers } = $$props;

	const days = headers && headers.length
	? new Array(7).fill("", 0, 7).map((n, i) => headers[i] || n)
	: [];

	const markup = days.map(day => `<span class="calio-head">${day}</span>`).join(`\n`);

	$$self.$set = $$props => {
		if ("headers" in $$props) $$invalidate(1, headers = $$props.headers);
	};

	return [markup, headers];
}

class Headers extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { headers: 1 });
	}
}

/* src/components/Calio.svelte generated by Svelte v3.20.1 */

function add_css$1() {
	var style = element("style");
	style.id = "svelte-1uuu3r4-style";
	style.textContent = ".calio{display:-ms-inline-grid;display:inline-grid;-ms-grid-columns:(var(--size-x, var(--size, 2.25em)))[7];grid-template-columns:repeat(7, var(--size-x, var(--size, 2.25em)));grid-auto-rows:var(--size-y, var(--size, 2em));line-height:var(--size-y, var(--size, 2em));text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.calio-head{color:var(--color, #333);font-weight:bold}";
	append(document.head, style);
}

function create_fragment$3(ctx) {
	let div;
	let t;
	let current;
	const headers_1 = new Headers({ props: { headers: /*headers*/ ctx[0] } });
	const dates = new Dates({ props: { props: /*props*/ ctx[2] } });
	dates.$on("select", /*onSelect*/ ctx[3]);

	return {
		c() {
			div = element("div");
			create_component(headers_1.$$.fragment);
			t = space();
			create_component(dates.$$.fragment);
			attr(div, "class", "calio");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(headers_1, div, null);
			append(div, t);
			mount_component(dates, div, null);
			/*div_binding*/ ctx[36](div);
			current = true;
		},
		p(ctx, dirty) {
			const headers_1_changes = {};
			if (dirty[0] & /*headers*/ 1) headers_1_changes.headers = /*headers*/ ctx[0];
			headers_1.$set(headers_1_changes);
			const dates_changes = {};
			if (dirty[0] & /*props*/ 4) dates_changes.props = /*props*/ ctx[2];
			dates.$set(dates_changes);
		},
		i(local) {
			if (current) return;
			transition_in(headers_1.$$.fragment, local);
			transition_in(dates.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(headers_1.$$.fragment, local);
			transition_out(dates.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(headers_1);
			destroy_component(dates);
			/*div_binding*/ ctx[36](null);
		}
	};
}

function structureRange(newValue) {
	newValue = toCleanArray(newValue);

	if (newValue.length > 2) {
		newValue = [newValue.pop()];
	}

	newValue = newValue.sort((a, b) => a.timestamp() - b.timestamp());
	return newValue;
}

function structureMulti(newValue, limit) {
	newValue = toCleanArray(newValue);

	if (limit && newValue.length > limit) {
		newValue = newValue.splice(0, limit);
	}

	newValue = newValue.sort((a, b) => a.timestamp() - b.timestamp());
	return newValue;
}

function structureSingle(newValue, newView) {
	return newValue
	? [
			newValue,
			!newView.isSameMonth(newValue)
			? newValue.clone().startOfMonth()
			: newView.clone()
		]
	: [null, newView];
}

function toCleanArray(data) {
	return new Array().concat(data).filter(Boolean);
}

function makeMyDay(day = null, ...rest) {
	return day
	? day instanceof Epoch
		? day.clone()
		: rest.length
			? new Epoch(day, ...rest)
			: Array.isArray(day)
				? day.filter(Boolean).length ? new Epoch(day) : null
				: new Epoch(day)
	: null;
}

function instance$3($$self, $$props, $$invalidate) {
	const today = new Epoch();
	const dispatcher = createEventDispatcher();
	let { value: initial = null } = $$props;
	let { headers = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] } = $$props;
	let { mode = "single" } = $$props;
	let { strict = false } = $$props;
	let { disabled = [] } = $$props;
	let { limit = null } = $$props;
	let { min = null } = $$props;
	let { max = null } = $$props;
	let el;
	let value = initial;
	let view = new Epoch();

	onMount(() => {
		tick().then(() => {
			view && dispatchEvents(el, "view", view);
			initial && selection && dispatchEvents(el, "selection", selection);
		});
	});

	function getSelection(newValue, min, max, disabled) {
		newValue = Array.isArray(newValue)
		? newValue.map(makeMyDay)
		: makeMyDay(newValue);

		newValue = Array.isArray(newValue) && mode === "single"
		? newValue[0]
		: newValue;

		switch (mode) {
			case "range":
				newValue = structureRange(newValue);
				break;
			case "multi":
				newValue = structureMulti(newValue, limit);
				break;
			default:
				$$invalidate(26, [newValue, view] = structureSingle(newValue, view), view);
				break;
		}

		if (newValue && newValue.length) {
			newValue = filterInvalidDatesMin(newValue, min);
			newValue = filterInvalidDatesMax(newValue, max);
			newValue = filterInvalidDatesDisabled(newValue, disabled);
		}

		return $$invalidate(25, value = newValue);
	}

	function filterInvalidDatesMin(newValue, min) {
		if (min) {
			min.isAfter(view.clone().endOfMonth()) && goTo(min);

			if (mode === "single") {
				if (min.isAfter(newValue)) {
					return null;
				}
			} else {
				const valid = newValue.filter(s => s.isAfter(min) || s.isSame(min));
				newValue = valid.length ? valid : null;
			}
		}

		return newValue;
	}

	function filterInvalidDatesMax(newValue, max) {
		if (max) {
			max.isBefore(view.clone().endOfMonth()) && goTo(max);

			if (mode === "single") {
				if (max.isBefore(newValue)) {
					return null;
				}
			} else {
				const valid = newValue.filter(s => s.isBefore(max) || s.isSame(max));
				newValue = valid.length ? valid : null;
			}
		}

		return newValue;
	}

	function filterInvalidDatesDisabled(newValue, disabled) {
		if (disabled.length && newValue) {
			if (mode === "single") {
				if (disabled.find(d => d.isSame(newValue))) {
					return null;
				}
			} else {
				const valid = newValue.filter(s => disabled.find(d => !d.isSame(s)));

				if (mode === "range" && strict && valid.length === 2) {
					if (disabled.find(d => d.isBetween(...valid))) {
						return null;
					}
				}

				return valid.length ? valid : null;
			}
		}

		return newValue;
	}

	function dispatchEvents(el, key, data) {
		if (data && typeof data.clone === "function") {
			data = data.clone();
		} else if (Array.isArray(data)) {
			data = data.map(d => d.clone());
		}

		if (el) {
			el.parentNode.dispatchEvent(new CustomEvent(`calio:${key}`, { detail: data, bubbles: true }));
		}

		dispatcher(key, data);
	}

	function onSelect(event) {
		select(event.detail);
	}

	function select(day = null) {
		let current = toCleanArray(value);

		if (!day) {
			return $$invalidate(25, value = null);
		}

		if (mode === "single") {
			$$invalidate(25, value = value && value.isSame(day) ? null : day);
		} else if (current.length) {
			let index = current.findIndex(s => day.isSame(s));

			if (index > -1) {
				current.splice(index, 1);
			} else {
				current.push(day);
			}

			$$invalidate(25, value = current);
		} else {
			$$invalidate(25, value = day);
		}
	}

	function setMin(date) {
		$$invalidate(5, min = date || null);
	}

	function setMax(date) {
		$$invalidate(6, max = date || null);
	}

	function setDisabled(date) {
		$$invalidate(4, disabled = date);
	}

	function goToYear(y) {
		$$invalidate(26, view = view.clone().year(y));
	}

	function goToNextYear() {
		$$invalidate(26, view = view.clone().addYear());
	}

	function goToLastYear() {
		$$invalidate(26, view = view.clone().subYear());
	}

	function goToMonth(m) {
		$$invalidate(26, view = view.clone().startOfMonth().month(m - 1));
	}

	function goToNextMonth() {
		$$invalidate(26, view = view.clone().startOfMonth().addMonth());
	}

	function goToLastMonth() {
		$$invalidate(26, view = view.clone().startOfMonth().subMonth());
	}

	function goToThisMonth() {
		$$invalidate(26, view = today.clone().startOfMonth());
	}

	function goToSelection() {
		if (mode === "single" && selection) {
			$$invalidate(26, view = selection.clone().startOfMonth());
		}
	}

	function goTo(day) {
		day = makeMyDay(day);

		if (day) {
			$$invalidate(26, view = day.clone().startOfMonth());
		}
	}

	function div_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			$$invalidate(1, el = $$value);
		});
	}

	$$self.$set = $$props => {
		if ("value" in $$props) $$invalidate(7, initial = $$props.value);
		if ("headers" in $$props) $$invalidate(0, headers = $$props.headers);
		if ("mode" in $$props) $$invalidate(8, mode = $$props.mode);
		if ("strict" in $$props) $$invalidate(9, strict = $$props.strict);
		if ("disabled" in $$props) $$invalidate(4, disabled = $$props.disabled);
		if ("limit" in $$props) $$invalidate(10, limit = $$props.limit);
		if ("min" in $$props) $$invalidate(5, min = $$props.min);
		if ("max" in $$props) $$invalidate(6, max = $$props.max);
	};

	let computed;
	let props;
	let selection;

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*min, max, disabled*/ 112) {
			 $$invalidate(28, computed = {
				min: makeMyDay(min),
				max: makeMyDay(max),
				disabled: new Array().concat(disabled).filter(Boolean).map(makeMyDay)
			});
		}

		if ($$self.$$.dirty[0] & /*value, computed*/ 301989888) {
			 $$invalidate(27, selection = getSelection(value, computed.min, computed.max, computed.disabled));
		}

		if ($$self.$$.dirty[0] & /*computed, selection, view, mode*/ 469762304) {
			 $$invalidate(2, props = {
				disabled: computed.disabled,
				min: computed.min,
				max: computed.max,
				selection,
				view,
				mode
			});
		}

		if ($$self.$$.dirty[0] & /*el, selection*/ 134217730) {
			 dispatchEvents(el, "selection", selection);
		}

		if ($$self.$$.dirty[0] & /*el, view*/ 67108866) {
			 dispatchEvents(el, "view", view);
		}

		if ($$self.$$.dirty[0] & /*el, computed*/ 268435458) {
			 dispatchEvents(el, "disabled", computed.disabled);
		}

		if ($$self.$$.dirty[0] & /*el, computed*/ 268435458) {
			 dispatchEvents(el, "min", computed.min);
		}

		if ($$self.$$.dirty[0] & /*el, computed*/ 268435458) {
			 dispatchEvents(el, "max", computed.max);
		}

		if ($$self.$$.dirty[0] & /*el, props, computed, selection, view, headers, mode, strict, disabled, value, limit, min, max*/ 503318391) ;
	};

	return [
		headers,
		el,
		props,
		onSelect,
		disabled,
		min,
		max,
		initial,
		mode,
		strict,
		limit,
		select,
		makeMyDay,
		setMin,
		setMax,
		setDisabled,
		goToYear,
		goToNextYear,
		goToLastYear,
		goToMonth,
		goToNextMonth,
		goToLastMonth,
		goToThisMonth,
		goToSelection,
		goTo,
		value,
		view,
		selection,
		computed,
		today,
		dispatcher,
		getSelection,
		filterInvalidDatesMin,
		filterInvalidDatesMax,
		filterInvalidDatesDisabled,
		dispatchEvents,
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
			instance$3,
			create_fragment$3,
			safe_not_equal,
			{
				value: 7,
				headers: 0,
				mode: 8,
				strict: 9,
				disabled: 4,
				limit: 10,
				min: 5,
				max: 6,
				select: 11,
				makeMyDay: 12,
				setMin: 13,
				setMax: 14,
				setDisabled: 15,
				goToYear: 16,
				goToNextYear: 17,
				goToLastYear: 18,
				goToMonth: 19,
				goToNextMonth: 20,
				goToLastMonth: 21,
				goToThisMonth: 22,
				goToSelection: 23,
				goTo: 24
			},
			[-1, -1]
		);
	}

	get select() {
		return this.$$.ctx[11];
	}

	get makeMyDay() {
		return makeMyDay;
	}

	get setMin() {
		return this.$$.ctx[13];
	}

	get setMax() {
		return this.$$.ctx[14];
	}

	get setDisabled() {
		return this.$$.ctx[15];
	}

	get goToYear() {
		return this.$$.ctx[16];
	}

	get goToNextYear() {
		return this.$$.ctx[17];
	}

	get goToLastYear() {
		return this.$$.ctx[18];
	}

	get goToMonth() {
		return this.$$.ctx[19];
	}

	get goToNextMonth() {
		return this.$$.ctx[20];
	}

	get goToLastMonth() {
		return this.$$.ctx[21];
	}

	get goToThisMonth() {
		return this.$$.ctx[22];
	}

	get goToSelection() {
		return this.$$.ctx[23];
	}

	get goTo() {
		return this.$$.ctx[24];
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
