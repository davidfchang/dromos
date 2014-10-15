//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Deps = Package.deps.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

/* Package-scope variables */
var RouteController, Route, Router, IronLocation, Utils, IronRouter, WaitList, paramParts, href, setState, added;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/utils.js                                                                  //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
/**                                                                                                   // 1
 * Utility methods available privately to the package.                                                // 2
 */                                                                                                   // 3
                                                                                                      // 4
Utils = {};                                                                                           // 5
                                                                                                      // 6
/**                                                                                                   // 7
 * global object on node or window object in the browser.                                             // 8
 */                                                                                                   // 9
                                                                                                      // 10
Utils.global = (function () { return this; })();                                                      // 11
                                                                                                      // 12
/**                                                                                                   // 13
 * deprecatation notice to the user which can be a string or object                                   // 14
 * of the form:                                                                                       // 15
 *                                                                                                    // 16
 * {                                                                                                  // 17
 *  name: 'somePropertyOrMethod',                                                                     // 18
 *  where: 'RouteController',                                                                         // 19
 *  instead: 'someOtherPropertyOrMethod',                                                             // 20
 *  message: ':name is deprecated. Please use :instead instead'                                       // 21
 * }                                                                                                  // 22
 */                                                                                                   // 23
Utils.notifyDeprecated = function (info) {                                                            // 24
  var name;                                                                                           // 25
  var instead;                                                                                        // 26
  var message;                                                                                        // 27
  var where;                                                                                          // 28
  var defaultMessage = "[:where] ':name' is deprecated. Please use ':instead' instead.";              // 29
                                                                                                      // 30
  if (_.isObject(info)) {                                                                             // 31
    name = info.name;                                                                                 // 32
    instead = info.instead;                                                                           // 33
    message = info.message || defaultMessage;                                                         // 34
    where = info.where;                                                                               // 35
  } else {                                                                                            // 36
    message = info;                                                                                   // 37
    name = '';                                                                                        // 38
    instead = '';                                                                                     // 39
    where = '';                                                                                       // 40
  }                                                                                                   // 41
                                                                                                      // 42
  if (typeof console !== 'undefined' && console.warn) {                                               // 43
    console.warn(                                                                                     // 44
      '<deprecated> ' +                                                                               // 45
      message                                                                                         // 46
      .replace(':name', name)                                                                         // 47
      .replace(':instead', instead)                                                                   // 48
      .replace(':where', where)                                                                       // 49
    );                                                                                                // 50
  }                                                                                                   // 51
};                                                                                                    // 52
                                                                                                      // 53
Utils.withDeprecatedNotice = function (info, fn, thisArg) {                                           // 54
  return function () {                                                                                // 55
    Utils.notifyDeprecated(info);                                                                     // 56
    return fn && fn.apply(thisArg || this, arguments);                                                // 57
  };                                                                                                  // 58
};                                                                                                    // 59
                                                                                                      // 60
/**                                                                                                   // 61
 * Given the name of a property, resolves to the value. Works with namespacing                        // 62
 * too. If first parameter is already a value that isn't a string it's returned                       // 63
 * immediately.                                                                                       // 64
 *                                                                                                    // 65
 * Examples:                                                                                          // 66
 *  'SomeClass' => window.SomeClass || global.someClass                                               // 67
 *  'App.namespace.SomeClass' => window.App.namespace.SomeClass                                       // 68
 *                                                                                                    // 69
 * @param {String|Object} nameOrValue                                                                 // 70
 */                                                                                                   // 71
                                                                                                      // 72
Utils.resolveValue = function (nameOrValue) {                                                         // 73
  var global = Utils.global;                                                                          // 74
  var parts;                                                                                          // 75
  var ptr;                                                                                            // 76
                                                                                                      // 77
  if (_.isString(nameOrValue)) {                                                                      // 78
    parts = nameOrValue.split('.')                                                                    // 79
    ptr = global;                                                                                     // 80
    for (var i = 0; i < parts.length; i++) {                                                          // 81
      ptr = ptr[parts[i]];                                                                            // 82
      if (!ptr)                                                                                       // 83
        return undefined;                                                                             // 84
    }                                                                                                 // 85
  } else {                                                                                            // 86
    ptr = nameOrValue;                                                                                // 87
  }                                                                                                   // 88
                                                                                                      // 89
  // final position of ptr should be the resolved value                                               // 90
  return ptr;                                                                                         // 91
};                                                                                                    // 92
                                                                                                      // 93
Utils.hasOwnProperty = function (obj, key) {                                                          // 94
  var prop = {}.hasOwnProperty;                                                                       // 95
  return prop.call(obj, key);                                                                         // 96
};                                                                                                    // 97
                                                                                                      // 98
/**                                                                                                   // 99
 * Don't mess with this function. It's exactly the same as the compiled                               // 100
 * coffeescript mechanism. If you change it we can't guarantee that our code                          // 101
 * will work when used with Coffeescript. One exception is putting in a runtime                       // 102
 * check that both child and parent are of type Function.                                             // 103
 */                                                                                                   // 104
                                                                                                      // 105
Utils.inherits = function (child, parent) {                                                           // 106
  if (Utils.typeOf(child) !== '[object Function]')                                                    // 107
    throw new Error('First parameter to Utils.inherits must be a function');                          // 108
                                                                                                      // 109
  if (Utils.typeOf(parent) !== '[object Function]')                                                   // 110
    throw new Error('Second parameter to Utils.inherits must be a function');                         // 111
                                                                                                      // 112
  for (var key in parent) {                                                                           // 113
    if (Utils.hasOwnProperty(parent, key))                                                            // 114
      child[key] = parent[key];                                                                       // 115
  }                                                                                                   // 116
                                                                                                      // 117
  function ctor () {                                                                                  // 118
    this.constructor = child;                                                                         // 119
  }                                                                                                   // 120
                                                                                                      // 121
  ctor.prototype = parent.prototype;                                                                  // 122
  child.prototype = new ctor();                                                                       // 123
  child.__super__ = parent.prototype;                                                                 // 124
  return child;                                                                                       // 125
};                                                                                                    // 126
                                                                                                      // 127
Utils.toArray = function (obj) {                                                                      // 128
  if (!obj)                                                                                           // 129
    return [];                                                                                        // 130
  else if (Utils.typeOf(obj) !== '[object Array]')                                                    // 131
    return [obj];                                                                                     // 132
  else                                                                                                // 133
    return obj;                                                                                       // 134
};                                                                                                    // 135
                                                                                                      // 136
Utils.typeOf = function (obj) {                                                                       // 137
  if (obj && obj.typeName)                                                                            // 138
    return obj.typeName;                                                                              // 139
  else                                                                                                // 140
    return Object.prototype.toString.call(obj);                                                       // 141
};                                                                                                    // 142
                                                                                                      // 143
Utils.extend = function (Super, definition, onBeforeExtendPrototype) {                                // 144
  if (arguments.length === 1)                                                                         // 145
    definition = Super;                                                                               // 146
  else {                                                                                              // 147
    definition = definition || {};                                                                    // 148
    definition.extend = Super;                                                                        // 149
  }                                                                                                   // 150
                                                                                                      // 151
  return Utils.create(definition, {                                                                   // 152
    onBeforeExtendPrototype: onBeforeExtendPrototype                                                  // 153
  });                                                                                                 // 154
};                                                                                                    // 155
                                                                                                      // 156
Utils.create = function (definition, options) {                                                       // 157
  var Constructor                                                                                     // 158
    , extendFrom                                                                                      // 159
    , savedPrototype;                                                                                 // 160
                                                                                                      // 161
  options = options || {};                                                                            // 162
  definition = definition || {};                                                                      // 163
                                                                                                      // 164
  if (Utils.hasOwnProperty(definition, 'constructor'))                                                // 165
    Constructor = definition.constructor;                                                             // 166
  else {                                                                                              // 167
    Constructor = function () {                                                                       // 168
      if (Constructor.__super__ && Constructor.__super__.constructor)                                 // 169
        return Constructor.__super__.constructor.apply(this, arguments);                              // 170
    }                                                                                                 // 171
  }                                                                                                   // 172
                                                                                                      // 173
  extendFrom = definition.extend;                                                                     // 174
                                                                                                      // 175
  if (definition.extend) delete definition.extend;                                                    // 176
                                                                                                      // 177
  var inherit = function (Child, Super, prototype) {                                                  // 178
    Utils.inherits(Child, Utils.resolveValue(Super));                                                 // 179
    if (prototype) _.extend(Child.prototype, prototype);                                              // 180
  };                                                                                                  // 181
                                                                                                      // 182
  if (extendFrom) {                                                                                   // 183
    inherit(Constructor, extendFrom);                                                                 // 184
  }                                                                                                   // 185
                                                                                                      // 186
  if (options.onBeforeExtendPrototype)                                                                // 187
    options.onBeforeExtendPrototype.call(Constructor, definition);                                    // 188
                                                                                                      // 189
  _.extend(Constructor.prototype, definition);                                                        // 190
                                                                                                      // 191
  return Constructor;                                                                                 // 192
};                                                                                                    // 193
                                                                                                      // 194
/**                                                                                                   // 195
 * Assert that the given condition is truthy.                                                         // 196
 *                                                                                                    // 197
 * @param {Boolean} condition The boolean condition to test for truthiness.                           // 198
 * @param {String} msg The error message to show if the condition is falsy.                           // 199
 */                                                                                                   // 200
                                                                                                      // 201
Utils.assert = function (condition, msg) {                                                            // 202
  if (!condition)                                                                                     // 203
    throw new Error(msg);                                                                             // 204
};                                                                                                    // 205
                                                                                                      // 206
Utils.warn = function (condition, msg) {                                                              // 207
  if (!condition)                                                                                     // 208
    console && console.warn && console.warn(msg);                                                     // 209
};                                                                                                    // 210
                                                                                                      // 211
Utils.capitalize = function (str) {                                                                   // 212
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);                                      // 213
};                                                                                                    // 214
                                                                                                      // 215
Utils.upperCamelCase = function (str) {                                                               // 216
  var re = /_|-|\./;                                                                                  // 217
                                                                                                      // 218
  if (!str)                                                                                           // 219
    return '';                                                                                        // 220
                                                                                                      // 221
  return _.map(str.split(re), function (word) {                                                       // 222
    return Utils.capitalize(word);                                                                    // 223
  }).join('');                                                                                        // 224
};                                                                                                    // 225
                                                                                                      // 226
Utils.camelCase = function (str) {                                                                    // 227
  var output = Utils.upperCamelCase(str);                                                             // 228
  output = output.charAt(0).toLowerCase() + output.slice(1, output.length);                           // 229
  return output;                                                                                      // 230
};                                                                                                    // 231
                                                                                                      // 232
Utils.pick = function (/* args */) {                                                                  // 233
  var args = _.toArray(arguments)                                                                     // 234
    , arg;                                                                                            // 235
  for (var i = 0; i < args.length; i++) {                                                             // 236
    arg = args[i];                                                                                    // 237
    if (typeof arg !== 'undefined' && arg !== null)                                                   // 238
      return arg;                                                                                     // 239
  }                                                                                                   // 240
                                                                                                      // 241
  return null;                                                                                        // 242
};                                                                                                    // 243
                                                                                                      // 244
