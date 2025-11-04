var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/nanoassert/index.js
var require_nanoassert = __commonJS({
  "node_modules/nanoassert/index.js"(exports, module) {
    assert.notEqual = notEqual;
    assert.notOk = notOk;
    assert.equal = equal;
    assert.ok = assert;
    module.exports = assert;
    function equal(a, b, m) {
      assert(a == b, m);
    }
    function notEqual(a, b, m) {
      assert(a != b, m);
    }
    function notOk(t, m) {
      assert(!t, m);
    }
    function assert(t, m) {
      if (!t) throw new Error(m || "AssertionError");
    }
  }
});

// node_modules/nanomorph/lib/events.js
var require_events = __commonJS({
  "node_modules/nanomorph/lib/events.js"(exports, module) {
    module.exports = [
      // attribute events (can be set with attributes)
      "onclick",
      "ondblclick",
      "onmousedown",
      "onmouseup",
      "onmouseover",
      "onmousemove",
      "onmouseout",
      "onmouseenter",
      "onmouseleave",
      "ontouchcancel",
      "ontouchend",
      "ontouchmove",
      "ontouchstart",
      "ondragstart",
      "ondrag",
      "ondragenter",
      "ondragleave",
      "ondragover",
      "ondrop",
      "ondragend",
      "onkeydown",
      "onkeypress",
      "onkeyup",
      "onunload",
      "onabort",
      "onerror",
      "onresize",
      "onscroll",
      "onselect",
      "onchange",
      "onsubmit",
      "onreset",
      "onfocus",
      "onblur",
      "oninput",
      "onanimationend",
      "onanimationiteration",
      "onanimationstart",
      // other common events
      "oncontextmenu",
      "onfocusin",
      "onfocusout"
    ];
  }
});

// node_modules/nanomorph/lib/morph.js
var require_morph = __commonJS({
  "node_modules/nanomorph/lib/morph.js"(exports, module) {
    var events = require_events();
    var eventsLength = events.length;
    var ELEMENT_NODE = 1;
    var TEXT_NODE = 3;
    var COMMENT_NODE = 8;
    module.exports = morph;
    function morph(newNode, oldNode) {
      var nodeType = newNode.nodeType;
      var nodeName = newNode.nodeName;
      if (nodeType === ELEMENT_NODE) {
        copyAttrs(newNode, oldNode);
      }
      if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
        if (oldNode.nodeValue !== newNode.nodeValue) {
          oldNode.nodeValue = newNode.nodeValue;
        }
      }
      if (nodeName === "INPUT") updateInput(newNode, oldNode);
      else if (nodeName === "OPTION") updateOption(newNode, oldNode);
      else if (nodeName === "TEXTAREA") updateTextarea(newNode, oldNode);
      copyEvents(newNode, oldNode);
    }
    function copyAttrs(newNode, oldNode) {
      var oldAttrs = oldNode.attributes;
      var newAttrs = newNode.attributes;
      var attrNamespaceURI = null;
      var attrValue = null;
      var fromValue = null;
      var attrName = null;
      var attr = null;
      for (var i = newAttrs.length - 1; i >= 0; --i) {
        attr = newAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;
        if (attrNamespaceURI) {
          attrName = attr.localName || attrName;
          fromValue = oldNode.getAttributeNS(attrNamespaceURI, attrName);
          if (fromValue !== attrValue) {
            oldNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
          }
        } else {
          if (!oldNode.hasAttribute(attrName)) {
            oldNode.setAttribute(attrName, attrValue);
          } else {
            fromValue = oldNode.getAttribute(attrName);
            if (fromValue !== attrValue) {
              if (attrValue === "null" || attrValue === "undefined") {
                oldNode.removeAttribute(attrName);
              } else {
                oldNode.setAttribute(attrName, attrValue);
              }
            }
          }
        }
      }
      for (var j = oldAttrs.length - 1; j >= 0; --j) {
        attr = oldAttrs[j];
        if (attr.specified !== false) {
          attrName = attr.name;
          attrNamespaceURI = attr.namespaceURI;
          if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
              oldNode.removeAttributeNS(attrNamespaceURI, attrName);
            }
          } else {
            if (!newNode.hasAttributeNS(null, attrName)) {
              oldNode.removeAttribute(attrName);
            }
          }
        }
      }
    }
    function copyEvents(newNode, oldNode) {
      for (var i = 0; i < eventsLength; i++) {
        var ev = events[i];
        if (newNode[ev]) {
          oldNode[ev] = newNode[ev];
        } else if (oldNode[ev]) {
          oldNode[ev] = void 0;
        }
      }
    }
    function updateOption(newNode, oldNode) {
      updateAttribute(newNode, oldNode, "selected");
    }
    function updateInput(newNode, oldNode) {
      var newValue = newNode.value;
      var oldValue = oldNode.value;
      updateAttribute(newNode, oldNode, "checked");
      updateAttribute(newNode, oldNode, "disabled");
      if (newNode.indeterminate !== oldNode.indeterminate) {
        oldNode.indeterminate = newNode.indeterminate;
      }
      if (oldNode.type === "file") return;
      if (newValue !== oldValue) {
        oldNode.setAttribute("value", newValue);
        oldNode.value = newValue;
      }
      if (newValue === "null") {
        oldNode.value = "";
        oldNode.removeAttribute("value");
      }
      if (!newNode.hasAttributeNS(null, "value")) {
        oldNode.removeAttribute("value");
      } else if (oldNode.type === "range") {
        oldNode.value = newValue;
      }
    }
    function updateTextarea(newNode, oldNode) {
      var newValue = newNode.value;
      if (newValue !== oldNode.value) {
        oldNode.value = newValue;
      }
      if (oldNode.firstChild && oldNode.firstChild.nodeValue !== newValue) {
        if (newValue === "" && oldNode.firstChild.nodeValue === oldNode.placeholder) {
          return;
        }
        oldNode.firstChild.nodeValue = newValue;
      }
    }
    function updateAttribute(newNode, oldNode, name) {
      if (newNode[name] !== oldNode[name]) {
        oldNode[name] = newNode[name];
        if (newNode[name]) {
          oldNode.setAttribute(name, "");
        } else {
          oldNode.removeAttribute(name);
        }
      }
    }
  }
});

