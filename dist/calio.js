function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function noop() {}

function assign(tar, src) {
  for (var k in src) tar[k] = src[k];

  return tar;
}

function assignTrue(tar, src) {
  for (var k in src) tar[k] = 1;

  return tar;
}

function appendNode(node, target) {
  target.appendChild(node);
}

function insertNode(node, target, anchor) {
  target.insertBefore(node, anchor);
}

function detachNode(node) {
  node.parentNode.removeChild(node);
}

function destroyEach(iterations, detach) {
  for (var i = 0; i < iterations.length; i += 1) {
    if (iterations[i]) iterations[i].d(detach);
  }
}

function createElement(name) {
  return document.createElement(name);
}

function createText(data) {
  return document.createTextNode(data);
}

function addListener(node, event, handler) {
  node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
  node.removeEventListener(event, handler, false);
}

function blankObject() {
  return Object.create(null);
}

function destroy(detach) {
  this.destroy = noop;
  this.fire('destroy');
  this.set = noop;

  this._fragment.d(detach !== false);

  this._fragment = null;
  this._state = {};
}

function _differs(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
}

function fire(eventName, data) {
  var handlers = eventName in this._handlers && this._handlers[eventName].slice();

  if (!handlers) return;

  for (var i = 0; i < handlers.length; i += 1) {
    var handler = handlers[i];

    if (!handler.__calling) {
      handler.__calling = true;
      handler.call(this, data);
      handler.__calling = false;
    }
  }
}

function get() {
  return this._state;
}

function init(component, options) {
  component._handlers = blankObject();
  component._bind = options._bind;
  component.options = options;
  component.root = options.root || component;
  component.store = component.root.store || options.store;
}

function on(eventName, handler) {
  var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
  handlers.push(handler);
  return {
    cancel: function () {
      var index = handlers.indexOf(handler);
      if (~index) handlers.splice(index, 1);
    }
  };
}

function set$1(newState) {
  this._set(assign({}, newState));

  if (this.root._lock) return;
  this.root._lock = true;
  callAll(this.root._beforecreate);
  callAll(this.root._oncreate);
  callAll(this.root._aftercreate);
  this.root._lock = false;
}

function _set$1(newState) {
  var oldState = this._state,
      changed = {},
      dirty = false;

  for (var key in newState) {
    if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
  }

  if (!dirty) return;
  this._state = assign(assign({}, oldState), newState);

  this._recompute(changed, this._state);

  if (this._bind) this._bind(changed, this._state);

  if (this._fragment) {
    this.fire("state", {
      changed: changed,
      current: this._state,
      previous: oldState
    });

    this._fragment.p(changed, this._state);

    this.fire("update", {
      changed: changed,
      current: this._state,
      previous: oldState
    });
  }
}

function callAll(fns) {
  while (fns && fns.length) fns.shift()();
}

function _mount(target, anchor) {
  this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var proto = {
  destroy,
  get,
  fire,
  on,
  set: set$1,
  _recompute: noop,
  _set: _set$1,
  _mount,
  _differs
};

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
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }
};

function pad(val, len = 2) {
  val = `${val}`;

  while (val.length < len) {
    val = `0${val}`;
  }

  return val;
}

function format (date, mask = 'default') {
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
    S: ['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
  };
  return mask.replace(token, $0 => {
    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
  });
}