Utils.StringConverters = {                                                                            // 245
  'none': function(input) {                                                                           // 246
    return input;                                                                                     // 247
  },                                                                                                  // 248
                                                                                                      // 249
  'upperCamelCase': function (input) {                                                                // 250
    return Utils.upperCamelCase(input);                                                               // 251
  },                                                                                                  // 252
                                                                                                      // 253
  'camelCase': function (input) {                                                                     // 254
    return Utils.camelCase(input);                                                                    // 255
  }                                                                                                   // 256
};                                                                                                    // 257
                                                                                                      // 258
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/route.js                                                                  //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
/*                                                                                                    // 1
 * Inspiration and some code for the compilation of routes comes from pagejs.                         // 2
 * The original has been modified to better handle hash fragments, and to store                       // 3
 * the regular expression on the Route instance. Also, the resolve method has                         // 4
 * been added to return a resolved path given a parameters object.                                    // 5
 */                                                                                                   // 6
                                                                                                      // 7
Route = function (router, name, options) {                                                            // 8
  var path;                                                                                           // 9
                                                                                                      // 10
  Utils.assert(router instanceof IronRouter);                                                         // 11
                                                                                                      // 12
  Utils.assert(_.isString(name),                                                                      // 13
    'Route constructor requires a name as the second parameter');                                     // 14
                                                                                                      // 15
  if (_.isFunction(options))                                                                          // 16
    options = { handler: options };                                                                   // 17
                                                                                                      // 18
  options = this.options = options || {};                                                             // 19
  path = options.path || ('/' + name);                                                                // 20
                                                                                                      // 21
  this.router = router;                                                                               // 22
  this.originalPath = path;                                                                           // 23
                                                                                                      // 24
  if (_.isString(this.originalPath) && this.originalPath.charAt(0) !== '/')                           // 25
    this.originalPath = '/' + this.originalPath;                                                      // 26
                                                                                                      // 27
  this.name = name;                                                                                   // 28
  this.where = options.where || 'client';                                                             // 29
  this.controller = options.controller;                                                               // 30
  this.action = options.action;                                                                       // 31
                                                                                                      // 32
  if (typeof options.reactive !== 'undefined')                                                        // 33
    this.isReactive = options.reactive;                                                               // 34
  else                                                                                                // 35
    this.isReactive = true;                                                                           // 36
                                                                                                      // 37
  this.compile();                                                                                     // 38
};                                                                                                    // 39
                                                                                                      // 40
Route.prototype = {                                                                                   // 41
  constructor: Route,                                                                                 // 42
                                                                                                      // 43
  /**                                                                                                 // 44
   * Compile the path.                                                                                // 45
   *                                                                                                  // 46
   *  @return {Route}                                                                                 // 47
   *  @api public                                                                                     // 48
   */                                                                                                 // 49
                                                                                                      // 50
  compile: function () {                                                                              // 51
    var self = this;                                                                                  // 52
    var path;                                                                                         // 53
    var options = self.options;                                                                       // 54
                                                                                                      // 55
    this.keys = [];                                                                                   // 56
                                                                                                      // 57
    if (self.originalPath instanceof RegExp) {                                                        // 58
      self.re = self.originalPath;                                                                    // 59
    } else {                                                                                          // 60
      path = self.originalPath                                                                        // 61
        .replace(/(.)\/$/, '$1')                                                                      // 62
        .concat(options.strict ? '' : '/?')                                                           // 63
        .replace(/\/\(/g, '(?:/')                                                                     // 64
        .replace(/#/, '/?#')                                                                          // 65
        .replace(                                                                                     // 66
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                     // 67
          function (match, slash, format, key, capture, optional){                                    // 68
            self.keys.push({ name: key, optional: !! optional });                                     // 69
            slash = slash || '';                                                                      // 70
            return ''                                                                                 // 71
              + (optional ? '' : slash)                                                               // 72
              + '(?:'                                                                                 // 73
              + (optional ? slash : '')                                                               // 74
              + (format || '')                                                                        // 75
              + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                              // 76
              + (optional || '');                                                                     // 77
          }                                                                                           // 78
        )                                                                                             // 79
        .replace(/([\/.])/g, '\\$1')                                                                  // 80
        .replace(/\*/g, '(.*)');                                                                      // 81
                                                                                                      // 82
      self.re = new RegExp('^' + path + '$', options.sensitive ? '' : 'i');                           // 83
    }                                                                                                 // 84
                                                                                                      // 85
    return this;                                                                                      // 86
  },                                                                                                  // 87
                                                                                                      // 88
  /**                                                                                                 // 89
   * Returns an array of parameters given a path. The array may have named                            // 90
   * properties in addition to indexed values.                                                        // 91
   *                                                                                                  // 92
   * @param {String} path                                                                             // 93
   * @return {Array}                                                                                  // 94
   * @api public                                                                                      // 95
   */                                                                                                 // 96
                                                                                                      // 97
  params: function (path) {                                                                           // 98
    if (!path)                                                                                        // 99
      return null;                                                                                    // 100
                                                                                                      // 101
    var params = [];                                                                                  // 102
    var m = this.exec(path);                                                                          // 103
    var queryString;                                                                                  // 104
    var keys = this.keys;                                                                             // 105
    var key;                                                                                          // 106
    var value;                                                                                        // 107
                                                                                                      // 108
    if (!m)                                                                                           // 109
      throw new Error('The route named "' + this.name + '" does not match the path "' + path + '"');  // 110
                                                                                                      // 111
    for (var i = 1, len = m.length; i < len; ++i) {                                                   // 112
      key = keys[i - 1];                                                                              // 113
      value = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i];                              // 114
      if (key) {                                                                                      // 115
        params[key.name] = params[key.name] !== undefined ?                                           // 116
          params[key.name] : value;                                                                   // 117
      } else                                                                                          // 118
        params.push(value);                                                                           // 119
    }                                                                                                 // 120
                                                                                                      // 121
    path = decodeURI(path);                                                                           // 122
                                                                                                      // 123
    queryString = path.split('?')[1];                                                                 // 124
    if (queryString)                                                                                  // 125
      queryString = queryString.split('#')[0];                                                        // 126
                                                                                                      // 127
    params.hash = path.split('#')[1];                                                                 // 128
                                                                                                      // 129
    if (queryString) {                                                                                // 130
      _.each(queryString.split('&'), function (paramString) {                                         // 131
        paramParts = paramString.split('=');                                                          // 132
        params[paramParts[0]] = decodeURIComponent(paramParts[1]);                                    // 133
      });                                                                                             // 134
    }                                                                                                 // 135
                                                                                                      // 136
    return params;                                                                                    // 137
  },                                                                                                  // 138
                                                                                                      // 139
  normalizePath: function (path) {                                                                    // 140
    var origin = Meteor.absoluteUrl();                                                                // 141
                                                                                                      // 142
    path = path.replace(origin, '');                                                                  // 143
                                                                                                      // 144
    var queryStringIndex = path.indexOf('?');                                                         // 145
    path = ~queryStringIndex ? path.slice(0, queryStringIndex) : path;                                // 146
                                                                                                      // 147
    var hashIndex = path.indexOf('#');                                                                // 148
    path = ~hashIndex ? path.slice(0, hashIndex) : path;                                              // 149
                                                                                                      // 150
    if (path.charAt(0) !== '/')                                                                       // 151
      path = '/' + path;                                                                              // 152
                                                                                                      // 153
    return path;                                                                                      // 154
  },                                                                                                  // 155
                                                                                                      // 156
  /**                                                                                                 // 157
   * Returns true if the path matches and false otherwise.                                            // 158
   *                                                                                                  // 159
   * @param {String} path                                                                             // 160
   * @return {Boolean}                                                                                // 161
   * @api public                                                                                      // 162
   */                                                                                                 // 163
  test: function (path) {                                                                             // 164
    return this.re.test(this.normalizePath(path));                                                    // 165
  },                                                                                                  // 166
                                                                                                      // 167
  exec: function (path) {                                                                             // 168
    return this.re.exec(this.normalizePath(path));                                                    // 169
  },                                                                                                  // 170
                                                                                                      // 171
  resolve: function (params, options) {                                                               // 172
    var value;                                                                                        // 173
    var isValueDefined;                                                                               // 174
    var result;                                                                                       // 175
    var wildCardCount = 0;                                                                            // 176
    var path = this.originalPath;                                                                     // 177
    var hash;                                                                                         // 178
    var query;                                                                                        // 179
    var isMissingParams = false;                                                                      // 180
                                                                                                      // 181
    options = options || {};                                                                          // 182
    params = params || [];                                                                            // 183
    query = options.query;                                                                            // 184
    hash = options.hash;                                                                              // 185
                                                                                                      // 186
    if (path instanceof RegExp) {                                                                     // 187
      throw new Error('Cannot currently resolve a regular expression path');                          // 188
    } else {                                                                                          // 189
      path = this.originalPath                                                                        // 190
        .replace(                                                                                     // 191
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                     // 192
          function (match, slash, format, key, capture, optional, offset) {                           // 193
            slash = slash || '';                                                                      // 194
            value = params[key];                                                                      // 195
            isValueDefined = typeof value !== 'undefined';                                            // 196
                                                                                                      // 197
            if (optional && !isValueDefined) {                                                        // 198
              value = '';                                                                             // 199
            } else if (!isValueDefined) {                                                             // 200
              isMissingParams = true;                                                                 // 201
              return;                                                                                 // 202
            }                                                                                         // 203
                                                                                                      // 204
            value = _.isFunction(value) ? value.call(params) : value;                                 // 205
            var escapedValue = _.map(String(value).split('/'), function (segment) {                   // 206
              return encodeURIComponent(segment);                                                     // 207
            }).join('/');                                                                             // 208
            return slash + escapedValue                                                               // 209
          }                                                                                           // 210
        )                                                                                             // 211
        .replace(                                                                                     // 212
          /\*/g,                                                                                      // 213
          function (match) {                                                                          // 214
            if (typeof params[wildCardCount] === 'undefined') {                                       // 215
              throw new Error(                                                                        // 216
                'You are trying to access a wild card parameter at index ' +                          // 217
                wildCardCount +                                                                       // 218
                ' but the value of params at that index is undefined');                               // 219
            }                                                                                         // 220
                                                                                                      // 221
            var paramValue = String(params[wildCardCount++]);                                         // 222
            return _.map(paramValue.split('/'), function (segment) {                                  // 223
              return encodeURIComponent(segment);                                                     // 224
            }).join('/');                                                                             // 225
          }                                                                                           // 226
        );                                                                                            // 227
                                                                                                      // 228
      if (_.isObject(query)) {                                                                        // 229
        query = _.map(_.pairs(query), function (queryPart) {                                          // 230
          return queryPart[0] + '=' + encodeURIComponent(queryPart[1]);                               // 231
        }).join('&');                                                                                 // 232
      }                                                                                               // 233
                                                                                                      // 234
      if (query && query.length)                                                                      // 235
        path = path + '?' + query;                                                                    // 236
                                                                                                      // 237
      if (hash) {                                                                                     // 238
        hash = encodeURI(hash.replace('#', ''));                                                      // 239
        path = query ?                                                                                // 240
          path + '#' + hash : path + '/#' + hash;                                                     // 241
      }                                                                                               // 242
    }                                                                                                 // 243
                                                                                                      // 244
    // Because of optional possibly empty segments we normalize path here                             // 245
    path = path.replace(/\/+/g, '/'); // Multiple / -> one /                                          // 246
    path = path.replace(/^(.+)\/$/g, '$1'); // Removal of trailing /                                  // 247
                                                                                                      // 248
    return isMissingParams ? null : path;                                                             // 249
  },                                                                                                  // 250
                                                                                                      // 251
  path: function (params, options) {                                                                  // 252
    return this.resolve(params, options);                                                             // 253
  },                                                                                                  // 254
                                                                                                      // 255
  url: function (params, options) {                                                                   // 256
    var path = this.path(params, options);                                                            // 257
    if (path[0] === '/')                                                                              // 258
      path = path.slice(1, path.length);                                                              // 259
    return Meteor.absoluteUrl() + path;                                                               // 260
  },                                                                                                  // 261
                                                                                                      // 262
  getController: function (path, options) {                                                           // 263
    var self = this;                                                                                  // 264
    var handler;                                                                                      // 265
    var controllerClass;                                                                              // 266
    var controller;                                                                                   // 267
    var action;                                                                                       // 268
    var routeName;                                                                                    // 269
                                                                                                      // 270
    var resolveValue = Utils.resolveValue;                                                            // 271
    var toArray = Utils.toArray;                                                                      // 272
                                                                                                      // 273
    var findController = function (name) {                                                            // 274
      var controller = resolveValue(name);                                                            // 275
      if (typeof controller === 'undefined') {                                                        // 276
        throw new Error(                                                                              // 277
          'controller "' + name + '" is not defined');                                                // 278
      }                                                                                               // 279
                                                                                                      // 280
      return controller;                                                                              // 281
    };                                                                                                // 282
                                                                                                      // 283
    options = _.extend({}, options, {                                                                 // 284
      path: path,                                                                                     // 285
      params: this.params(path),                                                                      // 286
      where: this.where,                                                                              // 287
      action: this.action                                                                             // 288
    });                                                                                               // 289
                                                                                                      // 290
    // case 1: controller option is defined on the route                                              // 291
    if (this.controller) {                                                                            // 292
      controllerClass = _.isString(this.controller) ?                                                 // 293
        findController(this.controller) : this.controller;                                            // 294
      controller = new controllerClass(this.router, this, options);                                   // 295
      return controller;                                                                              // 296
    }                                                                                                 // 297
                                                                                                      // 298
    // case 2: intelligently find the controller class in global namespace                            // 299
    routeName = this.name;                                                                            // 300
                                                                                                      // 301
    if (routeName) {                                                                                  // 302
      routeName = Router.convertRouteControllerName(routeName + 'Controller');                        // 303
      controllerClass = resolveValue(routeName);                                                      // 304
                                                                                                      // 305
      if (controllerClass) {                                                                          // 306
        controller = new controllerClass(this.router, this, options);                                 // 307
        return controller;                                                                            // 308
      }                                                                                               // 309
    }                                                                                                 // 310
                                                                                                      // 311
    // case 3: nothing found so create an anonymous controller                                        // 312
    return new RouteController(this.router, this, options);                                           // 313
  }                                                                                                   // 314
};                                                                                                    // 315
                                                                                                      // 316
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/route_controller.js                                                       //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var rewriteLegacyHooks = function (controller) {                                                      // 1
  var legacyToNew = {                                                                                 // 2
    'load': 'onRun',                                                                                  // 3
    'before': 'onBeforeAction',                                                                       // 4
    'after':'onAfterAction',                                                                          // 5
    'unload':'onStop'                                                                                 // 6
  };                                                                                                  // 7
                                                                                                      // 8
  _.each(legacyToNew, function (newHook, oldHook) {                                                   // 9
    var hasOld = false;                                                                               // 10
                                                                                                      // 11
    if (_.has(controller.options, oldHook)) {                                                         // 12
      hasOld = true;                                                                                  // 13
      controller.options[newHook] = controller.options[oldHook];                                      // 14
    }                                                                                                 // 15
                                                                                                      // 16
    // search on the object and the proto chain                                                       // 17
    if (typeof controller[oldHook] !== 'undefined') {                                                 // 18
      hasOld = true;                                                                                  // 19
      controller[newHook] = controller[oldHook];                                                      // 20
    }                                                                                                 // 21
                                                                                                      // 22
    if (hasOld) {                                                                                     // 23
      Utils.notifyDeprecated({                                                                        // 24
        where: 'RouteController',                                                                     // 25
        name: oldHook,                                                                                // 26
        instead: newHook                                                                              // 27
      });                                                                                             // 28
    }                                                                                                 // 29
  });                                                                                                 // 30
};                                                                                                    // 31
                                                                                                      // 32