// node_modules/nanomorph/index.js
var require_nanomorph = __commonJS({
  "node_modules/nanomorph/index.js"(exports, module) {
    var assert = require_nanoassert();
    var morph = require_morph();
    var TEXT_NODE = 3;
    module.exports = nanomorph2;
    function nanomorph2(oldTree, newTree, options) {
      assert.equal(typeof oldTree, "object", "nanomorph: oldTree should be an object");
      assert.equal(typeof newTree, "object", "nanomorph: newTree should be an object");
      if (options && options.childrenOnly) {
        updateChildren(newTree, oldTree);
        return oldTree;
      }
      assert.notEqual(
        newTree.nodeType,
        11,
        "nanomorph: newTree should have one root node (which is not a DocumentFragment)"
      );
      return walk(newTree, oldTree);
    }
    function walk(newNode, oldNode) {
      if (!oldNode) {
        return newNode;
      } else if (!newNode) {
        return null;
      } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
        return oldNode;
      } else if (newNode.tagName !== oldNode.tagName || getComponentId(newNode) !== getComponentId(oldNode)) {
        return newNode;
      } else {
        morph(newNode, oldNode);
        updateChildren(newNode, oldNode);
        return oldNode;
      }
    }
    function getComponentId(node) {
      return node.dataset ? node.dataset.nanomorphComponentId : void 0;
    }
    function updateChildren(newNode, oldNode) {
      var oldChild, newChild, morphed, oldMatch;
      var offset = 0;
      for (var i = 0; ; i++) {
        oldChild = oldNode.childNodes[i];
        newChild = newNode.childNodes[i - offset];
        if (!oldChild && !newChild) {
          break;
        } else if (!newChild) {
          oldNode.removeChild(oldChild);
          i--;
        } else if (!oldChild) {
          oldNode.appendChild(newChild);
          offset++;
        } else if (same(newChild, oldChild)) {
          morphed = walk(newChild, oldChild);
          if (morphed !== oldChild) {
            oldNode.replaceChild(morphed, oldChild);
            offset++;
          }
        } else {
          oldMatch = null;
          for (var j = i; j < oldNode.childNodes.length; j++) {
            if (same(oldNode.childNodes[j], newChild)) {
              oldMatch = oldNode.childNodes[j];
              break;
            }
          }
          if (oldMatch) {
            morphed = walk(newChild, oldMatch);
            if (morphed !== oldMatch) offset++;
            oldNode.insertBefore(morphed, oldChild);
          } else if (!newChild.id && !oldChild.id) {
            morphed = walk(newChild, oldChild);
            if (morphed !== oldChild) {
              oldNode.replaceChild(morphed, oldChild);
              offset++;
            }
          } else {
            oldNode.insertBefore(newChild, oldChild);
            offset++;
          }
        }
      }
    }
    function same(a, b) {
      if (a.id) return a.id === b.id;
      if (a.isSameNode) return a.isSameNode(b);
      if (a.tagName !== b.tagName) return false;
      if (a.type === TEXT_NODE) return a.nodeValue === b.nodeValue;
      return false;
    }
  }
});

// node_modules/hyperscript-helpers/dist/index.js
var require_dist = __commonJS({
  "node_modules/hyperscript-helpers/dist/index.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var isValidString = function isValidString2(param) {
      return typeof param === "string" && param.length > 0;
    };
    var startsWith = function startsWith2(string, start) {
      return string[0] === start;
    };
    var isSelector = function isSelector2(param) {
      return isValidString(param) && (startsWith(param, ".") || startsWith(param, "#"));
    };
    var node = function node2(h3) {
      return function(tagName) {
        return function(first) {
          for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            rest[_key - 1] = arguments[_key];
          }
          if (isSelector(first)) {
            return h3.apply(void 0, [tagName + first].concat(rest));
          } else if (typeof first === "undefined") {
            return h3(tagName);
          } else {
            return h3.apply(void 0, [tagName, first].concat(rest));
          }
        };
      };
    };
    var TAG_NAMES = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen", "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "math", "menu", "menuitem", "meta", "meter", "multicol", "nav", "nextid", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rbc", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp"];
    exports["default"] = function(h3) {
      var createTag = node(h3);
      var exported = { TAG_NAMES, isSelector, createTag };
      TAG_NAMES.forEach(function(n) {
        exported[n] = createTag(n);
      });
      return exported;
    };
    module.exports = exports["default"];
  }
});

