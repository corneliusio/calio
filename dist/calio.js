function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _core = createCommonjsModule(function (module) {
var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});
var _core_1 = _core.version;

var _global = createCommonjsModule(function (module) {
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _library = false;

var _shared = createCommonjsModule(function (module) {
var SHARED = '__core-js_shared__';
var store = _global[SHARED] || (_global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: _core.version,
  mode: _library ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var px = Math.random();
var _uid = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _wks = createCommonjsModule(function (module) {
var store = _shared('wks');

var Symbol = _global.Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
};

$exports.store = store;
});

var _isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var _anObject = function (it) {
  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

var document$1 = _global.document;
// typeof document.createElement is 'object' in old IE
var is = _isObject(document$1) && _isObject(document$1.createElement);
var _domCreate = function (it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])

// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function (it, S) {
  if (!_isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var dP = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  _anObject(O);
  P = _toPrimitive(P, true);
  _anObject(Attributes);
  if (_ie8DomDefine) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
	f: f
};

var _propertyDesc = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var _hide = _descriptors ? function (object, key, value) {
  return _objectDp.f(object, key, _propertyDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _wks('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
var _addToUnscopables = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

var _iterStep = function (done, value) {
  return { value: value, done: !!done };
};

var _iterators = {};

var toString = {}.toString;

var _cof = function (it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings

// eslint-disable-next-line no-prototype-builtins
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return _cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings


var _toIobject = function (it) {
  return _iobject(_defined(it));
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var _functionToString = _shared('native-function-to-string', Function.toString);

var _redefine = createCommonjsModule(function (module) {
var SRC = _uid('src');

var TO_STRING = 'toString';
var TPL = ('' + _functionToString).split(TO_STRING);

_core.inspectSource = function (it) {
  return _functionToString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === _global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    _hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    _hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || _functionToString.call(this);
});
});

var _aFunction = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding

var _ctx = function (fn, that, length) {
  _aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
    // extend global
    if (target) _redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) _hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
_global.core = _core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
var _export = $export;

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength

var min = Math.min;
var _toLength = function (it) {
  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var max = Math.max;
var min$1 = Math.min;
var _toAbsoluteIndex = function (index, length) {
  index = _toInteger(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes



var _arrayIncludes = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = _toIobject($this);
    var length = _toLength(O.length);
    var index = _toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var shared = _shared('keys');

var _sharedKey = function (key) {
  return shared[key] || (shared[key] = _uid(key));
};

var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function (object, names) {
  var O = _toIobject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (_has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)



var _objectKeys = Object.keys || function keys(O) {
  return _objectKeysInternal(O, _enumBugKeys);
};

var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  _anObject(O);
  var keys = _objectKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
  return O;
};

var document$2 = _global.document;
var _html = document$2 && document$2.documentElement;

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



var IE_PROTO$1 = _sharedKey('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE$1 = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = _domCreate('iframe');
  var i = _enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  _html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
  return createDict();
};

var _objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE$1] = _anObject(O);
    result = new Empty();
    Empty[PROTOTYPE$1] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = createDict();
  return Properties === undefined ? result : _objectDps(result, Properties);
};

var def = _objectDp.f;

var TAG = _wks('toStringTag');

var _setToStringTag = function (it, tag, stat) {
  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

var _iterCreate = function (Constructor, NAME, next) {
  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
  _setToStringTag(Constructor, NAME + ' Iterator');
};

// 7.1.13 ToObject(argument)

var _toObject = function (it) {
  return Object(_defined(it));
};

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


var IE_PROTO$2 = _sharedKey('IE_PROTO');
var ObjectProto = Object.prototype;

var _objectGpo = Object.getPrototypeOf || function (O) {
  O = _toObject(O);
  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

var ITERATOR = _wks('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  _iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      _setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    _hide(proto, ITERATOR, $default);
  }
  // Plug for library
  _iterators[NAME] = $default;
  _iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) _redefine(proto, key, methods[key]);
    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
  this._t = _toIobject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return _iterStep(1);
  }
  if (kind == 'keys') return _iterStep(0, index);
  if (kind == 'values') return _iterStep(0, O[index]);
  return _iterStep(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
_iterators.Arguments = _iterators.Array;

_addToUnscopables('keys');
_addToUnscopables('values');
_addToUnscopables('entries');

var ITERATOR$1 = _wks('iterator');
var TO_STRING_TAG = _wks('toStringTag');
var ArrayValues = _iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = _global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
    _iterators[NAME] = ArrayValues;
    if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
  }
}

// true  -> String#at
// false -> String#codePointAt
var _stringAt = function (TO_STRING) {
  return function (that, pos) {
    var s = String(_defined(that));
    var i = _toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

var at = _stringAt(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
var _advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

// getting tag from 19.1.3.6 Object.prototype.toString()

var TAG$1 = _wks('toStringTag');
// ES3 wrong here
var ARG = _cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

var _classof = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
    // builtinTag case
    : ARG ? _cof(O)
    // ES3 arguments fallback
    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
var _regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (_classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

// 21.2.5.3 get RegExp.prototype.flags

var _flags = function () {
  var that = _anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

var _regexpExec = patchedExec;

_export({
  target: 'RegExp',
  proto: true,
  forced: _regexpExec !== /./.exec
}, {
  exec: _regexpExec
});

var SPECIES = _wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

var _fixReWks = function (KEY, length, exec) {
  var SYMBOL = _wks(KEY);

  var DELEGATES_TO_SYMBOL = !_fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      _defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === _regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    _redefine(String.prototype, KEY, strfn);
    _hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

var max$1 = Math.max;
var min$2 = Math.min;
var floor$1 = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
_fixReWks('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = _anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = _regexpExecAbstract(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = _advanceStringIndex(S, _toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max$1(min$2(_toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = _toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor$1(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

// 7.2.8 IsRegExp(argument)


var MATCH = _wks('match');
var _isRegexp = function (it) {
  var isRegExp;
  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
};

// 7.3.20 SpeciesConstructor(O, defaultConstructor)


var SPECIES$1 = _wks('species');
var _speciesConstructor = function (O, D) {
  var C = _anObject(O).constructor;
  var S;
  return C === undefined || (S = _anObject(C)[SPECIES$1]) == undefined ? D : _aFunction(S);
};

var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX$1 = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !_fails(function () { });

// @@split logic
_fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!_isRegexp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = _regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX$1];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = _anObject(regexp);
      var S = String(this);
      var C = _speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(_toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = _advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});

function noop() {}

function assign(tar, src) {
  for (var k in src) {
    tar[k] = src[k];
  }

  return tar;
}

function assignTrue(tar, src) {
  for (var k in src) {
    tar[k] = 1;
  }

  return tar;
}

function append(target, node) {
  target.appendChild(node);
}

function insert(target, node, anchor) {
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

function addListener(node, event, handler, options) {
  node.addEventListener(event, handler, options);
}

function removeListener(node, event, handler, options) {
  node.removeEventListener(event, handler, options);
}

function setData(text, data) {
  text.data = '' + data;
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
      try {
        handler.__calling = true;
        handler.call(this, data);
      } finally {
        handler.__calling = false;
      }
    }
  }
}

function flush(component) {
  component._lock = true;
  callAll(component._beforecreate);
  callAll(component._oncreate);
  callAll(component._aftercreate);
  component._lock = false;
}

function get() {
  return this._state;
}

function init(component, options) {
  component._handlers = blankObject();
  component._slots = blankObject();
  component._bind = options._bind;
  component._staged = {};
  component.options = options;
  component.root = options.root || component;
  component.store = options.store || component.root.store;

  if (!options.root) {
    component._beforecreate = [];
    component._oncreate = [];
    component._aftercreate = [];
  }
}

function on(eventName, handler) {
  var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
  handlers.push(handler);
  return {
    cancel: function cancel() {
      var index = handlers.indexOf(handler);
      if (~index) handlers.splice(index, 1);
    }
  };
}

function set(newState) {
  this._set(assign({}, newState));

  if (this.root._lock) return;
  flush(this.root);
}

function _set(newState) {
  var oldState = this._state,
      changed = {},
      dirty = false;
  newState = assign(this._staged, newState);
  this._staged = {};

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

function _stage(newState) {
  assign(this._staged, newState);
}

function callAll(fns) {
  while (fns && fns.length) {
    fns.shift()();
  }
}

function _mount(target, anchor) {
  this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
}

var proto$1 = {
  destroy,
  get,
  fire,
  on,
  set,
  _recompute: noop,
  _set,
  _stage,
  _mount,
  _differs
};

// 21.2.5.3 get RegExp.prototype.flags()
if (_descriptors && /./g.flags != 'g') _objectDp.f(RegExp.prototype, 'flags', {
  configurable: true,
  get: _flags
});

var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  _redefine(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (_fails(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = _anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !_descriptors && R instanceof RegExp ? _flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhsTt])\1?|[LloS]|"[^"]*"|'[^']*'/g;
var formats = {
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

function pad(val) {
  var len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  val = `${val}`;

  while (val.length < len) {
    val = `0${val}`;
  }

  return val;
}

function format (date) {
  var mask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

  if (typeof date === 'object' && 'timestamp' in date) {
    date = date.timestamp();
  }

  date = date instanceof Date ? date : new Date(date);
  mask = `${formats.masks[mask] || mask || formats.masks.default}`;
  var d = date.getUTCDate(),
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
  constructor() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var a = args[0],
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

  year() {
    var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (y !== null) {
      this.value.setUTCFullYear(y);
      return this;
    }

    return this.value.getUTCFullYear();
  }

  month() {
    var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (m !== null) {
      this.value.setUTCMonth(m);
      return this;
    }

    return this.value.getUTCMonth();
  }

  date() {
    var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (d !== null) {
      this.value.setUTCDate(d);
      return this;
    }

    return this.value.getUTCDate();
  }

  addDay() {
    var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    this.date(this.date() + d);
    return this;
  }

  addMonth() {
    var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    this.month(this.month() + m);
    return this;
  }

  addYear() {
    var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    this.year(this.year() + y);
    return this;
  }

  subDay() {
    var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    this.date(this.date() - d);
    return this;
  }

  subMonth() {
    var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    this.month(this.month() - m);
    return this;
  }

  subYear() {
    var y = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
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

/* src/components/Day.svlt generated by Svelte v2.16.1 */

const today = new LilEpoch();

function classes({ props: { view }, day, isActive, isDisabled, isRanged }) {
    return [
        day.isSame(today) && 'is-today',
        view.endOfMonth().isBefore(day) && 'is-next',
        view.startOfMonth().isAfter(day) && 'is-prev',
        isDisabled && 'is-disabled',
        isRanged && 'is-ranged',
        isActive && 'is-active'
    ].filter(Boolean).join(' ');
}
function isActive({ props: { selection }, day }) {
    selection = new Array().concat(selection).filter(Boolean);

    return selection.find(s => day.isSame(s));
}
function isDisabled({ props: { min, max, disabled }, day }) {
    return (disabled.find(d => d.isSame && d.isSame(day)))
        || (min && day.isBefore(min))
        || (max && day.isAfter(max));
}
function isRanged({ props: { selection, mode }, day }) {
    if (mode === 'range' && selection) {
        let [start, end] = selection;

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
	append(document.head, style);
}

function create_main_fragment(component, ctx) {
	var span, text_value = ctx.day.date(), text, span_class_value;

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
			insert(target, span, anchor);
			append(span, text);
		},

		p(changed, _ctx) {
			ctx = _ctx;
			if ((changed.day) && text_value !== (text_value = ctx.day.date())) {
				setData(text, text_value);
			}

			if ((changed.classes) && span_class_value !== (span_class_value = "calio-day " + ctx.classes + " svelte-1mp2c5z")) {
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

	this._recompute({ props: 1, day: 1, isActive: 1, isDisabled: 1, isRanged: 1 }, this._state);
	this._intro = true;

	if (!document.getElementById("svelte-1mp2c5z-style")) add_css();

	this._fragment = create_main_fragment(this, this._state);

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);
	}
}

assign(Day.prototype, proto$1);

Day.prototype._recompute = function _recompute(changed, state) {
	if (changed.props || changed.day) {
		if (this._differs(state.isActive, (state.isActive = isActive(state)))) changed.isActive = true;
		if (this._differs(state.isDisabled, (state.isDisabled = isDisabled(state)))) changed.isDisabled = true;
		if (this._differs(state.isRanged, (state.isRanged = isRanged(state)))) changed.isRanged = true;
	}

	if (changed.props || changed.day || changed.isActive || changed.isDisabled || changed.isRanged) {
		if (this._differs(state.classes, (state.classes = classes(state)))) changed.classes = true;
	}
};

/* src/components/Calio.svlt generated by Svelte v2.16.1 */



const today$1 = new LilEpoch();

function updateRange(component, day) {
    let { selection, disabled, strict } = component.get(),
        index;

    selection = selection || [];
    index = selection.findIndex(s => s.isSame(day));

    if (index > -1) {
        selection.splice(index, 1);
        component.set({ selection });
    } else if (selection.length > 1) {
        component.set({
            selection: [day.clone()]
        });
    } else {
        selection = [...selection, day.clone()];

        selection = selection.sort((a, b) => {
            return a.timestamp() - b.timestamp();
        });

        if (strict) {
            let [start, end] = selection,
                isInvalid = end && !!disabled.find(d => {
                    return d.isAfter(start) && d.isBefore(end);
                });

            if (isInvalid) {
                return;
            }
        }

        component.set({ selection });
    }
}

function updateMulti(component, day) {
    let { selection, limit } = component.get(),
        index;

    selection = selection || [];
    index = selection.findIndex(s => s.isSame(day));

    if (index > -1) {
        selection.splice(index, 1);
        component.set({ selection });
    } else if (!limit || selection.length < limit) {
        component.set({
            selection: [...selection, day.clone()].sort((a, b) => {
                return a.timestamp() - b.timestamp();
            })
        });
    }
}

function updateSingle(component, day, view) {
    component.set({ selection: day.clone() });

    if (!view.isSameMonth(day)) {
        component.set({ view: day.clone().startOfMonth() });
    }
}

function props({ selection, mode, view, disabled, min, max }) {
    return { selection, mode, view, disabled, min, max };
}
function head({ headers }) {
    return headers.length
        ? new Array(7).fill('', 0, 7).map((n, i) => headers[i] || n)
        : [];
}
function dates({ view, disabled }) {
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

    for (let i = 1; i < (7 - dayOfLast); i++) {
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
        return day
            ? (day instanceof LilEpoch)
                ? day : Array.isArray(day)
                    ? new LilEpoch(...day) : new LilEpoch(day)
            : null;
    },

    select(day) {
        const { mode, view, disabled, min, max } = this.get();

        day = this.makeMyDay(day);

        if (day) {
            if (disabled.find(d => d.isSame(day))
                || (min && day.isBefore(min))
                || (max && day.isAfter(max))) {

                return;
            }

            switch (mode) {
                case 'range' :
                    updateRange(this, day);
                    break;
                case 'multi' :
                    updateMulti(this, day);
                    break;
                default :
                    updateSingle(this, day, view);
                    break;
            }
        }
    },

    goToYear(y) {
        const { view } = this.get();

        this.set({
            view: view.clone().year(y)
        });
    },

    goToNextYear() {
        const { view } = this.get();

        this.set({
            view: view.clone().addYear()
        });
    },

    goToLastYear() {
        const { view } = this.get();

        this.set({
            view: view.clone().subYear()
        });
    },

    goToMonth(m) {
        const { view } = this.get();

        this.set({
            view: view.clone().startOfMonth().month(m - 1)
        });
    },

    goToNextMonth() {
        const { view } = this.get();

        this.set({
            view: view.clone().startOfMonth().addMonth()
        });
    },

    goToLastMonth() {
        const { view } = this.get();

        this.set({
            view: view.clone().startOfMonth().subMonth()
        });
    },

    goToThisMonth() {
        this.set({
            view: today$1.clone().startOfMonth()
        });
    },

    goToSelection() {
        const { selection, mode } = this.get();

        if (mode === 'single' && selection) {
            this.set({
                view: selection.clone().startOfMonth()
            });
        }
    },

    goTo(day) {
        day = this.makeMyDay(day);

        if (day) {
            this.set({
                view: day.clone().startOfMonth()
            });
        }
    }
};

function oncreate() {
    const { value, min, max, disabled } = this.get();

    this.set({
        min: this.makeMyDay(min),
        max: this.makeMyDay(max),
        disabled: new Array()
            .concat(disabled)
            .filter(Boolean)
            .map(this.makeMyDay)
    });

    new Array().concat(value).forEach(v => this.select(v));
}
function onupdate({ changed, previous, current }) {
    this.refs.el.parentNode.dispatchEvent(new CustomEvent(`calio:update`, {
        detail: current
    }));

    Object.keys(changed).forEach(key => {
        this.fire(key, current);
        this.refs.el.parentNode.dispatchEvent(new CustomEvent(`calio:${key}`, {
            detail: current
        }));
    });

    if (previous && changed.value) {
        this.select(current.value);
    }
}
function add_css$1() {
	var style = createElement("style");
	style.id = 'svelte-4rx1aq-style';
	style.textContent = ".calio.svelte-4rx1aq{display:-ms-inline-grid;display:inline-grid;-ms-grid-columns:(var(--size-x, var(--size, 2.25em)))[7];grid-template-columns:repeat(7, var(--size-x, var(--size, 2.25em)));grid-auto-rows:var(--size-y, var(--size, 2em));line-height:var(--size-y, var(--size, 2em));text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.calio-head.svelte-4rx1aq{color:var(--color, #333);font-weight:bold}";
	append(document.head, style);
}

function get_each1_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.day = list[i];
	return child_ctx;
}

function get_each0_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.day = list[i];
	return child_ctx;
}

function create_main_fragment$1(component_1, ctx) {
	var div, text;

	var each0_value = ctx.head;

	var each0_blocks = [];

	for (var i = 0; i < each0_value.length; i += 1) {
		each0_blocks[i] = create_each_block_1(component_1, get_each0_context(ctx, each0_value, i));
	}

	var each1_value = ctx.dates;

	var each1_blocks = [];

	for (var i = 0; i < each1_value.length; i += 1) {
		each1_blocks[i] = create_each_block(component_1, get_each1_context(ctx, each1_value, i));
	}

	return {
		c() {
			div = createElement("div");

			for (var i = 0; i < each0_blocks.length; i += 1) {
				each0_blocks[i].c();
			}

			text = createText("\n    ");

			for (var i = 0; i < each1_blocks.length; i += 1) {
				each1_blocks[i].c();
			}
			div.className = "calio svelte-4rx1aq";
		},

		m(target, anchor) {
			insert(target, div, anchor);

			for (var i = 0; i < each0_blocks.length; i += 1) {
				each0_blocks[i].m(div, null);
			}

			append(div, text);

			for (var i = 0; i < each1_blocks.length; i += 1) {
				each1_blocks[i].m(div, null);
			}

			component_1.refs.el = div;
		},

		p(changed, ctx) {
			if (changed.head) {
				each0_value = ctx.head;

				for (var i = 0; i < each0_value.length; i += 1) {
					const child_ctx = get_each0_context(ctx, each0_value, i);

					if (each0_blocks[i]) {
						each0_blocks[i].p(changed, child_ctx);
					} else {
						each0_blocks[i] = create_each_block_1(component_1, child_ctx);
						each0_blocks[i].c();
						each0_blocks[i].m(div, text);
					}
				}

				for (; i < each0_blocks.length; i += 1) {
					each0_blocks[i].d(1);
				}
				each0_blocks.length = each0_value.length;
			}

			if (changed.dates || changed.props) {
				each1_value = ctx.dates;

				for (var i = 0; i < each1_value.length; i += 1) {
					const child_ctx = get_each1_context(ctx, each1_value, i);

					if (each1_blocks[i]) {
						each1_blocks[i].p(changed, child_ctx);
					} else {
						each1_blocks[i] = create_each_block(component_1, child_ctx);
						each1_blocks[i].c();
						each1_blocks[i].m(div, null);
					}
				}

				for (; i < each1_blocks.length; i += 1) {
					each1_blocks[i].d(1);
				}
				each1_blocks.length = each1_value.length;
			}
		},

		d(detach) {
			if (detach) {
				detachNode(div);
			}

			destroyEach(each0_blocks, detach);

			destroyEach(each1_blocks, detach);

			if (component_1.refs.el === div) component_1.refs.el = null;
		}
	};
}

// (2:4) {#each head as day}
function create_each_block_1(component_1, ctx) {
	var span, text_value = ctx.day, text;

	return {
		c() {
			span = createElement("span");
			text = createText(text_value);
			span.className = "calio-head svelte-4rx1aq";
		},

		m(target, anchor) {
			insert(target, span, anchor);
			append(span, text);
		},

		p(changed, ctx) {
			if ((changed.head) && text_value !== (text_value = ctx.day)) {
				setData(text, text_value);
			}
		},

		d(detach) {
			if (detach) {
				detachNode(span);
			}
		}
	};
}

// (5:4) {#each dates as day}
function create_each_block(component_1, ctx) {

	var day_1_initial_data = { day: ctx.day, props: ctx.props };
	var day_1 = new Day({
		root: component_1.root,
		store: component_1.store,
		data: day_1_initial_data
	});

	day_1.on("select", function(event) {
		component_1.select(ctx.day);
	});

	return {
		c() {
			day_1._fragment.c();
		},

		m(target, anchor) {
			day_1._mount(target, anchor);
		},

		p(changed, _ctx) {
			ctx = _ctx;
			var day_1_changes = {};
			if (changed.dates) day_1_changes.day = ctx.day;
			if (changed.props) day_1_changes.props = ctx.props;
			day_1._set(day_1_changes);
		},

		d(detach) {
			day_1.destroy(detach);
		}
	};
}

function Calio(options) {
	init(this, options);
	this.refs = {};
	this._state = assign(data(), options.data);

	this._recompute({ selection: 1, mode: 1, view: 1, disabled: 1, min: 1, max: 1, headers: 1 }, this._state);
	this._intro = true;
	this._handlers.update = [onupdate];

	if (!document.getElementById("svelte-4rx1aq-style")) add_css$1();

	this._fragment = create_main_fragment$1(this, this._state);

	this.root._oncreate.push(() => {
		oncreate.call(this);
		this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
	});

	if (options.target) {
		this._fragment.c();
		this._mount(options.target, options.anchor);

		flush(this);
	}
}

assign(Calio.prototype, proto$1);
assign(Calio.prototype, methods);

Calio.prototype._recompute = function _recompute(changed, state) {
	if (changed.selection || changed.mode || changed.view || changed.disabled || changed.min || changed.max) {
		if (this._differs(state.props, (state.props = props(state)))) changed.props = true;
	}

	if (changed.headers) {
		if (this._differs(state.head, (state.head = head(state)))) changed.head = true;
	}

	if (changed.view || changed.disabled) {
		if (this._differs(state.dates, (state.dates = dates(state)))) changed.dates = true;
	}
};

class index {
  constructor(el) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = ['headers', 'mode', 'disabled', 'strict', 'value', 'limit', 'min', 'max'];
    var target = typeof el === 'string' ? document.querySelector(el) : el;
    return new Calio({
      target,
      data: Object.keys(data).filter(key => options.includes(key)).reduce((obj, key) => (obj[key] = data[key], obj), {})
    });
  }

}

export default index;