RouteController = function (router, route, options) {                                                 // 33
  var self = this;                                                                                    // 34
                                                                                                      // 35
  if (!(router instanceof IronRouter))                                                                // 36
    throw new Error('RouteController requires a router');                                             // 37
                                                                                                      // 38
  if (!(route instanceof Route))                                                                      // 39
    throw new Error('RouteController requires a route');                                              // 40
                                                                                                      // 41
  options = this.options = options || {};                                                             // 42
                                                                                                      // 43
  this.router = router;                                                                               // 44
  this.route = route;                                                                                 // 45
                                                                                                      // 46
  this.path = options.path || '';                                                                     // 47
  this.params = options.params || [];                                                                 // 48
  this.where = options.where || 'client';                                                             // 49
  this.action = options.action || this.action;                                                        // 50
                                                                                                      // 51
  rewriteLegacyHooks(this);                                                                           // 52
};                                                                                                    // 53
                                                                                                      // 54
RouteController.prototype = {                                                                         // 55
  constructor: RouteController,                                                                       // 56
                                                                                                      // 57
  /**                                                                                                 // 58
   * Returns the value of a property, searching for the property in this lookup                       // 59
   * order:                                                                                           // 60
   *                                                                                                  // 61
   *   1. RouteController options                                                                     // 62
   *   2. RouteController prototype                                                                   // 63
   *   3. Route options                                                                               // 64
   *   4. Router options                                                                              // 65
   */                                                                                                 // 66
  lookupProperty: function (key) {                                                                    // 67
    var value;                                                                                        // 68
                                                                                                      // 69
    if (!_.isString(key))                                                                             // 70
      throw new Error('key must be a string');                                                        // 71
                                                                                                      // 72
    // 1. RouteController options                                                                     // 73
    if (typeof (value = this.options[key]) !== 'undefined')                                           // 74
      return value;                                                                                   // 75
                                                                                                      // 76
    // 2. RouteController instance                                                                    // 77
    if (typeof (value = this[key]) !== 'undefined')                                                   // 78
      return value;                                                                                   // 79
                                                                                                      // 80
    var opts;                                                                                         // 81
                                                                                                      // 82
    // 3. Route options                                                                               // 83
    opts = this.route.options;                                                                        // 84
    if (opts && typeof (value = opts[key]) !== 'undefined')                                           // 85
      return value;                                                                                   // 86
                                                                                                      // 87
    // 4. Router options                                                                              // 88
    opts = this.router.options;                                                                       // 89
    if (opts && typeof (value = opts[key]) !== 'undefined')                                           // 90
      return value;                                                                                   // 91
                                                                                                      // 92
    // 5. Oops couldn't find property                                                                 // 93
    return undefined;                                                                                 // 94
  },                                                                                                  // 95
                                                                                                      // 96
  runHooks: function (hookName, more, cb) {                                                           // 97
    var self = this;                                                                                  // 98
    var ctor = this.constructor;                                                                      // 99
                                                                                                      // 100
    if (!_.isString(hookName))                                                                        // 101
      throw new Error('hookName must be a string');                                                   // 102
                                                                                                      // 103
    if (more && !_.isArray(more))                                                                     // 104
      throw new Error('more must be an array of functions');                                          // 105
                                                                                                      // 106
    var isPaused = false;                                                                             // 107
                                                                                                      // 108
    var lookupHook = function (nameOrFn) {                                                            // 109
      var fn = nameOrFn;                                                                              // 110
                                                                                                      // 111
      // if we already have a func just return it                                                     // 112
      if (_.isFunction(fn))                                                                           // 113
        return fn;                                                                                    // 114
                                                                                                      // 115
      // look up one of the out-of-box hooks like                                                     // 116
      // 'loaded or 'dataNotFound' if the nameOrFn is a                                               // 117
      // string                                                                                       // 118
      if (_.isString(fn)) {                                                                           // 119
        if (_.isFunction(Router.hooks[fn]))                                                           // 120
          return Router.hooks[fn];                                                                    // 121
      }                                                                                               // 122
                                                                                                      // 123
      // we couldn't find it so throw an error                                                        // 124
      throw new Error("No hook found named: ", nameOrFn);                                             // 125
    };                                                                                                // 126
                                                                                                      // 127
    // concatenate together hook arrays from the inheritance                                          // 128
    // heirarchy, starting at the top parent down to the child.                                       // 129
    var collectInheritedHooks = function (ctor) {                                                     // 130
      var hooks = [];                                                                                 // 131
                                                                                                      // 132
      if (ctor.__super__)                                                                             // 133
        hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor));                      // 134
                                                                                                      // 135
      return Utils.hasOwnProperty(ctor.prototype, hookName) ?                                         // 136
        hooks.concat(ctor.prototype[hookName]) : hooks;                                               // 137
    };                                                                                                // 138
                                                                                                      // 139
                                                                                                      // 140
    // get a list of hooks to run in the following order:                                             // 141
    // 1. RouteController option hooks                                                                // 142
    // 2. RouteController proto hooks (including inherited super to child)                            // 143
    // 3. RouteController object hooks                                                                // 144
    // 4. Router global hooks                                                                         // 145
    // 5. Route option hooks                                                                          // 146
    // 6. more                                                                                        // 147
                                                                                                      // 148
    var toArray = Utils.toArray;                                                                      // 149
    var routerHooks = this.router.getHooks(hookName, this.route.name);                                // 150
                                                                                                      // 151
    var opts;                                                                                         // 152
    opts = this.route.options;                                                                        // 153
    var routeOptionHooks = toArray(opts && opts[hookName]);                                           // 154
                                                                                                      // 155
    opts = this.options;                                                                              // 156
    var optionHooks = toArray(opts && opts[hookName]);                                                // 157
                                                                                                      // 158
    var protoHooks = collectInheritedHooks(this.constructor);                                         // 159
                                                                                                      // 160
    var objectHooks;                                                                                  // 161
    // don't accidentally grab the prototype hooks!                                                   // 162
    // this makes sure the hook is on the object itself                                               // 163
    // not on its constructor's prototype object.                                                     // 164
    if (_.has(this, hookName))                                                                        // 165
      objectHooks = toArray(this[hookName])                                                           // 166
    else                                                                                              // 167
      objectHooks = [];                                                                               // 168
                                                                                                      // 169
    var allHooks = optionHooks                                                                        // 170
      .concat(protoHooks)                                                                             // 171
      .concat(objectHooks)                                                                            // 172
      .concat(routeOptionHooks)                                                                       // 173
      .concat(routerHooks)                                                                            // 174
      .concat(more);                                                                                  // 175
                                                                                                      // 176
    var isPaused = false;                                                                             // 177
    var pauseFn = function () {                                                                       // 178
      isPaused = true;                                                                                // 179
    };                                                                                                // 180
                                                                                                      // 181
    for (var i = 0, hook; hook = allHooks[i]; i++) {                                                  // 182
      var hookFn = lookupHook(hook);                                                                  // 183
                                                                                                      // 184
      if (!isPaused && !this.isStopped)                                                               // 185
        hookFn.call(self, pauseFn, i);                                                                // 186
    }                                                                                                 // 187
                                                                                                      // 188
    cb && cb.call(self, isPaused);                                                                    // 189
    return isPaused;                                                                                  // 190
  },                                                                                                  // 191
                                                                                                      // 192
  action: function () {                                                                               // 193
    throw new Error('not implemented');                                                               // 194
  },                                                                                                  // 195
                                                                                                      // 196
  stop: function (cb) {                                                                               // 197
    return this._stopController(cb);                                                                  // 198
  },                                                                                                  // 199
                                                                                                      // 200
  _stopController: function (cb) {                                                                    // 201
    var self = this;                                                                                  // 202
                                                                                                      // 203
    if (this.isStopped)                                                                               // 204
      return;                                                                                         // 205
                                                                                                      // 206
    self.isRunning = false;                                                                           // 207
    self.runHooks('onStop');                                                                          // 208
    self.isStopped = true;                                                                            // 209
    cb && cb.call(self);                                                                              // 210
  },                                                                                                  // 211
                                                                                                      // 212
  _run: function () {                                                                                 // 213
    throw new Error('not implemented');                                                               // 214
  }                                                                                                   // 215
};                                                                                                    // 216
                                                                                                      // 217