// node_modules/browser-split/index.js
var require_browser_split = __commonJS({
  "node_modules/browser-split/index.js"(exports, module) {
    module.exports = function split(undef) {
      var nativeSplit = String.prototype.split, compliantExecNpcg = /()??/.exec("")[1] === undef, self;
      self = function(str, separator, limit) {
        if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
          return nativeSplit.call(str, separator, limit);
        }
        var output = [], flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
        (separator.sticky ? "y" : ""), lastLastIndex = 0, separator = new RegExp(separator.source, flags + "g"), separator2, match, lastIndex, lastLength;
        str += "";
        if (!compliantExecNpcg) {
          separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
        }
        limit = limit === undef ? -1 >>> 0 : (
          // Math.pow(2, 32) - 1
          limit >>> 0
        );
        while (match = separator.exec(str)) {
          lastIndex = match.index + match[0].length;
          if (lastIndex > lastLastIndex) {
            output.push(str.slice(lastLastIndex, match.index));
            if (!compliantExecNpcg && match.length > 1) {
              match[0].replace(separator2, function() {
                for (var i = 1; i < arguments.length - 2; i++) {
                  if (arguments[i] === undef) {
                    match[i] = undef;
                  }
                }
              });
            }
            if (match.length > 1 && match.index < str.length) {
              Array.prototype.push.apply(output, match.slice(1));
            }
            lastLength = match[0].length;
            lastLastIndex = lastIndex;
            if (output.length >= limit) {
              break;
            }
          }
          if (separator.lastIndex === match.index) {
            separator.lastIndex++;
          }
        }
        if (lastLastIndex === str.length) {
          if (lastLength || !separator.test("")) {
            output.push("");
          }
        } else {
          output.push(str.slice(lastLastIndex));
        }
        return output.length > limit ? output.slice(0, limit) : output;
      };
      return self;
    }();
  }
});

// node_modules/indexof/index.js
var require_indexof = __commonJS({
  "node_modules/indexof/index.js"(exports, module) {
    var indexOf = [].indexOf;
    module.exports = function(arr, obj) {
      if (indexOf) return arr.indexOf(obj);
      for (var i = 0; i < arr.length; ++i) {
        if (arr[i] === obj) return i;
      }
      return -1;
    };
  }
});

// node_modules/class-list/index.js
var require_class_list = __commonJS({
  "node_modules/class-list/index.js"(exports, module) {
    var indexof = require_indexof();
    module.exports = ClassList;
    function ClassList(elem) {
      var cl = elem.classList;
      if (cl) {
        return cl;
      }
      var classList = {
        add,
        remove,
        contains,
        toggle,
        toString: $toString,
        length: 0,
        item
      };
      return classList;
      function add(token) {
        var list = getTokens();
        if (indexof(list, token) > -1) {
          return;
        }
        list.push(token);
        setTokens(list);
      }
      function remove(token) {
        var list = getTokens(), index = indexof(list, token);
        if (index === -1) {
          return;
        }
        list.splice(index, 1);
        setTokens(list);
      }
      function contains(token) {
        return indexof(getTokens(), token) > -1;
      }
      function toggle(token) {
        if (contains(token)) {
          remove(token);
          return false;
        } else {
          add(token);
          return true;
        }
      }
      function $toString() {
        return elem.className;
      }
      function item(index) {
        var tokens = getTokens();
        return tokens[index] || null;
      }
      function getTokens() {
        var className = elem.className;
        return filter(className.split(" "), isTruthy);
      }
      function setTokens(list) {
        var length = list.length;
        elem.className = list.join(" ");
        classList.length = length;
        for (var i = 0; i < list.length; i++) {
          classList[i] = list[i];
        }
        delete list[length];
      }
    }
    function filter(arr, fn) {
      var ret = [];
      for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i]);
      }
      return ret;
    }
    function isTruthy(value) {
      return !!value;
    }
  }
});

// (disabled):node_modules/html-element/index.js
var require_html_element = __commonJS({
  "(disabled):node_modules/html-element/index.js"() {
  }
});