class LilEpoch {
  constructor(...args) {
    const a = args[0],
          b = args[1],
          c = args[2];

    if (args.length > 1) {
      this.value = new Date(a, b, c || 1);
    } else if (a instanceof LilEpoch) {
      this.value = a.clone().value;
    } else if (a instanceof Date) {
      this.value = a;
    } else if (['number', 'string'].includes(typeof a)) {
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
    return this.year() === day.year() && this.month() === day.month() && this.date() === day.date();
  }

  isSameMonth(day) {
    return this.year() === day.year() && this.month() === day.month();
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

const today = new LilEpoch();

function classes({
  props: {
    view
  },
  day,
  isActive,
  isDisabled,
  isRanged
}) {
  return [day.isSame(today) && 'is-today', view.endOfMonth().isBefore(day) && 'is-next', view.startOfMonth().isAfter(day) && 'is-prev', isDisabled && 'is-disabled', isRanged && 'is-ranged', isActive && 'is-active'].filter(Boolean).join(' ');
}

function isActive({
  props: {
    selection
  },
  day
}) {
  selection = new Array().concat(selection).filter(Boolean);
  return selection.find(s => day.isSame(s));
}

function isDisabled({
  props: {
    min,
    max,
    disabled
  },
  day
}) {
  return disabled.find(d => d.isSame && d.isSame(day)) || min && day.isBefore(min) || max && day.isAfter(max);
}

function isRanged({
  props: {
    selection,
    mode
  },
  day
}) {
  if (mode === 'range' && selection) {
    let _selection = _slicedToArray(selection, 2),
        start = _selection[0],
        end = _selection[1];

    if (start && end) {
      return day.isAfter(start) && day.isBefore(end);
    }
  }

  return false;
}

function add_css() {
  var style = createElement("style");
  style.id = 'svelte-1mp2c5z-style';
  style.textContent = ".calio-day.svelte-1mp2c5z{cursor:pointer;color:var(--color, #333)}.calio-day.svelte-1mp2c5z:hover{color:var(--color-hover, var(--color, #333));background:var(--bg-hover, #EEE)}.calio-day.is-today.svelte-1mp2c5z{font-weight:900}.calio-day.is-prev.svelte-1mp2c5z,.calio-day.is-next.svelte-1mp2c5z{color:var(--color-inactive, #CCC);background:var(--bg-inactive, transparent)}.calio-day.is-disabled.svelte-1mp2c5z{pointer-events:none;color:var(--color-disabled, var(--color-inactive, #CCC));background:var(--bg-disabled, transparent);opacity:var(--opacity-disabled, 0.5)}.calio-day.is-ranged.svelte-1mp2c5z{color:var(--color-ranged, var(--color-active, white));background:var(--bg-ranged, var(--bg-active, rgba(100, 149, 237, 0.66)))}.calio-day.is-active.svelte-1mp2c5z{color:var(--color-active, white);background:var(--bg-active, rgb(100, 149, 237))}";
  appendNode(style, document.head);
}

function create_main_fragment(component, ctx) {
  var span,
      text_value = ctx.day.date(),
      text,
      span_class_value;

  function click_handler(event) {
    component.fire('select', ctx.day);
  }

  return {
    c() {
      span = createElement("span");
      text = createText(text_value);
      addListener(span, "click", click_handler);
      span.className = span_class_value = "calio-day " + ctx.classes + " svelte-1mp2c5z";
    },

    m(target, anchor) {
      insertNode(span, target, anchor);
      appendNode(text, span);
    },

    p(changed, _ctx) {
      ctx = _ctx;

      if (changed.day && text_value !== (text_value = ctx.day.date())) {
        text.data = text_value;
      }

      if (changed.classes && span_class_value !== (span_class_value = "calio-day " + ctx.classes + " svelte-1mp2c5z")) {
        span.className = span_class_value;
      }
    },

    d(detach) {
      if (detach) {
        detachNode(span);
      }

      removeListener(span, "click", click_handler);
    }

  };
}

function Day(options) {
  init(this, options);
  this._state = assign({}, options.data);

  this._recompute({
    props: 1,
    day: 1,
    isActive: 1,
    isDisabled: 1,
    isRanged: 1
  }, this._state);

  this._intro = true;
  if (!document.getElementById("svelte-1mp2c5z-style")) add_css();
  this._fragment = create_main_fragment(this, this._state);

  if (options.target) {
    this._fragment.c();

    this._mount(options.target, options.anchor);
  }
}

assign(Day.prototype, proto);

Day.prototype._recompute = function _recompute(changed, state) {
  if (changed.props || changed.day) {
    if (this._differs(state.isActive, state.isActive = isActive(state))) changed.isActive = true;
    if (this._differs(state.isDisabled, state.isDisabled = isDisabled(state))) changed.isDisabled = true;
    if (this._differs(state.isRanged, state.isRanged = isRanged(state))) changed.isRanged = true;
  }

  if (changed.props || changed.day || changed.isActive || changed.isDisabled || changed.isRanged) {
    if (this._differs(state.classes, state.classes = classes(state))) changed.classes = true;
  }
};

const today$1 = new LilEpoch();

function props({
  selection,
  mode,
  view,
  disabled,
  min,
  max
}) {
  return {
    selection,
    mode,
    view,
    disabled,
    min,
    max
  };
}

function head({
  headers
}) {
  return headers.length ? new Array(7).fill('', 0, 7).map((n, i) => headers[i] || n) : [];
}

function dates({
  view,
  disabled
}) {
  let current = view.clone().startOfMonth(),
      dates = [],
      dayOfFirst,
      dayOfLast;

  if (!Array.isArray(disabled)) {
    return [];
  }

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

function data() {
  return {
    headers: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    view: new LilEpoch(),
    mode: 'single',
    strict: false,
    disabled: [],
    selection: null,
    value: null,
    limit: null,
    min: null,
    max: null
  };
}
var methods = {
  makeMyDay(day = null) {
    return day ? day instanceof LilEpoch ? day : Array.isArray(day) ? new LilEpoch(...day) : new LilEpoch(day) : null;
  },

  select(day) {
    const _this$get = this.get(),
          mode = _this$get.mode,
          disabled = _this$get.disabled,
          min = _this$get.min,
          max = _this$get.max;

    day = this.makeMyDay(day);

    if (day) {
      if (disabled.find(d => d.isSame(day)) || min && day.isBefore(min) || max && day.isAfter(max)) {
        return;
      }

      switch (mode) {
        case 'range':
          this.updateRange(day);
          break;

        case 'multi':
          this.updateMulti(day);
          break;

        default:
          this.updateSingle(day);
          break;
      }
    }
  },

  updateRange(day) {
    let _this$get2 = this.get(),
        selection = _this$get2.selection,
        disabled = _this$get2.disabled,
        strict = _this$get2.strict,
        index;

    selection = selection || [];
    index = selection.findIndex(s => s.isSame(day));

    if (index > -1) {
      selection.splice(index, 1);
      this.set({
        selection
      });
    } else if (selection.length > 1) {
      this.set({
        selection: [day.clone()]
      });
    } else {
      selection = [...selection, day.clone()];
      selection = selection.sort((a, b) => {
        return a.timestamp() - b.timestamp();
      });

      if (strict) {
        let _selection = selection,
            _selection2 = _slicedToArray(_selection, 2),
            start = _selection2[0],
            end = _selection2[1],
            isInvalid = end && !!disabled.find(d => {
          return d.isAfter(start) && d.isBefore(end);
        });

        if (isInvalid) {
          return;
        }
      }

      this.set({
        selection: selection
      });
    }
  },

  updateMulti(day) {
    let _this$get3 = this.get(),
        selection = _this$get3.selection,
        limit = _this$get3.limit,
        index;

    selection = selection || [];
    index = selection.findIndex(s => s.isSame(day));

    if (index > -1) {
      selection.splice(index, 1);
      this.set({
        selection
      });
    } else if (!limit || selection.length < limit) {
      this.set({
        selection: [...selection, day.clone()].sort((a, b) => {
          return a.timestamp() - b.timestamp();
        })
      });
    }
  },

  updateSingle(day) {
    this.set({
      selection: day.clone()
    });
  },

  goToYear(y) {
    const _this$get4 = this.get(),
          view = _this$get4.view;

    this.set({
      view: view.clone().year(y)
    });
  },

  goToNextYear() {
    const _this$get5 = this.get(),
          view = _this$get5.view;

    this.set({
      view: view.clone().addYear()
    });
  },

  goToLastYear() {
    const _this$get6 = this.get(),
          view = _this$get6.view;

    this.set({
      view: view.clone().subYear()
    });
  },

  goToMonth(m) {
    const _this$get7 = this.get(),
          view = _this$get7.view;

    this.set({
      view: view.clone().date(1).month(m - 1)
    });
  },

  goToNextMonth() {
    const _this$get8 = this.get(),
          view = _this$get8.view;

    this.set({
      view: view.clone().date(1).addMonth()
    });
  },

  goToLastMonth() {
    const _this$get9 = this.get(),
          view = _this$get9.view;

    this.set({
      view: view.clone().date(1).subMonth()
    });
  },

  goToThisMonth() {
    this.set({
      view: today$1.clone()
    });
  },

  goToSelection() {
    const _this$get10 = this.get(),
          selection = _this$get10.selection,
          mode = _this$get10.mode;

    if (mode === 'single' && selection) {
      this.set({
        view: selection.clone()
      });
    }
  },

  goTo(day) {
    day = this.makeMyDay(day);

    if (day) {
      this.set({
        view: day.clone()
      });
    }
  }

};

function oncreate() {
  const _this$get11 = this.get(),
        value = _this$get11.value,
        min = _this$get11.min,
        max = _this$get11.max,
        disabled = _this$get11.disabled;

  this.set({
    min: this.makeMyDay(min),
    max: this.makeMyDay(max),
    disabled: new Array().concat(disabled).filter(Boolean).map(this.makeMyDay)
  });
  new Array().concat(value).forEach(v => this.select(v));
}

function onstate({
  changed,
  previous,
  current: {
    mode,
    view,
    value,
    selection,
    disabled
  }
}) {
  if (changed.view) {
    this.fire('view', view.clone().date(1));
  }

  if (previous && selection && changed.selection) {
    if (mode === 'single') {
      this.fire('select', selection.clone());

      if (!selection.isSameMonth(view)) {
        view = selection.clone();
        this.set({
          view
        });
        this.fire('view', view.clone().date(1));
      }
    } else {
      this.fire('select', selection.map(s => s.clone()));
    }
  }

  if (previous && changed.value) {
    const selection = this.makeMyDay(value);
    view = selection.clone();
    this.set({
      view,
      selection
    });
    this.fire('view', view.clone().date(1));
  }
}

function add_css$1() {
  var style = createElement("style");
  style.id = 'svelte-ui4b82-style';
  style.textContent = ".calio.svelte-ui4b82{display:-ms-inline-grid;display:inline-grid;-ms-grid-columns:(var(--size-x, var(--size, 2.25em)))[7];grid-template-columns:repeat(7, var(--size-x, var(--size, 2.25em)));grid-auto-rows:var(--size-y, var(--size, 2em));line-height:var(--size-y, var(--size, 2em));text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.calio-head.svelte-ui4b82{color:var(--color, #333);font-weight:bold}";
  appendNode(style, document.head);
}

function create_main_fragment$1(component, ctx) {
  var div, text;
  var each_value = ctx.head;
  var each_blocks = [];

  for (var i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(component, get_each_context(ctx, each_value, i));
  }

  var each_value_1 = ctx.dates;
  var each_1_blocks = [];

  for (var i = 0; i < each_value_1.length; i += 1) {
    each_1_blocks[i] = create_each_block_1(component, get_each_1_context(ctx, each_value_1, i));
  }

  return {
    c() {
      div = createElement("div");

      for (var i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      text = createText("\n    ");

      for (var i = 0; i < each_1_blocks.length; i += 1) {
        each_1_blocks[i].c();
      }

      div.className = "calio svelte-ui4b82";
    },

    m(target, anchor) {
      insertNode(div, target, anchor);

      for (var i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }

      appendNode(text, div);

      for (var i = 0; i < each_1_blocks.length; i += 1) {
        each_1_blocks[i].m(div, null);
      }
    },

    p(changed, ctx) {
      if (changed.head) {
        each_value = ctx.head;

        for (var i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(changed, child_ctx);
          } else {
            each_blocks[i] = create_each_block(component, child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div, text);
          }
        }

        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }

        each_blocks.length = each_value.length;
      }

      if (changed.dates || changed.props) {
        each_value_1 = ctx.dates;

        for (var i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_1_context(ctx, each_value_1, i);

          if (each_1_blocks[i]) {
            each_1_blocks[i].p(changed, child_ctx);
          } else {
            each_1_blocks[i] = create_each_block_1(component, child_ctx);
            each_1_blocks[i].c();
            each_1_blocks[i].m(div, null);
          }
        }

        for (; i < each_1_blocks.length; i += 1) {
          each_1_blocks[i].d(1);
        }

        each_1_blocks.length = each_value_1.length;
      }
    },

    d(detach) {
      if (detach) {
        detachNode(div);
      }

      destroyEach(each_blocks, detach);
      destroyEach(each_1_blocks, detach);
    }

  };
} // (2:4) {#each head as day}


function create_each_block(component, ctx) {
  var span,
      text_value = ctx.day,
      text;
  return {
    c() {
      span = createElement("span");
      text = createText(text_value);
      span.className = "calio-head svelte-ui4b82";
    },

    m(target, anchor) {
      insertNode(span, target, anchor);
      appendNode(text, span);
    },

    p(changed, ctx) {
      if (changed.head && text_value !== (text_value = ctx.day)) {
        text.data = text_value;
      }
    },

    d(detach) {
      if (detach) {
        detachNode(span);
      }
    }

  };
} // (5:4) {#each dates as day}


function create_each_block_1(component, ctx) {
  var day_initial_data = {
    day: ctx.day,
    props: ctx.props
  };
  var day = new Day({
    root: component.root,
    data: day_initial_data
  });
  day.on("select", function (event) {
    component.select(ctx.day);
  });
  return {
    c() {
      day._fragment.c();
    },

    m(target, anchor) {
      day._mount(target, anchor);
    },

    p(changed, _ctx) {
      ctx = _ctx;
      var day_changes = {};
      if (changed.dates) day_changes.day = ctx.day;
      if (changed.props) day_changes.props = ctx.props;

      day._set(day_changes);
    },

    d(detach) {
      day.destroy(detach);
    }

  };
}

function get_each_context(ctx, list, i) {
  const child_ctx = Object.create(ctx);
  child_ctx.day = list[i];
  child_ctx.each_value = list;
  child_ctx.day_index = i;
  return child_ctx;
}

function get_each_1_context(ctx, list, i) {
  const child_ctx = Object.create(ctx);
  child_ctx.day = list[i];
  child_ctx.each_value_1 = list;
  child_ctx.day_index_1 = i;
  return child_ctx;
}

function Calio(options) {
  init(this, options);
  this._state = assign(data(), options.data);

  this._recompute({
    selection: 1,
    mode: 1,
    view: 1,
    disabled: 1,
    min: 1,
    max: 1,
    headers: 1
  }, this._state);

  this._intro = true;
  this._handlers.state = [onstate];
  if (!document.getElementById("svelte-ui4b82-style")) add_css$1();

  if (!options.root) {
    this._oncreate = [];
    this._beforecreate = [];
    this._aftercreate = [];
  }

  this._fragment = create_main_fragment$1(this, this._state);

  this.root._oncreate.push(() => {
    onstate.call(this, {
      changed: assignTrue({}, this._state),
      current: this._state
    });
    oncreate.call(this);
    this.fire("update", {
      changed: assignTrue({}, this._state),
      current: this._state
    });
  });

  if (options.target) {
    this._fragment.c();

    this._mount(options.target, options.anchor);

    this._lock = true;
    callAll(this._beforecreate);
    callAll(this._oncreate);
    callAll(this._aftercreate);
    this._lock = false;
  }
}

assign(Calio.prototype, proto);
assign(Calio.prototype, methods);

Calio.prototype._recompute = function _recompute(changed, state) {
  if (changed.selection || changed.mode || changed.view || changed.disabled || changed.min || changed.max) {
    if (this._differs(state.props, state.props = props(state))) changed.props = true;
  }

  if (changed.headers) {
    if (this._differs(state.head, state.head = head(state))) changed.head = true;
  }

  if (changed.view || changed.disabled) {
    if (this._differs(state.dates, state.dates = dates(state))) changed.dates = true;
  }
};

class index {
  constructor(el, data = {}) {
    const options = ['headers', 'mode', 'disabled', 'strict', 'value', 'limit', 'min', 'max'];
    const target = typeof el === 'string' ? document.querySelector(el) : el;
    return new Calio({
      target,
      data: Object.keys(data).filter(key => options.includes(key)).reduce((obj, key) => (obj[key] = data[key], obj), {})
    });
  }

}

export default index;