_.extend(RouteController, {                                                                           // 218
  /**                                                                                                 // 219
   * Inherit from RouteController                                                                     // 220
   *                                                                                                  // 221
   * @param {Object} definition Prototype properties for inherited class.                             // 222
   */                                                                                                 // 223
                                                                                                      // 224
  extend: function (definition) {                                                                     // 225
    return Utils.extend(this, definition, function (definition) {                                     // 226
      var klass = this;                                                                               // 227
                                                                                                      // 228
      /*                                                                                              // 229
        Allow calling a class method from javascript, directly in the subclass                        // 230
        definition.                                                                                   // 231
                                                                                                      // 232
        Instead of this:                                                                              // 233
          MyController = RouteController.extend({...});                                               // 234
          MyController.before(function () {});                                                        // 235
                                                                                                      // 236
        You can do:                                                                                   // 237
          MyController = RouteController.extend({                                                     // 238
            before: function () {}                                                                    // 239
          });                                                                                         // 240
                                                                                                      // 241
        And in Coffeescript you can do:                                                               // 242
         MyController extends RouteController                                                         // 243
           @before function () {}                                                                     // 244
       */                                                                                             // 245
    });                                                                                               // 246
  }                                                                                                   // 247
});                                                                                                   // 248
                                                                                                      // 249
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/router.js                                                                 //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
IronRouter = function (options) {                                                                     // 1
  var self = this;                                                                                    // 2
                                                                                                      // 3
  this.configure(options);                                                                            // 4
                                                                                                      // 5
  /**                                                                                                 // 6
   * The routes array which doubles as a named route index by adding                                  // 7
   * properties to the array.                                                                         // 8
   *                                                                                                  // 9
   * @api public                                                                                      // 10
   */                                                                                                 // 11
  this.routes = [];                                                                                   // 12
                                                                                                      // 13
  /**                                                                                                 // 14
   * Default name conversions for controller                                                          // 15
   * and template lookup.                                                                             // 16
   */                                                                                                 // 17
  this._nameConverters = {};                                                                          // 18
  this.setNameConverter('Template', 'none');                                                          // 19
  this.setNameConverter('RouteController', 'upperCamelCase');                                         // 20
                                                                                                      // 21
  this._globalHooks = {};                                                                             // 22
  _.each(IronRouter.HOOK_TYPES, function (type) {                                                     // 23
    self._globalHooks[type] = [];                                                                     // 24
                                                                                                      // 25
    // example:                                                                                       // 26
    //  self.onRun = function (hook, options) {                                                       // 27
    //    return self.addHook('onRun', hook, options);                                                // 28
    //  };                                                                                            // 29
    self[type] = function (hook, options) {                                                           // 30
      return self.addHook(type, hook, options);                                                       // 31
    };                                                                                                // 32
  });                                                                                                 // 33
                                                                                                      // 34
  _.each(IronRouter.LEGACY_HOOK_TYPES, function (type, legacyType) {                                  // 35
    self[legacyType] = function () {                                                                  // 36
      Utils.notifyDeprecated({                                                                        // 37
        where: 'Router',                                                                              // 38
        name: legacyType,                                                                             // 39
        instead: type                                                                                 // 40
      });                                                                                             // 41
                                                                                                      // 42
      return self[type].apply(this, arguments);                                                       // 43
    }                                                                                                 // 44
  });                                                                                                 // 45
};                                                                                                    // 46
                                                                                                      // 47
IronRouter.HOOK_TYPES = [                                                                             // 48
  'onRun',                                                                                            // 49
  'onData',                                                                                           // 50
  'onBeforeAction',                                                                                   // 51
  'onAfterAction',                                                                                    // 52
  'onStop',                                                                                           // 53
                                                                                                      // 54
  // not technically a hook but we'll use it                                                          // 55
  // in a similar way. This will cause waitOn                                                         // 56
  // to be added as a method to the Router and then                                                   // 57
  // it can be selectively applied to specific routes                                                 // 58
  'waitOn'                                                                                            // 59
];                                                                                                    // 60
                                                                                                      // 61
IronRouter.LEGACY_HOOK_TYPES = {                                                                      // 62
  'load': 'onRun',                                                                                    // 63
  'before': 'onBeforeAction',                                                                         // 64
  'after': 'onAfterAction',                                                                           // 65
  'unload': 'onStop'                                                                                  // 66
};                                                                                                    // 67
                                                                                                      // 68