// node_modules/hyperscript/index.js
var require_hyperscript = __commonJS({
  "node_modules/hyperscript/index.js"(exports, module) {
    var split = require_browser_split();
    var ClassList = require_class_list();
    var w = typeof window === "undefined" ? require_html_element() : window;
    var document2 = w.document;
    var Text = w.Text;
    function context() {
      var cleanupFuncs = [];
      function h4() {
        var args = [].slice.call(arguments), e = null;
        function item(l) {
          var r;
          function parseClass(string) {
            var m = split(string, /([\.#]?[^\s#.]+)/);
            if (/^\.|#/.test(m[1]))
              e = document2.createElement("div");
            forEach(m, function(v2) {
              var s2 = v2.substring(1, v2.length);
              if (!v2) return;
              if (!e)
                e = document2.createElement(v2);
              else if (v2[0] === ".")
                ClassList(e).add(s2);
              else if (v2[0] === "#")
                e.setAttribute("id", s2);
            });
          }
          if (l == null)
            ;
          else if ("string" === typeof l) {
            if (!e)
              parseClass(l);
            else
              e.appendChild(r = document2.createTextNode(l));
          } else if ("number" === typeof l || "boolean" === typeof l || l instanceof Date || l instanceof RegExp) {
            e.appendChild(r = document2.createTextNode(l.toString()));
          } else if (isArray(l))
            forEach(l, item);
          else if (isNode(l))
            e.appendChild(r = l);
          else if (l instanceof Text)
            e.appendChild(r = l);
          else if ("object" === typeof l) {
            for (var k in l) {
              if ("function" === typeof l[k]) {
                if (/^on\w+/.test(k)) {
                  (function(k2, l2) {
                    if (e.addEventListener) {
                      e.addEventListener(k2.substring(2), l2[k2], false);
                      cleanupFuncs.push(function() {
                        e.removeEventListener(k2.substring(2), l2[k2], false);
                      });
                    } else {
                      e.attachEvent(k2, l2[k2]);
                      cleanupFuncs.push(function() {
                        e.detachEvent(k2, l2[k2]);
                      });
                    }
                  })(k, l);
                } else {
                  e[k] = l[k]();
                  cleanupFuncs.push(l[k](function(v2) {
                    e[k] = v2;
                  }));
                }
              } else if (k === "style") {
                if ("string" === typeof l[k]) {
                  e.style.cssText = l[k];
                } else {
                  for (var s in l[k]) (function(s2, v2) {
                    if ("function" === typeof v2) {
                      e.style.setProperty(s2, v2());
                      cleanupFuncs.push(v2(function(val) {
                        e.style.setProperty(s2, val);
                      }));
                    } else
                      var match = l[k][s2].match(/(.*)\W+!important\W*$/);
                    if (match) {
                      e.style.setProperty(s2, match[1], "important");
                    } else {
                      e.style.setProperty(s2, l[k][s2]);
                    }
                  })(s, l[k][s]);
                }
              } else if (k === "attrs") {
                for (var v in l[k]) {
                  e.setAttribute(v, l[k][v]);
                }
              } else if (k.substr(0, 5) === "data-") {
                e.setAttribute(k, l[k]);
              } else {
                e[k] = l[k];
              }
            }
          } else if ("function" === typeof l) {
            var v = l();
            e.appendChild(r = isNode(v) ? v : document2.createTextNode(v));
            cleanupFuncs.push(l(function(v2) {
              if (isNode(v2) && r.parentElement)
                r.parentElement.replaceChild(v2, r), r = v2;
              else
                r.textContent = v2;
            }));
          }
          return r;
        }
        while (args.length)
          item(args.shift());
        return e;
      }
      h4.cleanup = function() {
        for (var i = 0; i < cleanupFuncs.length; i++) {
          cleanupFuncs[i]();
        }
        cleanupFuncs.length = 0;
      };
      return h4;
    }
    var h3 = module.exports = context();
    h3.context = context;
    function isNode(el) {
      return el && el.nodeName && el.nodeType;
    }
    function forEach(arr, fn) {
      if (arr.forEach) return arr.forEach(fn);
      for (var i = 0; i < arr.length; i++) fn(arr[i], i);
    }
    function isArray(arr) {
      return Object.prototype.toString.call(arr) == "[object Array]";
    }
  }
});

// ../../dist/adt/io.js
var IO = (run) => ({
  run,
  map: (f) => IO(() => f(run())),
  chain: (f) => IO(() => f(run()).run()),
  ap: (fb) => IO(() => fb.run()(run()))
});
IO.of = (a) => IO(() => a);
IO.map = (f) => (io) => io.map(f);
IO.chain = (f) => (io) => io.chain(f);
IO.ap = (fb) => (fa) => fa.ap(fb);
IO.run = (io) => io.run();
IO.sequence = (ios) => IO(() => ios.map((io) => io.run()));
IO.traverse = (f) => (arr) => IO(() => arr.map((a) => f(a).run()));
IO.delay = (ms, io) => IO(() => {
  const start = Date.now();
  while (Date.now() - start < ms)
    ;
  return io.run();
});
IO.tryCatch = (f, onError) => IO(() => {
  try {
    return f();
  } catch (e) {
    return onError(e);
  }
});

// ../../dist/core/render.js
var renderApp = (renderer2) => (rootIO2, program2) => rootIO2.map((root) => {
  let model;
  const queue = [];
  let queued = false;
  const runEffects = (fx) => fx?.forEach((e) => e.run());
  const step = (msg) => {
    const { model: next, effects } = program2.update(msg, model, dispatch);
    model = next;
    renderer2(root, program2.view(model, dispatch));
    runEffects(effects);
  };
  const dispatch = (msg) => {
    queue.push(msg);
    if (!queued) {
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const msgs = queue.splice(0, queue.length);
        for (const msg2 of msgs)
          step(msg2);
      });
    }
  };
  const start = () => {
    const { model: m0, effects } = program2.init.run();
    model = m0;
    renderer2(root, program2.view(model, dispatch));
    runEffects(effects);
  };
  return IO(() => {
    start();
    return { dispatch };
  });
}).chain((io) => io);

// ../../dist/adt/reader.js
var Reader = (run) => ({
  run,
  map: (f) => Reader((env) => f(run(env))),
  chain: (f) => Reader((env) => f(run(env)).run(env)),
  ap: (fb) => Reader((env) => fb.run(env)(run(env)))
});
Reader.of = (a) => Reader(() => a);
Reader.ask = () => Reader((env) => env);
Reader.asks = (f) => Reader(f);
Reader.map = (f) => (r) => r.map(f);
Reader.chain = (f) => (r) => r.chain(f);
Reader.ap = (fb) => (fa) => fa.ap(fb);
Reader.run = (env) => (r) => r.run(env);
Reader.local = (f) => (r) => Reader((env) => r.run(f(env)));
Reader.sequence = (readers) => Reader((env) => readers.map((r) => r.run(env)));
Reader.traverse = (f) => (arr) => Reader((env) => arr.map((a) => f(a).run(env)));

// ../../dist/core/dom.js
var askEnv = Reader((env) => env);
var askDocument = askEnv.map((e) => e.document);
var askWindow = askEnv.map((e) => e.window);
var askStorage = askEnv.map((e) => e.localStorage);
var askFetch = askEnv.map((e) => e.fetch);
var runDomIO = (rio, env) => rio.run(env).run();
var browserEnv = () => ({
  document,
  window,
  localStorage,
  fetch
});

// ../../dist/adt/id.js
var Id = (a) => ({
  run: () => a,
  map: (f) => Id(f(a)),
  chain: (f) => f(a),
  ap: (fb) => Id(fb.run()(a))
});
Id.of = (a) => Id(a);
Id.ap = (fb) => (fa) => fa.ap(fb);
Id.map = (f) => (id) => id.map(f);
Id.chain = (f) => (id) => id.chain(f);
Id.run = (id) => id.run();
Id.extract = (id) => id.run();

// ../../dist/adt/either.js
var Left = (l) => ({ _tag: "Left", left: l });
var Right = (r) => ({ _tag: "Right", right: r });
var map = (f, e) => e._tag === "Right" ? Right(f(e.right)) : e;
var ap = (ef, ea) => {
  if (ef._tag === "Left")
    return Left(ef.left);
  if (ea._tag === "Left")
    return Left(ea.left);
  return Right(ef.right(ea.right));
};
var chain = (f, e) => e._tag === "Right" ? f(e.right) : e;
var bimap = (onLeft, onRight, e) => e._tag === "Left" ? Left(onLeft(e.left)) : Right(onRight(e.right));
var mapLeft = (f, e) => e._tag === "Left" ? Left(f(e.left)) : e;
var fold = (onLeft, onRight, e) => e._tag === "Left" ? onLeft(e.left) : onRight(e.right);
var of = (a) => Right(a);
var getOrElse = (defaultValue, e) => e._tag === "Right" ? e.right : defaultValue;
var getOrElseW = (onLeft, e) => e._tag === "Right" ? e.right : onLeft(e.left);
var alt = (e1, e2) => e1._tag === "Right" ? e1 : e2;
var isLeft = (e) => e._tag === "Left";
var isRight = (e) => e._tag === "Right";
var fromNullable = (onNull) => (a) => a == null ? Left(onNull) : Right(a);
var tryCatch = (f) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};
var tryCatchK = (f, onError) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(onError(e));
  }
};
var swap = (e) => e._tag === "Left" ? Right(e.left) : Left(e.right);
var filterOrElse = (predicate, onFalse, e) => e._tag === "Right" && !predicate(e.right) ? Left(onFalse(e.right)) : e;
var traverse = (f, arr) => {
  const result = [];
  for (const a of arr) {
    const eb = f(a);
    if (eb._tag === "Left")
      return eb;
    result.push(eb.right);
  }
  return Right(result);
};
var sequence = (arr) => traverse((x) => x, arr);
var Either = {
  Left,
  Right,
  map,
  ap,
  chain,
  bimap,
  mapLeft,
  fold,
  of,
  getOrElse,
  getOrElseW,
  alt,
  isLeft,
  isRight,
  fromNullable,
  tryCatch,
  tryCatchK,
  swap,
  filterOrElse,
  traverse,
  sequence
};

