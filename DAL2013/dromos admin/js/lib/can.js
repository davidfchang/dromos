/*!
* CanJS - 1.1.7
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Thu, 19 Sep 2013 16:54:57 GMT
* Licensed MIT
* Includes: can/construct/construct.js,can/observe/observe.js,can/observe/compute/compute.js,can/model/model.js,can/view/view.js,can/control/control.js,can/route/route.js,can/control/route/route.js,can/view/mustache/mustache.js,can/util/string/string.js
* Download from: http://bitbuilder.herokuapp.com/can.custom.js?configuration=zepto&plugins=can%2Fconstruct%2Fconstruct.js&plugins=can%2Fobserve%2Fobserve.js&plugins=can%2Fobserve%2Fcompute%2Fcompute.js&plugins=can%2Fmodel%2Fmodel.js&plugins=can%2Fview%2Fview.js&plugins=can%2Fcontrol%2Fcontrol.js&plugins=can%2Froute%2Froute.js&plugins=can%2Fcontrol%2Froute%2Froute.js&plugins=can%2Fview%2Fmustache%2Fmustache.js&plugins=can%2Futil%2Fstring%2Fstring.js
*/
(function (undefined) {
    // ## can/util/can.js
    var __m4 = (function () {
        var can = window.can || {};
        if (typeof GLOBALCAN === 'undefined' || GLOBALCAN !== false) {
            window.can = can;
        }

        can.isDeferred = function (obj) {
            var isFunction = this.isFunction;

            // Returns `true` if something looks like a deferred.
            return obj && isFunction(obj.then) && isFunction(obj.pipe);
        };

        var cid = 0;
        can.cid = function (object, name) {
            if (object._cid) {
                return object._cid;
            } else {
                return object._cid = (name || "") + (++cid);
            }
        };
        can.VERSION = '@EDGE';
        return can;
    })();

    // ## can/util/object/isplain/isplain.js
    var __m6 = (function (can) {
        var core_hasOwn = Object.prototype.hasOwnProperty, isWindow = function (obj) {
            return obj != null && obj == obj.window;
        }, isPlainObject = function (obj) {
            if (!obj || (typeof obj !== "object") || obj.nodeType || isWindow(obj)) {
                return false;
            }

            try  {
                if (obj.constructor && !core_hasOwn.call(obj, "constructor") && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            var key;
            for (key in obj) {
            }

            return key === undefined || core_hasOwn.call(obj, key);
        };

        can.isPlainObject = isPlainObject;
        return can;
    })(__m4);

    // ## can/util/event.js
    var __m7 = (function (can) {
        // event.js
        // ---------
        // _Basic event wrapper._
        can.addEvent = function (event, fn) {
            if (!this.__bindEvents) {
                this.__bindEvents = {};
            }
            var eventName = event.split(".")[0];

            if (!this.__bindEvents[eventName]) {
                this.__bindEvents[eventName] = [];
            }
            this.__bindEvents[eventName].push({
                handler: fn,
                name: event
            });
            return this;
        };
        can.removeEvent = function (event, fn) {
            if (!this.__bindEvents) {
                return;
            }
            var i = 0, events = this.__bindEvents[event.split(".")[0]], ev;
            while (i < events.length) {
                ev = events[i];
                if ((fn && ev.handler === fn) || (!fn && ev.name === event)) {
                    events.splice(i, 1);
                } else {
                    i++;
                }
            }
            return this;
        };
        can.dispatch = function (event) {
            if (!this.__bindEvents) {
                return;
            }

            var eventName = event.type.split(".")[0], handlers = (this.__bindEvents[eventName] || []).slice(0), self = this, args = [event].concat(event.data || []);

            can.each(handlers, function (ev) {
                event.data = args.slice(1);
                ev.handler.apply(self, args);
            });
        };

        return can;
    })(__m4);

    // ## can/util/fragment.js
    var __m8 = (function (can) {
        // fragment.js
        // ---------
        // _DOM Fragment support._
        var fragmentRE = /^\s*<(\w+)[^>]*>/, fragment = function (html, name) {
            if (name === undefined) {
                name = fragmentRE.test(html) && RegExp.$1;
            }

            if (html && can.isFunction(html.replace)) {
                // Fix "XHTML"-style tags in all browsers
                html = html.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, "<$1></$2>");
            }

            var container = document.createElement('div'), temp = document.createElement('div');

            if (name === "tbody" || name === "tfoot" || name === "thead") {
                temp.innerHTML = "<table>" + html + "</table>";
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild;
            } else if (name === "tr") {
                temp.innerHTML = "<table><tbody>" + html + "</tbody></table>";
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild;
            } else if (name === "td" || name === "th") {
                temp.innerHTML = "<table><tbody><tr>" + html + "</tr></tbody></table>";
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild.firstChild.firstChild;
            } else if (name === 'option') {
                temp.innerHTML = "<select>" + html + "</select>";
                container = temp.firstChild.nodeType === 3 ? temp.lastChild : temp.firstChild;
            } else {
                container.innerHTML = '' + html;
            }

            // IE8 barfs if you pass slice a `childNodes` object, so make a copy.
            var tmp = {}, children = container.childNodes;
            tmp.length = children.length;
            for (var i = 0; i < children.length; i++) {
                tmp[i] = children[i];
            }
            return [].slice.call(tmp);
        };

        can.buildFragment = function (html, nodes) {
            var parts = fragment(html), frag = document.createDocumentFragment();

            can.each(parts, function (part) {
                frag.appendChild(part);
            });
            return frag;
        };

        return can;
    })(__m4);

    // ## can/util/deferred.js
    var __m9 = (function (can) {
        // deferred.js
        // ---------
        // _Lightweight, jQuery style deferreds._
        // extend is usually provided by the wrapper but to avoid steal.then calls
        // we define a simple extend here as well
        var extend = function (target, src) {
            for (var key in src) {
                if (src.hasOwnProperty(key)) {
                    target[key] = src[key];
                }
            }
        }, Deferred = function (func) {
            if (!(this instanceof Deferred))
                return new Deferred();

            this._doneFuncs = [];
            this._failFuncs = [];
            this._resultArgs = null;
            this._status = "";

            // Check for option `function` -- call it with this as context and as first
            // parameter, as specified in jQuery API.
            func && func.call(this, this);
        };

        can.Deferred = Deferred;
        can.when = Deferred.when = function () {
            var args = can.makeArray(arguments);
            if (args.length < 2) {
                var obj = args[0];
                if (obj && (can.isFunction(obj.isResolved) && can.isFunction(obj.isRejected))) {
                    return obj;
                } else {
                    return Deferred().resolve(obj);
                }
            } else {
                var df = Deferred(), done = 0, rp = [];

                can.each(args, function (arg, j) {
                    arg.done(function () {
                        rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                        if (++done == args.length) {
                            df.resolve.apply(df, rp);
                        }
                    }).fail(function () {
                        df.reject((arguments.length === 1) ? arguments[0] : arguments);
                    });
                });

                return df;
            }
        };

        var resolveFunc = function (type, _status) {
            return function (context) {
                var args = this._resultArgs = (arguments.length > 1) ? arguments[1] : [];
                return this.exec(context, this[type], args, _status);
            };
        }, doneFunc = function (type, _status) {
            return function () {
                var self = this;

                // In Safari, the properties of the `arguments` object are not enumerable,
                // so we have to convert arguments to an `Array` that allows `can.each` to loop over them.
                can.each(Array.prototype.slice.call(arguments), function (v, i, args) {
                    if (!v)
                        return;
                    if (v.constructor === Array) {
                        args.callee.apply(self, v);
                    } else {
                        if (self._status === _status)
                            v.apply(self, self._resultArgs || []);

                        self[type].push(v);
                    }
                });
                return this;
            };
        };

        extend(Deferred.prototype, {
            pipe: function (done, fail) {
                var d = can.Deferred();
                this.done(function () {
                    d.resolve(done.apply(this, arguments));
                });

                this.fail(function () {
                    if (fail) {
                        d.reject(fail.apply(this, arguments));
                    } else {
                        d.reject.apply(d, arguments);
                    }
                });
                return d;
            },
            resolveWith: resolveFunc("_doneFuncs", "rs"),
            rejectWith: resolveFunc("_failFuncs", "rj"),
            done: doneFunc("_doneFuncs", "rs"),
            fail: doneFunc("_failFuncs", "rj"),
            always: function () {
                var args = can.makeArray(arguments);
                if (args.length && args[0])
                    this.done(args[0]).fail(args[0]);

                return this;
            },
            then: function () {
                var args = can.makeArray(arguments);

                if (args.length > 1 && args[1])
                    this.fail(args[1]);

                if (args.length && args[0])
                    this.done(args[0]);

                return this;
            },
            state: function () {
                switch (this._status) {
                    case 'rs':
                        return 'resolved';
                    case 'rj':
                        return 'rejected';
                    default:
                        return 'pending';
                }
            },
            isResolved: function () {
                return this._status === "rs";
            },
            isRejected: function () {
                return this._status === "rj";
            },
            reject: function () {
                return this.rejectWith(this, arguments);
            },
            resolve: function () {
                return this.resolveWith(this, arguments);
            },
            exec: function (context, dst, args, st) {
                if (this._status !== "")
                    return this;

                this._status = st;

                can.each(dst, function (d) {
                    d.apply(context, args);
                });

                return this;
            }
        });

        return can;
    })(__m4);

    // ## can/util/array/each.js
    var __m10 = (function (can) {
        can.each = function (elements, callback, context) {
            var i = 0, key;
            if (elements) {
                if (typeof elements.length === 'number' && elements.pop) {
                    if (elements.attr) {
                        elements.attr('length');
                    }
                    for (key = elements.length; i < key; i++) {
                        if (callback.call(context || elements[i], elements[i], i, elements) === false) {
                            break;
                        }
                    }
                } else if (elements.hasOwnProperty) {
                    for (key in elements) {
                        if (elements.hasOwnProperty(key)) {
                            if (callback.call(context || elements[key], elements[key], key, elements) === false) {
                                break;
                            }
                        }
                    }
                }
            }
            return elements;
        };

        return can;
    })(__m4);

    // ## can/util/zepto/zepto.js
    var __m3 = (function (can) {
        var $ = Zepto;

        // data.js
        // ---------
        // _jQuery-like data methods._
        var data = {}, dataAttr = $.fn.data, uuid = $.uuid = +new Date(), exp = $.expando = 'Zepto' + uuid;

        function getData(node, name) {
            var id = node[exp], store = id && data[id];
            return name === undefined ? store || setData(node) : (store && store[name]) || dataAttr.call($(node), name);
        }

        function setData(node, name, value) {
            var id = node[exp] || (node[exp] = ++uuid), store = data[id] || (data[id] = {});
            if (name !== undefined)
                store[name] = value;
            return store;
        }
        ;

        $.fn.data = function (name, value) {
            return value === undefined ? this.length == 0 ? undefined : getData(this[0], name) : this.each(function (idx) {
                setData(this, name, $.isFunction(value) ? value.call(this, idx, getData(this, name)) : value);
            });
        };
        $.cleanData = function (elems) {
            for (var i = 0, elem; (elem = elems[i]) !== undefined; i++) {
                can.trigger(elem, "destroyed", [], false);
                var id = elem[exp];
                delete data[id];
            }
        };

        // zepto.js
        // ---------
        // _Zepto node list._
        var oldEach = can.each;

        // Extend what you can out of Zepto.
        $.extend(can, Zepto);
        can.each = oldEach;

        var arrHas = function (obj, name) {
            return obj[0] && obj[0][name] || obj[name];
        };

        // Do what's similar for jQuery.
        can.trigger = function (obj, event, args, bubble) {
            if (obj.trigger) {
                obj.trigger(event, args);
            } else if (arrHas(obj, "dispatchEvent")) {
                if (bubble === false) {
                    $([obj]).triggerHandler(event, args);
                } else {
                    $([obj]).trigger(event, args);
                }
            } else {
                if (typeof event == "string") {
                    event = {
                        type: event
                    };
                }
                event.target = event.target || obj;
                event.data = args;
                can.dispatch.call(obj, event);
            }
        };

        can.$ = Zepto;

        can.bind = function (ev, cb) {
            if (this.bind) {
                this.bind(ev, cb);
            } else if (arrHas(this, "addEventListener")) {
                $([this]).bind(ev, cb);
            } else {
                can.addEvent.call(this, ev, cb);
            }
            return this;
        };
        can.unbind = function (ev, cb) {
            if (this.unbind) {
                this.unbind(ev, cb);
            } else if (arrHas(this, "addEventListener")) {
                $([this]).unbind(ev, cb);
            } else {
                can.removeEvent.call(this, ev, cb);
            }
            return this;
        };
        can.delegate = function (selector, ev, cb) {
            if (this.delegate) {
                this.delegate(selector, ev, cb);
            } else {
                $([this]).delegate(selector, ev, cb);
            }
        };
        can.undelegate = function (selector, ev, cb) {
            if (this.undelegate) {
                this.undelegate(selector, ev, cb);
            } else {
                $([this]).undelegate(selector, ev, cb);
            }
        };

        $.each(["append", "filter", "addClass", "remove", "data"], function (i, name) {
            can[name] = function (wrapped) {
                return wrapped[name].apply(wrapped, can.makeArray(arguments).slice(1));
            };
        });

        can.makeArray = function (arr) {
            var ret = [];
            can.each(arr, function (a, i) {
                ret[i] = a;
            });
            return ret;
        };

        can.proxy = function (f, ctx) {
            return function () {
                return f.apply(ctx, arguments);
            };
        };

        // Make ajax.
        var XHR = $.ajaxSettings.xhr;
        $.ajaxSettings.xhr = function () {
            var xhr = XHR();
            var open = xhr.open;
            xhr.open = function (type, url, async) {
                open.call(this, type, url, ASYNC === undefined ? true : ASYNC);
            };
            return xhr;
        };
        var ASYNC;
        var AJAX = $.ajax;
        var updateDeferred = function (xhr, d) {
            for (var prop in xhr) {
                if (typeof d[prop] == 'function') {
                    d[prop] = function () {
                        xhr[prop].apply(xhr, arguments);
                    };
                } else {
                    d[prop] = prop[xhr];
                }
            }
        };
        can.ajax = function (options) {
            var success = options.success, error = options.error;
            var d = can.Deferred();

            options.success = function (data) {
                updateDeferred(xhr, d);
                d.resolve.call(d, data);
                success && success.apply(this, arguments);
            };
            options.error = function () {
                updateDeferred(xhr, d);
                d.reject.apply(d, arguments);
                error && error.apply(this, arguments);
            };
            if (options.async === false) {
                ASYNC = false;
            }
            var xhr = AJAX(options);
            ASYNC = undefined;
            updateDeferred(xhr, d);
            return d;
        };

        // Make destroyed and empty work.
        $.fn.empty = function () {
            return this.each(function () {
                $.cleanData(this.getElementsByTagName('*'));
                this.innerHTML = '';
            });
        };

        $.fn.remove = function () {
            $.cleanData(this);
            this.each(function () {
                if (this.parentNode != null) {
                    // might be a text node
                    this.getElementsByTagName && $.cleanData(this.getElementsByTagName('*'));
                    this.parentNode.removeChild(this);
                }
            });
            return this;
        };

        can.trim = function (str) {
            return str.trim();
        };
        can.isEmptyObject = function (object) {
            var name;
            for (name in object) {
            }
            ;
            return name === undefined;
        };

        // Make extend handle `true` for deep.
        can.extend = function (first) {
            if (first === true) {
                var args = can.makeArray(arguments);
                args.shift();
                return $.extend.apply($, args);
            }
            return $.extend.apply($, arguments);
        };

        can.get = function (wrapped, index) {
            return wrapped[index];
        };

        return can;
    })(__m4, Zepto, __m6, __m7, __m8, __m9, __m10);

    // ## can/util/string/string.js
    var __m2 = (function (can) {
        // ##string.js
        // _Miscellaneous string utility functions._
        // Several of the methods in this plugin use code adapated from Prototype
        // Prototype JavaScript framework, version 1.6.0.1.
        // © 2005-2007 Sam Stephenson
        var strUndHash = /_|-/, strColons = /\=\=/, strWords = /([A-Z]+)([A-Z][a-z])/g, strLowUp = /([a-z\d])([A-Z])/g, strDash = /([a-z\d])([A-Z])/g, strReplacer = /\{([^\}]+)\}/g, strQuote = /"/g, strSingleQuote = /'/g, getNext = function (obj, prop, add) {
            var result = obj[prop];

            if (result === undefined && add === true) {
                result = obj[prop] = {};
            }
            return result;
        }, isContainer = function (current) {
            return (/^f|^o/).test(typeof current);
        };

        can.extend(can, {
            // Escapes strings for HTML.
            esc: function (content) {
                // Convert bad values into empty strings
                var isInvalid = content === null || content === undefined || (isNaN(content) && ("" + content === 'NaN'));
                return ("" + (isInvalid ? '' : content)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(strQuote, '&#34;').replace(strSingleQuote, "&#39;");
            },
            getObject: function (name, roots, add) {
                // The parts of the name we are looking up
                // `['App','Models','Recipe']`
                var parts = name ? name.split('.') : [], length = parts.length, current, r = 0, i, container, rootsLength;

                // Make sure roots is an `array`.
                roots = can.isArray(roots) ? roots : [roots || window];

                rootsLength = roots.length;

                if (!length) {
                    return roots[0];
                }

                for (r; r < rootsLength; r++) {
                    current = roots[r];
                    container = undefined;

                    for (i = 0; i < length && isContainer(current); i++) {
                        container = current;
                        current = getNext(container, parts[i]);
                    }

                    if (container !== undefined && current !== undefined) {
                        break;
                    }
                }

                if (add === false && current !== undefined) {
                    delete container[parts[i - 1]];
                }

                if (add === true && current === undefined) {
                    current = roots[0];

                    for (i = 0; i < length && isContainer(current); i++) {
                        current = getNext(current, parts[i], true);
                    }
                }

                return current;
            },
            // Capitalizes a string.
            capitalize: function (s, cache) {
                // Used to make newId.
                return s.charAt(0).toUpperCase() + s.slice(1);
            },
            // Underscores a string.
            underscore: function (s) {
                return s.replace(strColons, '/').replace(strWords, '$1_$2').replace(strLowUp, '$1_$2').replace(strDash, '_').toLowerCase();
            },
            // Micro-templating.
            sub: function (str, data, remove) {
                var obs = [];

                str = str || '';

                obs.push(str.replace(strReplacer, function (whole, inside) {
                    // Convert inside to type.
                    var ob = can.getObject(inside, data, remove === true ? false : undefined);

                    if (ob === undefined || ob === null) {
                        obs = null;
                        return "";
                    }

                    if (isContainer(ob) && obs) {
                        obs.push(ob);
                        return "";
                    }

                    return "" + ob;
                }));

                return obs === null ? obs : (obs.length <= 1 ? obs[0] : obs);
            },
            // These regex's are used throughout the rest of can, so let's make
            // them available.
            replacer: strReplacer,
            undHash: strUndHash
        });
        return can;
    })(__m3);

    // ## can/construct/construct.js
    var __m1 = (function (can) {
        // ## construct.js
        // `can.Construct`
        // _This is a modified version of
        // [John Resig's class](http://ejohn.org/blog/simple-javascript-inheritance/).
        // It provides class level inheritance and callbacks._
        // A private flag used to initialize a new class instance without
        // initializing it's bindings.
        var initializing = 0;

        can.Construct = function () {
            if (arguments.length) {
                return can.Construct.extend.apply(can.Construct, arguments);
            }
        };

        can.extend(can.Construct, {
            constructorExtends: true,
            newInstance: function () {
                // Get a raw instance object (`init` is not called).
                var inst = this.instance(), arg = arguments, args;

                if (inst.setup) {
                    args = inst.setup.apply(inst, arguments);
                }

                if (inst.init) {
                    inst.init.apply(inst, args || arguments);
                }

                return inst;
            },
            // Overwrites an object with methods. Used in the `super` plugin.
            // `newProps` - New properties to add.
            // `oldProps` - Where the old properties might be (used with `super`).
            // `addTo` - What we are adding to.
            _inherit: function (newProps, oldProps, addTo) {
                can.extend(addTo || newProps, newProps || {});
            },
            // used for overwriting a single property.
            // this should be used for patching other objects
            // the super plugin overwrites this
            _overwrite: function (what, oldProps, propName, val) {
                what[propName] = val;
            },
            // Set `defaults` as the merger of the parent `defaults` and this
            // object's `defaults`. If you overwrite this method, make sure to
            // include option merging logic.
            setup: function (base, fullName) {
                this.defaults = can.extend(true, {}, base.defaults, this.defaults);
            },
            // Create's a new `class` instance without initializing by setting the
            // `initializing` flag.
            instance: function () {
                // Prevents running `init`.
                initializing = 1;

                var inst = new this();

                // Allow running `init`.
                initializing = 0;

                return inst;
            },
            // Extends classes.
            extend: function (fullName, klass, proto) {
                if (typeof fullName != 'string') {
                    proto = klass;
                    klass = fullName;
                    fullName = null;
                }

                if (!proto) {
                    proto = klass;
                    klass = null;
                }
                proto = proto || {};

                var _super_class = this, _super = this.prototype, name, shortName, namespace, prototype;

                // Instantiate a base class (but only create the instance,
                // don't run the init constructor).
                prototype = this.instance();

                // Copy the properties over onto the new prototype.
                can.Construct._inherit(proto, _super, prototype);

                // The dummy class constructor.
                function Constructor() {
                    if (!initializing) {
                        return this.constructor !== Constructor && arguments.length && Constructor.constructorExtends ? arguments.callee.extend.apply(arguments.callee, arguments) : Constructor.newInstance.apply(Constructor, arguments);
                    }
                }

                for (name in _super_class) {
                    if (_super_class.hasOwnProperty(name)) {
                        Constructor[name] = _super_class[name];
                    }
                }

                // Copy new static properties on class.
                can.Construct._inherit(klass, _super_class, Constructor);

                if (fullName) {
                    var parts = fullName.split('.'), shortName = parts.pop(), current = can.getObject(parts.join('.'), window, true), namespace = current, _fullName = can.underscore(fullName.replace(/\./g, "_")), _shortName = can.underscore(shortName);

                    current[shortName] = Constructor;
                }

                // Set things that shouldn't be overwritten.
                can.extend(Constructor, {
                    constructor: Constructor,
                    prototype: prototype,
                    namespace: namespace,
                    _shortName: _shortName,
                    fullName: fullName,
                    _fullName: _fullName
                });

                if (shortName !== undefined) {
                    Constructor.shortName = shortName;
                }

                // Make sure our prototype looks nice.
                Constructor.prototype.constructor = Constructor;

                // Call the class `setup` and `init`
                var t = [_super_class].concat(can.makeArray(arguments)), args = Constructor.setup.apply(Constructor, t);

                if (Constructor.init) {
                    Constructor.init.apply(Constructor, args || t);
                }

                return Constructor;
            }
        });

        can.Construct.prototype.setup = function () {
        };

        can.Construct.prototype.init = function () {
        };

        return can.Construct;
    })(__m2);

    // ## can/util/bind/bind.js
    var __m12 = (function (can) {
        // ## Bind helpers
        can.bindAndSetup = function () {
            // Add the event to this object
            can.addEvent.apply(this, arguments);

            if (!this._init) {
                if (!this._bindings) {
                    this._bindings = 1;

                    // setup live-binding
                    this._bindsetup && this._bindsetup();
                } else {
                    this._bindings++;
                }
            }

            return this;
        };

        can.unbindAndTeardown = function (ev, handler) {
            // Remove the event handler
            can.removeEvent.apply(this, arguments);

            this._bindings--;

            if (!this._bindings) {
                this._bindteardown && this._bindteardown();
            }
            return this;
        };

        return can;
    })(__m3);

    // ## can/observe/observe.js
    var __m11 = (function (can, bind) {
        // ## observe.js
        // `can.Observe`
        // _Provides the observable pattern for JavaScript Objects._
        // Returns `true` if something is an object with properties of its own.
        var canMakeObserve = function (obj) {
            return obj && !can.isDeferred(obj) && (can.isArray(obj) || can.isPlainObject(obj) || (obj instanceof can.Observe));
        }, unhookup = function (items, namespace) {
            return can.each(items, function (item) {
                if (item && item.unbind) {
                    item.unbind("change" + namespace);
                }
            });
        }, hookupBubble = function (child, prop, parent, Ob, List) {
            Ob = Ob || Observe;
            List = List || Observe.List;

            if (child instanceof Observe) {
                // We have an `observe` already...
                // Make sure it is not listening to this already
                // It's only listening if it has bindings already.
                parent._bindings && unhookup([child], parent._cid);
            } else if (can.isArray(child)) {
                child = new List(child);
            } else {
                child = new Ob(child);
            }

            if (parent._bindings) {
                // Listen to all changes and `batchTrigger` upwards.
                bindToChildAndBubbleToParent(child, prop, parent);
            }

            return child;
        }, bindToChildAndBubbleToParent = function (child, prop, parent) {
            child.bind("change" + parent._cid, function () {
                // `batchTrigger` the type on this...
                var args = can.makeArray(arguments), ev = args.shift();
                args[0] = (prop === "*" ? [parent.indexOf(child), args[0]] : [prop, args[0]]).join(".");

                // track objects dispatched on this observe
                ev.triggeredNS = ev.triggeredNS || {};

                if (ev.triggeredNS[parent._cid]) {
                    return;
                }

                ev.triggeredNS[parent._cid] = true;

                // send change event with modified attr to parent
                can.trigger(parent, ev, args);
                // send modified attr event to parent
                //can.trigger(parent, args[0], args);
            });
        }, observeId = 0, serialize = function (observe, how, where) {
            // Go through each property.
            observe.each(function (val, name) {
                // If the value is an `object`, and has an `attrs` or `serialize` function.
                where[name] = canMakeObserve(val) && can.isFunction(val[how]) ? val[how]() : val;
            });
            return where;
        }, attrParts = function (attr, keepKey) {
            if (keepKey) {
                return [attr];
            }
            return can.isArray(attr) ? attr : ("" + attr).split(".");
        }, batchNum = 1, transactions = 0, batchEvents = [], stopCallbacks = [], makeBindSetup = function (wildcard) {
            return function () {
                var parent = this;
                this._each(function (child, prop) {
                    if (child && child.bind) {
                        bindToChildAndBubbleToParent(child, wildcard || prop, parent);
                    }
                });
            };
        };

        var Observe = can.Map = can.Observe = can.Construct({
            // keep so it can be overwritten
            bind: can.bindAndSetup,
            unbind: can.unbindAndTeardown,
            id: "id",
            canMakeObserve: canMakeObserve,
            // starts collecting events
            // takes a callback for after they are updated
            // how could you hook into after ejs
            startBatch: function (batchStopHandler) {
                transactions++;
                batchStopHandler && stopCallbacks.push(batchStopHandler);
            },
            stopBatch: function (force, callStart) {
                if (force) {
                    transactions = 0;
                } else {
                    transactions--;
                }

                if (transactions == 0) {
                    var items = batchEvents.slice(0), callbacks = stopCallbacks.slice(0);
                    batchEvents = [];
                    stopCallbacks = [];
                    batchNum++;
                    callStart && this.startBatch();
                    can.each(items, function (args) {
                        can.trigger.apply(can, args);
                    });
                    can.each(callbacks, function (cb) {
                        cb();
                    });
                }
            },
            triggerBatch: function (item, event, args) {
                if (!item._init) {
                    if (transactions == 0) {
                        return can.trigger(item, event, args);
                    } else {
                        event = typeof event === "string" ? {
                            type: event
                        } : event;
                        event.batchNum = batchNum;
                        batchEvents.push([
                            item,
                            event,
                            args
                        ]);
                    }
                }
            },
            keys: function (observe) {
                var keys = [];
                Observe.__reading && Observe.__reading(observe, '__keys');
                for (var keyName in observe._data) {
                    keys.push(keyName);
                }
                return keys;
            }
        }, {
            setup: function (obj) {
                // `_data` is where we keep the properties.
                this._data = {};

                // The namespace this `object` uses to listen to events.
                can.cid(this, ".observe");

                // Sets all `attrs`.
                this._init = 1;
                this.attr(obj);
                this.bind('change' + this._cid, can.proxy(this._changes, this));
                delete this._init;
            },
            _bindsetup: makeBindSetup(),
            _bindteardown: function () {
                var cid = this._cid;
                this._each(function (child) {
                    unhookup([child], cid);
                });
            },
            _changes: function (ev, attr, how, newVal, oldVal) {
                Observe.triggerBatch(this, {
                    type: attr,
                    batchNum: ev.batchNum
                }, [newVal, oldVal]);
            },
            _triggerChange: function (attr, how, newVal, oldVal) {
                Observe.triggerBatch(this, "change", can.makeArray(arguments));
            },
            // no live binding iterator
            _each: function (callback) {
                var data = this.__get();
                for (var prop in data) {
                    if (data.hasOwnProperty(prop)) {
                        callback(data[prop], prop);
                    }
                }
            },
            attr: function (attr, val) {
                // This is super obfuscated for space -- basically, we're checking
                // if the type of the attribute is not a `number` or a `string`.
                var type = typeof attr;
                if (type !== "string" && type !== "number") {
                    return this._attrs(attr, val);
                } else if (arguments.length === 1) {
                    // Let people know we are reading.
                    Observe.__reading && Observe.__reading(this, attr);
                    return this._get(attr);
                } else {
                    // Otherwise we are setting.
                    this._set(attr, val);
                    return this;
                }
            },
            each: function () {
                Observe.__reading && Observe.__reading(this, '__keys');
                return can.each.apply(undefined, [this.__get()].concat(can.makeArray(arguments)));
            },
            removeAttr: function (attr) {
                // Info if this is List or not
                var isList = this instanceof can.Observe.List, parts = attrParts(attr), prop = parts.shift(), current = isList ? this[prop] : this._data[prop];

                if (parts.length) {
                    return current.removeAttr(parts);
                } else {
                    if (isList) {
                        this.splice(prop, 1);
                    } else if (prop in this._data) {
                        // Otherwise, `delete`.
                        delete this._data[prop];

                        if (!(prop in this.constructor.prototype)) {
                            delete this[prop];
                        }

                        // Let others know the number of keys have changed
                        Observe.triggerBatch(this, "__keys");
                        this._triggerChange(prop, "remove", undefined, current);
                    }
                    return current;
                }
            },
            // Reads a property from the `object`.
            _get: function (attr) {
                var value = typeof attr === 'string' && !!~attr.indexOf('.') && this.__get(attr);
                if (value) {
                    return value;
                }

                // break up the attr (`"foo.bar"`) into `["foo","bar"]`
                var parts = attrParts(attr), current = this.__get(parts.shift());

                // if there are other attributes to read
                return parts.length ? current ? current._get(parts) : undefined : current;
            },
            // Reads a property directly if an `attr` is provided, otherwise
            // returns the "real" data object itself.
            __get: function (attr) {
                return attr ? this._data[attr] : this._data;
            },
            // Sets `attr` prop as value on this object where.
            // `attr` - Is a string of properties or an array  of property values.
            // `value` - The raw value to set.
            _set: function (attr, value, keepKey) {
                // Convert `attr` to attr parts (if it isn't already).
                var parts = attrParts(attr, keepKey), prop = parts.shift(), current = this.__get(prop);

                if (canMakeObserve(current) && parts.length) {
                    // That `object` should set it (this might need to call attr).
                    current._set(parts, value);
                } else if (!parts.length) {
                    if (this.__convert) {
                        value = this.__convert(prop, value);
                    }
                    this.__set(prop, value, current);
                } else {
                    throw "can.Observe: Object does not exist";
                }
            },
            __set: function (prop, value, current) {
                if (value !== current) {
                    // Check if we are adding this for the first time --
                    // if we are, we need to create an `add` event.
                    var changeType = this.__get().hasOwnProperty(prop) ? "set" : "add";

                    // Set the value on data.
                    this.___set(prop, canMakeObserve(value) ? hookupBubble(value, prop, this) : value);

                    if (changeType == "add") {
                        // If there is no current value, let others know that
                        // the the number of keys have changed
                        Observe.triggerBatch(this, "__keys", undefined);
                    }

                    // `batchTrigger` the change event.
                    this._triggerChange(prop, changeType, value, current);

                    //Observe.triggerBatch(this, prop, [value, current]);
                    // If we can stop listening to our old value, do it.
                    current && unhookup([current], this._cid);
                }
            },
            // Directly sets a property on this `object`.
            ___set: function (prop, val) {
                this._data[prop] = val;

                if (!(prop in this.constructor.prototype)) {
                    this[prop] = val;
                }
            },
            bind: can.bindAndSetup,
            unbind: can.unbindAndTeardown,
            serialize: function () {
                return serialize(this, 'serialize', {});
            },
            _attrs: function (props, remove) {
                if (props === undefined) {
                    return serialize(this, 'attr', {});
                }

                props = can.extend({}, props);
                var prop, self = this, newVal;
                Observe.startBatch();
                this.each(function (curVal, prop) {
                    newVal = props[prop];

                    if (newVal === undefined) {
                        remove && self.removeAttr(prop);
                        return;
                    }

                    if (self.__convert) {
                        newVal = self.__convert(prop, newVal);
                    }

                    if (newVal instanceof can.Observe) {
                        self.__set(prop, newVal, curVal);
                        // if its an object, let attr merge
                    } else if (canMakeObserve(curVal) && canMakeObserve(newVal) && curVal.attr) {
                        curVal.attr(newVal, remove);
                        // otherwise just set
                    } else if (curVal != newVal) {
                        self.__set(prop, newVal, curVal);
                    }

                    delete props[prop];
                });

                for (var prop in props) {
                    newVal = props[prop];
                    this._set(prop, newVal, true);
                }
                Observe.stopBatch();
                return this;
            },
            compute: function (prop) {
                return can.compute(this, prop);
            }
        });

        // Helpers for `observable` lists.
        var splice = [].splice, list = Observe({
            setup: function (instances, options) {
                this.length = 0;
                can.cid(this, ".observe");
                this._init = 1;
                if (can.isDeferred(instances)) {
                    this.replace(instances);
                } else {
                    this.push.apply(this, can.makeArray(instances || []));
                }

                // this change needs to be ignored
                this.bind('change' + this._cid, can.proxy(this._changes, this));
                can.extend(this, options);
                delete this._init;
            },
            _triggerChange: function (attr, how, newVal, oldVal) {
                Observe.prototype._triggerChange.apply(this, arguments);

                if (!~attr.indexOf('.')) {
                    if (how === 'add') {
                        Observe.triggerBatch(this, how, [newVal, +attr]);
                        Observe.triggerBatch(this, 'length', [this.length]);
                    } else if (how === 'remove') {
                        Observe.triggerBatch(this, how, [oldVal, +attr]);
                        Observe.triggerBatch(this, 'length', [this.length]);
                    } else {
                        Observe.triggerBatch(this, how, [newVal, +attr]);
                    }
                }
            },
            __get: function (attr) {
                return attr ? this[attr] : this;
            },
            ___set: function (attr, val) {
                this[attr] = val;
                if (+attr >= this.length) {
                    this.length = (+attr + 1);
                }
            },
            _each: function (callback) {
                var data = this.__get();
                for (var i = 0; i < data.length; i++) {
                    callback(data[i], i);
                }
            },
            _bindsetup: makeBindSetup("*"),
            // Returns the serialized form of this list.
            serialize: function () {
                return serialize(this, 'serialize', []);
            },
            splice: function (index, howMany) {
                var args = can.makeArray(arguments), i;

                for (i = 2; i < args.length; i++) {
                    var val = args[i];
                    if (canMakeObserve(val)) {
                        args[i] = hookupBubble(val, "*", this, this.constructor.Observe, this.constructor);
                    }
                }
                if (howMany === undefined) {
                    howMany = args[1] = this.length - index;
                }
                var removed = splice.apply(this, args);
                can.Observe.startBatch();
                if (howMany > 0) {
                    this._triggerChange("" + index, "remove", undefined, removed);
                    unhookup(removed, this._cid);
                }
                if (args.length > 2) {
                    this._triggerChange("" + index, "add", args.slice(2), removed);
                }
                can.Observe.stopBatch();
                return removed;
            },
            _attrs: function (items, remove) {
                if (items === undefined) {
                    return serialize(this, 'attr', []);
                }

                // Create a copy.
                items = can.makeArray(items);

                Observe.startBatch();
                this._updateAttrs(items, remove);
                Observe.stopBatch();
            },
            _updateAttrs: function (items, remove) {
                var len = Math.min(items.length, this.length);

                for (var prop = 0; prop < len; prop++) {
                    var curVal = this[prop], newVal = items[prop];

                    if (canMakeObserve(curVal) && canMakeObserve(newVal)) {
                        curVal.attr(newVal, remove);
                    } else if (curVal != newVal) {
                        this._set(prop, newVal);
                    } else {
                    }
                }
                if (items.length > this.length) {
                    // Add in the remaining props.
                    this.push.apply(this, items.slice(this.length));
                } else if (items.length < this.length && remove) {
                    this.splice(items.length);
                }
            }
        }), getArgs = function (args) {
            return args[0] && can.isArray(args[0]) ? args[0] : can.makeArray(args);
        };

        // Create `push`, `pop`, `shift`, and `unshift`
        can.each({
            push: "length",
            unshift: 0
        }, // Adds a method
        // `name` - The method name.
        // `where` - Where items in the `array` should be added.
        function (where, name) {
            var orig = [][name];
            list.prototype[name] = function () {
                // Get the items being added.
                var args = [], len = where ? this.length : 0, i = arguments.length, res, val, constructor = this.constructor;

                while (i--) {
                    val = arguments[i];
                    args[i] = canMakeObserve(val) ? hookupBubble(val, "*", this, this.constructor.Observe, this.constructor) : val;
                }

                // Call the original method.
                res = orig.apply(this, args);

                if (!this.comparator || args.length) {
                    this._triggerChange("" + len, "add", args, undefined);
                }

                return res;
            };
        });

        can.each({
            pop: "length",
            shift: 0
        }, // Creates a `remove` type method
        function (where, name) {
            list.prototype[name] = function () {
                var args = getArgs(arguments), len = where && this.length ? this.length - 1 : 0;

                var res = [][name].apply(this, args);

                // Create a change where the args are
                // `len` - Where these items were removed.
                // `remove` - Items removed.
                // `undefined` - The new values (there are none).
                // `res` - The old, removed values (should these be unbound).
                this._triggerChange("" + len, "remove", undefined, [res]);

                if (res && res.unbind) {
                    res.unbind("change" + this._cid);
                }
                return res;
            };
        });

        can.extend(list.prototype, {
            indexOf: function (item) {
                this.attr('length');
                return can.inArray(item, this);
            },
            join: [].join,
            reverse: [].reverse,
            slice: function () {
                var temp = Array.prototype.slice.apply(this, arguments);
                return new this.constructor(temp);
            },
            concat: function () {
                var args = [];
                can.each(can.makeArray(arguments), function (arg, i) {
                    args[i] = arg instanceof can.Observe.List ? arg.serialize() : arg;
                });
                return new this.constructor(Array.prototype.concat.apply(this.serialize(), args));
            },
            forEach: function (cb, thisarg) {
                can.each(this, cb, thisarg || this);
            },
            replace: function (newList) {
                if (can.isDeferred(newList)) {
                    newList.then(can.proxy(this.replace, this));
                } else {
                    this.splice.apply(this, [0, this.length].concat(can.makeArray(newList || [])));
                }

                return this;
            }
        });

        can.List = Observe.List = list;
        Observe.setup = function () {
            can.Construct.setup.apply(this, arguments);

            // I would prefer not to do it this way. It should
            // be using the attributes plugin to do this type of conversion.
            this.List = Observe.List({
                Observe: this
            }, {});
        };
        return Observe;
    })(__m3, __m12, __m1);

    // ## can/observe/compute/compute.js
    var __m13 = (function (can, bind) {
        // returns the
        // - observes and attr methods are called by func
        // - the value returned by func
        // ex: `{value: 100, observed: [{obs: o, attr: "completed"}]}`
        var getValueAndObserved = function (func, self) {
            var oldReading;
            if (can.Observe) {
                // Set a callback on can.Observe to know
                // when an attr is read.
                // Keep a reference to the old reader
                // if there is one.  This is used
                // for nested live binding.
                oldReading = can.Observe.__reading;
                can.Observe.__reading = function (obj, attr) {
                    // Add the observe and attr that was read
                    // to `observed`
                    observed.push({
                        obj: obj,
                        attr: attr + ""
                    });
                };
            }

            var observed = [], value = func.call(self);

            if (can.Observe) {
                can.Observe.__reading = oldReading;
            }
            return {
                value: value,
                observed: observed
            };
        }, computeBinder = function (getterSetter, context, callback, computeState) {
            // track what we are observing
            var observing = {}, matched = true, data = {
                // we will maintain the value while live-binding is taking place
                value: undefined,
                // a teardown method that stops listening
                teardown: function () {
                    for (var name in observing) {
                        var ob = observing[name];
                        ob.observe.obj.unbind(ob.observe.attr, onchanged);
                        delete observing[name];
                    }
                }
            }, batchNum;

            // when a property value is changed
            var onchanged = function (ev) {
                if (computeState && !computeState.bound) {
                    return;
                }
                if (ev.batchNum === undefined || ev.batchNum !== batchNum) {
                    // store the old value
                    var oldValue = data.value, newvalue = getValueAndBind();

                    // update the value reference (in case someone reads)
                    data.value = newvalue;

                    if (newvalue !== oldValue) {
                        callback(newvalue, oldValue);
                    }
                    batchNum = batchNum = ev.batchNum;
                }
            };

            // gets the value returned by `getterSetter` and also binds to any attributes
            // read by the call
            var getValueAndBind = function () {
                var info = getValueAndObserved(getterSetter, context), newObserveSet = info.observed;

                var value = info.value;
                matched = !matched;

                // go through every attribute read by this observe
                can.each(newObserveSet, function (ob) {
                    if (observing[ob.obj._cid + "|" + ob.attr]) {
                        // mark at as observed
                        observing[ob.obj._cid + "|" + ob.attr].matched = matched;
                    } else {
                        // otherwise, set the observe/attribute on oldObserved, marking it as being observed
                        observing[ob.obj._cid + "|" + ob.attr] = {
                            matched: matched,
                            observe: ob
                        };
                        ob.obj.bind(ob.attr, onchanged);
                    }
                });

                for (var name in observing) {
                    var ob = observing[name];
                    if (ob.matched !== matched) {
                        ob.observe.obj.unbind(ob.observe.attr, onchanged);
                        delete observing[name];
                    }
                }
                return value;
            };

            // set the initial value
            data.value = getValueAndBind();

            data.isListening = !can.isEmptyObject(observing);
            return data;
        };

        // if no one is listening ... we can not calculate every time
        can.compute = function (getterSetter, context, eventName) {
            if (getterSetter && getterSetter.isComputed) {
                return getterSetter;
            }

            // stores the result of computeBinder
            var computedData, bindings = 0, computed, computeState = {
                bound: false,
                // true if this compute is calculated from other computes and observes
                hasDependencies: false
            }, on = function () {
            }, off = function () {
            }, value, get = function () {
                return value;
            }, set = function (newVal) {
                value = newVal;
            }, canReadForChangeEvent = true;

            computed = function (newVal) {
                if (arguments.length) {
                    // save a reference to the old value
                    var old = value;

                    // setter may return a value if
                    // setter is for a value maintained exclusively by this compute
                    var setVal = set.call(context, newVal, old);

                    if (computed.hasDependencies) {
                        return get.call(context);
                    }

                    if (setVal === undefined) {
                        // it's possible, like with the DOM, setting does not
                        // fire a change event, so we must read
                        value = get.call(context);
                    } else {
                        value = setVal;
                    }

                    if (old !== value) {
                        can.Observe.triggerBatch(computed, "change", [value, old]);
                    }
                    return value;
                } else {
                    if (can.Observe && can.Observe.__reading && canReadForChangeEvent) {
                        can.Observe.__reading(computed, 'change');
                    }

                    if (computeState.bound) {
                        return value;
                    } else {
                        return get.call(context);
                    }
                }
            };
            if (typeof getterSetter === "function") {
                set = getterSetter;
                get = getterSetter;
                canReadForChangeEvent = eventName === false ? false : true;
                computed.hasDependencies = false;
                on = function (update) {
                    computedData = computeBinder(getterSetter, context || this, update, computeState);
                    computed.hasDependencies = computedData.isListening;
                    value = computedData.value;
                };
                off = function () {
                    computedData && computedData.teardown();
                };
            } else if (context) {
                if (typeof context == "string") {
                    // `can.compute(obj, "propertyName", [eventName])`
                    var propertyName = context, isObserve = getterSetter instanceof can.Observe;
                    if (isObserve) {
                        computed.hasDependencies = true;
                    }
                    get = function () {
                        if (isObserve) {
                            return getterSetter.attr(propertyName);
                        } else {
                            return getterSetter[propertyName];
                        }
                    };
                    set = function (newValue) {
                        if (isObserve) {
                            getterSetter.attr(propertyName, newValue);
                        } else {
                            getterSetter[propertyName] = newValue;
                        }
                    };
                    var handler;
                    on = function (update) {
                        handler = function () {
                            update(get(), value);
                        };
                        can.bind.call(getterSetter, eventName || propertyName, handler);

                        // use getValueAndObserved because
                        // we should not be indicating that some parent
                        // reads this property if it happens to be binding on it
                        value = getValueAndObserved(get).value;
                    };
                    off = function () {
                        can.unbind.call(getterSetter, eventName || propertyName, handler);
                    };
                } else {
                    if (typeof context === "function") {
                        value = getterSetter;
                        set = context;
                    } else {
                        // `can.compute(initialValue,{get:, set:, on:, off:})`
                        value = getterSetter;
                        var options = context;
                        get = options.get || get;
                        set = options.set || set;
                        on = options.on || on;
                        off = options.off || off;
                    }
                }
            } else {
                // `can.compute(5)`
                value = getterSetter;
            }

            computed.isComputed = true;

            can.cid(computed, "compute");

            var updater = function (newValue, oldValue) {
                value = newValue;

                // might need a way to look up new and oldVal
                can.Observe.triggerBatch(computed, "change", [newValue, oldValue]);
            };

            return can.extend(computed, {
                _bindsetup: function () {
                    computeState.bound = true;

                    // setup live-binding
                    on.call(this, updater);
                },
                _bindteardown: function () {
                    off.call(this, updater);
                    computeState.bound = false;
                },
                bind: can.bindAndSetup,
                unbind: can.unbindAndTeardown
            });
        };
        can.compute.binder = computeBinder;
        return can.compute;
    })(__m3, __m12);

    // ## can/model/model.js
    var __m14 = (function (can) {
        // ## model.js
        // `can.Model`
        // _A `can.Observe` that connects to a RESTful interface._
        // Generic deferred piping function
        var pipe = function (def, model, func) {
            var d = new can.Deferred();
            def.then(function () {
                var args = can.makeArray(arguments);
                try  {
                    args[0] = model[func](args[0]);
                    d.resolveWith(d, args);
                } catch (e) {
                    d.rejectWith(d, [e].concat(args));
                }
            }, function () {
                d.rejectWith(this, arguments);
            });

            if (typeof def.abort === 'function') {
                d.abort = function () {
                    return def.abort();
                };
            }

            return d;
        }, modelNum = 0, ignoreHookup = /change.observe\d+/, getId = function (inst) {
            // Instead of using attr, use __get for performance.
            // Need to set reading
            can.Observe.__reading && can.Observe.__reading(inst, inst.constructor.id);
            return inst.__get(inst.constructor.id);
        }, ajax = function (ajaxOb, data, type, dataType, success, error) {
            var params = {};

            if (typeof ajaxOb == "string") {
                // If there's a space, it's probably the type.
                var parts = ajaxOb.split(/\s+/);
                params.url = parts.pop();
                if (parts.length) {
                    params.type = parts.pop();
                }
            } else {
                can.extend(params, ajaxOb);
            }

            // If we are a non-array object, copy to a new attrs.
            params.data = typeof data == "object" && !can.isArray(data) ? can.extend(params.data || {}, data) : data;

            // Get the url with any templated values filled out.
            params.url = can.sub(params.url, params.data, true);

            return can.ajax(can.extend({
                type: type || "post",
                dataType: dataType || "json",
                success: success,
                error: error
            }, params));
        }, makeRequest = function (self, type, success, error, method) {
            var args;

            if (can.isArray(self)) {
                args = self[1];
                self = self[0];
            } else {
                args = self.serialize();
            }
            args = [args];
            var deferred, model = self.constructor, jqXHR;

            if (type == 'destroy') {
                args.shift();
            }

            if (type !== 'create') {
                args.unshift(getId(self));
            }

            jqXHR = model[type].apply(model, args);

            deferred = jqXHR.pipe(function (data) {
                self[method || type + "d"](data, jqXHR);
                return self;
            });

            if (jqXHR.abort) {
                deferred.abort = function () {
                    jqXHR.abort();
                };
            }

            deferred.then(success, error);
            return deferred;
        }, ajaxMethods = {
            create: {
                url: "_shortName",
                type: "post"
            },
            update: {
                data: function (id, attrs) {
                    attrs = attrs || {};
                    var identity = this.id;
                    if (attrs[identity] && attrs[identity] !== id) {
                        attrs["new" + can.capitalize(id)] = attrs[identity];
                        delete attrs[identity];
                    }
                    attrs[identity] = id;
                    return attrs;
                },
                type: "put"
            },
            destroy: {
                type: "delete",
                data: function (id) {
                    var args = {};
                    args.id = args[this.id] = id;
                    return args;
                }
            },
            findAll: {
                url: "_shortName"
            },
            findOne: {}
        }, ajaxMaker = function (ajaxMethod, str) {
            // Return a `function` that serves as the ajax method.
            return function (data) {
                // If the ajax method has it's own way of getting `data`, use that.
                data = ajaxMethod.data ? ajaxMethod.data.apply(this, arguments) : data;

                // Return the ajax method with `data` and the `type` provided.
                return ajax(str || this[ajaxMethod.url || "_url"], data, ajaxMethod.type || "get");
            };
        };

        can.Model = can.Observe({
            fullName: "can.Model",
            _reqs: 0,
            setup: function (base) {
                // create store here if someone wants to use model without inheriting from it
                this.store = {};
                can.Observe.setup.apply(this, arguments);

                if (!can.Model) {
                    return;
                }
                this.List = ML({
                    Observe: this
                }, {});
                var self = this, clean = can.proxy(this._clean, self);

                // go through ajax methods and set them up
                can.each(ajaxMethods, function (method, name) {
                    if (!can.isFunction(self[name])) {
                        // use ajaxMaker to convert that into a function
                        // that returns a deferred with the data
                        self[name] = ajaxMaker(method, self[name]);
                    }

                    if (self["make" + can.capitalize(name)]) {
                        // pass the deferred method to the make method to get back
                        // the "findAll" method.
                        var newMethod = self["make" + can.capitalize(name)](self[name]);
                        can.Construct._overwrite(self, base, name, function () {
                            // increment the numer of requests
                            can.Model._reqs++;
                            var def = newMethod.apply(this, arguments);
                            var then = def.then(clean, clean);
                            then.abort = def.abort;

                            // attach abort to our then and return it
                            return then;
                        });
                    }
                });

                if (self.fullName == "can.Model" || !self.fullName) {
                    self.fullName = "Model" + (++modelNum);
                }

                // Add ajax converters.
                can.Model._reqs = 0;
                this._url = this._shortName + "/{" + this.id + "}";
            },
            _ajax: ajaxMaker,
            _makeRequest: makeRequest,
            _clean: function () {
                can.Model._reqs--;
                if (!can.Model._reqs) {
                    for (var id in this.store) {
                        if (!this.store[id]._bindings) {
                            delete this.store[id];
                        }
                    }
                }
                return arguments[0];
            },
            models: function (instancesRawData, oldList) {
                // until "end of turn", increment reqs counter so instances will be added to the store
                can.Model._reqs++;
                if (!instancesRawData) {
                    return;
                }

                if (instancesRawData instanceof this.List) {
                    return instancesRawData;
                }

                // Get the list type.
                var self = this, tmp = [], res = oldList instanceof can.Observe.List ? oldList : new (self.List || ML)(), arr = can.isArray(instancesRawData), ml = (instancesRawData instanceof ML), raw = arr ? instancesRawData : (ml ? instancesRawData.serialize() : instancesRawData.data), i = 0;

                if (typeof raw === 'undefined') {
                    throw new Error('Could not get any raw data while converting using .models');
                }

                if (res.length) {
                    res.splice(0);
                }

                can.each(raw, function (rawPart) {
                    tmp.push(self.model(rawPart));
                });

                // We only want one change event so push everything at once
                res.push.apply(res, tmp);

                if (!arr) {
                    can.each(instancesRawData, function (val, prop) {
                        if (prop !== 'data') {
                            res.attr(prop, val);
                        }
                    });
                }

                // at "end of turn", clean up the store
                setTimeout(can.proxy(this._clean, this), 1);
                return res;
            },
            model: function (attributes) {
                if (!attributes) {
                    return;
                }
                if (typeof attributes.serialize === 'function') {
                    attributes = attributes.serialize();
                }
                var id = attributes[this.id], model = (id || id === 0) && this.store[id] ? this.store[id].attr(attributes, this.removeAttr || false) : new this(attributes);
                if (can.Model._reqs) {
                    this.store[attributes[this.id]] = model;
                }
                return model;
            }
        }, {
            isNew: function () {
                var id = getId(this);
                return !(id || id === 0);
            },
            save: function (success, error) {
                return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
            },
            destroy: function (success, error) {
                if (this.isNew()) {
                    var self = this;
                    var def = can.Deferred();
                    def.then(success, error);
                    return def.done(function (data) {
                        self.destroyed(data);
                    }).resolve(self);
                }
                return makeRequest(this, 'destroy', success, error, 'destroyed');
            },
            _bindsetup: function () {
                this.constructor.store[this.__get(this.constructor.id)] = this;
                return can.Observe.prototype._bindsetup.apply(this, arguments);
            },
            _bindteardown: function () {
                delete this.constructor.store[getId(this)];
                return can.Observe.prototype._bindteardown.apply(this, arguments);
            },
            // Change `id`.
            ___set: function (prop, val) {
                can.Observe.prototype.___set.call(this, prop, val);

                if (prop === this.constructor.id && this._bindings) {
                    this.constructor.store[getId(this)] = this;
                }
            }
        });

        can.each({
            makeFindAll: "models",
            makeFindOne: "model",
            makeCreate: "model",
            makeUpdate: "model"
        }, function (method, name) {
            can.Model[name] = function (oldMethod) {
                return function () {
                    var args = can.makeArray(arguments), oldArgs = can.isFunction(args[1]) ? args.splice(0, 1) : args.splice(0, 2), def = pipe(oldMethod.apply(this, oldArgs), this, method);
                    def.then(args[0], args[1]);

                    // return the original promise
                    return def;
                };
            };
        });

        can.each([
            "created",
            "updated",
            "destroyed"
        ], function (funcName) {
            can.Model.prototype[funcName] = function (attrs) {
                var stub, constructor = this.constructor;

                // Update attributes if attributes have been passed
                stub = attrs && typeof attrs == 'object' && this.attr(attrs.attr ? attrs.attr() : attrs);

                // triggers change event that bubble's like
                // handler( 'change','1.destroyed' ). This is used
                // to remove items on destroyed from Model Lists.
                // but there should be a better way.
                can.trigger(this, "change", funcName);

                // Call event on the instance's Class
                can.trigger(constructor, funcName, this);
            };
        });

        // Model lists are just like `Observe.List` except that when their items are
        // destroyed, it automatically gets removed from the list.
        var ML = can.Model.List = can.Observe.List({
            setup: function (params) {
                if (can.isPlainObject(params) && !can.isArray(params)) {
                    can.Observe.List.prototype.setup.apply(this);
                    this.replace(this.constructor.Observe.findAll(params));
                } else {
                    can.Observe.List.prototype.setup.apply(this, arguments);
                }
            },
            _changes: function (ev, attr) {
                can.Observe.List.prototype._changes.apply(this, arguments);
                if (/\w+\.destroyed/.test(attr)) {
                    var index = this.indexOf(ev.target);
                    if (index != -1) {
                        this.splice(index, 1);
                    }
                }
            }
        });

        return can.Model;
    })(__m3, __m11);

    // ## can/view/view.js
    var __m15 = (function (can) {
        // ## view.js
        // `can.view`
        // _Templating abstraction._
        var isFunction = can.isFunction, makeArray = can.makeArray, hookupId = 1, $view = can.view = can.template = function (view, data, helpers, callback) {
            if (isFunction(helpers)) {
                callback = helpers;
                helpers = undefined;
            }

            var pipe = function (result) {
                return $view.frag(result);
            }, wrapCallback = isFunction(callback) ? function (frag) {
                callback(pipe(frag));
            } : null, result = $view.render(view, data, helpers, wrapCallback), deferred = can.Deferred();

            if (isFunction(result)) {
                return result;
            }

            if (can.isDeferred(result)) {
                result.then(function (result, data) {
                    deferred.resolve.call(deferred, pipe(result), data);
                }, function () {
                    deferred.fail.apply(deferred, arguments);
                });
                return deferred;
            }

            // Convert it into a dom frag.
            return pipe(result);
        };

        can.extend($view, {
            // creates a frag and hooks it up all at once
            frag: function (result, parentNode) {
                return $view.hookup($view.fragment(result), parentNode);
            },
            // simply creates a frag
            // this is used internally to create a frag
            // insert it
            // then hook it up
            fragment: function (result) {
                var frag = can.buildFragment(result, document.body);

                if (!frag.childNodes.length) {
                    frag.appendChild(document.createTextNode(''));
                }
                return frag;
            },
            // Convert a path like string into something that's ok for an `element` ID.
            toId: function (src) {
                return can.map(src.toString().split(/\/|\./g), function (part) {
                    if (part) {
                        return part;
                    }
                }).join("_");
            },
            hookup: function (fragment, parentNode) {
                var hookupEls = [], id, func;

                // Get all `childNodes`.
                can.each(fragment.childNodes ? can.makeArray(fragment.childNodes) : fragment, function (node) {
                    if (node.nodeType === 1) {
                        hookupEls.push(node);
                        hookupEls.push.apply(hookupEls, can.makeArray(node.getElementsByTagName('*')));
                    }
                });

                // Filter by `data-view-id` attribute.
                can.each(hookupEls, function (el) {
                    if (el.getAttribute && (id = el.getAttribute('data-view-id')) && (func = $view.hookups[id])) {
                        func(el, parentNode, id);
                        delete $view.hookups[id];
                        el.removeAttribute('data-view-id');
                    }
                });

                return fragment;
            },
            // auj
            // heir
            hookups: {},
            hook: function (cb) {
                $view.hookups[++hookupId] = cb;
                return " data-view-id='" + hookupId + "'";
            },
            cached: {},
            cachedRenderers: {},
            cache: true,
            register: function (info) {
                this.types["." + info.suffix] = info;
            },
            types: {},
            ext: ".ejs",
            registerScript: function () {
            },
            preload: function () {
            },
            render: function (view, data, helpers, callback) {
                if (isFunction(helpers)) {
                    callback = helpers;
                    helpers = undefined;
                }

                // See if we got passed any deferreds.
                var deferreds = getDeferreds(data);

                if (deferreds.length) {
                    // The deferred that resolves into the rendered content...
                    var deferred = new can.Deferred(), dataCopy = can.extend({}, data);

                    // Add the view request to the list of deferreds.
                    deferreds.push(get(view, true));

                    // Wait for the view and all deferreds to finish...
                    can.when.apply(can, deferreds).then(function (resolved) {
                        // Get all the resolved deferreds.
                        var objs = makeArray(arguments), renderer = objs.pop(), result;

                        if (can.isDeferred(data)) {
                            dataCopy = usefulPart(resolved);
                        } else {
                            for (var prop in data) {
                                if (can.isDeferred(data[prop])) {
                                    dataCopy[prop] = usefulPart(objs.shift());
                                }
                            }
                        }

                        // Get the rendered result.
                        result = renderer(dataCopy, helpers);

                        // Resolve with the rendered view.
                        deferred.resolve(result, dataCopy);

                        // If there's a `callback`, call it back with the result.
                        callback && callback(result, dataCopy);
                    }, function () {
                        deferred.reject.apply(deferred, arguments);
                    });

                    // Return the deferred...
                    return deferred;
                } else {
                    // No deferreds! Render this bad boy.
                    var response, async = isFunction(callback), deferred = get(view, async);

                    if (async) {
                        // Return the deferred
                        response = deferred;

                        // And fire callback with the rendered result.
                        deferred.then(function (renderer) {
                            callback(data ? renderer(data, helpers) : renderer);
                        });
                    } else {
                        if (deferred.state() === "resolved" && deferred.__view_id) {
                            var currentRenderer = $view.cachedRenderers[deferred.__view_id];
                            return data ? currentRenderer(data, helpers) : currentRenderer;
                        } else {
                            // Otherwise, the deferred is complete, so
                            // set response to the result of the rendering.
                            deferred.then(function (renderer) {
                                response = data ? renderer(data, helpers) : renderer;
                            });
                        }
                    }

                    return response;
                }
            },
            registerView: function (id, text, type, def) {
                // Get the renderer function.
                var func = (type || $view.types[$view.ext]).renderer(id, text);
                def = def || new can.Deferred();

                if ($view.cache) {
                    $view.cached[id] = def;
                    def.__view_id = id;
                    $view.cachedRenderers[id] = func;
                }

                // Return the objects for the response's `dataTypes`
                // (in this case view).
                return def.resolve(func);
            }
        });

        // Makes sure there's a template, if not, have `steal` provide a warning.
        var checkText = function (text, url) {
            if (!text.length) {
                throw "can.view: No template or empty template:" + url;
            }
        }, get = function (url, async) {
            var suffix = url.match(/\.[\w\d]+$/), type, el, id, jqXHR;

            if (url.match(/^#/)) {
                url = url.substr(1);
            }

            if (el = document.getElementById(url)) {
                suffix = "." + el.type.match(/\/(x\-)?(.+)/)[2];
            }

            if (!suffix && !$view.cached[url]) {
                url += (suffix = $view.ext);
            }

            if (can.isArray(suffix)) {
                suffix = suffix[0];
            }

            // Convert to a unique and valid id.
            id = $view.toId(url);

            if (url.match(/^\/\//)) {
                var sub = url.substr(2);
                url = !window.steal ? sub : steal.config().root.mapJoin("" + steal.id(sub));
            }

            // Set the template engine type.
            type = $view.types[suffix];

            if ($view.cached[id]) {
                // Return the cached deferred renderer.
                return $view.cached[id];
                // Otherwise if we are getting this from a `<script>` element.
            } else if (el) {
                // Resolve immediately with the element's `innerHTML`.
                return $view.registerView(id, el.innerHTML, type);
            } else {
                // Make an ajax request for text.
                var d = new can.Deferred();
                can.ajax({
                    async: async,
                    url: url,
                    dataType: "text",
                    error: function (jqXHR) {
                        checkText("", url);
                        d.reject(jqXHR);
                    },
                    success: function (text) {
                        // Make sure we got some text back.
                        checkText(text, url);
                        $view.registerView(id, text, type, d);
                    }
                });
                return d;
            }
        }, getDeferreds = function (data) {
            var deferreds = [];

            if (can.isDeferred(data)) {
                return [data];
            } else {
                for (var prop in data) {
                    if (can.isDeferred(data[prop])) {
                        deferreds.push(data[prop]);
                    }
                }
            }
            return deferreds;
        }, usefulPart = function (resolved) {
            return can.isArray(resolved) && resolved[1] === 'success' ? resolved[0] : resolved;
        };

        if (window.steal) {
            steal.type("view js", function (options, success, error) {
                var type = $view.types["." + options.type], id = $view.toId(options.id);

                options.text = "steal('" + (type.plugin || "can/view/" + options.type) + "',function(can){return " + "can.view.preload('" + id + "'," + options.text + ");\n})";
                success();
            });
        }

        //!steal-pluginify-remove-end
        can.extend($view, {
            register: function (info) {
                this.types["." + info.suffix] = info;

                if (window.steal) {
                    steal.type(info.suffix + " view js", function (options, success, error) {
                        var type = $view.types["." + options.type], id = $view.toId(options.id + '');

                        options.text = type.script(id, options.text);
                        success();
                    });
                }
                ;

                //!steal-pluginify-remove-end
                $view[info.suffix] = function (id, text) {
                    if (!text) {
                        // Return a nameless renderer
                        var renderer = function () {
                            return $view.frag(renderer.render.apply(this, arguments));
                        };
                        renderer.render = function () {
                            var renderer = info.renderer(null, id);
                            return renderer.apply(renderer, arguments);
                        };
                        return renderer;
                    }

                    $view.preload(id, info.renderer(id, text));
                    return can.view(id);
                };
            },
            registerScript: function (type, id, src) {
                return "can.view.preload('" + id + "'," + $view.types["." + type].script(id, src) + ");";
            },
            preload: function (id, renderer) {
                var def = $view.cached[id] = new can.Deferred().resolve(function (data, helpers) {
                    return renderer.call(data, data, helpers);
                });

                function frag() {
                    return $view.frag(renderer.apply(this, arguments));
                }

                // expose the renderer for mustache
                frag.render = renderer;

                // set cache references (otherwise preloaded recursive views won't recurse properly)
                def.__view_id = id;
                $view.cachedRenderers[id] = renderer;

                return frag;
            }
        });

        return can;
    })(__m3);

    // ## can/control/control.js
    var __m16 = (function (can) {
        // ## control.js
        // `can.Control`
        // _Controller_
        // Binds an element, returns a function that unbinds.
        var bind = function (el, ev, callback) {
            can.bind.call(el, ev, callback);

            return function () {
                can.unbind.call(el, ev, callback);
            };
        }, isFunction = can.isFunction, extend = can.extend, each = can.each, slice = [].slice, paramReplacer = /\{([^\}]+)\}/g, special = can.getObject("$.event.special", [can]) || {}, delegate = function (el, selector, ev, callback) {
            can.delegate.call(el, selector, ev, callback);
            return function () {
                can.undelegate.call(el, selector, ev, callback);
            };
        }, binder = function (el, ev, callback, selector) {
            return selector ? delegate(el, can.trim(selector), ev, callback) : bind(el, ev, callback);
        }, basicProcessor;

        var Control = can.Control = can.Construct({
            // Setup pre-processes which methods are event listeners.
            setup: function () {
                // Allow contollers to inherit "defaults" from super-classes as it
                // done in `can.Construct`
                can.Construct.setup.apply(this, arguments);

                if (can.Control) {
                    // Cache the underscored names.
                    var control = this, funcName;

                    // Calculate and cache actions.
                    control.actions = {};
                    for (funcName in control.prototype) {
                        if (control._isAction(funcName)) {
                            control.actions[funcName] = control._action(funcName);
                        }
                    }
                }
            },
            // Moves `this` to the first argument, wraps it with `jQuery` if it's an element
            _shifter: function (context, name) {
                var method = typeof name == "string" ? context[name] : name;

                if (!isFunction(method)) {
                    method = context[method];
                }

                return function () {
                    context.called = name;
                    return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
                };
            },
            // Return `true` if is an action.
            _isAction: function (methodName) {
                var val = this.prototype[methodName], type = typeof val;

                // if not the constructor
                return (methodName !== 'constructor') && (type == "function" || (type == "string" && isFunction(this.prototype[val]))) && !!(special[methodName] || processors[methodName] || /[^\w]/.test(methodName));
            },
            // Takes a method name and the options passed to a control
            // and tries to return the data necessary to pass to a processor
            // (something that binds things).
            _action: function (methodName, options) {
                // If we don't have options (a `control` instance), we'll run this
                // later.
                paramReplacer.lastIndex = 0;
                if (options || !paramReplacer.test(methodName)) {
                    // If we have options, run sub to replace templates `{}` with a
                    // value from the options or the window
                    var convertedName = options ? can.sub(methodName, [options, window]) : methodName;
                    if (!convertedName) {
                        return null;
                    }

                    // If a `{}` template resolves to an object, `convertedName` will be
                    // an array
                    var arr = can.isArray(convertedName), name = arr ? convertedName[1] : convertedName, parts = name.split(/\s+/g), event = parts.pop();

                    return {
                        processor: processors[event] || basicProcessor,
                        parts: [name, parts.join(" "), event],
                        delegate: arr ? convertedName[0] : undefined
                    };
                }
            },
            // An object of `{eventName : function}` pairs that Control uses to
            // hook up events auto-magically.
            processors: {},
            // A object of name-value pairs that act as default values for a
            // control instance
            defaults: {}
        }, {
            // Sets `this.element`, saves the control in `data, binds event
            // handlers.
            setup: function (element, options) {
                var cls = this.constructor, pluginname = cls.pluginName || cls._fullName, arr;

                // Want the raw element here.
                this.element = can.$(element);

                if (pluginname && pluginname !== 'can_control') {
                    // Set element and `className` on element.
                    this.element.addClass(pluginname);
                }

                (arr = can.data(this.element, "controls")) || can.data(this.element, "controls", arr = []);
                arr.push(this);

                // Option merging.
                this.options = extend({}, cls.defaults, options);

                // Bind all event handlers.
                this.on();

                // Gets passed into `init`.
                return [this.element, this.options];
            },
            on: function (el, selector, eventName, func) {
                if (!el) {
                    // Adds bindings.
                    this.off();

                    // Go through the cached list of actions and use the processor
                    // to bind
                    var cls = this.constructor, bindings = this._bindings, actions = cls.actions, element = this.element, destroyCB = can.Control._shifter(this, "destroy"), funcName, ready;

                    for (funcName in actions) {
                        if (actions.hasOwnProperty(funcName) && (ready = actions[funcName] || cls._action(funcName, this.options))) {
                            bindings.push(ready.processor(ready.delegate || element, ready.parts[2], ready.parts[1], funcName, this));
                        }
                    }

                    // Setup to be destroyed...
                    // don't bind because we don't want to remove it.
                    can.bind.call(element, "destroyed", destroyCB);
                    bindings.push(function (el) {
                        can.unbind.call(el, "destroyed", destroyCB);
                    });
                    return bindings.length;
                }

                if (typeof el == 'string') {
                    func = eventName;
                    eventName = selector;
                    selector = el;
                    el = this.element;
                }

                if (func === undefined) {
                    func = eventName;
                    eventName = selector;
                    selector = null;
                }

                if (typeof func == 'string') {
                    func = can.Control._shifter(this, func);
                }

                this._bindings.push(binder(el, eventName, func, selector));

                return this._bindings.length;
            },
            // Unbinds all event handlers on the controller.
            off: function () {
                var el = this.element[0];
                each(this._bindings || [], function (value) {
                    value(el);
                });

                // Adds bindings.
                this._bindings = [];
            },
            // Prepares a `control` for garbage collection
            destroy: function () {
                if (this.element === null) {
                    return;
                }
                var Class = this.constructor, pluginName = Class.pluginName || Class._fullName, controls;

                // Unbind bindings.
                this.off();

                if (pluginName && pluginName !== 'can_control') {
                    // Remove the `className`.
                    this.element.removeClass(pluginName);
                }

                // Remove from `data`.
                controls = can.data(this.element, "controls");
                controls.splice(can.inArray(this, controls), 1);

                can.trigger(this, "destroyed");

                this.element = null;
            }
        });

        var processors = can.Control.processors, basicProcessor = function (el, event, selector, methodName, control) {
            return binder(el, event, can.Control._shifter(control, methodName), selector);
        };

        // Set common events to be processed as a `basicProcessor`
        each([
            "change",
            "click",
            "contextmenu",
            "dblclick",
            "keydown",
            "keyup",
            "keypress",
            "mousedown",
            "mousemove",
            "mouseout",
            "mouseover",
            "mouseup",
            "reset",
            "resize",
            "scroll",
            "select",
            "submit",
            "focusin",
            "focusout",
            "mouseenter",
            "mouseleave",
            "touchstart",
            "touchmove",
            "touchcancel",
            "touchend",
            "touchleave"
        ], function (v) {
            processors[v] = basicProcessor;
        });

        return Control;
    })(__m3, __m1);

    // ## can/util/string/deparam/deparam.js
    var __m18 = (function (can) {
        // ## deparam.js
        // `can.deparam`
        // _Takes a string of name value pairs and returns a Object literal that represents those params._
        var digitTest = /^\d+$/, keyBreaker = /([^\[\]]+)|(\[\])/g, paramTest = /([^?#]*)(#.*)?$/, prep = function (str) {
            return decodeURIComponent(str.replace(/\+/g, " "));
        };

        can.extend(can, {
            deparam: function (params) {
                var data = {}, pairs, lastPart;

                if (params && paramTest.test(params)) {
                    pairs = params.split('&'), can.each(pairs, function (pair) {
                        var parts = pair.split('='), key = prep(parts.shift()), value = prep(parts.join("=")), current = data;

                        if (key) {
                            parts = key.match(keyBreaker);

                            for (var j = 0, l = parts.length - 1; j < l; j++) {
                                if (!current[parts[j]]) {
                                    // If what we are pointing to looks like an `array`
                                    current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] == "[]" ? [] : {};
                                }
                                current = current[parts[j]];
                            }
                            lastPart = parts.pop();
                            if (lastPart == "[]") {
                                current.push(value);
                            } else {
                                current[lastPart] = value;
                            }
                        }
                    });
                }
                return data;
            }
        });
        return can;
    })(__m3, __m2);

    // ## can/route/route.js
    var __m17 = (function (can) {
        // ## route.js
        // `can.route`
        // _Helps manage browser history (and client state) by synchronizing the
        // `window.location.hash` with a `can.Observe`._
        // Helper methods used for matching routes.
        var matcher = /\:([\w\.]+)/g, paramsMatcher = /^(?:&[^=]+=[^&]*)+/, makeProps = function (props) {
            var tags = [];
            can.each(props, function (val, name) {
                tags.push((name === 'className' ? 'class' : name) + '="' + (name === "href" ? val : can.esc(val)) + '"');
            });
            return tags.join(" ");
        }, matchesData = function (route, data) {
            var count = 0, i = 0, defaults = {};

            for (var name in route.defaults) {
                if (route.defaults[name] === data[name]) {
                    // mark as matched
                    defaults[name] = 1;
                    count++;
                }
            }
            for (; i < route.names.length; i++) {
                if (!data.hasOwnProperty(route.names[i])) {
                    return -1;
                }
                if (!defaults[route.names[i]]) {
                    count++;
                }
            }

            return count;
        }, onready = !0, location = window.location, wrapQuote = function (str) {
            return (str + '').replace(/([.?*+\^$\[\]\\(){}|\-])/g, "\\$1");
        }, each = can.each, extend = can.extend;

        can.route = function (url, defaults) {
            defaults = defaults || {};

            // Extract the variable names and replace with `RegExp` that will match
            // an atual URL with values.
            var names = [], test = url.replace(matcher, function (whole, name, i) {
                names.push(name);
                var next = "\\" + (url.substr(i + whole.length, 1) || can.route._querySeparator);

                // a name without a default value HAS to have a value
                // a name that has a default value can be empty
                // The `\\` is for string-escaping giving single `\` for `RegExp` escaping.
                return "([^" + next + "]" + (defaults[name] ? "*" : "+") + ")";
            });

            // Add route in a form that can be easily figured out.
            can.route.routes[url] = {
                // A regular expression that will match the route when variable values
                // are present; i.e. for `:page/:type` the `RegExp` is `/([\w\.]*)/([\w\.]*)/` which
                // will match for any value of `:page` and `:type` (word chars or period).
                test: new RegExp("^" + test + "($|" + wrapQuote(can.route._querySeparator) + ")"),
                // The original URL, same as the index for this entry in routes.
                route: url,
                // An `array` of all the variable names in this route.
                names: names,
                // Default values provided for the variables.
                defaults: defaults,
                // The number of parts in the URL separated by `/`.
                length: url.split('/').length
            };
            return can.route;
        };

        extend(can.route, {
            _querySeparator: '&',
            _paramsMatcher: paramsMatcher,
            param: function (data, _setRoute) {
                // Check if the provided data keys match the names in any routes;
                // Get the one with the most matches.
                var route, matches = 0, matchCount, routeName = data.route, propCount = 0;

                delete data.route;

                each(data, function () {
                    propCount++;
                });

                // Otherwise find route.
                each(can.route.routes, function (temp, name) {
                    // best route is the first with all defaults matching
                    matchCount = matchesData(temp, data);
                    if (matchCount > matches) {
                        route = temp;
                        matches = matchCount;
                    }
                    if (matchCount >= propCount) {
                        return false;
                    }
                });

                if (can.route.routes[routeName] && matchesData(can.route.routes[routeName], data) === matches) {
                    route = can.route.routes[routeName];
                }

                if (route) {
                    var cpy = extend({}, data), res = route.route.replace(matcher, function (whole, name) {
                        delete cpy[name];
                        return data[name] === route.defaults[name] ? "" : encodeURIComponent(data[name]);
                    }), after;

                    // Remove matching default values
                    each(route.defaults, function (val, name) {
                        if (cpy[name] === val) {
                            delete cpy[name];
                        }
                    });

                    // The remaining elements of data are added as
                    // `&amp;` separated parameters to the url.
                    after = can.param(cpy);

                    if (_setRoute) {
                        can.route.attr('route', route.route);
                    }
                    return res + (after ? can.route._querySeparator + after : "");
                }

                // If no route was found, there is no hash URL, only paramters.
                return can.isEmptyObject(data) ? "" : can.route._querySeparator + can.param(data);
            },
            deparam: function (url) {
                // See if the url matches any routes by testing it against the `route.test` `RegExp`.
                // By comparing the URL length the most specialized route that matches is used.
                var route = {
                    length: -1
                };
                each(can.route.routes, function (temp, name) {
                    if (temp.test.test(url) && temp.length > route.length) {
                        route = temp;
                    }
                });

                if (route.length > -1) {
                    var parts = url.match(route.test), start = parts.shift(), remainder = url.substr(start.length - (parts[parts.length - 1] === can.route._querySeparator ? 1 : 0)), obj = (remainder && can.route._paramsMatcher.test(remainder)) ? can.deparam(remainder.slice(1)) : {};

                    // Add the default values for this route.
                    obj = extend(true, {}, route.defaults, obj);

                    // Overwrite each of the default values in `obj` with those in
                    // parts if that part is not empty.
                    each(parts, function (part, i) {
                        if (part && part !== can.route._querySeparator) {
                            obj[route.names[i]] = decodeURIComponent(part);
                        }
                    });
                    obj.route = route.route;
                    return obj;
                }

                if (url.charAt(0) !== can.route._querySeparator) {
                    url = can.route._querySeparator + url;
                }
                return can.route._paramsMatcher.test(url) ? can.deparam(url.slice(1)) : {};
            },
            data: new can.Observe({}),
            routes: {},
            ready: function (val) {
                if (val === false) {
                    onready = val;
                }
                if (val === true || onready === true) {
                    can.route._setup();
                    setState();
                }
                return can.route;
            },
            url: function (options, merge) {
                if (merge) {
                    options = extend({}, curParams, options);
                }
                return "#!" + can.route.param(options);
            },
            link: function (name, options, props, merge) {
                return "<a " + makeProps(extend({
                    href: can.route.url(options, merge)
                }, props)) + ">" + name + "</a>";
            },
            current: function (options) {
                return location.hash == "#!" + can.route.param(options);
            },
            _setup: function () {
                // If the hash changes, update the `can.route.data`.
                can.bind.call(window, 'hashchange', setState);
            },
            _getHash: function () {
                return location.href.split(/#!?/)[1] || "";
            },
            _setHash: function (serialized) {
                var path = (can.route.param(serialized, true));
                location.hash = "#!" + path;
                return path;
            }
        });

        // The functions in the following list applied to `can.route` (e.g. `can.route.attr('...')`) will
        // instead act on the `can.route.data` observe.
        each(['bind', 'unbind', 'delegate', 'undelegate', 'attr', 'removeAttr'], function (name) {
            can.route[name] = function () {
                if (!can.route.data[name]) {
                    return;
                }

                return can.route.data[name].apply(can.route.data, arguments);
            };
        });

        var timer, curParams, setState = can.route.setState = function () {
            var hash = can.route._getHash();
            curParams = can.route.deparam(hash);

            if (!changingData || hash !== lastHash) {
                can.route.attr(curParams, true);
            }
        }, lastHash, changingData;

        // If the `can.route.data` changes, update the hash.
        // Using `.serialize()` retrieves the raw data contained in the `observable`.
        // This function is ~~throttled~~ debounced so it only updates once even if multiple values changed.
        // This might be able to use batchNum and avoid this.
        can.route.bind("change", function (ev, attr) {
            // indicate that data is changing
            changingData = 1;
            clearTimeout(timer);
            timer = setTimeout(function () {
                // indicate that the hash is set to look like the data
                changingData = 0;
                var serialized = can.route.data.serialize();

                lastHash = can.route._setHash(serialized);
            }, 1);
        });

        // `onready` event...
        can.bind.call(document, "ready", can.route.ready);

        if ((document.readyState === 'complete' || document.readyState === "interactive") && onready) {
            can.route.ready();
        }

        // extend route to have a similar property
        // that is often checked in mustache to determine
        // an object's observability
        can.route.constructor.canMakeObserve = can.Observe.canMakeObserve;

        return can.route;
    })(__m3, __m11, __m18);

    // ## can/control/route/route.js
    var __m19 = (function (can) {
        // ## control/route.js
        // _Controller route integration._
        can.Control.processors.route = function (el, event, selector, funcName, controller) {
            selector = selector || "";
            can.route(selector);
            var batchNum, check = function (ev, attr, how) {
                if (can.route.attr('route') === (selector) && (ev.batchNum === undefined || ev.batchNum !== batchNum)) {
                    batchNum = ev.batchNum;

                    var d = can.route.attr();
                    delete d.route;
                    if (can.isFunction(controller[funcName])) {
                        controller[funcName](d);
                    } else {
                        controller[controller[funcName]](d);
                    }
                }
            };
            can.route.bind('change', check);
            return function () {
                can.route.unbind('change', check);
            };
        };

        return can;
    })(__m3, __m17, __m16);

    // ## can/view/elements.js
    var __m22 = (function () {
        var elements = {
            tagToContentPropMap: {
                option: "textContent" in document.createElement("option") ? "textContent" : "innerText",
                textarea: "value"
            },
            attrMap: {
                "class": "className",
                "value": "value",
                "innerText": "innerText",
                "textContent": "textContent",
                "checked": true,
                "disabled": true,
                "readonly": true,
                "required": true
            },
            // elements whos default value we should set
            defaultValue: ["input", "textarea"],
            // a map of parent element to child elements
            tagMap: {
                "": "span",
                table: "tbody",
                tr: "td",
                ol: "li",
                ul: "li",
                tbody: "tr",
                thead: "tr",
                tfoot: "tr",
                select: "option",
                optgroup: "option"
            },
            // a tag's parent element
            reverseTagMap: {
                tr: "tbody",
                option: "select",
                td: "tr",
                th: "tr",
                li: "ul"
            },
            getParentNode: function (el, defaultParentNode) {
                return defaultParentNode && el.parentNode.nodeType === 11 ? defaultParentNode : el.parentNode;
            },
            // set an attribute on an element
            setAttr: function (el, attrName, val) {
                var tagName = el.nodeName.toString().toLowerCase(), prop = elements.attrMap[attrName];

                if (prop === true) {
                    el[attrName] = true;
                } else if (prop) {
                    // set the value as true / false
                    el[prop] = val;
                    if (prop === "value" && can.inArray(tagName, elements.defaultValue) >= 0) {
                        el.defaultValue = val;
                    }
                } else {
                    el.setAttribute(attrName, val);
                }
            },
            // gets the value of an attribute
            getAttr: function (el, attrName) {
                // Default to a blank string for IE7/8
                return (elements.attrMap[attrName] && el[elements.attrMap[attrName]] ? el[elements.attrMap[attrName]] : el.getAttribute(attrName)) || '';
            },
            // removes the attribute
            removeAttr: function (el, attrName) {
                if (elements.attrMap[attrName] === true) {
                    el[attrName] = false;
                } else {
                    el.removeAttribute(attrName);
                }
            },
            contentText: function (text) {
                if (typeof text == 'string') {
                    return text;
                }

                if (!text && text !== 0) {
                    return '';
                }
                return "" + text;
            }
        };

        return elements;
    })();

    // ## can/view/scanner.js
    var __m21 = (function (can, elements) {
        var newLine = /(\r|\n)+/g, clean = function (content) {
            return content.split('\\').join("\\\\").split("\n").join("\\n").split('"').join('\\"').split("\t").join("\\t");
        }, getTag = function (tagName, tokens, i) {
            if (tagName) {
                return tagName;
            } else {
                while (i < tokens.length) {
                    if (tokens[i] == "<" && elements.reverseTagMap[tokens[i + 1]]) {
                        return elements.reverseTagMap[tokens[i + 1]];
                    }
                    i++;
                }
            }
            return '';
        }, bracketNum = function (content) {
            return (--content.split("{").length) - (--content.split("}").length);
        }, myEval = function (script) {
            eval(script);
        }, attrReg = /([^\s]+)[\s]*=[\s]*$/, startTxt = 'var ___v1ew = [];', finishTxt = "return ___v1ew.join('')", put_cmd = "___v1ew.push(", insert_cmd = put_cmd, htmlTag = null, quote = null, beforeQuote = null, rescan = null, status = function () {
            // `t` - `1`.
            // `h` - `0`.
            // `q` - String `beforeQuote`.
            return quote ? "'" + beforeQuote.match(attrReg)[1] + "'" : (htmlTag ? 1 : 0);
        };

        can.view.Scanner = Scanner = function (options) {
            // Set options on self
            can.extend(this, {
                text: {},
                tokens: []
            }, options);

            // Cache a token lookup
            this.tokenReg = [];
            this.tokenSimple = {
                "<": "<",
                ">": ">",
                '"': '"',
                "'": "'"
            };
            this.tokenComplex = [];
            this.tokenMap = {};
            for (var i = 0, token; token = this.tokens[i]; i++) {
                if (token[2]) {
                    this.tokenReg.push(token[2]);
                    this.tokenComplex.push({
                        abbr: token[1],
                        re: new RegExp(token[2]),
                        rescan: token[3]
                    });
                } else {
                    this.tokenReg.push(token[1]);
                    this.tokenSimple[token[1]] = token[0];
                }
                this.tokenMap[token[0]] = token[1];
            }

            // Cache the token registry.
            this.tokenReg = new RegExp("(" + this.tokenReg.slice(0).concat(["<", ">", '"', "'"]).join("|") + ")", "g");
        };

        Scanner.prototype = {
            helpers: [
                {
                    name: /\s*\(([\$\w]+)\)\s*->([^\n]*)/,
                    fn: function (content) {
                        var quickFunc = /\s*\(([\$\w]+)\)\s*->([^\n]*)/, parts = content.match(quickFunc);

                        return "can.proxy(function(__){var " + parts[1] + "=can.$(__);" + parts[2] + "}, this);";
                    }
                }
            ],
            scan: function (source, name) {
                var tokens = [], last = 0, simple = this.tokenSimple, complex = this.tokenComplex;

                source = source.replace(newLine, "\n");
                if (this.transform) {
                    source = this.transform(source);
                }
                source.replace(this.tokenReg, function (whole, part) {
                    // offset is the second to last argument
                    var offset = arguments[arguments.length - 2];

                    if (offset > last) {
                        tokens.push(source.substring(last, offset));
                    }

                    if (simple[whole]) {
                        tokens.push(whole);
                    } else {
                        for (var i = 0, token; token = complex[i]; i++) {
                            if (token.re.test(whole)) {
                                tokens.push(token.abbr);

                                if (token.rescan) {
                                    tokens.push(token.rescan(part));
                                }
                                break;
                            }
                        }
                    }

                    // update the position of the last part of the last token
                    last = offset + part.length;
                });

                if (last < source.length) {
                    tokens.push(source.substr(last));
                }

                var content = '', buff = [startTxt + (this.text.start || '')], put = function (content, bonus) {
                    buff.push(put_cmd, '"', clean(content), '"' + (bonus || '') + ');');
                }, endStack = [], lastToken, startTag = null, magicInTag = false, tagName = '', tagNames = [], popTagName = false, bracketCount, i = 0, token, tmap = this.tokenMap;

                // Reinitialize the tag state goodness.
                htmlTag = quote = beforeQuote = null;

                for (; (token = tokens[i++]) !== undefined;) {
                    if (startTag === null) {
                        switch (token) {
                            case tmap.left:
                            case tmap.escapeLeft:
                            case tmap.returnLeft:
                                magicInTag = htmlTag && 1;
                            case tmap.commentLeft:
                                // A new line -- just add whatever content within a clean.
                                // Reset everything.
                                startTag = token;
                                if (content.length) {
                                    put(content);
                                }
                                content = '';
                                break;
                            case tmap.escapeFull:
                                // This is a full line escape (a line that contains only whitespace and escaped logic)
                                // Break it up into escape left and right
                                magicInTag = htmlTag && 1;
                                rescan = 1;
                                startTag = tmap.escapeLeft;
                                if (content.length) {
                                    put(content);
                                }
                                rescan = tokens[i++];
                                content = rescan.content || rescan;
                                if (rescan.before) {
                                    put(rescan.before);
                                }
                                tokens.splice(i, 0, tmap.right);
                                break;
                            case tmap.commentFull:
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            case '<':
                                if (tokens[i].indexOf("!--") !== 0) {
                                    htmlTag = 1;
                                    magicInTag = 0;
                                }
                                content += token;
                                break;
                            case '>':
                                htmlTag = 0;

                                // content.substr(-1) doesn't work in IE7/8
                                var emptyElement = content.substr(content.length - 1) == "/" || content.substr(content.length - 2) == "--";

                                if (magicInTag || !popTagName && elements.tagToContentPropMap[tagNames[tagNames.length - 1]]) {
                                    if (emptyElement) {
                                        put(content.substr(0, content.length - 1), ",can.view.pending(),\"/>\"");
                                    } else {
                                        put(content, ",can.view.pending(),\">\"");
                                    }
                                    content = '';
                                    magicInTag = 0;
                                } else {
                                    content += token;
                                }

                                if (emptyElement || popTagName) {
                                    // remove the current tag in the stack
                                    tagNames.pop();

                                    // set the current tag to the previous parent
                                    tagName = tagNames[tagNames.length - 1];

                                    // Don't pop next time
                                    popTagName = false;
                                }
                                break;
                            case "'":
                            case '"':
                                if (htmlTag) {
                                    if (quote && quote === token) {
                                        // We are exiting the quote.
                                        quote = null;
                                        // Otherwise we are creating a quote.
                                        // TODO: does this handle `\`?
                                    } else if (quote === null) {
                                        quote = token;
                                        beforeQuote = lastToken;
                                    }
                                }
                            default:
                                if (lastToken === '<') {
                                    tagName = token.split(/\s/)[0];
                                    if (tagName.indexOf("/") === 0 && tagNames[tagNames.length - 1] === tagName.substr(1)) {
                                        // set tagName to the last tagName
                                        // if there are no more tagNames, we'll rely on getTag.
                                        tagName = tagNames[tagNames.length - 1];
                                        popTagName = true;
                                    } else {
                                        tagNames.push(tagName);
                                    }
                                }
                                content += token;
                                break;
                        }
                    } else {
                        switch (token) {
                            case tmap.right:
                            case tmap.returnRight:
                                switch (startTag) {
                                    case tmap.left:
                                        // Get the number of `{ minus }`
                                        bracketCount = bracketNum(content);

                                        if (bracketCount == 1) {
                                            // We are starting on.
                                            buff.push(insert_cmd, "can.view.txt(0,'" + getTag(tagName, tokens, i) + "'," + status() + ",this,function(){", startTxt, content);

                                            endStack.push({
                                                before: "",
                                                after: finishTxt + "}));\n"
                                            });
                                        } else {
                                            // How are we ending this statement?
                                            last = endStack.length && bracketCount == -1 ? endStack.pop() : {
                                                after: ";"
                                            };

                                            if (last.before) {
                                                buff.push(last.before);
                                            }

                                            // Add the remaining content.
                                            buff.push(content, ";", last.after);
                                        }
                                        break;
                                    case tmap.escapeLeft:
                                    case tmap.returnLeft:
                                        // We have an extra `{` -> `block`.
                                        // Get the number of `{ minus }`.
                                        bracketCount = bracketNum(content);

                                        if (bracketCount) {
                                            // When we return to the same # of `{` vs `}` end with a `doubleParent`.
                                            endStack.push({
                                                before: finishTxt,
                                                after: "}));"
                                            });
                                        }

                                        var escaped = startTag === tmap.escapeLeft ? 1 : 0, commands = {
                                            insert: insert_cmd,
                                            tagName: getTag(tagName, tokens, i),
                                            status: status()
                                        };

                                        for (var ii = 0; ii < this.helpers.length; ii++) {
                                            // Match the helper based on helper
                                            // regex name value
                                            var helper = this.helpers[ii];
                                            if (helper.name.test(content)) {
                                                content = helper.fn(content, commands);

                                                if (helper.name.source == /^>[\s]*\w*/.source) {
                                                    escaped = 0;
                                                }
                                                break;
                                            }
                                        }

                                        if (typeof content == 'object') {
                                            if (content.raw) {
                                                buff.push(content.raw);
                                            }
                                        } else {
                                            // If we have `<%== a(function(){ %>` then we want
                                            // `can.EJS.text(0,this, function(){ return a(function(){ var _v1ew = [];`.
                                            buff.push(insert_cmd, "can.view.txt(" + escaped + ",'" + tagName + "'," + status() + ",this,function(){ " + (this.text.escape || '') + "return ", content, bracketCount ? startTxt : "}));");
                                        }

                                        if (rescan && rescan.after && rescan.after.length) {
                                            put(rescan.after.length);
                                            rescan = null;
                                        }
                                        break;
                                }
                                startTag = null;
                                content = '';
                                break;
                            case tmap.templateLeft:
                                content += tmap.left;
                                break;
                            default:
                                content += token;
                                break;
                        }
                    }
                    lastToken = token;
                }

                if (content.length) {
                    // Should be `content.dump` in Ruby.
                    put(content);
                }
                buff.push(";");

                var template = buff.join(''), out = {
                    out: 'with(_VIEW) { with (_CONTEXT) {' + template + " " + finishTxt + "}}"
                };

                // Use `eval` instead of creating a function, because it is easier to debug.
                myEval.call(out, 'this.fn = (function(_CONTEXT,_VIEW){' + out.out + '});\r\n//@ sourceURL=' + name + ".js");

                return out;
            }
        };

        return Scanner;
    })(__m15, __m22);

    // ## can/view/node_lists.js
    var __m25 = (function (can) {
        // text node expando test
        var canExpando = true;
        try  {
            document.createTextNode('')._ = 0;
        } catch (ex) {
            canExpando = false;
        }

        // a mapping of element ids to nodeList ids
        var nodeMap = {}, textNodeMap = {}, nodeListMap = {}, expando = "ejs_" + Math.random(), _id = 0, id = function (node) {
            if (canExpando || node.nodeType !== 3) {
                if (node[expando]) {
                    return node[expando];
                } else {
                    return node[expando] = (node.nodeName ? "element_" : "obj_") + (++_id);
                }
            } else {
                for (var textNodeID in textNodeMap) {
                    if (textNodeMap[textNodeID] === node) {
                        return textNodeID;
                    }
                }

                textNodeMap["text_" + (++_id)] = node;
                return "text_" + _id;
            }
        }, removeNodeListId = function (node, nodeListId) {
            var nodeListIds = nodeMap[id(node)];
            if (nodeListIds) {
                var index = can.inArray(nodeListId, nodeListIds);

                if (index >= 0) {
                    nodeListIds.splice(index, 1);
                }
                if (!nodeListIds.length) {
                    delete nodeMap[id(node)];
                }
            }
        }, addNodeListId = function (node, nodeListId) {
            var nodeListIds = nodeMap[id(node)];
            if (!nodeListIds) {
                nodeListIds = nodeMap[id(node)] = [];
            }
            nodeListIds.push(nodeListId);
        };

        var nodeLists = {
            id: id,
            // replaces the contents of one node list with the nodes in another list
            replace: function (oldNodeList, newNodes) {
                // for each node in the node list
                oldNodeList = can.makeArray(oldNodeList);

                // try every set
                //can.each( oldNodeList, function(node){
                var node = oldNodeList[0];

                // for each nodeList the node is in
                can.each(can.makeArray(nodeMap[id(node)]), function (nodeListId) {
                    // if startNode to endNode is
                    // within list, replace that list
                    // I think the problem is not the WHOLE part is being
                    // matched
                    var nodeList = nodeListMap[nodeListId], startIndex = can.inArray(node, nodeList), endIndex = can.inArray(oldNodeList[oldNodeList.length - 1], nodeList);

                    if (startIndex >= 0 && endIndex >= 0) {
                        for (var i = startIndex; i <= endIndex; i++) {
                            var n = nodeList[i];
                            removeNodeListId(n, nodeListId);
                        }

                        // swap in new nodes into the nodeLIst
                        nodeList.splice.apply(nodeList, [startIndex, endIndex - startIndex + 1].concat(newNodes));

                        // tell these new nodes they belong to the nodeList
                        can.each(newNodes, function (node) {
                            addNodeListId(node, nodeListId);
                        });
                    } else {
                        nodeLists.unregister(nodeList);
                    }
                });
                //});
            },
            // registers a list of nodes
            register: function (nodeList) {
                var nLId = id(nodeList);
                nodeListMap[nLId] = nodeList;

                can.each(nodeList, function (node) {
                    addNodeListId(node, nLId);
                });
            },
            // removes mappings
            unregister: function (nodeList) {
                var nLId = id(nodeList);
                can.each(nodeList, function (node) {
                    removeNodeListId(node, nLId);
                });
                delete nodeListMap[nLId];
            },
            nodeMap: nodeMap,
            nodeListMap: nodeListMap
        };
        var ids = function (nodeList) {
            return nodeList.map(function (n) {
                return id(n) + ":" + (n.innerHTML || n.nodeValue);
            });
        };
        return nodeLists;
    })(__m3);

    // ## can/view/live.js
    var __m24 = (function (can, elements, view, nodeLists) {
        // ## live.js
        // The live module provides live binding for computes
        // and can.Observe.List.
        // Currently, it's API is designed for `can/view/render`, but
        // it could easily be used for other purposes.
        // ### Helper methods
        // #### setup
        // `setup(HTMLElement, bind(data), unbind(data)) -> data`
        // Calls bind right away, but will call unbind
        // if the element is "destroyed" (removed from the DOM).
        var setup = function (el, bind, unbind) {
            var teardown = function () {
                unbind(data);
                can.unbind.call(el, 'destroyed', teardown);
            }, data = {
                teardownCheck: function (parent) {
                    if (!parent) {
                        teardown();
                    }
                }
            };

            can.bind.call(el, 'destroyed', teardown);
            bind(data);
            return data;
        }, listen = function (el, compute, change) {
            return setup(el, function () {
                compute.bind("change", change);
            }, function (data) {
                compute.unbind("change", change);
                if (data.nodeList) {
                    nodeLists.unregister(data.nodeList);
                }
            });
        }, getAttributeParts = function (newVal) {
            return (newVal || "").replace(/['"]/g, '').split('=');
        };

        // #### insertElementsAfter
        // Appends elements after the last item in oldElements.
        insertElementsAfter = function (oldElements, newFrag) {
            var last = oldElements[oldElements.length - 1];

            if (last.nextSibling) {
                last.parentNode.insertBefore(newFrag, last.nextSibling);
            } else {
                last.parentNode.appendChild(newFrag);
            }
        };

        var live = {
            nodeLists: nodeLists,
            list: function (el, list, func, context, parentNode) {
                // A mapping of the index to an array
                // of elements that represent the item.
                // Each array is registered so child or parent
                // live structures can update the elements
                var nodesMap = [], add = function (ev, items, index) {
                    // Collect new html and mappings
                    var frag = document.createDocumentFragment(), newMappings = [];
                    can.each(items, function (item) {
                        var itemHTML = func.call(context, item), itemFrag = can.view.frag(itemHTML, parentNode);

                        newMappings.push(can.makeArray(itemFrag.childNodes));
                        frag.appendChild(itemFrag);
                    });

                    if (!nodesMap[index]) {
                        insertElementsAfter(index == 0 ? [text] : nodesMap[index - 1], frag);
                    } else {
                        var el = nodesMap[index][0];
                        el.parentNode.insertBefore(frag, el);
                    }

                    // register each item
                    can.each(newMappings, function (nodeList) {
                        nodeLists.register(nodeList);
                    });
                    [].splice.apply(nodesMap, [index, 0].concat(newMappings));
                }, remove = function (ev, items, index) {
                    var removedMappings = nodesMap.splice(index, items.length), itemsToRemove = [];

                    can.each(removedMappings, function (nodeList) {
                        // add items that we will remove all at once
                        [].push.apply(itemsToRemove, nodeList);

                        // Update any parent lists to remove these items
                        nodeLists.replace(nodeList, []);

                        // unregister the list
                        nodeLists.unregister(nodeList);
                    });
                    can.remove(can.$(itemsToRemove));
                }, parentNode = elements.getParentNode(el, parentNode), text = document.createTextNode("");

                // Setup binding and teardown to add and remove events
                setup(parentNode, function () {
                    list.bind("add", add).bind("remove", remove);
                }, function () {
                    list.unbind("add", add).unbind("remove", remove);
                    can.each(nodesMap, function (nodeList) {
                        nodeLists.unregister(nodeList);
                    });
                });

                insertElementsAfter([el], text);
                can.remove(can.$(el));
                add({}, list, 0);
            },
            html: function (el, compute, parentNode) {
                var parentNode = elements.getParentNode(el, parentNode), data = listen(parentNode, compute, function (ev, newVal, oldVal) {
                    var attached = nodes[0].parentNode;

                    if (attached) {
                        makeAndPut(newVal);
                    }
                    data.teardownCheck(nodes[0].parentNode);
                });

                var nodes, makeAndPut = function (val) {
                    // create the fragment, but don't hook it up
                    // we need to insert it into the document first
                    var frag = can.view.frag(val, parentNode), newNodes = can.makeArray(frag.childNodes);

                    // Insert it in the `document` or `documentFragment`
                    insertElementsAfter(nodes || [el], frag);

                    if (!nodes) {
                        can.remove(can.$(el));
                        nodes = newNodes;

                        // set the teardown nodeList
                        data.nodeList = nodes;
                        nodeLists.register(nodes);
                    } else {
                        // Update node Array's to point to new nodes
                        // and then remove the old nodes.
                        // It has to be in this order for Mootools
                        // and IE because somehow, after an element
                        // is removed from the DOM, it loses its
                        // expando values.
                        var nodesToRemove = can.makeArray(nodes);
                        nodeLists.replace(nodes, newNodes);
                        can.remove(can.$(nodesToRemove));
                    }
                };
                makeAndPut(compute(), [el]);
            },
            text: function (el, compute, parentNode) {
                var parent = elements.getParentNode(el, parentNode);

                // setup listening right away so we don't have to re-calculate value
                var data = listen(el.parentNode !== parent ? el.parentNode : parent, compute, function (ev, newVal, oldVal) {
                    if (typeof node.nodeValue != 'unknown') {
                        node.nodeValue = "" + newVal;
                    }
                    data.teardownCheck(node.parentNode);
                });

                var node = document.createTextNode(compute());

                if (el.parentNode !== parent) {
                    parent = el.parentNode;
                    parent.insertBefore(node, el);
                    parent.removeChild(el);
                } else {
                    parent.insertBefore(node, el);
                    parent.removeChild(el);
                }
            },
            attributes: function (el, compute, currentValue) {
                var setAttrs = function (newVal) {
                    var parts = getAttributeParts(newVal), newAttrName = parts.shift();

                    if ((newAttrName != attrName) && attrName) {
                        elements.removeAttr(el, attrName);
                    }

                    if (newAttrName) {
                        elements.setAttr(el, newAttrName, parts.join('='));
                        attrName = newAttrName;
                    }
                };

                listen(el, compute, function (ev, newVal) {
                    setAttrs(newVal);
                });

                if (arguments.length >= 3) {
                    var attrName = getAttributeParts(currentValue)[0];
                } else {
                    setAttrs(compute());
                }
            },
            attributePlaceholder: '__!!__',
            attributeReplace: /__!!__/g,
            attribute: function (el, attributeName, compute) {
                listen(el, compute, function (ev, newVal) {
                    elements.setAttr(el, attributeName, hook.render());
                });

                var wrapped = can.$(el), hooks;

                // Get the list of hookups or create one for this element.
                // Hooks is a map of attribute names to hookup `data`s.
                // Each hookup data has:
                // `render` - A `function` to render the value of the attribute.
                // `funcs` - A list of hookup `function`s on that attribute.
                // `batchNum` - The last event `batchNum`, used for performance.
                hooks = can.data(wrapped, 'hooks');
                if (!hooks) {
                    can.data(wrapped, 'hooks', hooks = {});
                }

                // Get the attribute value.
                var attr = elements.getAttr(el, attributeName), parts = attr.split(live.attributePlaceholder), goodParts = [], hook;
                goodParts.push(parts.shift(), parts.join(live.attributePlaceholder));

                if (hooks[attributeName]) {
                    // Just add to that attribute's list of `function`s.
                    hooks[attributeName].computes.push(compute);
                } else {
                    // Create the hookup data.
                    hooks[attributeName] = {
                        render: function () {
                            var i = 0, newAttr = attr ? attr.replace(live.attributeReplace, function () {
                                return elements.contentText(hook.computes[i++]());
                            }) : elements.contentText(hook.computes[i++]());
                            return newAttr;
                        },
                        computes: [compute],
                        batchNum: undefined
                    };
                }

                // Save the hook for slightly faster performance.
                hook = hooks[attributeName];

                // Insert the value in parts.
                goodParts.splice(1, 0, compute());

                // Set the attribute.
                elements.setAttr(el, attributeName, goodParts.join(""));
            }
        };
        return live;
    })(__m3, __m22, __m15, __m25);

    // ## can/view/render.js
    var __m23 = (function (can, elements, live) {
        var pendingHookups = [], tagChildren = function (tagName) {
            var newTag = elements.tagMap[tagName] || "span";
            if (newTag === "span") {
                //innerHTML in IE doesn't honor leading whitespace after empty elements
                return "@@!!@@";
            }
            return "<" + newTag + ">" + tagChildren(newTag) + "</" + newTag + ">";
        }, contentText = function (input, tag) {
            if (typeof input == 'string') {
                return input;
            }

            if (!input && input !== 0) {
                return '';
            }

            // If it's an object, and it has a hookup method.
            var hook = (input.hookup && // Make a function call the hookup method.
            function (el, id) {
                input.hookup.call(input, el, id);
            }) || (typeof input == 'function' && input);

            if (hook) {
                if (tag) {
                    return "<" + tag + " " + can.view.hook(hook) + "></" + tag + ">";
                } else {
                    pendingHookups.push(hook);
                }

                return '';
            }

            // Finally, if all else is `false`, `toString()` it.
            return "" + input;
        }, contentEscape = function (txt) {
            return (typeof txt == 'string' || typeof txt == 'number') ? can.esc(txt) : contentText(txt);
        };

        var current;

        can.extend(can.view, {
            live: live,
            setupLists: function () {
                var old = can.view.lists, data;

                can.view.lists = function (list, renderer) {
                    data = {
                        list: list,
                        renderer: renderer
                    };
                };
                return function () {
                    can.view.lists = old;
                    return data;
                };
            },
            pending: function () {
                // TODO, make this only run for the right tagName
                var hooks = pendingHookups.slice(0);
                lastHookups = hooks;
                pendingHookups = [];
                return can.view.hook(function (el) {
                    can.each(hooks, function (fn) {
                        fn(el);
                    });
                });
            },
            txt: function (escape, tagName, status, self, func) {
                var listTeardown = can.view.setupLists(), emptyHandler = function () {
                }, unbind = function () {
                    compute.unbind("change", emptyHandler);
                };

                var compute = can.compute(func, self, false);

                // bind to get and temporarily cache the value
                compute.bind("change", emptyHandler);

                // call the "wrapping" function and get the binding information
                var tag = (elements.tagMap[tagName] || "span"), listData = listTeardown(), value = compute();

                if (listData) {
                    return "<" + tag + can.view.hook(function (el, parentNode) {
                        live.list(el, listData.list, listData.renderer, self, parentNode);
                    }) + "></" + tag + ">";
                }

                if (!compute.hasDependencies) {
                    unbind();
                    return (escape || status !== 0 ? contentEscape : contentText)(value, status === 0 && tag);
                }

                // the property (instead of innerHTML elements) to adjust. For
                // example options should use textContent
                var contentProp = elements.tagToContentPropMap[tagName];

                if (status === 0 && !contentProp) {
                    // Return an element tag with a hookup in place of the content
                    return "<" + tag + can.view.hook(escape ? // If we are escaping, replace the parentNode with
                    // a text node who's value is `func`'s return value.
                    function (el, parentNode) {
                        live.text(el, compute, parentNode);
                        unbind();
                    } : // If we are not escaping, replace the parentNode with a
                    // documentFragment created as with `func`'s return value.
                    function (el, parentNode) {
                        live.html(el, compute, parentNode);
                        unbind();
                        //children have to be properly nested HTML for buildFragment to work properly
                    }) + ">" + tagChildren(tag) + "</" + tag + ">";
                    // In a tag, but not in an attribute
                } else if (status === 1) {
                    // remember the old attr name
                    pendingHookups.push(function (el) {
                        live.attributes(el, compute, compute());
                        unbind();
                    });
                    return compute();
                } else {
                    var attributeName = status === 0 ? contentProp : status;

                    // if the magic tag is inside the element, like `<option><% TAG %></option>`,
                    // we add this hookup to the last element (ex: `option`'s) hookups.
                    // Otherwise, the magic tag is in an attribute, just add to the current element's
                    // hookups.
                    (status === 0 ? lastHookups : pendingHookups).push(function (el) {
                        live.attribute(el, attributeName, compute);
                        unbind();
                    });
                    return live.attributePlaceholder;
                }
            }
        });

        return can;
    })(__m15, __m22, __m24, __m2);

    // ## can/view/mustache/mustache.js
    var __m20 = (function (can) {
        // # mustache.js
        // `can.Mustache`: The Mustache templating engine.
        // See the [Transformation](#section-29) section within *Scanning Helpers* for a detailed explanation
        // of the runtime render code design. The majority of the Mustache engine implementation
        // occurs within the *Transformation* scanning helper.
        // ## Initialization
        // Define the view extension.
        can.view.ext = ".mustache";

        // ### Setup internal helper variables and functions.
        // An alias for the context variable used for tracking a stack of contexts.
        // This is also used for passing to helper functions to maintain proper context.
        var CONTEXT = '___c0nt3xt', HASH = '___h4sh', STACK = '___st4ck', STACKED = '___st4ck3d', CONTEXT_STACK = STACK + '(' + CONTEXT + ',this)', CONTEXT_OBJ = '{context:' + CONTEXT_STACK + ',options:options}', isObserve = function (obj) {
            return obj !== null && can.isFunction(obj.attr) && obj.constructor && !!obj.constructor.canMakeObserve;
        }, isArrayLike = function (obj) {
            return obj && obj.splice && typeof obj.length == 'number';
        }, Mustache = function (options, helpers) {
            if (this.constructor != Mustache) {
                var mustache = new Mustache(options);
                return function (data, options) {
                    return mustache.render(data, options);
                };
            }

            if (typeof options == "function") {
                this.template = {
                    fn: options
                };
                return;
            }

            // Set options on self.
            can.extend(this, options);
            this.template = this.scanner.scan(this.text, this.name);
        };

        // Put Mustache on the `can` object.
        can.Mustache = window.Mustache = Mustache;

        Mustache.prototype.render = function (object, options) {
            object = object || {};
            options = options || {};
            if (!options.helpers && !options.partials) {
                options.helpers = options;
            }
            return this.template.fn.call(object, object, {
                _data: object,
                options: options
            });
        };

        can.extend(Mustache.prototype, {
            // Share a singleton scanner for parsing templates.
            scanner: new can.view.Scanner({
                // A hash of strings for the scanner to inject at certain points.
                text: {
                    // This is the logic to inject at the beginning of a rendered template.
                    // This includes initializing the `context` stack.
                    start: 'var ' + CONTEXT + ' = this && this.' + STACKED + ' ? this : [];' + CONTEXT + '.' + STACKED + ' = true;' + 'var ' + STACK + ' = function(context, self) {' + 'var s;' + 'if (arguments.length == 1 && context) {' + 's = !context.' + STACKED + ' ? [context] : context;' + '} else if (!context.' + STACKED + ') {' + 's = [self, context];' + '} else if (context && context === self && context.' + STACKED + ') {' + 's = context.slice(0);' + '} else {' + 's = context && context.' + STACKED + ' ? context.concat([self]) : ' + STACK + '(context).concat([self]);' + '}' + 'return (s.' + STACKED + ' = true) && s;' + '};'
                },
                // An ordered token registry for the scanner.
                // This needs to be ordered by priority to prevent token parsing errors.
                // Each token follows the following structure:
                //		[
                //			// Which key in the token map to match.
                //			"tokenMapName",
                //			// A simple token to match, like "{{".
                //			"token",
                //			// Optional. A complex (regexp) token to match that
                //			// overrides the simple token.
                //			"[\\s\\t]*{{",
                //			// Optional. A function that executes advanced
                //			// manipulation of the matched content. This is
                //			// rarely used.
                //			function(content){
                //				return content;
                //			}
                //		]
                tokens: [
                    ["returnLeft", "{{{", "{{[{&]"],
                    ["commentFull", "{{!}}", "^[\\s\\t]*{{!.+?}}\\n"],
                    ["commentLeft", "{{!", "(\\n[\\s\\t]*{{!|{{!)"],
                    [
                        "escapeFull",
                        "{{}}",
                        "(^[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}\\n|\\n[\\s\\t]*{{[#/^][^}]+?}}$)",
                        function (content) {
                            return {
                                before: /^\n.+?\n$/.test(content) ? '\n' : '',
                                content: content.match(/\{\{(.+?)\}\}/)[1] || ''
                            };
                        }
                    ],
                    ["escapeLeft", "{{"],
                    ["returnRight", "}}}"],
                    ["right", "}}"]
                ],
                // ## Scanning Helpers
                // This is an array of helpers that transform content that is within escaped tags like `{{token}}`. These helpers are solely for the scanning phase; they are unrelated to Mustache/Handlebars helpers which execute at render time. Each helper has a definition like the following:
                //		{
                //			// The content pattern to match in order to execute.
                //			// Only the first matching helper is executed.
                //			name: /pattern to match/,
                //			// The function to transform the content with.
                //			// @param {String} content   The content to transform.
                //			// @param {Object} cmd       Scanner helper data.
                //			//                           {
                //			//                             insert: "insert command",
                //			//                             tagName: "div",
                //			//                             status: 0
                //			//                           }
                //			fn: function(content, cmd) {
                //				return 'for text injection' ||
                //					{ raw: 'to bypass text injection' };
                //			}
                //		}
                helpers: [
                    // ### Partials
                    // Partials begin with a greater than sign, like {{> box}}.
                    // Partials are rendered at runtime (as opposed to compile time),
                    // so recursive partials are possible. Just avoid infinite loops.
                    // For example, this template and partial:
                    // 		base.mustache:
                    // 			<h2>Names</h2>
                    // 			{{#names}}
                    // 				{{> user}}
                    // 			{{/names}}
                    // 		user.mustache:
                    // 			<strong>{{name}}</strong>
                    {
                        name: /^>[\s]*\w*/,
                        fn: function (content, cmd) {
                            // Get the template name and call back into the render method,
                            // passing the name and the current context.
                            var templateName = can.trim(content.replace(/^>\s?/, '')).replace(/["|']/g, "");
                            return "options.partials && options.partials['" + templateName + "'] ? can.Mustache.renderPartial(options.partials['" + templateName + "']," + CONTEXT_STACK + ",options) : can.Mustache.render('" + templateName + "', " + CONTEXT_STACK + ")";
                        }
                    },
                    // ### Data Hookup
                    // This will attach the data property of `this` to the element
                    // its found on using the first argument as the data attribute
                    // key.
                    // For example:
                    //		<li id="nameli" {{ data 'name' }}></li>
                    // then later you can access it like:
                    //		can.$('#nameli').data('name');
                    {
                        name: /^\s*data\s/,
                        fn: function (content, cmd) {
                            var attr = content.match(/["|'](.*)["|']/)[1];

                            // return a function which calls `can.data` on the element
                            // with the attribute name with the current context.
                            return "can.proxy(function(__){" + "can.data(can.$(__),'" + attr + "', this.pop()); }, " + CONTEXT_STACK + ")";
                        }
                    },
                    // ### Transformation (default)
                    // This transforms all content to its interpolated equivalent,
                    // including calls to the corresponding helpers as applicable.
                    // This outputs the render code for almost all cases.
                    // #### Definitions
                    // * `context` - This is the object that the current rendering context operates within.
                    //		Each nested template adds a new `context` to the context stack.
                    // * `stack` - Mustache supports nested sections,
                    //		each of which add their own context to a stack of contexts.
                    //		Whenever a token gets interpolated, it will check for a match against the
                    //		last context in the stack, then iterate through the rest of the stack checking for matches.
                    //		The first match is the one that gets returned.
                    // * `Mustache.txt` - This serializes a collection of logic, optionally contained within a section.
                    //		If this is a simple interpolation, only the interpolation lookup will be passed.
                    //		If this is a section, then an `options` object populated by the truthy (`options.fn`) and
                    //		falsey (`options.inverse`) encapsulated functions will also be passed. This section handling
                    //		exists to support the runtime context nesting that Mustache supports.
                    // * `Mustache.get` - This resolves an interpolation reference given a stack of contexts.
                    // * `options` - An object containing methods for executing the inner contents of sections or helpers.
                    //		`options.fn` - Contains the inner template logic for a truthy section.
                    //		`options.inverse` - Contains the inner template logic for a falsey section.
                    //		`options.hash` - Contains the merged hash object argument for custom helpers.
                    // #### Design
                    // This covers the design of the render code that the transformation helper generates.
                    // ##### Pseudocode
                    // A detailed explanation is provided in the following sections, but here is some brief pseudocode
                    // that gives a high level overview of what the generated render code does (with a template similar to
                    // `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`).
                    // *Initialize the render code.*
                    // 		view = []
                    // 		context = []
                    // 		stack = fn { context.concat([this]) }
                    // *Render the root section.*
                    // 		view.push( "string" )
                    // 		view.push( can.view.txt(
                    // *Render the nested section with `can.Mustache.txt`.*
                    // 			txt(
                    // *Add the current context to the stack.*
                    // 				stack(),
                    // *Flag this for truthy section mode.*
                    // 				"#",
                    // *Interpolate and check the `a` variable for truthyness using the stack with `can.Mustache.get`.*
                    // 				get( "a", stack() ),
                    // *Include the nested section's inner logic.
                    // The stack argument is usually the parent section's copy of the stack,
                    // but it can be an override context that was passed by a custom helper.
                    // Sections can nest `0..n` times -- **NESTCEPTION**.*
                    // 				{ fn: fn(stack) {
                    // *Render the nested section (everything between the `{{#a}}` and `{{/a}}` tokens).*
                    // 					view = []
                    // 					view.push( "string" )
                    // 					view.push(
                    // *Add the current context to the stack.*
                    // 						stack(),
                    // *Flag this as interpolation-only mode.*
                    // 						null,
                    // *Interpolate the `b.c.d.e.name` variable using the stack.*
                    // 						get( "b.c.d.e.name", stack() ),
                    // 					)
                    // 					view.push( "string" )
                    // *Return the result for the nested section.*
                    // 					return view.join()
                    // 				}}
                    // 			)
                    // 		))
                    // 		view.push( "string" )
                    // *Return the result for the root section, which includes all nested sections.*
                    // 		return view.join()
                    // ##### Initialization
                    // Each rendered template is started with the following initialization code:
                    // 		var ___v1ew = [];
                    // 		var ___c0nt3xt = [];
                    // 		___c0nt3xt.___st4ck = true;
                    // 		var ___st4ck = function(context, self) {
                    // 			var s;
                    // 			if (arguments.length == 1 && context) {
                    // 				s = !context.___st4ck ? [context] : context;
                    // 			} else {
                    // 				s = context && context.___st4ck
                    //					? context.concat([self])
                    //					: ___st4ck(context).concat([self]);
                    // 			}
                    // 			return (s.___st4ck = true) && s;
                    // 		};
                    // The `___v1ew` is the the array used to serialize the view.
                    // The `___c0nt3xt` is a stacking array of contexts that slices and expands with each nested section.
                    // The `___st4ck` function is used to more easily update the context stack in certain situations.
                    // Usually, the stack function simply adds a new context (`self`/`this`) to a context stack.
                    // However, custom helpers will occasionally pass override contexts that need their own context stack.
                    // ##### Sections
                    // Each section, `{{#section}} content {{/section}}`, within a Mustache template generates a section
                    // context in the resulting render code. The template itself is treated like a root section, with the
                    // same execution logic as any others. Each section can have `0..n` nested sections within it.
                    // Here's an example of a template without any descendent sections.
                    // Given the template: `"{{a.b.c.d.e.name}}" == "Phil"`
                    // Would output the following render code:
                    //		___v1ew.push("\"");
                    //		___v1ew.push(can.view.txt(1, '', 0, this, function() {
                    // 			return can.Mustache.txt(___st4ck(___c0nt3xt, this), null,
                    //				can.Mustache.get("a.b.c.d.e.name",
                    //					___st4ck(___c0nt3xt, this))
                    //			);
                    //		}));
                    //		___v1ew.push("\" == \"Phil\"");
                    // The simple strings will get appended to the view. Any interpolated references (like `{{a.b.c.d.e.name}}`)
                    // will be pushed onto the view via `can.view.txt` in order to support live binding.
                    // The function passed to `can.view.txt` will call `can.Mustache.txt`, which serializes the object data by doing
                    // a context lookup with `can.Mustache.get`.
                    // `can.Mustache.txt`'s first argument is a copy of the context stack with the local context `this` added to it.
                    // This stack will grow larger as sections nest.
                    // The second argument is for the section type. This will be `"#"` for truthy sections, `"^"` for falsey,
                    // or `null` if it is an interpolation instead of a section.
                    // The third argument is the interpolated value retrieved with `can.Mustache.get`, which will perform the
                    // context lookup and return the approriate string or object.
                    // Any additional arguments, if they exist, are used for passing arguments to custom helpers.
                    // For nested sections, the last argument is an `options` object that contains the nested section's logic.
                    // Here's an example of a template with a single nested section.
                    // Given the template: `"{{#a}}{{b.c.d.e.name}}{{/a}}" == "Phil"`
                    // Would output the following render code:
                    //		___v1ew.push("\"");
                    // 		___v1ew.push(can.view.txt(0, '', 0, this, function() {
                    // 			return can.Mustache.txt(___st4ck(___c0nt3xt, this), "#",
                    //				can.Mustache.get("a", ___st4ck(___c0nt3xt, this)),
                    //					[{
                    // 					_: function() {
                    // 						return ___v1ew.join("");
                    // 					}
                    // 				}, {
                    // 					fn: function(___c0nt3xt) {
                    // 						var ___v1ew = [];
                    // 						___v1ew.push(can.view.txt(1, '', 0, this,
                    //								function() {
                    //  								return can.Mustache.txt(
                    // 									___st4ck(___c0nt3xt, this),
                    // 									null,
                    // 									can.Mustache.get("b.c.d.e.name",
                    // 										___st4ck(___c0nt3xt, this))
                    // 								);
                    // 							}
                    // 						));
                    // 						return ___v1ew.join("");
                    // 					}
                    // 				}]
                    //			)
                    // 		}));
                    //		___v1ew.push("\" == \"Phil\"");
                    // This is specified as a truthy section via the `"#"` argument. The last argument includes an array of helper methods used with `options`.
                    // These act similarly to custom helpers: `options.fn` will be called for truthy sections, `options.inverse` will be called for falsey sections.
                    // The `options._` function only exists as a dummy function to make generating the section nesting easier (a section may have a `fn`, `inverse`,
                    // or both, but there isn't any way to determine that at compilation time).
                    // Within the `fn` function is the section's render context, which in this case will render anything between the `{{#a}}` and `{{/a}}` tokens.
                    // This function has `___c0nt3xt` as an argument because custom helpers can pass their own override contexts. For any case where custom helpers
                    // aren't used, `___c0nt3xt` will be equivalent to the `___st4ck(___c0nt3xt, this)` stack created by its parent section. The `inverse` function
                    // works similarly, except that it is added when `{{^a}}` and `{{else}}` are used. `var ___v1ew = []` is specified in `fn` and `inverse` to
                    // ensure that live binding in nested sections works properly.
                    // All of these nested sections will combine to return a compiled string that functions similar to EJS in its uses of `can.view.txt`.
                    // #### Implementation
                    {
                        name: /^.*$/,
                        fn: function (content, cmd) {
                            var mode = false, result = [];

                            // Trim the content so we don't have any trailing whitespace.
                            content = can.trim(content);

                            if (content.length && (mode = content.match(/^([#^/]|else$)/))) {
                                mode = mode[0];
                                switch (mode) {
                                    case '#':

                                    case '^':
                                        result.push(cmd.insert + 'can.view.txt(0,\'' + cmd.tagName + '\',' + cmd.status + ',this,function(){ return ');
                                        break;

                                    case '/':
                                        return {
                                            raw: 'return ___v1ew.join("");}}])}));'
                                        };
                                        break;
                                }

                                // Trim the mode off of the content.
                                content = content.substring(1);
                            }

                            if (mode != 'else') {
                                var args = [], i = 0, hashing = false, arg, split, m;

                                // Parse the helper arguments.
                                // This needs uses this method instead of a split(/\s/) so that
                                // strings with spaces can be correctly parsed.
                                (can.trim(content) + ' ').replace(/((([^\s]+?=)?('.*?'|".*?"))|.*?)\s/g, function (whole, part) {
                                    args.push(part);
                                });

                                // Start the content render block.
                                result.push('can.Mustache.txt(' + CONTEXT_OBJ + ',' + (mode ? '"' + mode + '"' : 'null') + ',');

                                for (; arg = args[i]; i++) {
                                    i && result.push(',');

                                    if (i && (m = arg.match(/^(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false)|((.+?)=(('.*?'|".*?"|[0-9]+\.?[0-9]*|true|false)|(.+))))$/))) {
                                        if (m[2]) {
                                            result.push(m[0]);
                                        } else {
                                            if (!hashing) {
                                                hashing = true;
                                                result.push('{' + HASH + ':{');
                                            }

                                            // Add the key/value.
                                            result.push(m[4], ':', m[6] ? m[6] : 'can.Mustache.get("' + m[5].replace(/"/g, '\\"') + '",' + CONTEXT_OBJ + ')');

                                            if (i == args.length - 1) {
                                                result.push('}}');
                                            }
                                        }
                                    } else {
                                        result.push('can.Mustache.get("' + arg.replace(/"/g, '\\"') + '",' + CONTEXT_OBJ + (i == 0 && args.length > 1 ? ',true' : ',false') + (i > 0 ? ',true' : ',false') + ')');
                                    }
                                }
                            }

                            // Create an option object for sections of code.
                            mode && mode != 'else' && result.push(',[{_:function(){');
                            switch (mode) {
                                case '#':
                                    result.push('return ___v1ew.join("");}},{fn:function(' + CONTEXT + '){var ___v1ew = [];');
                                    break;

                                case 'else':
                                case '^':
                                    result.push('return ___v1ew.join("");}},{inverse:function(' + CONTEXT + '){var ___v1ew = [];');
                                    break;

                                default:
                                    result.push(');');
                                    break;
                            }

                            // Return a raw result if there was a section, otherwise return the default string.
                            result = result.join('');
                            return mode ? {
                                raw: result
                            } : result;
                        }
                    }
                ]
            })
        });

        // Add in default scanner helpers first.
        // We could probably do this differently if we didn't 'break' on every match.
        var helpers = can.view.Scanner.prototype.helpers;
        for (var i = 0; i < helpers.length; i++) {
            Mustache.prototype.scanner.helpers.unshift(helpers[i]);
        }
        ;

        Mustache.txt = function (context, mode, name) {
            // Grab the extra arguments to pass to helpers.
            var args = Array.prototype.slice.call(arguments, 3), options = can.extend.apply(can, [
                {
                    fn: function () {
                    },
                    inverse: function () {
                    }
                }
            ].concat(mode ? args.pop() : []));

            var extra = {};
            if (context.context) {
                extra = context.options;
                context = context.context;
            }

            if (helper = (Mustache.getHelper(name, extra) || (can.isFunction(name) && !name.isComputed && {
                fn: name
            }))) {
                // Use the most recent context as `this` for the helper.
                var stack = context[STACKED] && context, context = (stack && context[context.length - 1]) || context, opts = {
                    fn: can.proxy(options.fn, context),
                    inverse: can.proxy(options.inverse, context)
                }, lastArg = args[args.length - 1];

                if (stack) {
                    opts.contexts = stack;
                }

                if (lastArg && lastArg[HASH]) {
                    opts.hash = args.pop()[HASH];
                }
                args.push(opts);

                // Call the helper.
                return helper.fn.apply(context, args) || '';
            }

            if (can.isFunction(name) && name.isComputed) {
                name = name();
            }

            // An array of arguments to check for truthyness when evaluating sections.
            var validArgs = args.length ? args : [name], valid = true, result = [], i, helper, argIsObserve, arg;

            if (mode) {
                for (i = 0; i < validArgs.length; i++) {
                    arg = validArgs[i];
                    argIsObserve = typeof arg !== 'undefined' && isObserve(arg);

                    if (isArrayLike(arg)) {
                        if (mode == '#') {
                            valid = valid && !!(argIsObserve ? arg.attr('length') : arg.length);
                        } else if (mode == '^') {
                            valid = valid && !(argIsObserve ? arg.attr('length') : arg.length);
                        }
                    } else {
                        valid = mode == '#' ? valid && !!arg : mode == '^' ? valid && !arg : valid;
                    }
                }
            }

            if (valid) {
                switch (mode) {
                    case '#':
                        if (isArrayLike(name)) {
                            var isObserveList = isObserve(name);

                            for (i = 0; i < name.length; i++) {
                                result.push(options.fn.call(name[i], context) || '');

                                // Ensure that live update works on observable lists
                                isObserveList && name.attr('' + i);
                            }
                            return result.join('');
                        } else {
                            return options.fn.call(name || {}, context) || '';
                        }
                        break;

                    case '^':
                        return options.inverse.call(name || {}, context) || '';
                        break;
                    default:
                        // Add + '' to convert things like numbers to strings.
                        // This can cause issues if you are trying to
                        // eval on the length but this is the more
                        // common case.
                        return '' + (name !== undefined ? name : '');
                        break;
                }
            }

            return '';
        };

        Mustache.get = function (ref, contexts, isHelper, isArgument) {
            var options = contexts.options || {};
            contexts = contexts.context || contexts;

            // Assume the local object is the last context in the stack.
            var obj = contexts[contexts.length - 1], context = contexts[contexts.length - 2], names = ref.indexOf('\\.') == -1 ? ref.split('.') : (function () {
                var names = [], last = 0;
                ref.replace(/(\\)?\./g, function ($0, $1, index) {
                    if (!$1) {
                        names.push(ref.slice(last, index).replace(/\\\./g, '.'));
                        last = index + $0.length;
                    }
                });
                names.push(ref.slice(last).replace(/\\\./g, '.'));
                return names;
            })(), namesLength = names.length, value, lastValue, name, i, j, defaultObserve, defaultObserveName;

            if (/^\.|this$/.test(ref)) {
                if (!/^object|undefined$/.test(typeof context)) {
                    return context || '';
                } else {
                    while (value = contexts.pop()) {
                        if (typeof value !== 'undefined') {
                            return value;
                        }
                    }
                    return '';
                }
            } else if (!isHelper) {
                for (i = contexts.length - 1; i >= 0; i--) {
                    // Check the context for the reference
                    value = contexts[i];

                    if (can.isFunction(value) && value.isComputed) {
                        value = value();
                    }

                    if (typeof value !== 'undefined' && value !== null) {
                        var isHelper = Mustache.getHelper(ref, options);
                        for (j = 0; j < namesLength; j++) {
                            if (typeof value[names[j]] !== 'undefined' && value[names[j]] !== null) {
                                lastValue = value;
                                value = value[name = names[j]];
                            } else if (isHelper) {
                                return ref;
                            } else if (isObserve(value)) {
                                defaultObserve = value;
                                defaultObserveName = names[j];
                                lastValue = value = undefined;
                                break;
                            } else {
                                lastValue = value = undefined;
                                break;
                            }
                        }
                    }

                    if (value !== undefined) {
                        return Mustache.resolve(value, lastValue, name, isArgument);
                    }
                }
            }

            if (defaultObserve && !(Mustache.getHelper(ref) && can.inArray(defaultObserveName, can.Observe.keys(defaultObserve)) === -1)) {
                return defaultObserve.compute(defaultObserveName);
            }

            if (value = Mustache.getHelper(ref, options)) {
                return ref;
            } else if (typeof obj !== 'undefined' && obj !== null && can.isFunction(obj[ref])) {
                // Support helper-like functions as anonymous helpers
                return obj[ref];
            }

            return '';
        };

        Mustache.resolve = function (value, lastValue, name, isArgument) {
            if (lastValue && can.isFunction(lastValue[name]) && isArgument) {
                if (lastValue[name].isComputed) {
                    return lastValue[name];
                }

                // Don't execute functions if they are parameters for a helper and are not a can.compute
                // Need to bind it to the original context so that that information doesn't get lost by the helper
                return function () {
                    return lastValue[name].apply(lastValue, arguments);
                };
            } else if (lastValue && can.isFunction(lastValue) && lastValue.isComputed) {
                return lastValue()[name];
            } else if (lastValue && can.isFunction(lastValue[name])) {
                return lastValue[name]();
            } else if (isObserve(value) && isArrayLike(value) && value.attr('length')) {
                return value;
            } else if (lastValue && isObserve(lastValue)) {
                return lastValue.compute(name);
            } else if (can.isFunction(value)) {
                return value();
            } else {
                return value;
            }
        };

        // ## Helpers
        // Helpers are functions that can be called from within a template.
        // These helpers differ from the scanner helpers in that they execute
        // at runtime instead of during compilation.
        // Custom helpers can be added via `can.Mustache.registerHelper`,
        // but there are also some built-in helpers included by default.
        // Most of the built-in helpers are little more than aliases to actions
        // that the base version of Mustache simply implies based on the
        // passed in object.
        // Built-in helpers:
        // * `data` - `data` is a special helper that is implemented via scanning helpers.
        //		It hooks up the active element to the active data object: `<div {{data "key"}} />`
        // * `if` - Renders a truthy section: `{{#if var}} render {{/if}}`
        // * `unless` - Renders a falsey section: `{{#unless var}} render {{/unless}}`
        // * `each` - Renders an array: `{{#each array}} render {{this}} {{/each}}`
        // * `with` - Opens a context section: `{{#with var}} render {{/with}}`
        Mustache._helpers = {};

        Mustache.registerHelper = function (name, fn) {
            this._helpers[name] = {
                name: name,
                fn: fn
            };
        };

        Mustache.getHelper = function (name, options) {
            return options && options.helpers && options.helpers[name] && {
                fn: options.helpers[name]
            } || this._helpers[name];
            for (var i = 0, helper; helper = [i]; i++) {
                if (helper.name == name) {
                    return helper;
                }
            }
            return null;
        };

        Mustache.render = function (partial, context) {
            if (!can.view.cached[partial] && context[partial]) {
                partial = context[partial];
            }

            // Call into `can.view.render` passing the
            // partial and context.
            return can.view.render(partial, context);
        };

        Mustache.renderPartial = function (partial, context, options) {
            return partial.render ? partial.render(context, options) : partial(context, options);
        };

        // The built-in Mustache helpers.
        can.each({
            // Implements the `if` built-in helper.
            'if': function (expr, options) {
                if (!!Mustache.resolve(expr)) {
                    return options.fn(options.contexts || this);
                } else {
                    return options.inverse(options.contexts || this);
                }
            },
            // Implements the `unless` built-in helper.
            'unless': function (expr, options) {
                if (!Mustache.resolve(expr)) {
                    return options.fn(options.contexts || this);
                }
            },
            // Implements the `each` built-in helper.
            'each': function (expr, options) {
                expr = Mustache.resolve(expr);
                if (!!expr && isArrayLike(expr)) {
                    if (isObserve(expr) && typeof expr.attr('length') !== 'undefined') {
                        return can.view.lists && can.view.lists(expr, function (item) {
                            return options.fn(item);
                        });
                    } else {
                        var result = [];
                        for (var i = 0; i < expr.length; i++) {
                            result.push(options.fn(expr[i]));
                        }
                        return result.join('');
                    }
                }
            },
            // Implements the `with` built-in helper.
            'with': function (expr, options) {
                var ctx = expr;
                expr = Mustache.resolve(expr);
                if (!!expr) {
                    return options.fn(ctx);
                }
            }
        }, function (fn, name) {
            Mustache.registerHelper(name, fn);
        });

        // ## Registration
        // Registers Mustache with can.view.
        can.view.register({
            suffix: "mustache",
            contentType: "x-mustache-template",
            // Returns a `function` that renders the view.
            script: function (id, src) {
                return "can.Mustache(function(_CONTEXT,_VIEW) { " + new Mustache({
                    text: src,
                    name: id
                }).template.out + " })";
            },
            renderer: function (id, text) {
                return Mustache({
                    text: text,
                    name: id
                });
            }
        });

        return can;
    })(__m3, __m15, __m21, __m13, __m23);

    window['can'] = __m4;
})();