IronRouter.prototype = {                                                                              // 69
  constructor: IronRouter,                                                                            // 70
                                                                                                      // 71
  /**                                                                                                 // 72
   * Configure instance with options. This can be called at any time. If the                          // 73
   * instance options object hasn't been created yet it is created here.                              // 74
   *                                                                                                  // 75
   * @param {Object} options                                                                          // 76
   * @return {IronRouter}                                                                             // 77
   * @api public                                                                                      // 78
   */                                                                                                 // 79
                                                                                                      // 80
  configure: function (options) {                                                                     // 81
    var self = this;                                                                                  // 82
                                                                                                      // 83
    options = options || {};                                                                          // 84
    this.options = this.options || {};                                                                // 85
    _.extend(this.options, options);                                                                  // 86
                                                                                                      // 87
    // e.g. before: fn OR before: [fn1, fn2]                                                          // 88
    _.each(IronRouter.HOOK_TYPES, function(type) {                                                    // 89
      if (self.options[type]) {                                                                       // 90
        _.each(Utils.toArray(self.options[type]), function(hook) {                                    // 91
          self.addHook(type, hook);                                                                   // 92
        });                                                                                           // 93
                                                                                                      // 94
        delete self.options[type];                                                                    // 95
      }                                                                                               // 96
    });                                                                                               // 97
                                                                                                      // 98
    _.each(IronRouter.LEGACY_HOOK_TYPES, function(type, legacyType) {                                 // 99
      if (self.options[legacyType]) {                                                                 // 100
        // XXX: warning?                                                                              // 101
        _.each(Utils.toArray(self.options[legacyType]), function(hook) {                              // 102
          self.addHook(type, hook);                                                                   // 103
        });                                                                                           // 104
                                                                                                      // 105
        delete self.options[legacyType];                                                              // 106
      }                                                                                               // 107
    });                                                                                               // 108
                                                                                                      // 109
    if (options.templateNameConverter)                                                                // 110
      this.setNameConverter('Template', options.templateNameConverter);                               // 111
                                                                                                      // 112
    if (options.routeControllerNameConverter)                                                         // 113
      this.setNameConverter('RouteController', options.routeControllerNameConverter);                 // 114
                                                                                                      // 115
    return this;                                                                                      // 116
  },                                                                                                  // 117
                                                                                                      // 118
  convertTemplateName: function (input) {                                                             // 119
    var converter = this._nameConverters['Template'];                                                 // 120
    if (!converter)                                                                                   // 121
      throw new Error('No name converter found for Template');                                        // 122
    return converter(input);                                                                          // 123
  },                                                                                                  // 124
                                                                                                      // 125
  convertRouteControllerName: function (input) {                                                      // 126
    var converter = this._nameConverters['RouteController'];                                          // 127
    if (!converter)                                                                                   // 128
      throw new Error('No name converter found for RouteController');                                 // 129
    return converter(input);                                                                          // 130
  },                                                                                                  // 131
                                                                                                      // 132
  setNameConverter: function (key, stringOrFunc) {                                                    // 133
    var converter;                                                                                    // 134
                                                                                                      // 135
    if (_.isFunction(stringOrFunc))                                                                   // 136
      converter = stringOrFunc;                                                                       // 137
                                                                                                      // 138
    if (_.isString(stringOrFunc))                                                                     // 139
      converter = Utils.StringConverters[stringOrFunc];                                               // 140
                                                                                                      // 141
    if (!converter) {                                                                                 // 142
      throw new Error('No converter found named: ' + stringOrFunc);                                   // 143
    }                                                                                                 // 144
                                                                                                      // 145
    this._nameConverters[key] = converter;                                                            // 146
    return this;                                                                                      // 147
  },                                                                                                  // 148
                                                                                                      // 149
  /**                                                                                                 // 150
   *                                                                                                  // 151
   * Add a hook to all routes. The hooks will apply to all routes,                                    // 152
   * unless you name routes to include or exclude via `only` and `except` options                     // 153
   *                                                                                                  // 154
   * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                              // 155
   * @param {Object} [options] Options to controll the hooks [optional]                               // 156
   * @param {Function} [hook] Callback to run                                                         // 157
   * @return {IronRouter}                                                                             // 158
   * @api public                                                                                      // 159
   *                                                                                                  // 160
   */                                                                                                 // 161
                                                                                                      // 162
  addHook: function(type, hook, options) {                                                            // 163
    options = options || {}                                                                           // 164
                                                                                                      // 165
    if (options.only)                                                                                 // 166
      options.only = Utils.toArray(options.only);                                                     // 167
    if (options.except)                                                                               // 168
      options.except = Utils.toArray(options.except);                                                 // 169
                                                                                                      // 170
    this._globalHooks[type].push({options: options, hook: hook});                                     // 171
                                                                                                      // 172
    return this;                                                                                      // 173
  },                                                                                                  // 174
                                                                                                      // 175
  /**                                                                                                 // 176
   *                                                                                                  // 177
   * Fetch the list of global hooks that apply to the given route name.                               // 178
   * Hooks are defined by the .addHook() function above.                                              // 179
   *                                                                                                  // 180
   * @param {String} [type] one of IronRouter.HOOK_TYPES                                              // 181
   * @param {String} [name] the name of the route we are interested in                                // 182
   * @return {[Function]} [hooks] an array of hooks to run                                            // 183
   * @api public                                                                                      // 184
   *                                                                                                  // 185
   */                                                                                                 // 186
                                                                                                      // 187
  getHooks: function(type, name) {                                                                    // 188
    var hooks = [];                                                                                   // 189
                                                                                                      // 190
    _.each(this._globalHooks[type], function(hook) {                                                  // 191
      var options = hook.options;                                                                     // 192
                                                                                                      // 193
      if (options.except && _.include(options.except, name))                                          // 194
        return;                                                                                       // 195
                                                                                                      // 196
      if (options.only && ! _.include(options.only, name))                                            // 197
        return;                                                                                       // 198
                                                                                                      // 199
      hooks.push(hook.hook);                                                                          // 200
    });                                                                                               // 201
                                                                                                      // 202
    return hooks;                                                                                     // 203
  },                                                                                                  // 204
                                                                                                      // 205
                                                                                                      // 206
  /**                                                                                                 // 207
   * Convenience function to define a bunch of routes at once. In the future we                       // 208
   * might call the callback with a custom dsl.                                                       // 209
   *                                                                                                  // 210
   * Example:                                                                                         // 211
   *  Router.map(function () {                                                                        // 212
   *    this.route('posts');                                                                          // 213
   *  });                                                                                             // 214
   *                                                                                                  // 215
   *  @param {Function} cb                                                                            // 216
   *  @return {IronRouter}                                                                            // 217
   *  @api public                                                                                     // 218
   */                                                                                                 // 219
                                                                                                      // 220
  map: function (cb) {                                                                                // 221
    Utils.assert(_.isFunction(cb),                                                                    // 222
           'map requires a function as the first parameter');                                         // 223
    cb.call(this);                                                                                    // 224
    return this;                                                                                      // 225
  },                                                                                                  // 226
                                                                                                      // 227
  /**                                                                                                 // 228
   * Define a new route. You must name the route, but as a second parameter you                       // 229
   * can either provide an object of options or a Route instance.                                     // 230
   *                                                                                                  // 231
   * @param {String} name The name of the route                                                       // 232
   * @param {Object} [options] Options to pass along to the route                                     // 233
   * @return {Route}                                                                                  // 234
   * @api public                                                                                      // 235
   */                                                                                                 // 236
                                                                                                      // 237
  route: function (name, options) {                                                                   // 238
    var route;                                                                                        // 239
                                                                                                      // 240
    Utils.assert(_.isString(name), 'name is a required parameter');                                   // 241
                                                                                                      // 242
    if (options instanceof Route)                                                                     // 243
      route = options;                                                                                // 244
    else                                                                                              // 245
      route = new Route(this, name, options);                                                         // 246
                                                                                                      // 247
    this.routes[name] = route;                                                                        // 248
    this.routes.push(route);                                                                          // 249
    return route;                                                                                     // 250
  },                                                                                                  // 251
                                                                                                      // 252
  path: function (routeName, params, options) {                                                       // 253
    var route = this.routes[routeName];                                                               // 254
    Utils.warn(route,                                                                                 // 255
     'You called Router.path for a route named ' + routeName + ' but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.path(params, options);                                                      // 257
  },                                                                                                  // 258
                                                                                                      // 259
  url: function (routeName, params, options) {                                                        // 260
    var route = this.routes[routeName];                                                               // 261
    Utils.warn(route,                                                                                 // 262
      'You called Router.url for a route named "' + routeName + '" but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.url(params, options);                                                       // 264
  },                                                                                                  // 265
                                                                                                      // 266
  match: function (path) {                                                                            // 267
    return _.find(this.routes, function(r) { return r.test(path); });                                 // 268
  },                                                                                                  // 269
                                                                                                      // 270
  dispatch: function (path, options, cb) {                                                            // 271
    var route = this.match(path);                                                                     // 272
                                                                                                      // 273
    if (! route)                                                                                      // 274
      return this.onRouteNotFound(path, options);                                                     // 275
                                                                                                      // 276
    if (route.where !== (Meteor.isClient ? 'client' : 'server'))                                      // 277
      return this.onUnhandled(path, options);                                                         // 278
                                                                                                      // 279
    var controller = route.getController(path, options);                                              // 280
    this.run(controller, cb);                                                                         // 281
  },                                                                                                  // 282
                                                                                                      // 283
  run: function (controller, cb) {                                                                    // 284
    var self = this;                                                                                  // 285
    var where = Meteor.isClient ? 'client' : 'server';                                                // 286
                                                                                                      // 287
    Utils.assert(controller, 'run requires a controller');                                            // 288
                                                                                                      // 289
    // one last check to see if we should handle the route here                                       // 290
    if (controller.where != where) {                                                                  // 291
      self.onUnhandled(controller.path, controller.options);                                          // 292
      return;                                                                                         // 293
    }                                                                                                 // 294
                                                                                                      // 295
    var run = function () {                                                                           // 296
      self._currentController = controller;                                                           // 297
      self._currentController._run();                                                                 // 298
    };                                                                                                // 299
                                                                                                      // 300
    // if we already have a current controller let's stop it and then                                 // 301
    // run the new one once the old controller is stopped. this will add                              // 302
    // the run function as an onInvalidate callback to the controller's                               // 303
    // computation. Otherwse, just run the new controller.                                            // 304
    if (this._currentController)                                                                      // 305
      this._currentController._stopController(run);                                                   // 306
    else                                                                                              // 307
      run();                                                                                          // 308
  },                                                                                                  // 309
                                                                                                      // 310
  onUnhandled: function (path, options) {                                                             // 311
    throw new Error('onUnhandled not implemented');                                                   // 312
  },                                                                                                  // 313
                                                                                                      // 314
  onRouteNotFound: function (path, options) {                                                         // 315
    throw new Error('Oh no! No route found for path: "' + path + '"');                                // 316
  }                                                                                                   // 317
};                                                                                                    // 318
                                                                                                      // 319
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/client/location.js                                                        //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var dep = new Deps.Dependency;                                                                        // 1
// XXX: we have to store the state internally (rather than just calling out                           // 2
// to window.location) due to an android 2.3 bug. See:                                                // 3
//   https://github.com/EventedMind/iron-router/issues/350                                            // 4
var currentState = {                                                                                  // 5
  path: location.pathname + location.search + location.hash                                           // 6
};                                                                                                    // 7
                                                                                                      // 8
function onpopstate (e) {                                                                             // 9
  setState(e.originalEvent.state, null, location.pathname + location.search + location.hash);         // 10
}                                                                                                     // 11
                                                                                                      // 12
IronLocation = {};                                                                                    // 13
                                                                                                      // 14
IronLocation.origin = function () {                                                                   // 15
  return location.protocol + '//' + location.host;                                                    // 16
};                                                                                                    // 17
                                                                                                      // 18
IronLocation.isSameOrigin = function (href) {                                                         // 19
  var origin = IronLocation.origin();                                                                 // 20
  return href.indexOf(origin) === 0;                                                                  // 21
};                                                                                                    // 22
                                                                                                      // 23
IronLocation.get = function () {                                                                      // 24
  dep.depend();                                                                                       // 25
  return currentState;                                                                                // 26
};                                                                                                    // 27
                                                                                                      // 28
IronLocation.path = function () {                                                                     // 29
  dep.depend();                                                                                       // 30
  return currentState.path;                                                                           // 31
};                                                                                                    // 32
                                                                                                      // 33
IronLocation.set = function (url, options) {                                                          // 34
  options = options || {};                                                                            // 35
                                                                                                      // 36
  var state = options.state || {};                                                                    // 37
                                                                                                      // 38
  if (/^http/.test(url))                                                                              // 39
    href = url;                                                                                       // 40
  else {                                                                                              // 41
    if (url.charAt(0) !== '/')                                                                        // 42
      url = '/' + url;                                                                                // 43
    href = IronLocation.origin() + url;                                                               // 44
  }                                                                                                   // 45
                                                                                                      // 46
  if (!IronLocation.isSameOrigin(href))                                                               // 47
    window.location = href;                                                                           // 48
  else if (options.where === 'server')                                                                // 49
    window.location = href;                                                                           // 50
  else if (options.replaceState)                                                                      // 51
    IronLocation.replaceState(state, options.title, url, options.skipReactive);                       // 52
  else                                                                                                // 53
    IronLocation.pushState(state, options.title, url, options.skipReactive);                          // 54
};                                                                                                    // 55
                                                                                                      // 56
// store the state for later access                                                                   // 57
setState = function(newState, title, url, skipReactive) {                                             // 58
  newState = _.extend({}, newState);                                                                  // 59
  newState.path = url;                                                                                // 60
  newState.title = title;                                                                             // 61
                                                                                                      // 62
  if (!skipReactive && ! EJSON.equals(currentState, newState))                                        // 63
    dep.changed();                                                                                    // 64
                                                                                                      // 65
  currentState = newState;                                                                            // 66
}                                                                                                     // 67
                                                                                                      // 68
IronLocation.pushState = function (state, title, url, skipReactive) {                                 // 69
  setState(state, title, url, skipReactive);                                                          // 70
                                                                                                      // 71
  if (history.pushState)                                                                              // 72
    history.pushState(state, title, url);                                                             // 73
  else                                                                                                // 74
    window.location = url;                                                                            // 75
};                                                                                                    // 76
                                                                                                      // 77
IronLocation.replaceState = function (state, title, url, skipReactive) {                              // 78
  // allow just the state or title to be set                                                          // 79
  if (arguments.length < 2)                                                                           // 80
    title = currentState.title;                                                                       // 81
  if (arguments.length < 3)                                                                           // 82
    url = currentState.path;                                                                          // 83
                                                                                                      // 84
  setState(state, title, url, skipReactive);                                                          // 85
                                                                                                      // 86
  if (history.replaceState)                                                                           // 87
    history.replaceState(state, title, url);                                                          // 88
  else                                                                                                // 89
    window.location = url;                                                                            // 90
};                                                                                                    // 91
                                                                                                      // 92
IronLocation.bindEvents = function(){                                                                 // 93
  $(window).on('popstate', onpopstate);                                                               // 94
};                                                                                                    // 95
                                                                                                      // 96
IronLocation.unbindEvents = function(){                                                               // 97
  $(window).off('popstate', onpopstate);                                                              // 98
};                                                                                                    // 99
                                                                                                      // 100
IronLocation.start = function () {                                                                    // 101
  if (this.isStarted)                                                                                 // 102
    return;                                                                                           // 103
                                                                                                      // 104
  IronLocation.bindEvents();                                                                          // 105
  this.isStarted = true;                                                                              // 106
                                                                                                      // 107
  // store the fact that this is the first route we hit.                                              // 108
  // this serves two purposes                                                                         // 109
  //   1. We can tell when we've reached an unhandled route and need to show a                        // 110
  //      404 (rather than bailing out to let the server handle it)                                   // 111
  //   2. Users can look at the state to tell if the history.back() will stay                         // 112
  //      inside the app (this is important for mobile apps).                                         // 113
  if (history.replaceState)                                                                           // 114
    history.replaceState({initial: true}, null, location.pathname + location.search + location.hash); // 115
};                                                                                                    // 116
                                                                                                      // 117
IronLocation.stop = function () {                                                                     // 118
  IronLocation.unbindEvents();                                                                        // 119
  this.isStarted = false;                                                                             // 120
};                                                                                                    // 121
                                                                                                      // 122
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/client/router.js                                                          //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
IronRouter = Utils.extend(IronRouter, {                                                               // 1
  constructor: function (options) {                                                                   // 2
    var self = this;                                                                                  // 3
                                                                                                      // 4
    IronRouter.__super__.constructor.apply(this, arguments);                                          // 5
    self.options.linkSelector = self.options.linkSelector || 'a[href]';                               // 6
                                                                                                      // 7
    this.isRendered = false;                                                                          // 8
                                                                                                      // 9
    /**                                                                                               // 10
     * The current RouteController instance. This is set anytime a new route is                       // 11
     * dispatched. It's a reactive variable which you can get by calling                              // 12
     * Router.current();                                                                              // 13
     *                                                                                                // 14
     * @api private                                                                                   // 15
     */                                                                                               // 16
    this._currentController = null;                                                                   // 17
                                                                                                      // 18
    /**                                                                                               // 19
     * Dependency to for this._currentController                                                      // 20
     *                                                                                                // 21
     * @api private                                                                                   // 22
     */                                                                                               // 23
    this._controllerDep = new Deps.Dependency;                                                        // 24
                                                                                                      // 25
    /**                                                                                               // 26
      * Did the URL we are looking at come from a hot-code-reload                                     // 27
      *  (and thus should we treat is as not new?)                                                    // 28
      *                                                                                               // 29
      * @api private                                                                                  // 30
      */                                                                                              // 31
    this._hasJustReloaded = false;                                                                    // 32
                                                                                                      // 33
    Meteor.startup(function () {                                                                      // 34
      Meteor.defer(function () {                                                                      // 35
        if (self.options.autoRender !== false)                                                        // 36
          self.autoRender();                                                                          // 37
        if (self.options.autoStart !== false)                                                         // 38
          self.start();                                                                               // 39
      });                                                                                             // 40
    });                                                                                               // 41
                                                                                                      // 42
    // proxy these methods to the underlying ui manager object                                        // 43
    _.each([                                                                                          // 44
      'layout',                                                                                       // 45
      'setRegion',                                                                                    // 46
      'clearRegion',                                                                                  // 47
      'getData',                                                                                      // 48
      'setData'                                                                                       // 49
    ], function (uiApiMethod) {                                                                       // 50
      self[uiApiMethod] = function () {                                                               // 51
        if (!self._ui)                                                                                // 52
          throw new Error("No uiManager is configured on the Router");                                // 53
        return self._ui[uiApiMethod].apply(self._ui, arguments);                                      // 54
      };                                                                                              // 55
    });                                                                                               // 56
  },                                                                                                  // 57
                                                                                                      // 58
  configure: function (options) {                                                                     // 59
    options = options || {};                                                                          // 60
                                                                                                      // 61
    IronRouter.__super__.configure.apply(this, arguments);                                            // 62
                                                                                                      // 63
    if (options.uiManager && this.isRendered)                                                         // 64
      throw new Error("Can't set uiManager after Router has been rendered");                          // 65
    else if (options.uiManager) {                                                                     // 66
      this._ui = options.uiManager;                                                                   // 67
    }                                                                                                 // 68
                                                                                                      // 69
    return this;                                                                                      // 70
  },                                                                                                  // 71
                                                                                                      // 72
  /**                                                                                                 // 73
   * Reactive accessor for the current RouteController instance. You can also                         // 74
   * get a nonreactive value by specifiying {reactive: false} as an option.                           // 75
   *                                                                                                  // 76
   * @param {Object} [opts] configuration options                                                     // 77
   * @param {Boolean} [opts.reactive] Set to false to enable a non-reactive read.                     // 78
   * @return {RouteController}                                                                        // 79
   * @api public                                                                                      // 80
   */                                                                                                 // 81
                                                                                                      // 82
  current: function (opts) {                                                                          // 83
    if (opts && opts.reactive === false)                                                              // 84
      return this._currentController;                                                                 // 85
    else {                                                                                            // 86
      this._controllerDep.depend();                                                                   // 87
      return this._currentController;                                                                 // 88
    }                                                                                                 // 89
  },                                                                                                  // 90
                                                                                                      // 91
  clearUnusedRegions: function (usedYields) {                                                         // 92
    if (!this._ui)                                                                                    // 93
      throw new Error('No ui manager has been set');                                                  // 94
                                                                                                      // 95
    var self = this;                                                                                  // 96
    var layout = this._ui;                                                                            // 97
                                                                                                      // 98
    var allYields = layout.getRegionKeys();                                                           // 99
    usedYields = _.filter(usedYields, function (val) {                                                // 100
      return !!val;                                                                                   // 101
    });                                                                                               // 102
                                                                                                      // 103
    var unusedYields = _.difference(allYields, usedYields);                                           // 104
                                                                                                      // 105
    _.each(unusedYields, function (key) {                                                             // 106
      layout.clearRegion(key);                                                                        // 107
    });                                                                                               // 108
  },                                                                                                  // 109
                                                                                                      // 110
  run: function (controller, cb) {                                                                    // 111
    IronRouter.__super__.run.apply(this, arguments);                                                  // 112
                                                                                                      // 113
    if (controller == this._currentController) {                                                      // 114
      cb && cb(controller);                                                                           // 115
      this._controllerDep.changed();                                                                  // 116
    }                                                                                                 // 117
  },                                                                                                  // 118
                                                                                                      // 119
  /**                                                                                                 // 120
   * Wrapper around Location.go that accepts a routeName or a path as the first                       // 121
   * parameter. This method can accept client and server side routes.                                 // 122
   *                                                                                                  // 123
   * Examples:                                                                                        // 124
   *                                                                                                  // 125
   *  1. Router.go('/posts', {state: 'true'});                                                        // 126
   *  2. Router.go('postIndex', [param1, param2], {state});                                           // 127
   *                                                                                                  // 128
   * @param {String} routeNameOrPath                                                                  // 129
   * @param {Array|Object} [params]                                                                   // 130
   * @param {Object} [state]                                                                          // 131
   * @param {Boolean} [replaceState]                                                                  // 132
   * @api public                                                                                      // 133
   */                                                                                                 // 134
                                                                                                      // 135
  go: function (routeNameOrPath, params, options) {                                                   // 136
    var self = this;                                                                                  // 137
    var isPathRe = /^\/|http/                                                                         // 138
    var route;                                                                                        // 139
    var path;                                                                                         // 140
    var onComplete;                                                                                   // 141
    var controller;                                                                                   // 142
    var done;                                                                                         // 143
                                                                                                      // 144
    // after the dispatch is complete, set the IronLocation                                           // 145
    // path and state which will update the browser's url.                                            // 146
    done = function() {                                                                               // 147
      options = options || {};                                                                        // 148
      self._location.set(path, {                                                                      // 149
        replaceState: options.replaceState,                                                           // 150
        state: options.state,                                                                         // 151
        skipReactive: true                                                                            // 152
      });                                                                                             // 153
    };                                                                                                // 154
                                                                                                      // 155
    if (isPathRe.test(routeNameOrPath)) {                                                             // 156
      path = routeNameOrPath;                                                                         // 157
      options = params;                                                                               // 158
                                                                                                      // 159
      // if the path hasn't changed (at all), we are going to do nothing here                         // 160
      if (path === self._location.path()) {                                                           // 161
        if (self.options.debug)                                                                       // 162
          console.log("You've navigated to the same path that you are currently at. Doing nothing");  // 163
        return;                                                                                       // 164
      }                                                                                               // 165
                                                                                                      // 166
      // issue here is in the dispatch process we might want to                                       // 167
      // make a server request so therefore not call this method yet, so                              // 168
      // we need to push the state only after we've decided it's a client                             // 169
      // request, otherwise let the browser handle it and send off to the                             // 170
      // server                                                                                       // 171
      self.dispatch(path, options, done);                                                             // 172
    } else {                                                                                          // 173
      route = self.routes[routeNameOrPath];                                                           // 174
      Utils.assert(route, 'No route found named ' + routeNameOrPath);                                 // 175
      path = route.path(params, options);                                                             // 176
      controller = route.getController(path, options);                                                // 177
      self.run(controller, done);                                                                     // 178
    }                                                                                                 // 179
  },                                                                                                  // 180
                                                                                                      // 181
  render: function () {                                                                               // 182
    //XXX this probably needs to be reworked since _ui.render() returns an                            // 183
    //inited component which doesnt work with Shark rendering pipeline.                               // 184
    if (!this._ui)                                                                                    // 185
      throw new Error("No uiManager configured on Router");                                           // 186
    this.isRendered = true;                                                                           // 187
    return this._ui.render();                                                                         // 188
  },                                                                                                  // 189
                                                                                                      // 190
  autoRender: function () {                                                                           // 191
    if (!this._ui)                                                                                    // 192
      throw new Error("No uiManager configured on Router");                                           // 193
    this._ui.insert(document.body, UI.body, {                                                         // 194
      template: this.options.layoutTemplate                                                           // 195
    });                                                                                               // 196
  },                                                                                                  // 197
                                                                                                      // 198
  bindEvents: function () {                                                                           // 199
    $(document).on('click.ironRouter', this.options.linkSelector, _.bind(this.onClick, this));        // 200
  },                                                                                                  // 201
                                                                                                      // 202
  unbindEvents: function () {                                                                         // 203
    $(document).off('click.ironRouter', this.options.linkSelector);                                   // 204
  },                                                                                                  // 205
                                                                                                      // 206
  /**                                                                                                 // 207
   * Start listening to click events and set up a Deps.autorun for location                           // 208
   * changes. If already started the method just returns.                                             // 209
   *                                                                                                  // 210
   * @api public                                                                                      // 211
   */                                                                                                 // 212
                                                                                                      // 213
  start: function () {                                                                                // 214
    var self = this;                                                                                  // 215
                                                                                                      // 216
    if (self.isStarted) return;                                                                       // 217
                                                                                                      // 218
    self.isStarted = true;                                                                            // 219
                                                                                                      // 220
    self._location = self.options.location || IronLocation;                                           // 221
    self._location.start();                                                                           // 222
                                                                                                      // 223
    self.bindEvents();                                                                                // 224
                                                                                                      // 225
    Deps.autorun(function (c) {                                                                       // 226
      var location;                                                                                   // 227
      self._locationComputation = c;                                                                  // 228
      self.dispatch(self._location.path(), {state: history.state});                                   // 229
    });                                                                                               // 230
  },                                                                                                  // 231
                                                                                                      // 232
  /**                                                                                                 // 233
   * Remove click event listener and stop listening for location changes.                             // 234
   *                                                                                                  // 235
   * @api public                                                                                      // 236
   */                                                                                                 // 237
                                                                                                      // 238
  stop: function () {                                                                                 // 239
    this.isStarted = false;                                                                           // 240
                                                                                                      // 241
    this.unbindEvents();                                                                              // 242
    this._location.stop();                                                                            // 243
                                                                                                      // 244
    if (this._locationComputation)                                                                    // 245
      this._locationComputation.stop();                                                               // 246
  },                                                                                                  // 247
                                                                                                      // 248
  /**                                                                                                 // 249
   * If we don't handle a link but the server does, bail to the server                                // 250
   *                                                                                                  // 251
   * @api public                                                                                      // 252
   */                                                                                                 // 253
  onUnhandled: function (path, options) {                                                             // 254
    this.stop();                                                                                      // 255
    window.location = path;                                                                           // 256
  },                                                                                                  // 257
                                                                                                      // 258
  /**                                                                                                 // 259
   * if we don't handle a link, _and_ the  server doesn't handle it,                                  // 260
   * do one of two things:                                                                            // 261
   *   a) if this is the initial route, then it can't be a static asset, so                           // 262
   *      show notFound or throw an error                                                             // 263
   *   b) otherwise, let the server have a go at it, we may end up coming back.                       // 264
   *                                                                                                  // 265
   * @api public                                                                                      // 266
   */                                                                                                 // 267
  onRouteNotFound: function (path, options) {                                                         // 268
    if (this._location.path() !== path) {                                                             // 269
      this.stop();                                                                                    // 270
      window.location = path;                                                                         // 271
    } else if (this.options.notFoundTemplate) {                                                       // 272
      var notFoundRoute = new Route(this, '__notfound__', _.extend(options || {}, {path: path}));     // 273
      this.run(new RouteController(this, notFoundRoute, {                                             // 274
        layoutTemplate: this.options.layoutTemplate,                                                  // 275
        template: this.options.notFoundTemplate                                                       // 276
      }));                                                                                            // 277
    } else {                                                                                          // 278
      throw new Error('Oh no! No route found for path: "' + path + '"');                              // 279
    }                                                                                                 // 280
  },                                                                                                  // 281
                                                                                                      // 282
  onClick: function(e) {                                                                              // 283
    var el = e.currentTarget;                                                                         // 284
    var which = _.isUndefined(e.which) ? e.button : e.which;                                          // 285
    var href = el.href;                                                                               // 286
    var path = el.pathname + el.search + el.hash;                                                     // 287
                                                                                                      // 288
    // we only want to handle clicks on links which:                                                  // 289
    // - haven't been cancelled already                                                               // 290
    if (e.isDefaultPrevented())                                                                       // 291
      return;                                                                                         // 292
                                                                                                      // 293
    //  - are with the left mouse button with no meta key pressed                                     // 294
    if (which !== 1)                                                                                  // 295
      return;                                                                                         // 296
                                                                                                      // 297
    if (e.metaKey || e.ctrlKey || e.shiftKey)                                                         // 298
      return;                                                                                         // 299
                                                                                                      // 300
    // - aren't in a new window                                                                       // 301
    if (el.target)                                                                                    // 302
      return;                                                                                         // 303
                                                                                                      // 304
    // - aren't external to the app                                                                   // 305
    if (!IronLocation.isSameOrigin(href))                                                             // 306
      return;                                                                                         // 307
                                                                                                      // 308
    // note that we _do_ handle links which point to the current URL                                  // 309
    // and links which only change the hash.                                                          // 310
    e.preventDefault();                                                                               // 311
    this.go(path);                                                                                    // 312
  }                                                                                                   // 313
});                                                                                                   // 314
                                                                                                      // 315
/**                                                                                                   // 316
 * The main Router instance that clients will deal with                                               // 317
 *                                                                                                    // 318
 * @api public                                                                                        // 319
 * @exports Router                                                                                    // 320
 */                                                                                                   // 321
                                                                                                      // 322
Router = new IronRouter;                                                                              // 323
                                                                                                      // 324
if (Meteor._reload) {                                                                                 // 325
  // just register the fact that a migration _has_ happened                                           // 326
  Meteor._reload.onMigrate('iron-router', function() { return [true, true]});                         // 327
                                                                                                      // 328
  // then when we come back up, check if it it's set                                                  // 329
  var data = Meteor._reload.migrationData('iron-router');                                             // 330
  Router._hasJustReloaded = data;                                                                     // 331
}                                                                                                     // 332
                                                                                                      // 333
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/client/wait_list.js                                                       //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
//XXX this waitlist isn't very smart. You just keep adding items to it and if                         // 1
//its used in a computation, we'll probably get duplicate handles.                                    // 2
WaitList = function () {                                                                              // 3
  this._dep = new Deps.Dependency;                                                                    // 4
  this.clear();                                                                                       // 5
};                                                                                                    // 6
                                                                                                      // 7
WaitList.prototype = {                                                                                // 8
  get: function (idx) {                                                                               // 9
    return this._list[idx];                                                                           // 10
  },                                                                                                  // 11
                                                                                                      // 12
  clear: function () {                                                                                // 13
    this._list = [];                                                                                  // 14
  },                                                                                                  // 15
                                                                                                      // 16
  append: function (list) {                                                                           // 17
    var self = this;                                                                                  // 18
    list = Utils.toArray(list);                                                                       // 19
    _.each(list, function (o) {                                                                       // 20
      self.push(o);                                                                                   // 21
    });                                                                                               // 22
  },                                                                                                  // 23
                                                                                                      // 24
  push: function (o) {                                                                                // 25
    var self = this;                                                                                  // 26
                                                                                                      // 27
    if (!o)                                                                                           // 28
      return;                                                                                         // 29
                                                                                                      // 30
    var res = this._list.push(o);                                                                     // 31
                                                                                                      // 32
    // remove the handle if the current computation invalidates                                       // 33
    Deps.active && Deps.onInvalidate(function() { self.pull(o); });                                   // 34
                                                                                                      // 35
    return res;                                                                                       // 36
  },                                                                                                  // 37
                                                                                                      // 38
  // take o out of the waitlist                                                                       // 39
  pull: function(o) {                                                                                 // 40
    this._list = _.reject(this._list, function(_o) { return _o === o });                              // 41
  },                                                                                                  // 42
                                                                                                      // 43
  ready: function () {                                                                                // 44
    return _.all(this._list, function (handle) {                                                      // 45
      return handle.ready();                                                                          // 46
    });                                                                                               // 47
  }                                                                                                   // 48
};                                                                                                    // 49
                                                                                                      // 50
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/client/hooks.js                                                           //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
Router.hooks = {                                                                                      // 1
  dataNotFound: function (pause) {                                                                    // 2
    var data = this.data();                                                                           // 3
    var tmpl;                                                                                         // 4
                                                                                                      // 5
    if (data === null || typeof data === 'undefined') {                                               // 6
      tmpl = this.lookupProperty('notFoundTemplate');                                                 // 7
                                                                                                      // 8
      if (tmpl) {                                                                                     // 9
        this.render(tmpl);                                                                            // 10
        this.renderRegions();                                                                         // 11
        pause();                                                                                      // 12
      }                                                                                               // 13
    }                                                                                                 // 14
  },                                                                                                  // 15
                                                                                                      // 16
  loading: function (pause) {                                                                         // 17
    var self = this;                                                                                  // 18
    var tmpl;                                                                                         // 19
                                                                                                      // 20
    if (!this.ready()) {                                                                              // 21
      tmpl = this.lookupProperty('loadingTemplate');                                                  // 22
                                                                                                      // 23
      if (tmpl) {                                                                                     // 24
        this.render(tmpl);                                                                            // 25
        this.renderRegions();                                                                         // 26
        pause();                                                                                      // 27
      }                                                                                               // 28
    }                                                                                                 // 29
  }                                                                                                   // 30
};                                                                                                    // 31
                                                                                                      // 32
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/client/route_controller.js                                                //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
var isLogging = false;                                                                                // 1
var log = function (msg) {                                                                            // 2
  if (!isLogging)                                                                                     // 3
    return;                                                                                           // 4
  console.log('%c<RouteController> ' + msg, 'color: purple; font-size: 1.3em; font-weight: bold;');   // 5
};                                                                                                    // 6
                                                                                                      // 7
RouteController = Utils.extend(RouteController, {                                                     // 8
  constructor: function () {                                                                          // 9
    var self = this;                                                                                  // 10
                                                                                                      // 11
    RouteController.__super__.constructor.apply(this, arguments);                                     // 12
                                                                                                      // 13
    // the value of the data option or prototype property                                             // 14
    this._dataValue = this.lookupProperty('data');                                                    // 15
                                                                                                      // 16
    // rewrite the data function on the instance itself.  Get the data from the                       // 17
    // controller itself, not the router global data context. This is what                            // 18
    // controller functions will read from. Templates will get their data                             // 19
    // context from the global router data context which will get set in the                          // 20
    // _run function.                                                                                 // 21
    this.data = function () {                                                                         // 22
      var value;                                                                                      // 23
                                                                                                      // 24
      if (_.isFunction(self._dataValue))                                                              // 25
        value = self._dataValue.call(self);                                                           // 26
      else if (self._dataValue)                                                                       // 27
        value = self._dataValue                                                                       // 28
      else                                                                                            // 29
        value = null;                                                                                 // 30
                                                                                                      // 31
      log('this.data()');                                                                             // 32
      return value;                                                                                   // 33
    };                                                                                                // 34
                                                                                                      // 35
    this._waitList = new WaitList;                                                                    // 36
                                                                                                      // 37
    // proxy these methods to the router                                                              // 38
    _.each([                                                                                          // 39
      'layout',                                                                                       // 40
      'setRegion',                                                                                    // 41
      'clearRegion'                                                                                   // 42
    ], function (routerApiMethod) {                                                                   // 43
      self[routerApiMethod] = function () {                                                           // 44
        if (!self.router)                                                                             // 45
          throw new Error("No router defined on RouteController");                                    // 46
        return self.router[routerApiMethod].apply(self.router, arguments);                            // 47
      };                                                                                              // 48
    });                                                                                               // 49
  },                                                                                                  // 50
                                                                                                      // 51
  setLayout: function () {                                                                            // 52
    return this.layout.apply(this, arguments);                                                        // 53
  },                                                                                                  // 54
                                                                                                      // 55
  ready: function () {                                                                                // 56
    return this._waitList.ready();                                                                    // 57
  },                                                                                                  // 58
                                                                                                      // 59
  /**                                                                                                 // 60
   * Stop running this controller and redirect to a new path. Same parameters as                      // 61
   * those of Router.go.                                                                              // 62
   * @api public                                                                                      // 63
   */                                                                                                 // 64
                                                                                                      // 65
  redirect: function (/* args */) {                                                                   // 66
    return Router.go.apply(Router, arguments);                                                        // 67
  },                                                                                                  // 68
                                                                                                      // 69
  //XXX move into subscription class? look into arunoda's work.                                       // 70
  subscribe: function (/* same as Meteor.subscribe */) {                                              // 71
    var self = this;                                                                                  // 72
                                                                                                      // 73
    var waitApi = (function () {                                                                      // 74
      return {                                                                                        // 75
        wait: function () {                                                                           // 76
          self._waitList.push(this);                                                                  // 77
          added = true;                                                                               // 78
        }                                                                                             // 79
      };                                                                                              // 80
    })();                                                                                             // 81
                                                                                                      // 82
    var handle = Meteor.subscribe.apply(this, arguments);                                             // 83
    return _.extend(handle, waitApi);                                                                 // 84
  },                                                                                                  // 85
                                                                                                      // 86
  lookupLayoutTemplate: function () {                                                                 // 87
    return this.lookupProperty('layoutTemplate');                                                     // 88
  },                                                                                                  // 89
                                                                                                      // 90
  lookupTemplate: function () {                                                                       // 91
    return this.lookupProperty('template')                                                            // 92
      || Router.convertTemplateName(this.route.name);                                                 // 93
  },                                                                                                  // 94
                                                                                                      // 95
  lookupRegionTemplates: function () {                                                                // 96
    var res;                                                                                          // 97
                                                                                                      // 98
    if (res = this.lookupProperty('regionTemplates'))                                                 // 99
      return res;                                                                                     // 100
    else if (res = this.lookupProperty('yieldTemplates'))                                             // 101
      return res;                                                                                     // 102
    else                                                                                              // 103
      return {};                                                                                      // 104
  },                                                                                                  // 105
                                                                                                      // 106
  /**                                                                                                 // 107
   * Return an array of waitOn values in the folowing order (although, ordering                       // 108
   * shouldn't really matter for waitOn). The result may contain sub arrays like                      // 109
   * this:                                                                                            // 110
   *   [[fn1, fn2], [fn3, fn4]]                                                                       // 111
   *                                                                                                  // 112
   *   1. Router options                                                                              // 113
   *   2. Route options                                                                               // 114
   *   3. Controller options                                                                          // 115
   *   4. Controller instance                                                                         // 116
   */                                                                                                 // 117
                                                                                                      // 118
  lookupWaitOn: function () {                                                                         // 119
    var toArray = Utils.toArray;                                                                      // 120
                                                                                                      // 121
    var fromRouterHook = toArray(this.router.getHooks('waitOn', this.route.name));                    // 122
    var fromRouterOptions = toArray(this.router.options.waitOn);                                      // 123
    var fromRouteOptions = toArray(this.route.options.waitOn);                                        // 124
    var fromMyOptions = toArray(this.options.waitOn);                                                 // 125
    var fromInstOptions = toArray(this.waitOn);                                                       // 126
                                                                                                      // 127
    return fromRouterHook                                                                             // 128
      .concat(fromRouterOptions)                                                                      // 129
      .concat(fromRouteOptions)                                                                       // 130
      .concat(fromMyOptions)                                                                          // 131
      .concat(fromInstOptions);                                                                       // 132
  },                                                                                                  // 133
                                                                                                      // 134
  /**                                                                                                 // 135
   * Either specify a template to render or call with no arguments to render the                      // 136
   * RouteController's template plus all of the yieldTemplates.                                       // 137
   *                                                                                                  // 138
   * XXX can we have some hooks here? would be nice to give                                           // 139
   * iron-transitioner a place to plug in. Maybe onSetRegion(fn)?                                     // 140
   */                                                                                                 // 141
                                                                                                      // 142
  render: function (template, options) {                                                              // 143
    var to;                                                                                           // 144
    var template;                                                                                     // 145
    var layout;                                                                                       // 146
    var self = this;                                                                                  // 147
                                                                                                      // 148
    var addRenderedRegion = function (key) {                                                          // 149
      if (self._renderedRegions) {                                                                    // 150
        //XXX doesn't using "main" creep into the ui manager?                                         // 151
        key = key || 'main';                                                                          // 152
        self._renderedRegions.push(key);                                                              // 153
      }                                                                                               // 154
    };                                                                                                // 155
                                                                                                      // 156
    if (arguments.length == 0) {                                                                      // 157
      this.setRegion(this.lookupTemplate());                                                          // 158
      addRenderedRegion();                                                                            // 159
      this.renderRegions();                                                                           // 160
    } else {                                                                                          // 161
      options = options || {};                                                                        // 162
      to = options.to;                                                                                // 163
      this.setRegion(to, template);                                                                   // 164
      addRenderedRegion(to);                                                                          // 165
    }                                                                                                 // 166
  },                                                                                                  // 167
                                                                                                      // 168
  renderRegions: function() {                                                                         // 169
    var self = this;                                                                                  // 170
    var regionTemplates = this.lookupRegionTemplates();                                               // 171
                                                                                                      // 172
    _.each(regionTemplates, function (opts, tmpl) {                                                   // 173
      self.render(tmpl, opts)                                                                         // 174
    });                                                                                               // 175
  },                                                                                                  // 176
                                                                                                      // 177
  wait: function (handle) {                                                                           // 178
    handle = _.isFunction(handle) ? handle.call(this) : handle;                                       // 179
    // handle could be an object or a array if a function returned an array                           // 180
    this._waitList.append(handle);                                                                    // 181
  },                                                                                                  // 182
                                                                                                      // 183
  action: function () {                                                                               // 184
    this.render();                                                                                    // 185
  },                                                                                                  // 186
                                                                                                      // 187
  /**                                                                                                 // 188
   * A private method that the Router can call into to                                                // 189
   * stop the controller. The reason we need this is because we                                       // 190
   * don't want users calling stop() in their hooks/action like they                                  // 191
   * had done previously. We now want them to call pause(). stop() now                                // 192
   * completely stops the controller and tears down its computations. pause()                         // 193
   * just stopps running downstream functions (e.g. when you're running                               // 194
   * before/action/after functions. But if the outer computation causes the                           // 195
   * entire chain of functions to run again that's fine.                                              // 196
   */                                                                                                 // 197
  _stopController: function (cb) {                                                                    // 198
    var self = this;                                                                                  // 199
                                                                                                      // 200
    // noop if we're already stopped                                                                  // 201
    if (this.isStopped)                                                                               // 202
      return;                                                                                         // 203
                                                                                                      // 204
    var onStop = function () {                                                                        // 205
      RouteController.__super__._stopController.call(self, cb);                                       // 206
    };                                                                                                // 207
                                                                                                      // 208
    if (this._computation) {                                                                          // 209
      this._computation.stop();                                                                       // 210
      this._computation.onInvalidate(onStop);                                                         // 211
    } else {                                                                                          // 212
      onStop();                                                                                       // 213
    }                                                                                                 // 214
  },                                                                                                  // 215
                                                                                                      // 216
  _run: function () {                                                                                 // 217
    var self = this;                                                                                  // 218
                                                                                                      // 219
    // if we're already running, you can't call run again without                                     // 220
    // calling stop first.                                                                            // 221
    if (self.isRunning)                                                                               // 222
      throw new Error("You called _run without first calling stop");                                  // 223
                                                                                                      // 224
    self.isRunning = true;                                                                            // 225
    self.isStopped = false;                                                                           // 226
                                                                                                      // 227
    var withNoStopsAllowed = function (fn, thisArg) {                                                 // 228
      return function () {                                                                            // 229
        var oldStop = self.stop;                                                                      // 230
                                                                                                      // 231
        self.stop = function () {                                                                     // 232
          if (typeof console !== 'undefined') {                                                       // 233
            console.warn("You called this.stop() inside a hook or your action function but you should use pause() now instead which is the first parameter to the hook function.");
            return;                                                                                   // 235
          }                                                                                           // 236
        };                                                                                            // 237
                                                                                                      // 238
        try {                                                                                         // 239
          return fn.call(thisArg || this);                                                            // 240
        } finally {                                                                                   // 241
          self.stop = oldStop;                                                                        // 242
        }                                                                                             // 243
      };                                                                                              // 244
    };                                                                                                // 245
                                                                                                      // 246
    // outer most computation is just used to stop inner computations from one                        // 247
    // place. i don't expect this computation to be invalidated during the run.                       // 248
    self._computation = Deps.autorun(withNoStopsAllowed(function () {                                 // 249
      self._renderedRegions = [];                                                                     // 250
      self._waitList.clear();                                                                         // 251
                                                                                                      // 252
      self.layout(self.lookupLayoutTemplate());                                                       // 253
                                                                                                      // 254
      Deps.autorun(withNoStopsAllowed(function () {                                                   // 255
        if (!self.router._hasJustReloaded)                                                            // 256
          self.runHooks('onRun');                                                                     // 257
        self.router._hasJustReloaded = false;                                                         // 258
      }));                                                                                            // 259
                                                                                                      // 260
      // waitOn                                                                                       // 261
      Deps.autorun(withNoStopsAllowed(function () {                                                   // 262
        var waitOnList = self.lookupWaitOn();                                                         // 263
        var waitOn = _.flatten(_.map(waitOnList, function (fnOrHandle) {                              // 264
          return _.isFunction(fnOrHandle) ? fnOrHandle.call(self) : fnOrHandle;                       // 265
        }));                                                                                          // 266
                                                                                                      // 267
        log('waitOn');                                                                                // 268
        self._waitList.append(waitOn);                                                                // 269
      }));                                                                                            // 270
                                                                                                      // 271
      // data                                                                                         // 272
      // always set the data to something on a new route run.                                         // 273
      // it might be null at first, and then run again once                                           // 274
      // we have data.                                                                                // 275
      Deps.autorun(withNoStopsAllowed(function () {                                                   // 276
        var data = self.data();                                                                       // 277
        self.router.setData(data);                                                                    // 278
        self.runHooks('onData');                                                                      // 279
      }));                                                                                            // 280
                                                                                                      // 281
      // action                                                                                       // 282
      var action = _.isFunction(self.action) ? self.action : self[self.action];                       // 283
      Utils.assert(action,                                                                            // 284
        "You don't have an action named \"" + self.action + "\" defined on your RouteController");    // 285
                                                                                                      // 286
      Deps.autorun(withNoStopsAllowed(function () {                                                   // 287
        log('Call action');                                                                           // 288
        self.runHooks('onBeforeAction', [], function (paused) {                                       // 289
          if (!paused && !self.isStopped) {                                                           // 290
            action.call(self);                                                                        // 291
                                                                                                      // 292
            if (!self.isStopped) {                                                                    // 293
              self.runHooks('onAfterAction', [                                                        // 294
                function clearUnusedRegions () {                                                      // 295
                  if (this.router) {                                                                  // 296
                    this.router.clearUnusedRegions(this._renderedRegions);                            // 297
                  }                                                                                   // 298
                }                                                                                     // 299
              ]);                                                                                     // 300
            }                                                                                         // 301
          }                                                                                           // 302
        });                                                                                           // 303
      }));                                                                                            // 304
    }));                                                                                              // 305
  }                                                                                                   // 306
});                                                                                                   // 307
                                                                                                      // 308
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// packages/iron-router/lib/client/ui/helpers.js                                                      //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
//XXX renderRouter                                                                                    // 1
//XXX pathFor                                                                                         // 2
//XXX urlFor                                                                                          // 3
                                                                                                      // 4
Router.helpers = {};                                                                                  // 5
                                                                                                      // 6
var Handlebars;                                                                                       // 7
                                                                                                      // 8
if (Package.ui) {                                                                                     // 9
  Handlebars = Package.ui.Handlebars;                                                                 // 10
                                                                                                      // 11
  var getData = function (thisArg) {                                                                  // 12
    return thisArg === window ? {} : thisArg;                                                         // 13
  };                                                                                                  // 14
                                                                                                      // 15
  var processPathArgs = function (routeName, options) {                                               // 16
    if (_.isObject(routeName)) {                                                                      // 17
      options = routeName;                                                                            // 18
      routeName = options.route;                                                                      // 19
    }                                                                                                 // 20
                                                                                                      // 21
    var opts = options.hash;                                                                          // 22
    var params = opts.params || _.omit(opts, 'hash', 'query');                                        // 23
    var hash = opts.hash;                                                                             // 24
    var query = opts.query;                                                                           // 25
                                                                                                      // 26
    return {                                                                                          // 27
      routeName: routeName,                                                                           // 28
      params: params,                                                                                 // 29
      query: query,                                                                                   // 30
      hash: hash                                                                                      // 31
    };                                                                                                // 32
  };                                                                                                  // 33
                                                                                                      // 34
  _.extend(Router.helpers, {                                                                          // 35
                                                                                                      // 36
    /**                                                                                               // 37
     * Example Use:                                                                                   // 38
     *                                                                                                // 39
     *  {{pathFor 'items' params=this}}                                                               // 40
     *  {{pathFor 'items' id=5 query="view=all" hash="somehash"}}                                     // 41
     *  {{pathFor route='items' id=5 query="view=all" hash="somehash"}}                               // 42
     */                                                                                               // 43
                                                                                                      // 44
    pathFor: function (routeName, options) {                                                          // 45
      var args = processPathArgs(routeName, options);                                                 // 46
                                                                                                      // 47
      return Router.path(args.routeName, args.params, {                                               // 48
        query: args.query,                                                                            // 49
        hash: args.hash                                                                               // 50
      });                                                                                             // 51
    },                                                                                                // 52
                                                                                                      // 53
    /**                                                                                               // 54
     * Same as pathFor but returns entire aboslute url.                                               // 55
     *                                                                                                // 56
     */                                                                                               // 57
    urlFor: function (routeName, options) {                                                           // 58
      var args = processPathArgs(routeName, options);                                                 // 59
                                                                                                      // 60
      return Router.url(args.routeName, args.params, {                                                // 61
        query: args.query,                                                                            // 62
        hash: args.hash                                                                               // 63
      });                                                                                             // 64
    }                                                                                                 // 65
  });                                                                                                 // 66
                                                                                                      // 67
  _.each(Router.helpers, function (helper, name) {                                                    // 68
    Handlebars.registerHelper(name, helper);                                                          // 69
  });                                                                                                 // 70
}                                                                                                     // 71
                                                                                                      // 72
////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron-router'] = {
  RouteController: RouteController,
  Route: Route,
  Router: Router,
  IronLocation: IronLocation,
  Utils: Utils,
  IronRouter: IronRouter,
  WaitList: WaitList
};

})();

//# sourceMappingURL=2ba6a175ee3809d07717c93d3b60ad0583b9573e.map