// ../../dist/adt/writer.js
var Writer = (run) => ({
  run,
  map: (f) => Writer(() => {
    const [a, w] = run();
    return [f(a), w];
  }),
  chain: (f) => Writer(() => {
    const [a, w1] = run();
    const [b, w2] = f(a).run();
    const combined = Array.isArray(w1) ? [...w1, ...w2] : w2;
    return [b, combined];
  }),
  ap: (fb) => Writer(() => {
    const [fn, w1] = fb.run();
    const [a, w2] = run();
    const combined = Array.isArray(w1) ? [...w1, ...w2] : w2;
    return [fn(a), combined];
  })
});
Writer.of = (a, empty) => Writer(() => [a, empty]);
Writer.tell = (w) => Writer(() => [void 0, w]);
Writer.map = (f) => (w) => w.map(f);
Writer.chain = (f) => (w) => w.chain(f);
Writer.ap = (fb) => (fa) => fa.ap(fb);
Writer.run = (w) => w.run();
Writer.evalWriter = (w) => w.run()[0];
Writer.execWriter = (w) => w.run()[1];
Writer.listen = (w) => Writer(() => {
  const [a, log] = w.run();
  return [[a, log], log];
});
Writer.pass = (w) => Writer(() => {
  const [[a, f], log] = w.run();
  return [a, f(log)];
});
Writer.censor = (f) => (w) => Writer(() => {
  const [a, log] = w.run();
  return [a, f(log)];
});
Writer.updateValueAndLog = (w, message) => w.chain((a) => Writer(() => [a, [message]]));
Writer.sequence = (writers) => Writer(() => {
  const values = [];
  let combinedLog;
  writers.forEach((w, i) => {
    const [a, log] = w.run();
    values.push(a);
    if (i === 0) {
      combinedLog = log;
    } else if (Array.isArray(combinedLog)) {
      combinedLog = [...combinedLog, ...log];
    } else {
      combinedLog = log;
    }
  });
  return [values, combinedLog];
});
Writer.traverse = (f) => (arr) => Writer.sequence(arr.map(f));

// ../../dist/adt/state.js
var State = (run) => ({
  run,
  map: (f) => State((s) => {
    const [a, s1] = run(s);
    return [f(a), s1];
  }),
  chain: (f) => State((s) => {
    const [a, s1] = run(s);
    return f(a).run(s1);
  }),
  ap: (fb) => State((s) => {
    const [fn, s1] = fb.run(s);
    const [a, s2] = run(s1);
    return [fn(a), s2];
  })
});
State.of = (a) => State((s) => [a, s]);
State.get = () => State((s) => [s, s]);
State.put = (s) => State(() => [void 0, s]);
State.modify = (f) => State((s) => [void 0, f(s)]);
State.gets = (f) => State((s) => [f(s), s]);
State.map = (f) => (st) => st.map(f);
State.chain = (f) => (st) => st.chain(f);
State.ap = (fb) => (fa) => fa.ap(fb);
State.run = (s) => (st) => st.run(s);
State.evalState = (s) => (st) => st.run(s)[0];
State.execState = (s) => (st) => st.run(s)[1];
State.sequence = (states) => State((s) => {
  let currentState = s;
  const values = [];
  for (const st of states) {
    const [a, nextState] = st.run(currentState);
    values.push(a);
    currentState = nextState;
  }
  return [values, currentState];
});
State.traverse = (f) => (arr) => State.sequence(arr.map(f));

// ../../dist/adt/stream.js
var Stream = (subscribe) => ({
  subscribe,
  map: (f) => Stream((o) => subscribe({
    next: (a) => {
      try {
        o.next(f(a));
      } catch (e) {
        o.error?.(e);
      }
    },
    error: o.error,
    complete: o.complete
  })),
  chain: (f) => Stream((o) => {
    let innerUnsub = null;
    const outerUnsub = subscribe({
      next: (a) => {
        try {
          const inner = f(a);
          innerUnsub?.();
          innerUnsub = inner.subscribe(o);
        } catch (e) {
          o.error?.(e);
        }
      },
      error: o.error,
      complete: o.complete
    });
    return () => {
      innerUnsub?.();
      outerUnsub();
    };
  }),
  filter: (predicate) => Stream((o) => subscribe({
    next: (a) => {
      try {
        if (predicate(a))
          o.next(a);
      } catch (e) {
        o.error?.(e);
      }
    },
    error: o.error,
    complete: o.complete
  })),
  scan: (f, initial) => Stream((o) => {
    let acc = initial;
    return subscribe({
      next: (a) => {
        try {
          acc = f(acc, a);
          o.next(acc);
        } catch (e) {
          o.error?.(e);
        }
      },
      error: o.error,
      complete: o.complete
    });
  }),
  take: (n) => Stream((o) => {
    let count = 0;
    const unsub = subscribe({
      next: (a) => {
        if (count < n) {
          o.next(a);
          count++;
          if (count === n) {
            o.complete?.();
            unsub();
          }
        }
      },
      error: o.error,
      complete: o.complete
    });
    return unsub;
  }),
  skip: (n) => Stream((o) => {
    let count = 0;
    return subscribe({
      next: (a) => {
        count++;
        if (count > n)
          o.next(a);
      },
      error: o.error,
      complete: o.complete
    });
  })
});
Stream.of = (a) => Stream((o) => {
  o.next(a);
  o.complete?.();
  return () => {
  };
});
Stream.fromArray = (arr) => Stream((o) => {
  arr.forEach((a) => o.next(a));
  o.complete?.();
  return () => {
  };
});
Stream.empty = () => Stream((o) => {
  o.complete?.();
  return () => {
  };
});
Stream.never = () => Stream(() => () => {
});
Stream.fromPromise = (p2) => Stream((o) => {
  let cancelled = false;
  p2.then((a) => {
    if (!cancelled) {
      o.next(a);
      o.complete?.();
    }
  }).catch((e) => {
    if (!cancelled)
      o.error?.(e);
  });
  return () => {
    cancelled = true;
  };
});
Stream.interval = (ms) => Stream((o) => {
  let count = 0;
  const id = setInterval(() => o.next(count++), ms);
  return () => clearInterval(id);
});
Stream.periodic = (ms) => Stream((o) => {
  const id = setInterval(() => o.next(void 0), ms);
  return () => clearInterval(id);
});
Stream.fromEvent = (target, eventName) => Stream((o) => {
  const handler = (e) => o.next(e);
  target.addEventListener(eventName, handler);
  return () => target.removeEventListener(eventName, handler);
});
Stream.merge = (s1, s2) => Stream((o) => {
  const unsub1 = s1.subscribe(o);
  const unsub2 = s2.subscribe(o);
  return () => {
    unsub1();
    unsub2();
  };
});
Stream.concat = (s1, s2) => Stream((o) => {
  let unsub2 = null;
  const unsub1 = s1.subscribe({
    next: o.next,
    error: o.error,
    complete: () => {
      unsub2 = s2.subscribe(o);
    }
  });
  return () => {
    unsub1();
    unsub2?.();
  };
});
Stream.combineLatest = (sa, sb) => Stream((o) => {
  let latestA;
  let latestB;
  let hasA = false;
  let hasB = false;
  const emit = () => {
    if (hasA && hasB) {
      o.next([latestA, latestB]);
    }
  };
  const unsubA = sa.subscribe({
    next: (a) => {
      latestA = a;
      hasA = true;
      emit();
    },
    error: o.error
  });
  const unsubB = sb.subscribe({
    next: (b) => {
      latestB = b;
      hasB = true;
      emit();
    },
    error: o.error
  });
  return () => {
    unsubA();
    unsubB();
  };
});
Stream.zip = (sa, sb) => Stream((o) => {
  const queueA = [];
  const queueB = [];
  const tryEmit = () => {
    if (queueA.length > 0 && queueB.length > 0) {
      o.next([queueA.shift(), queueB.shift()]);
    }
  };
  const unsubA = sa.subscribe({
    next: (a) => {
      queueA.push(a);
      tryEmit();
    },
    error: o.error,
    complete: o.complete
  });
  const unsubB = sb.subscribe({
    next: (b) => {
      queueB.push(b);
      tryEmit();
    },
    error: o.error,
    complete: o.complete
  });
  return () => {
    unsubA();
    unsubB();
  };
});
Stream.debounce = (ms) => (s) => Stream((o) => {
  let timeoutId = null;
  const unsub = s.subscribe({
    next: (a) => {
      if (timeoutId)
        clearTimeout(timeoutId);
      timeoutId = setTimeout(() => o.next(a), ms);
    },
    error: o.error,
    complete: o.complete
  });
  return () => {
    if (timeoutId)
      clearTimeout(timeoutId);
    unsub();
  };
});
Stream.throttle = (ms) => (s) => Stream((o) => {
  let lastEmit = 0;
  return s.subscribe({
    next: (a) => {
      const now = Date.now();
      if (now - lastEmit >= ms) {
        o.next(a);
        lastEmit = now;
      }
    },
    error: o.error,
    complete: o.complete
  });
});
Stream.distinctUntilChanged = (equals) => (s) => Stream((o) => {
  let last;
  let hasLast = false;
  const eq = equals || ((a, b) => a === b);
  return s.subscribe({
    next: (a) => {
      if (!hasLast || !eq(last, a)) {
        o.next(a);
        last = a;
        hasLast = true;
      }
    },
    error: o.error,
    complete: o.complete
  });
});

// ../../dist/adt/task.js
var Task = (run) => ({
  run,
  map: (f) => Task(() => run().then((ea) => ea._tag === "Right" ? Right(f(ea.right)) : ea)),
  chain: (f) => Task(() => run().then((ea) => ea._tag === "Right" ? f(ea.right).run() : Promise.resolve(ea))),
  ap: (fb) => Task(() => fb.run().then((ef) => ef._tag === "Right" ? run().then((ea) => ea._tag === "Right" ? Right(ef.right(ea.right)) : ea) : Promise.resolve(ef))),
  mapError: (f) => Task(() => run().then((ea) => ea._tag === "Left" ? Left(f(ea.left)) : ea)),
  bimap: (onError, onSuccess) => Task(() => run().then((ea) => ea._tag === "Left" ? Left(onError(ea.left)) : Right(onSuccess(ea.right))))
});
Task.of = (a) => Task(() => Promise.resolve(Right(a)));
Task.reject = (e) => Task(() => Promise.resolve(Left(e)));
Task.tryCatch = (f) => Task(() => f().then(Right).catch(Left));
Task.tryCatchK = (f, onError) => Task(() => f().then(Right).catch((e) => Left(onError(e))));
Task.map = (f) => (t) => t.map(f);
Task.chain = (f) => (t) => t.chain(f);
Task.ap = (fb) => (fa) => fa.ap(fb);
Task.mapError = (f) => (t) => t.mapError(f);
Task.bimap = (onError, onSuccess) => (t) => t.bimap(onError, onSuccess);
Task.fold = (onError, onSuccess) => (t) => t.run().then((ea) => ea._tag === "Left" ? onError(ea.left) : onSuccess(ea.right));
Task.getOrElse = (defaultValue) => (t) => t.run().then((ea) => ea._tag === "Right" ? ea.right : defaultValue);
Task.delay = (ms) => (t) => Task(() => new Promise((resolve) => setTimeout(() => t.run().then(resolve), ms)));
Task.timeout = (ms, onTimeout) => (t) => Task(() => Promise.race([
  t.run(),
  new Promise((resolve) => setTimeout(() => resolve(Left(onTimeout)), ms))
]));
Task.sequence = (tasks) => Task(async () => {
  const results = [];
  for (const task of tasks) {
    const ea = await task.run();
    if (ea._tag === "Left")
      return ea;
    results.push(ea.right);
  }
  return Right(results);
});
Task.traverse = (f) => (arr) => Task.sequence(arr.map(f));
Task.all = (tasks) => Task(async () => {
  const results = await Promise.all(tasks.map((t) => t.run()));
  const values = [];
  for (const ea of results) {
    if (ea._tag === "Left")
      return ea;
    values.push(ea.right);
  }
  return Right(values);
});
Task.race = (tasks) => Task(() => Promise.race(tasks.map((t) => t.run())));
Task.fromEither = (e) => Task(() => Promise.resolve(e));
Task.toPromise = (t) => t.run().then((ea) => {
  if (ea._tag === "Left")
    throw ea.left;
  return ea.right;
});

// ../../dist/core/httpTask.js
var httpTask = (path, options) => Reader((env) => Task(async () => {
  try {
    const r = await env.fetch(`${env.baseUrl ?? ""}${path}`, options);
    if (!r.ok) {
      return Either.Left({
        status: r.status,
        message: r.statusText || "HTTP error"
      });
    }
    const data = await r.json();
    return Either.Right(data);
  } catch (e) {
    return Either.Left({
      message: e instanceof Error ? e.message : String(e)
    });
  }
}));

// src/shared/renderer.ts
var import_nanomorph = __toESM(require_nanomorph(), 1);
var import_hyperscript_helpers = __toESM(require_dist(), 1);
var hyperscript = __toESM(require_hyperscript(), 1);
var h = hyperscript.default || hyperscript;
var current = null;
var renderer = (root, vnode) => {
  if (!current) {
    root.appendChild(vnode);
    current = vnode;
  } else {
    current = (0, import_nanomorph.default)(current, vnode);
  }
};
var { div, h1, h2, p, button, section, input, ul, li, span } = (0, import_hyperscript_helpers.default)(h);

// src/model/init.ts
var init = IO(() => {
  const isBrowser = typeof window !== "undefined";
  const env = isBrowser ? { fetch: window.fetch.bind(window), baseUrl: "https://jsonplaceholder.typicode.com" } : { fetch: globalThis.fetch, baseUrl: "https://jsonplaceholder.typicode.com" };
  const empty = { data: [], loading: false, page: 1, limit: 10 };
  const model = {
    theme: "light",
    env,
    active: "posts",
    logs: Writer.of("", []),
    posts: empty,
    users: empty,
    comments: empty,
    albums: empty,
    photos: empty,
    todos: empty
  };
  return { model, effects: [] };
});

// src/model/update.ts
var update = (msg, m, dispatch) => {
  switch (msg.type) {
    case "SET_ACTIVE":
      return { model: { ...m, active: msg.key } };
    case "FETCH_RESOURCE": {
      const key = msg.key;
      const { limit } = m[key];
      const task = httpTask(`/${key}?_page=1&_limit=${limit}`).run(m.env);
      const io = IO(async () => {
        const res = await task.run();
        if (res._tag === "Right")
          dispatch({ type: "FETCH_SUCCESS", key, data: res.right, page: 1 });
        else
          dispatch({
            type: "FETCH_ERROR",
            key,
            error: "status" in res.left ? res.left : { status: 0, message: res.left.message }
          });
      });
      return {
        model: {
          ...m,
          [key]: { ...m[key], loading: true }
        },
        effects: [io]
      };
    }
    case "FETCH_PAGE": {
      const key = msg.key;
      const page = msg.page;
      const { limit } = m[key];
      const task = httpTask(`/${key}?_page=${page}&_limit=${limit}`).run(m.env);
      const io = IO(async () => {
        const res = await task.run();
        if (res._tag === "Right") {
          dispatch({ type: "FETCH_SUCCESS", key, data: res.right, page });
        } else {
          dispatch({
            type: "FETCH_ERROR",
            key,
            error: "status" in res.left ? res.left : { status: 0, message: res.left.message }
          });
        }
      });
      return {
        model: {
          ...m,
          [key]: { ...m[key], loading: true }
        },
        effects: [io]
      };
    }
    case "FETCH_SUCCESS": {
      const key = msg.key;
      const logs = m.logs.chain(() => Writer(() => ["", [`Fetched ${key} page ${msg.page || 1}`]]));
      return {
        model: {
          ...m,
          [key]: {
            ...m[key],
            data: [...msg.data],
            loading: false,
            page: msg.page || 1
          },
          logs
        }
      };
    }
    case "FETCH_ERROR": {
      const logs = m.logs.chain(
        () => Writer(() => ["", [`Error fetching ${msg.key}: ${msg.error}`]])
      );
      return {
        model: {
          ...m,
          [msg.key]: { ...m[msg.key], loading: false, error: msg.error },
          logs
        }
      };
    }
    case "TOGGLE_THEME": {
      const next = m.theme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      return { model: { ...m, theme: next } };
    }
    default:
      return { model: m };
  }
};

// src/shared/views/ResourcePanel.ts
var ResourceList = (key, res, dispatch) => {
  const { data, page, limit, loading, error } = res;
  const nextPage = page + 1;
  const prevPage = page - 1;
  const hasData = res.data.length || res.loading || res.error;
  return section({ className: "p-4 border rounded" }, [
    h1({ className: "text-lg font-bold mb-2 capitalize" }, key),
    button(
      {
        className: "bg-blue-600 text-white px-3 py-1 rounded mb-3",
        onclick: () => dispatch({ type: "FETCH_RESOURCE", key })
      },
      res.loading ? "Loading..." : "Fetch"
    ),
    hasData && div({ className: "flex items-center gap-3 mt-3" }, [
      button(
        {
          id: `${String(key)}-prev-${prevPage}`,
          className: "px-3 py-1 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed",
          disabled: res.page === 1 || res.loading,
          onclick: () => dispatch({ type: "FETCH_PAGE", key, page: res.page - 1 })
        },
        "Prev"
      ),
      span({ className: "text-sm" }, `Page ${res.page}`),
      button(
        {
          id: `${String(key)}-next-${nextPage}`,
          className: "px-3 py-1 bg-gray-200 rounded",
          onclick: () => dispatch({ type: "FETCH_PAGE", key, page: res.page + 1 })
        },
        "Next"
      )
    ]),
    res.error && p({ className: "text-red-600" }, `Error: ${JSON.stringify(res.error)}`),
    ul(
      { className: "text-sm space-y-1" },
      res.data.map((item) => li({ className: "border-b pb-1" }, JSON.stringify(item)))
    )
  ]);
};
var ResourcePanel = (m, dispatch) => div({ className: "grid grid-cols-2 gap-4" }, [
  ResourceList("posts", m.posts, dispatch),
  ResourceList("users", m.users, dispatch),
  ResourceList("comments", m.comments, dispatch),
  ResourceList("todos", m.todos, dispatch),
  ResourceList("albums", m.albums, dispatch),
  ResourceList("photos", m.photos, dispatch)
]);

// src/shared/views/Layout.ts
var Layout = (m, dispatch) => section({ className: "p-6 space-y-6" }, [
  div({ className: "flex justify-between items-center" }, [
    h1({ className: "text-3xl font-bold" }, "Effects-Lab Dashboard"),
    button(
      {
        className: "bg-gray-800 text-white px-4 py-2 rounded",
        onclick: () => dispatch({ type: "TOGGLE_THEME" })
      },
      `Theme: ${m.theme}`
    )
  ]),
  ResourcePanel(m, dispatch)
]);

// src/browser/program.ts
var program = {
  init,
  update,
  view: Layout
};

// src/shared/utils/globalIO.ts
var registerGlobalIO = (dispatch) => Reader(
  (env) => IO(() => {
    const resize = () => dispatch({
      type: "RESIZE",
      width: env.window.innerWidth,
      height: env.window.innerHeight
    });
    env.window.addEventListener("resize", resize);
    resize();
    return () => env.window.removeEventListener("resize", resize);
  })
);

// src/browser/main.ts
var hydrateLogs = (raw) => raw?.logs && typeof raw.logs.run === "function" ? raw.logs : Writer.of("", []);
var hydrateEnv = IO(() => ({
  fetch: window.fetch.bind(window),
  baseUrl: "https://jsonplaceholder.typicode.com",
  window,
  document,
  localStorage
}));
var hydrateModel = IO(() => {
  const raw = window.__INITIAL_MODEL__;
  const logs = hydrateLogs(raw);
  const env = hydrateEnv.run();
  return { ...raw, env, logs };
});
var rootIO = IO(() => document.getElementById("app"));
var app = renderApp(renderer)(rootIO, {
  ...program,
  init: {
    run: () => {
      const model = hydrateModel.run();
      return { model, effects: [] };
    }
  }
});
var resizeEffect = registerGlobalIO(app.run().dispatch);
runDomIO(resizeEffect, browserEnv());
export {
  app
};
/*! Bundled license information:

browser-split/index.js:
  (*!
   * Cross-Browser Split 1.1.1
   * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
   * Available under the MIT License
   * ECMAScript compliant, uniform cross-browser split method
   *)
*/
