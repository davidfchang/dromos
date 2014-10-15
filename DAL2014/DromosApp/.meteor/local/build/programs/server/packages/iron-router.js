(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Deps = Package.deps.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;

/* Package-scope variables */
var RouteController, Route, Router, Utils, IronRouter, paramParts;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/utils.js                                                                 //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
/**                                                                                                  // 1
 * Utility methods available privately to the package.                                               // 2
 */                                                                                                  // 3
                                                                                                     // 4
Utils = {};                                                                                          // 5
                                                                                                     // 6
/**                                                                                                  // 7
 * global object on node or window object in the browser.                                            // 8
 */                                                                                                  // 9
                                                                                                     // 10
Utils.global = (function () { return this; })();                                                     // 11
                                                                                                     // 12
/**                                                                                                  // 13
 * deprecatation notice to the user which can be a string or object                                  // 14
 * of the form:                                                                                      // 15
 *                                                                                                   // 16
 * {                                                                                                 // 17
 *  name: 'somePropertyOrMethod',                                                                    // 18
 *  where: 'RouteController',                                                                        // 19
 *  instead: 'someOtherPropertyOrMethod',                                                            // 20
 *  message: ':name is deprecated. Please use :instead instead'                                      // 21
 * }                                                                                                 // 22
 */                                                                                                  // 23
Utils.notifyDeprecated = function (info) {                                                           // 24
  var name;                                                                                          // 25
  var instead;                                                                                       // 26
  var message;                                                                                       // 27
  var where;                                                                                         // 28
  var defaultMessage = "[:where] ':name' is deprecated. Please use ':instead' instead.";             // 29
                                                                                                     // 30
  if (_.isObject(info)) {                                                                            // 31
    name = info.name;                                                                                // 32
    instead = info.instead;                                                                          // 33
    message = info.message || defaultMessage;                                                        // 34
    where = info.where;                                                                              // 35
  } else {                                                                                           // 36
    message = info;                                                                                  // 37
    name = '';                                                                                       // 38
    instead = '';                                                                                    // 39
    where = '';                                                                                      // 40
  }                                                                                                  // 41
                                                                                                     // 42
  if (typeof console !== 'undefined' && console.warn) {                                              // 43
    console.warn(                                                                                    // 44
      '<deprecated> ' +                                                                              // 45
      message                                                                                        // 46
      .replace(':name', name)                                                                        // 47
      .replace(':instead', instead)                                                                  // 48
      .replace(':where', where)                                                                      // 49
    );                                                                                               // 50
  }                                                                                                  // 51
};                                                                                                   // 52
                                                                                                     // 53
Utils.withDeprecatedNotice = function (info, fn, thisArg) {                                          // 54
  return function () {                                                                               // 55
    Utils.notifyDeprecated(info);                                                                    // 56
    return fn && fn.apply(thisArg || this, arguments);                                               // 57
  };                                                                                                 // 58
};                                                                                                   // 59
                                                                                                     // 60
/**                                                                                                  // 61
 * Given the name of a property, resolves to the value. Works with namespacing                       // 62
 * too. If first parameter is already a value that isn't a string it's returned                      // 63
 * immediately.                                                                                      // 64
 *                                                                                                   // 65
 * Examples:                                                                                         // 66
 *  'SomeClass' => window.SomeClass || global.someClass                                              // 67
 *  'App.namespace.SomeClass' => window.App.namespace.SomeClass                                      // 68
 *                                                                                                   // 69
 * @param {String|Object} nameOrValue                                                                // 70
 */                                                                                                  // 71
                                                                                                     // 72
Utils.resolveValue = function (nameOrValue) {                                                        // 73
  var global = Utils.global;                                                                         // 74
  var parts;                                                                                         // 75
  var ptr;                                                                                           // 76
                                                                                                     // 77
  if (_.isString(nameOrValue)) {                                                                     // 78
    parts = nameOrValue.split('.')                                                                   // 79
    ptr = global;                                                                                    // 80
    for (var i = 0; i < parts.length; i++) {                                                         // 81
      ptr = ptr[parts[i]];                                                                           // 82
      if (!ptr)                                                                                      // 83
        return undefined;                                                                            // 84
    }                                                                                                // 85
  } else {                                                                                           // 86
    ptr = nameOrValue;                                                                               // 87
  }                                                                                                  // 88
                                                                                                     // 89
  // final position of ptr should be the resolved value                                              // 90
  return ptr;                                                                                        // 91
};                                                                                                   // 92
                                                                                                     // 93
Utils.hasOwnProperty = function (obj, key) {                                                         // 94
  var prop = {}.hasOwnProperty;                                                                      // 95
  return prop.call(obj, key);                                                                        // 96
};                                                                                                   // 97
                                                                                                     // 98
/**                                                                                                  // 99
 * Don't mess with this function. It's exactly the same as the compiled                              // 100
 * coffeescript mechanism. If you change it we can't guarantee that our code                         // 101
 * will work when used with Coffeescript. One exception is putting in a runtime                      // 102
 * check that both child and parent are of type Function.                                            // 103
 */                                                                                                  // 104
                                                                                                     // 105
Utils.inherits = function (child, parent) {                                                          // 106
  if (Utils.typeOf(child) !== '[object Function]')                                                   // 107
    throw new Error('First parameter to Utils.inherits must be a function');                         // 108
                                                                                                     // 109
  if (Utils.typeOf(parent) !== '[object Function]')                                                  // 110
    throw new Error('Second parameter to Utils.inherits must be a function');                        // 111
                                                                                                     // 112
  for (var key in parent) {                                                                          // 113
    if (Utils.hasOwnProperty(parent, key))                                                           // 114
      child[key] = parent[key];                                                                      // 115
  }                                                                                                  // 116
                                                                                                     // 117
  function ctor () {                                                                                 // 118
    this.constructor = child;                                                                        // 119
  }                                                                                                  // 120
                                                                                                     // 121
  ctor.prototype = parent.prototype;                                                                 // 122
  child.prototype = new ctor();                                                                      // 123
  child.__super__ = parent.prototype;                                                                // 124
  return child;                                                                                      // 125
};                                                                                                   // 126
                                                                                                     // 127
Utils.toArray = function (obj) {                                                                     // 128
  if (!obj)                                                                                          // 129
    return [];                                                                                       // 130
  else if (Utils.typeOf(obj) !== '[object Array]')                                                   // 131
    return [obj];                                                                                    // 132
  else                                                                                               // 133
    return obj;                                                                                      // 134
};                                                                                                   // 135
                                                                                                     // 136
Utils.typeOf = function (obj) {                                                                      // 137
  if (obj && obj.typeName)                                                                           // 138
    return obj.typeName;                                                                             // 139
  else                                                                                               // 140
    return Object.prototype.toString.call(obj);                                                      // 141
};                                                                                                   // 142
                                                                                                     // 143
Utils.extend = function (Super, definition, onBeforeExtendPrototype) {                               // 144
  if (arguments.length === 1)                                                                        // 145
    definition = Super;                                                                              // 146
  else {                                                                                             // 147
    definition = definition || {};                                                                   // 148
    definition.extend = Super;                                                                       // 149
  }                                                                                                  // 150
                                                                                                     // 151
  return Utils.create(definition, {                                                                  // 152
    onBeforeExtendPrototype: onBeforeExtendPrototype                                                 // 153
  });                                                                                                // 154
};                                                                                                   // 155
                                                                                                     // 156
Utils.create = function (definition, options) {                                                      // 157
  var Constructor                                                                                    // 158
    , extendFrom                                                                                     // 159
    , savedPrototype;                                                                                // 160
                                                                                                     // 161
  options = options || {};                                                                           // 162
  definition = definition || {};                                                                     // 163
                                                                                                     // 164
  if (Utils.hasOwnProperty(definition, 'constructor'))                                               // 165
    Constructor = definition.constructor;                                                            // 166
  else {                                                                                             // 167
    Constructor = function () {                                                                      // 168
      if (Constructor.__super__ && Constructor.__super__.constructor)                                // 169
        return Constructor.__super__.constructor.apply(this, arguments);                             // 170
    }                                                                                                // 171
  }                                                                                                  // 172
                                                                                                     // 173
  extendFrom = definition.extend;                                                                    // 174
                                                                                                     // 175
  if (definition.extend) delete definition.extend;                                                   // 176
                                                                                                     // 177
  var inherit = function (Child, Super, prototype) {                                                 // 178
    Utils.inherits(Child, Utils.resolveValue(Super));                                                // 179
    if (prototype) _.extend(Child.prototype, prototype);                                             // 180
  };                                                                                                 // 181
                                                                                                     // 182
  if (extendFrom) {                                                                                  // 183
    inherit(Constructor, extendFrom);                                                                // 184
  }                                                                                                  // 185
                                                                                                     // 186
  if (options.onBeforeExtendPrototype)                                                               // 187
    options.onBeforeExtendPrototype.call(Constructor, definition);                                   // 188
                                                                                                     // 189
  _.extend(Constructor.prototype, definition);                                                       // 190
                                                                                                     // 191
  return Constructor;                                                                                // 192
};                                                                                                   // 193
                                                                                                     // 194
/**                                                                                                  // 195
 * Assert that the given condition is truthy.                                                        // 196
 *                                                                                                   // 197
 * @param {Boolean} condition The boolean condition to test for truthiness.                          // 198
 * @param {String} msg The error message to show if the condition is falsy.                          // 199
 */                                                                                                  // 200
                                                                                                     // 201
Utils.assert = function (condition, msg) {                                                           // 202
  if (!condition)                                                                                    // 203
    throw new Error(msg);                                                                            // 204
};                                                                                                   // 205
                                                                                                     // 206
Utils.warn = function (condition, msg) {                                                             // 207
  if (!condition)                                                                                    // 208
    console && console.warn && console.warn(msg);                                                    // 209
};                                                                                                   // 210
                                                                                                     // 211
Utils.capitalize = function (str) {                                                                  // 212
  return str.charAt(0).toUpperCase() + str.slice(1, str.length);                                     // 213
};                                                                                                   // 214
                                                                                                     // 215
Utils.upperCamelCase = function (str) {                                                              // 216
  var re = /_|-|\./;                                                                                 // 217
                                                                                                     // 218
  if (!str)                                                                                          // 219
    return '';                                                                                       // 220
                                                                                                     // 221
  return _.map(str.split(re), function (word) {                                                      // 222
    return Utils.capitalize(word);                                                                   // 223
  }).join('');                                                                                       // 224
};                                                                                                   // 225
                                                                                                     // 226
Utils.camelCase = function (str) {                                                                   // 227
  var output = Utils.upperCamelCase(str);                                                            // 228
  output = output.charAt(0).toLowerCase() + output.slice(1, output.length);                          // 229
  return output;                                                                                     // 230
};                                                                                                   // 231
                                                                                                     // 232
Utils.pick = function (/* args */) {                                                                 // 233
  var args = _.toArray(arguments)                                                                    // 234
    , arg;                                                                                           // 235
  for (var i = 0; i < args.length; i++) {                                                            // 236
    arg = args[i];                                                                                   // 237
    if (typeof arg !== 'undefined' && arg !== null)                                                  // 238
      return arg;                                                                                    // 239
  }                                                                                                  // 240
                                                                                                     // 241
  return null;                                                                                       // 242
};                                                                                                   // 243
                                                                                                     // 244
Utils.StringConverters = {                                                                           // 245
  'none': function(input) {                                                                          // 246
    return input;                                                                                    // 247
  },                                                                                                 // 248
                                                                                                     // 249
  'upperCamelCase': function (input) {                                                               // 250
    return Utils.upperCamelCase(input);                                                              // 251
  },                                                                                                 // 252
                                                                                                     // 253
  'camelCase': function (input) {                                                                    // 254
    return Utils.camelCase(input);                                                                   // 255
  }                                                                                                  // 256
};                                                                                                   // 257
                                                                                                     // 258
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/route.js                                                                 //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
/*                                                                                                   // 1
 * Inspiration and some code for the compilation of routes comes from pagejs.                        // 2
 * The original has been modified to better handle hash fragments, and to store                      // 3
 * the regular expression on the Route instance. Also, the resolve method has                        // 4
 * been added to return a resolved path given a parameters object.                                   // 5
 */                                                                                                  // 6
                                                                                                     // 7
Route = function (router, name, options) {                                                           // 8
  var path;                                                                                          // 9
                                                                                                     // 10
  Utils.assert(router instanceof IronRouter);                                                        // 11
                                                                                                     // 12
  Utils.assert(_.isString(name),                                                                     // 13
    'Route constructor requires a name as the second parameter');                                    // 14
                                                                                                     // 15
  if (_.isFunction(options))                                                                         // 16
    options = { handler: options };                                                                  // 17
                                                                                                     // 18
  options = this.options = options || {};                                                            // 19
  path = options.path || ('/' + name);                                                               // 20
                                                                                                     // 21
  this.router = router;                                                                              // 22
  this.originalPath = path;                                                                          // 23
                                                                                                     // 24
  if (_.isString(this.originalPath) && this.originalPath.charAt(0) !== '/')                          // 25
    this.originalPath = '/' + this.originalPath;                                                     // 26
                                                                                                     // 27
  this.name = name;                                                                                  // 28
  this.where = options.where || 'client';                                                            // 29
  this.controller = options.controller;                                                              // 30
  this.action = options.action;                                                                      // 31
                                                                                                     // 32
  if (typeof options.reactive !== 'undefined')                                                       // 33
    this.isReactive = options.reactive;                                                              // 34
  else                                                                                               // 35
    this.isReactive = true;                                                                          // 36
                                                                                                     // 37
  this.compile();                                                                                    // 38
};                                                                                                   // 39
                                                                                                     // 40
Route.prototype = {                                                                                  // 41
  constructor: Route,                                                                                // 42
                                                                                                     // 43
  /**                                                                                                // 44
   * Compile the path.                                                                               // 45
   *                                                                                                 // 46
   *  @return {Route}                                                                                // 47
   *  @api public                                                                                    // 48
   */                                                                                                // 49
                                                                                                     // 50
  compile: function () {                                                                             // 51
    var self = this;                                                                                 // 52
    var path;                                                                                        // 53
    var options = self.options;                                                                      // 54
                                                                                                     // 55
    this.keys = [];                                                                                  // 56
                                                                                                     // 57
    if (self.originalPath instanceof RegExp) {                                                       // 58
      self.re = self.originalPath;                                                                   // 59
    } else {                                                                                         // 60
      path = self.originalPath                                                                       // 61
        .replace(/(.)\/$/, '$1')                                                                     // 62
        .concat(options.strict ? '' : '/?')                                                          // 63
        .replace(/\/\(/g, '(?:/')                                                                    // 64
        .replace(/#/, '/?#')                                                                         // 65
        .replace(                                                                                    // 66
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                    // 67
          function (match, slash, format, key, capture, optional){                                   // 68
            self.keys.push({ name: key, optional: !! optional });                                    // 69
            slash = slash || '';                                                                     // 70
            return ''                                                                                // 71
              + (optional ? '' : slash)                                                              // 72
              + '(?:'                                                                                // 73
              + (optional ? slash : '')                                                              // 74
              + (format || '')                                                                       // 75
              + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'                             // 76
              + (optional || '');                                                                    // 77
          }                                                                                          // 78
        )                                                                                            // 79
        .replace(/([\/.])/g, '\\$1')                                                                 // 80
        .replace(/\*/g, '(.*)');                                                                     // 81
                                                                                                     // 82
      self.re = new RegExp('^' + path + '$', options.sensitive ? '' : 'i');                          // 83
    }                                                                                                // 84
                                                                                                     // 85
    return this;                                                                                     // 86
  },                                                                                                 // 87
                                                                                                     // 88
  /**                                                                                                // 89
   * Returns an array of parameters given a path. The array may have named                           // 90
   * properties in addition to indexed values.                                                       // 91
   *                                                                                                 // 92
   * @param {String} path                                                                            // 93
   * @return {Array}                                                                                 // 94
   * @api public                                                                                     // 95
   */                                                                                                // 96
                                                                                                     // 97
  params: function (path) {                                                                          // 98
    if (!path)                                                                                       // 99
      return null;                                                                                   // 100
                                                                                                     // 101
    var params = [];                                                                                 // 102
    var m = this.exec(path);                                                                         // 103
    var queryString;                                                                                 // 104
    var keys = this.keys;                                                                            // 105
    var key;                                                                                         // 106
    var value;                                                                                       // 107
                                                                                                     // 108
    if (!m)                                                                                          // 109
      throw new Error('The route named "' + this.name + '" does not match the path "' + path + '"'); // 110
                                                                                                     // 111
    for (var i = 1, len = m.length; i < len; ++i) {                                                  // 112
      key = keys[i - 1];                                                                             // 113
      value = typeof m[i] == 'string' ? decodeURIComponent(m[i]) : m[i];                             // 114
      if (key) {                                                                                     // 115
        params[key.name] = params[key.name] !== undefined ?                                          // 116
          params[key.name] : value;                                                                  // 117
      } else                                                                                         // 118
        params.push(value);                                                                          // 119
    }                                                                                                // 120
                                                                                                     // 121
    path = decodeURI(path);                                                                          // 122
                                                                                                     // 123
    queryString = path.split('?')[1];                                                                // 124
    if (queryString)                                                                                 // 125
      queryString = queryString.split('#')[0];                                                       // 126
                                                                                                     // 127
    params.hash = path.split('#')[1];                                                                // 128
                                                                                                     // 129
    if (queryString) {                                                                               // 130
      _.each(queryString.split('&'), function (paramString) {                                        // 131
        paramParts = paramString.split('=');                                                         // 132
        params[paramParts[0]] = decodeURIComponent(paramParts[1]);                                   // 133
      });                                                                                            // 134
    }                                                                                                // 135
                                                                                                     // 136
    return params;                                                                                   // 137
  },                                                                                                 // 138
                                                                                                     // 139
  normalizePath: function (path) {                                                                   // 140
    var origin = Meteor.absoluteUrl();                                                               // 141
                                                                                                     // 142
    path = path.replace(origin, '');                                                                 // 143
                                                                                                     // 144
    var queryStringIndex = path.indexOf('?');                                                        // 145
    path = ~queryStringIndex ? path.slice(0, queryStringIndex) : path;                               // 146
                                                                                                     // 147
    var hashIndex = path.indexOf('#');                                                               // 148
    path = ~hashIndex ? path.slice(0, hashIndex) : path;                                             // 149
                                                                                                     // 150
    if (path.charAt(0) !== '/')                                                                      // 151
      path = '/' + path;                                                                             // 152
                                                                                                     // 153
    return path;                                                                                     // 154
  },                                                                                                 // 155
                                                                                                     // 156
  /**                                                                                                // 157
   * Returns true if the path matches and false otherwise.                                           // 158
   *                                                                                                 // 159
   * @param {String} path                                                                            // 160
   * @return {Boolean}                                                                               // 161
   * @api public                                                                                     // 162
   */                                                                                                // 163
  test: function (path) {                                                                            // 164
    return this.re.test(this.normalizePath(path));                                                   // 165
  },                                                                                                 // 166
                                                                                                     // 167
  exec: function (path) {                                                                            // 168
    return this.re.exec(this.normalizePath(path));                                                   // 169
  },                                                                                                 // 170
                                                                                                     // 171
  resolve: function (params, options) {                                                              // 172
    var value;                                                                                       // 173
    var isValueDefined;                                                                              // 174
    var result;                                                                                      // 175
    var wildCardCount = 0;                                                                           // 176
    var path = this.originalPath;                                                                    // 177
    var hash;                                                                                        // 178
    var query;                                                                                       // 179
    var isMissingParams = false;                                                                     // 180
                                                                                                     // 181
    options = options || {};                                                                         // 182
    params = params || [];                                                                           // 183
    query = options.query;                                                                           // 184
    hash = options.hash;                                                                             // 185
                                                                                                     // 186
    if (path instanceof RegExp) {                                                                    // 187
      throw new Error('Cannot currently resolve a regular expression path');                         // 188
    } else {                                                                                         // 189
      path = this.originalPath                                                                       // 190
        .replace(                                                                                    // 191
          /(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,                                                    // 192
          function (match, slash, format, key, capture, optional, offset) {                          // 193
            slash = slash || '';                                                                     // 194
            value = params[key];                                                                     // 195
            isValueDefined = typeof value !== 'undefined';                                           // 196
                                                                                                     // 197
            if (optional && !isValueDefined) {                                                       // 198
              value = '';                                                                            // 199
            } else if (!isValueDefined) {                                                            // 200
              isMissingParams = true;                                                                // 201
              return;                                                                                // 202
            }                                                                                        // 203
                                                                                                     // 204
            value = _.isFunction(value) ? value.call(params) : value;                                // 205
            var escapedValue = _.map(String(value).split('/'), function (segment) {                  // 206
              return encodeURIComponent(segment);                                                    // 207
            }).join('/');                                                                            // 208
            return slash + escapedValue                                                              // 209
          }                                                                                          // 210
        )                                                                                            // 211
        .replace(                                                                                    // 212
          /\*/g,                                                                                     // 213
          function (match) {                                                                         // 214
            if (typeof params[wildCardCount] === 'undefined') {                                      // 215
              throw new Error(                                                                       // 216
                'You are trying to access a wild card parameter at index ' +                         // 217
                wildCardCount +                                                                      // 218
                ' but the value of params at that index is undefined');                              // 219
            }                                                                                        // 220
                                                                                                     // 221
            var paramValue = String(params[wildCardCount++]);                                        // 222
            return _.map(paramValue.split('/'), function (segment) {                                 // 223
              return encodeURIComponent(segment);                                                    // 224
            }).join('/');                                                                            // 225
          }                                                                                          // 226
        );                                                                                           // 227
                                                                                                     // 228
      if (_.isObject(query)) {                                                                       // 229
        query = _.map(_.pairs(query), function (queryPart) {                                         // 230
          return queryPart[0] + '=' + encodeURIComponent(queryPart[1]);                              // 231
        }).join('&');                                                                                // 232
      }                                                                                              // 233
                                                                                                     // 234
      if (query && query.length)                                                                     // 235
        path = path + '?' + query;                                                                   // 236
                                                                                                     // 237
      if (hash) {                                                                                    // 238
        hash = encodeURI(hash.replace('#', ''));                                                     // 239
        path = query ?                                                                               // 240
          path + '#' + hash : path + '/#' + hash;                                                    // 241
      }                                                                                              // 242
    }                                                                                                // 243
                                                                                                     // 244
    // Because of optional possibly empty segments we normalize path here                            // 245
    path = path.replace(/\/+/g, '/'); // Multiple / -> one /                                         // 246
    path = path.replace(/^(.+)\/$/g, '$1'); // Removal of trailing /                                 // 247
                                                                                                     // 248
    return isMissingParams ? null : path;                                                            // 249
  },                                                                                                 // 250
                                                                                                     // 251
  path: function (params, options) {                                                                 // 252
    return this.resolve(params, options);                                                            // 253
  },                                                                                                 // 254
                                                                                                     // 255
  url: function (params, options) {                                                                  // 256
    var path = this.path(params, options);                                                           // 257
    if (path[0] === '/')                                                                             // 258
      path = path.slice(1, path.length);                                                             // 259
    return Meteor.absoluteUrl() + path;                                                              // 260
  },                                                                                                 // 261
                                                                                                     // 262
  getController: function (path, options) {                                                          // 263
    var self = this;                                                                                 // 264
    var handler;                                                                                     // 265
    var controllerClass;                                                                             // 266
    var controller;                                                                                  // 267
    var action;                                                                                      // 268
    var routeName;                                                                                   // 269
                                                                                                     // 270
    var resolveValue = Utils.resolveValue;                                                           // 271
    var toArray = Utils.toArray;                                                                     // 272
                                                                                                     // 273
    var findController = function (name) {                                                           // 274
      var controller = resolveValue(name);                                                           // 275
      if (typeof controller === 'undefined') {                                                       // 276
        throw new Error(                                                                             // 277
          'controller "' + name + '" is not defined');                                               // 278
      }                                                                                              // 279
                                                                                                     // 280
      return controller;                                                                             // 281
    };                                                                                               // 282
                                                                                                     // 283
    options = _.extend({}, options, {                                                                // 284
      path: path,                                                                                    // 285
      params: this.params(path),                                                                     // 286
      where: this.where,                                                                             // 287
      action: this.action                                                                            // 288
    });                                                                                              // 289
                                                                                                     // 290
    // case 1: controller option is defined on the route                                             // 291
    if (this.controller) {                                                                           // 292
      controllerClass = _.isString(this.controller) ?                                                // 293
        findController(this.controller) : this.controller;                                           // 294
      controller = new controllerClass(this.router, this, options);                                  // 295
      return controller;                                                                             // 296
    }                                                                                                // 297
                                                                                                     // 298
    // case 2: intelligently find the controller class in global namespace                           // 299
    routeName = this.name;                                                                           // 300
                                                                                                     // 301
    if (routeName) {                                                                                 // 302
      routeName = Router.convertRouteControllerName(routeName + 'Controller');                       // 303
      controllerClass = resolveValue(routeName);                                                     // 304
                                                                                                     // 305
      if (controllerClass) {                                                                         // 306
        controller = new controllerClass(this.router, this, options);                                // 307
        return controller;                                                                           // 308
      }                                                                                              // 309
    }                                                                                                // 310
                                                                                                     // 311
    // case 3: nothing found so create an anonymous controller                                       // 312
    return new RouteController(this.router, this, options);                                          // 313
  }                                                                                                  // 314
};                                                                                                   // 315
                                                                                                     // 316
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/route_controller.js                                                      //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
var rewriteLegacyHooks = function (controller) {                                                     // 1
  var legacyToNew = {                                                                                // 2
    'load': 'onRun',                                                                                 // 3
    'before': 'onBeforeAction',                                                                      // 4
    'after':'onAfterAction',                                                                         // 5
    'unload':'onStop'                                                                                // 6
  };                                                                                                 // 7
                                                                                                     // 8
  _.each(legacyToNew, function (newHook, oldHook) {                                                  // 9
    var hasOld = false;                                                                              // 10
                                                                                                     // 11
    if (_.has(controller.options, oldHook)) {                                                        // 12
      hasOld = true;                                                                                 // 13
      controller.options[newHook] = controller.options[oldHook];                                     // 14
    }                                                                                                // 15
                                                                                                     // 16
    // search on the object and the proto chain                                                      // 17
    if (typeof controller[oldHook] !== 'undefined') {                                                // 18
      hasOld = true;                                                                                 // 19
      controller[newHook] = controller[oldHook];                                                     // 20
    }                                                                                                // 21
                                                                                                     // 22
    if (hasOld) {                                                                                    // 23
      Utils.notifyDeprecated({                                                                       // 24
        where: 'RouteController',                                                                    // 25
        name: oldHook,                                                                               // 26
        instead: newHook                                                                             // 27
      });                                                                                            // 28
    }                                                                                                // 29
  });                                                                                                // 30
};                                                                                                   // 31
                                                                                                     // 32
RouteController = function (router, route, options) {                                                // 33
  var self = this;                                                                                   // 34
                                                                                                     // 35
  if (!(router instanceof IronRouter))                                                               // 36
    throw new Error('RouteController requires a router');                                            // 37
                                                                                                     // 38
  if (!(route instanceof Route))                                                                     // 39
    throw new Error('RouteController requires a route');                                             // 40
                                                                                                     // 41
  options = this.options = options || {};                                                            // 42
                                                                                                     // 43
  this.router = router;                                                                              // 44
  this.route = route;                                                                                // 45
                                                                                                     // 46
  this.path = options.path || '';                                                                    // 47
  this.params = options.params || [];                                                                // 48
  this.where = options.where || 'client';                                                            // 49
  this.action = options.action || this.action;                                                       // 50
                                                                                                     // 51
  rewriteLegacyHooks(this);                                                                          // 52
};                                                                                                   // 53
                                                                                                     // 54
RouteController.prototype = {                                                                        // 55
  constructor: RouteController,                                                                      // 56
                                                                                                     // 57
  /**                                                                                                // 58
   * Returns the value of a property, searching for the property in this lookup                      // 59
   * order:                                                                                          // 60
   *                                                                                                 // 61
   *   1. RouteController options                                                                    // 62
   *   2. RouteController prototype                                                                  // 63
   *   3. Route options                                                                              // 64
   *   4. Router options                                                                             // 65
   */                                                                                                // 66
  lookupProperty: function (key) {                                                                   // 67
    var value;                                                                                       // 68
                                                                                                     // 69
    if (!_.isString(key))                                                                            // 70
      throw new Error('key must be a string');                                                       // 71
                                                                                                     // 72
    // 1. RouteController options                                                                    // 73
    if (typeof (value = this.options[key]) !== 'undefined')                                          // 74
      return value;                                                                                  // 75
                                                                                                     // 76
    // 2. RouteController instance                                                                   // 77
    if (typeof (value = this[key]) !== 'undefined')                                                  // 78
      return value;                                                                                  // 79
                                                                                                     // 80
    var opts;                                                                                        // 81
                                                                                                     // 82
    // 3. Route options                                                                              // 83
    opts = this.route.options;                                                                       // 84
    if (opts && typeof (value = opts[key]) !== 'undefined')                                          // 85
      return value;                                                                                  // 86
                                                                                                     // 87
    // 4. Router options                                                                             // 88
    opts = this.router.options;                                                                      // 89
    if (opts && typeof (value = opts[key]) !== 'undefined')                                          // 90
      return value;                                                                                  // 91
                                                                                                     // 92
    // 5. Oops couldn't find property                                                                // 93
    return undefined;                                                                                // 94
  },                                                                                                 // 95
                                                                                                     // 96
  runHooks: function (hookName, more, cb) {                                                          // 97
    var self = this;                                                                                 // 98
    var ctor = this.constructor;                                                                     // 99
                                                                                                     // 100
    if (!_.isString(hookName))                                                                       // 101
      throw new Error('hookName must be a string');                                                  // 102
                                                                                                     // 103
    if (more && !_.isArray(more))                                                                    // 104
      throw new Error('more must be an array of functions');                                         // 105
                                                                                                     // 106
    var isPaused = false;                                                                            // 107
                                                                                                     // 108
    var lookupHook = function (nameOrFn) {                                                           // 109
      var fn = nameOrFn;                                                                             // 110
                                                                                                     // 111
      // if we already have a func just return it                                                    // 112
      if (_.isFunction(fn))                                                                          // 113
        return fn;                                                                                   // 114
                                                                                                     // 115
      // look up one of the out-of-box hooks like                                                    // 116
      // 'loaded or 'dataNotFound' if the nameOrFn is a                                              // 117
      // string                                                                                      // 118
      if (_.isString(fn)) {                                                                          // 119
        if (_.isFunction(Router.hooks[fn]))                                                          // 120
          return Router.hooks[fn];                                                                   // 121
      }                                                                                              // 122
                                                                                                     // 123
      // we couldn't find it so throw an error                                                       // 124
      throw new Error("No hook found named: ", nameOrFn);                                            // 125
    };                                                                                               // 126
                                                                                                     // 127
    // concatenate together hook arrays from the inheritance                                         // 128
    // heirarchy, starting at the top parent down to the child.                                      // 129
    var collectInheritedHooks = function (ctor) {                                                    // 130
      var hooks = [];                                                                                // 131
                                                                                                     // 132
      if (ctor.__super__)                                                                            // 133
        hooks = hooks.concat(collectInheritedHooks(ctor.__super__.constructor));                     // 134
                                                                                                     // 135
      return Utils.hasOwnProperty(ctor.prototype, hookName) ?                                        // 136
        hooks.concat(ctor.prototype[hookName]) : hooks;                                              // 137
    };                                                                                               // 138
                                                                                                     // 139
                                                                                                     // 140
    // get a list of hooks to run in the following order:                                            // 141
    // 1. RouteController option hooks                                                               // 142
    // 2. RouteController proto hooks (including inherited super to child)                           // 143
    // 3. RouteController object hooks                                                               // 144
    // 4. Router global hooks                                                                        // 145
    // 5. Route option hooks                                                                         // 146
    // 6. more                                                                                       // 147
                                                                                                     // 148
    var toArray = Utils.toArray;                                                                     // 149
    var routerHooks = this.router.getHooks(hookName, this.route.name);                               // 150
                                                                                                     // 151
    var opts;                                                                                        // 152
    opts = this.route.options;                                                                       // 153
    var routeOptionHooks = toArray(opts && opts[hookName]);                                          // 154
                                                                                                     // 155
    opts = this.options;                                                                             // 156
    var optionHooks = toArray(opts && opts[hookName]);                                               // 157
                                                                                                     // 158
    var protoHooks = collectInheritedHooks(this.constructor);                                        // 159
                                                                                                     // 160
    var objectHooks;                                                                                 // 161
    // don't accidentally grab the prototype hooks!                                                  // 162
    // this makes sure the hook is on the object itself                                              // 163
    // not on its constructor's prototype object.                                                    // 164
    if (_.has(this, hookName))                                                                       // 165
      objectHooks = toArray(this[hookName])                                                          // 166
    else                                                                                             // 167
      objectHooks = [];                                                                              // 168
                                                                                                     // 169
    var allHooks = optionHooks                                                                       // 170
      .concat(protoHooks)                                                                            // 171
      .concat(objectHooks)                                                                           // 172
      .concat(routeOptionHooks)                                                                      // 173
      .concat(routerHooks)                                                                           // 174
      .concat(more);                                                                                 // 175
                                                                                                     // 176
    var isPaused = false;                                                                            // 177
    var pauseFn = function () {                                                                      // 178
      isPaused = true;                                                                               // 179
    };                                                                                               // 180
                                                                                                     // 181
    for (var i = 0, hook; hook = allHooks[i]; i++) {                                                 // 182
      var hookFn = lookupHook(hook);                                                                 // 183
                                                                                                     // 184
      if (!isPaused && !this.isStopped)                                                              // 185
        hookFn.call(self, pauseFn, i);                                                               // 186
    }                                                                                                // 187
                                                                                                     // 188
    cb && cb.call(self, isPaused);                                                                   // 189
    return isPaused;                                                                                 // 190
  },                                                                                                 // 191
                                                                                                     // 192
  action: function () {                                                                              // 193
    throw new Error('not implemented');                                                              // 194
  },                                                                                                 // 195
                                                                                                     // 196
  stop: function (cb) {                                                                              // 197
    return this._stopController(cb);                                                                 // 198
  },                                                                                                 // 199
                                                                                                     // 200
  _stopController: function (cb) {                                                                   // 201
    var self = this;                                                                                 // 202
                                                                                                     // 203
    if (this.isStopped)                                                                              // 204
      return;                                                                                        // 205
                                                                                                     // 206
    self.isRunning = false;                                                                          // 207
    self.runHooks('onStop');                                                                         // 208
    self.isStopped = true;                                                                           // 209
    cb && cb.call(self);                                                                             // 210
  },                                                                                                 // 211
                                                                                                     // 212
  _run: function () {                                                                                // 213
    throw new Error('not implemented');                                                              // 214
  }                                                                                                  // 215
};                                                                                                   // 216
                                                                                                     // 217
_.extend(RouteController, {                                                                          // 218
  /**                                                                                                // 219
   * Inherit from RouteController                                                                    // 220
   *                                                                                                 // 221
   * @param {Object} definition Prototype properties for inherited class.                            // 222
   */                                                                                                // 223
                                                                                                     // 224
  extend: function (definition) {                                                                    // 225
    return Utils.extend(this, definition, function (definition) {                                    // 226
      var klass = this;                                                                              // 227
                                                                                                     // 228
      /*                                                                                             // 229
        Allow calling a class method from javascript, directly in the subclass                       // 230
        definition.                                                                                  // 231
                                                                                                     // 232
        Instead of this:                                                                             // 233
          MyController = RouteController.extend({...});                                              // 234
          MyController.before(function () {});                                                       // 235
                                                                                                     // 236
        You can do:                                                                                  // 237
          MyController = RouteController.extend({                                                    // 238
            before: function () {}                                                                   // 239
          });                                                                                        // 240
                                                                                                     // 241
        And in Coffeescript you can do:                                                              // 242
         MyController extends RouteController                                                        // 243
           @before function () {}                                                                    // 244
       */                                                                                            // 245
    });                                                                                              // 246
  }                                                                                                  // 247
});                                                                                                  // 248
                                                                                                     // 249
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/router.js                                                                //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
IronRouter = function (options) {                                                                    // 1
  var self = this;                                                                                   // 2
                                                                                                     // 3
  this.configure(options);                                                                           // 4
                                                                                                     // 5
  /**                                                                                                // 6
   * The routes array which doubles as a named route index by adding                                 // 7
   * properties to the array.                                                                        // 8
   *                                                                                                 // 9
   * @api public                                                                                     // 10
   */                                                                                                // 11
  this.routes = [];                                                                                  // 12
                                                                                                     // 13
  /**                                                                                                // 14
   * Default name conversions for controller                                                         // 15
   * and template lookup.                                                                            // 16
   */                                                                                                // 17
  this._nameConverters = {};                                                                         // 18
  this.setNameConverter('Template', 'none');                                                         // 19
  this.setNameConverter('RouteController', 'upperCamelCase');                                        // 20
                                                                                                     // 21
  this._globalHooks = {};                                                                            // 22
  _.each(IronRouter.HOOK_TYPES, function (type) {                                                    // 23
    self._globalHooks[type] = [];                                                                    // 24
                                                                                                     // 25
    // example:                                                                                      // 26
    //  self.onRun = function (hook, options) {                                                      // 27
    //    return self.addHook('onRun', hook, options);                                               // 28
    //  };                                                                                           // 29
    self[type] = function (hook, options) {                                                          // 30
      return self.addHook(type, hook, options);                                                      // 31
    };                                                                                               // 32
  });                                                                                                // 33
                                                                                                     // 34
  _.each(IronRouter.LEGACY_HOOK_TYPES, function (type, legacyType) {                                 // 35
    self[legacyType] = function () {                                                                 // 36
      Utils.notifyDeprecated({                                                                       // 37
        where: 'Router',                                                                             // 38
        name: legacyType,                                                                            // 39
        instead: type                                                                                // 40
      });                                                                                            // 41
                                                                                                     // 42
      return self[type].apply(this, arguments);                                                      // 43
    }                                                                                                // 44
  });                                                                                                // 45
};                                                                                                   // 46
                                                                                                     // 47
IronRouter.HOOK_TYPES = [                                                                            // 48
  'onRun',                                                                                           // 49
  'onData',                                                                                          // 50
  'onBeforeAction',                                                                                  // 51
  'onAfterAction',                                                                                   // 52
  'onStop',                                                                                          // 53
                                                                                                     // 54
  // not technically a hook but we'll use it                                                         // 55
  // in a similar way. This will cause waitOn                                                        // 56
  // to be added as a method to the Router and then                                                  // 57
  // it can be selectively applied to specific routes                                                // 58
  'waitOn'                                                                                           // 59
];                                                                                                   // 60
                                                                                                     // 61
IronRouter.LEGACY_HOOK_TYPES = {                                                                     // 62
  'load': 'onRun',                                                                                   // 63
  'before': 'onBeforeAction',                                                                        // 64
  'after': 'onAfterAction',                                                                          // 65
  'unload': 'onStop'                                                                                 // 66
};                                                                                                   // 67
                                                                                                     // 68
IronRouter.prototype = {                                                                             // 69
  constructor: IronRouter,                                                                           // 70
                                                                                                     // 71
  /**                                                                                                // 72
   * Configure instance with options. This can be called at any time. If the                         // 73
   * instance options object hasn't been created yet it is created here.                             // 74
   *                                                                                                 // 75
   * @param {Object} options                                                                         // 76
   * @return {IronRouter}                                                                            // 77
   * @api public                                                                                     // 78
   */                                                                                                // 79
                                                                                                     // 80
  configure: function (options) {                                                                    // 81
    var self = this;                                                                                 // 82
                                                                                                     // 83
    options = options || {};                                                                         // 84
    this.options = this.options || {};                                                               // 85
    _.extend(this.options, options);                                                                 // 86
                                                                                                     // 87
    // e.g. before: fn OR before: [fn1, fn2]                                                         // 88
    _.each(IronRouter.HOOK_TYPES, function(type) {                                                   // 89
      if (self.options[type]) {                                                                      // 90
        _.each(Utils.toArray(self.options[type]), function(hook) {                                   // 91
          self.addHook(type, hook);                                                                  // 92
        });                                                                                          // 93
                                                                                                     // 94
        delete self.options[type];                                                                   // 95
      }                                                                                              // 96
    });                                                                                              // 97
                                                                                                     // 98
    _.each(IronRouter.LEGACY_HOOK_TYPES, function(type, legacyType) {                                // 99
      if (self.options[legacyType]) {                                                                // 100
        // XXX: warning?                                                                             // 101
        _.each(Utils.toArray(self.options[legacyType]), function(hook) {                             // 102
          self.addHook(type, hook);                                                                  // 103
        });                                                                                          // 104
                                                                                                     // 105
        delete self.options[legacyType];                                                             // 106
      }                                                                                              // 107
    });                                                                                              // 108
                                                                                                     // 109
    if (options.templateNameConverter)                                                               // 110
      this.setNameConverter('Template', options.templateNameConverter);                              // 111
                                                                                                     // 112
    if (options.routeControllerNameConverter)                                                        // 113
      this.setNameConverter('RouteController', options.routeControllerNameConverter);                // 114
                                                                                                     // 115
    return this;                                                                                     // 116
  },                                                                                                 // 117
                                                                                                     // 118
  convertTemplateName: function (input) {                                                            // 119
    var converter = this._nameConverters['Template'];                                                // 120
    if (!converter)                                                                                  // 121
      throw new Error('No name converter found for Template');                                       // 122
    return converter(input);                                                                         // 123
  },                                                                                                 // 124
                                                                                                     // 125
  convertRouteControllerName: function (input) {                                                     // 126
    var converter = this._nameConverters['RouteController'];                                         // 127
    if (!converter)                                                                                  // 128
      throw new Error('No name converter found for RouteController');                                // 129
    return converter(input);                                                                         // 130
  },                                                                                                 // 131
                                                                                                     // 132
  setNameConverter: function (key, stringOrFunc) {                                                   // 133
    var converter;                                                                                   // 134
                                                                                                     // 135
    if (_.isFunction(stringOrFunc))                                                                  // 136
      converter = stringOrFunc;                                                                      // 137
                                                                                                     // 138
    if (_.isString(stringOrFunc))                                                                    // 139
      converter = Utils.StringConverters[stringOrFunc];                                              // 140
                                                                                                     // 141
    if (!converter) {                                                                                // 142
      throw new Error('No converter found named: ' + stringOrFunc);                                  // 143
    }                                                                                                // 144
                                                                                                     // 145
    this._nameConverters[key] = converter;                                                           // 146
    return this;                                                                                     // 147
  },                                                                                                 // 148
                                                                                                     // 149
  /**                                                                                                // 150
   *                                                                                                 // 151
   * Add a hook to all routes. The hooks will apply to all routes,                                   // 152
   * unless you name routes to include or exclude via `only` and `except` options                    // 153
   *                                                                                                 // 154
   * @param {String} [type] one of 'load', 'unload', 'before' or 'after'                             // 155
   * @param {Object} [options] Options to controll the hooks [optional]                              // 156
   * @param {Function} [hook] Callback to run                                                        // 157
   * @return {IronRouter}                                                                            // 158
   * @api public                                                                                     // 159
   *                                                                                                 // 160
   */                                                                                                // 161
                                                                                                     // 162
  addHook: function(type, hook, options) {                                                           // 163
    options = options || {}                                                                          // 164
                                                                                                     // 165
    if (options.only)                                                                                // 166
      options.only = Utils.toArray(options.only);                                                    // 167
    if (options.except)                                                                              // 168
      options.except = Utils.toArray(options.except);                                                // 169
                                                                                                     // 170
    this._globalHooks[type].push({options: options, hook: hook});                                    // 171
                                                                                                     // 172
    return this;                                                                                     // 173
  },                                                                                                 // 174
                                                                                                     // 175
  /**                                                                                                // 176
   *                                                                                                 // 177
   * Fetch the list of global hooks that apply to the given route name.                              // 178
   * Hooks are defined by the .addHook() function above.                                             // 179
   *                                                                                                 // 180
   * @param {String} [type] one of IronRouter.HOOK_TYPES                                             // 181
   * @param {String} [name] the name of the route we are interested in                               // 182
   * @return {[Function]} [hooks] an array of hooks to run                                           // 183
   * @api public                                                                                     // 184
   *                                                                                                 // 185
   */                                                                                                // 186
                                                                                                     // 187
  getHooks: function(type, name) {                                                                   // 188
    var hooks = [];                                                                                  // 189
                                                                                                     // 190
    _.each(this._globalHooks[type], function(hook) {                                                 // 191
      var options = hook.options;                                                                    // 192
                                                                                                     // 193
      if (options.except && _.include(options.except, name))                                         // 194
        return;                                                                                      // 195
                                                                                                     // 196
      if (options.only && ! _.include(options.only, name))                                           // 197
        return;                                                                                      // 198
                                                                                                     // 199
      hooks.push(hook.hook);                                                                         // 200
    });                                                                                              // 201
                                                                                                     // 202
    return hooks;                                                                                    // 203
  },                                                                                                 // 204
                                                                                                     // 205
                                                                                                     // 206
  /**                                                                                                // 207
   * Convenience function to define a bunch of routes at once. In the future we                      // 208
   * might call the callback with a custom dsl.                                                      // 209
   *                                                                                                 // 210
   * Example:                                                                                        // 211
   *  Router.map(function () {                                                                       // 212
   *    this.route('posts');                                                                         // 213
   *  });                                                                                            // 214
   *                                                                                                 // 215
   *  @param {Function} cb                                                                           // 216
   *  @return {IronRouter}                                                                           // 217
   *  @api public                                                                                    // 218
   */                                                                                                // 219
                                                                                                     // 220
  map: function (cb) {                                                                               // 221
    Utils.assert(_.isFunction(cb),                                                                   // 222
           'map requires a function as the first parameter');                                        // 223
    cb.call(this);                                                                                   // 224
    return this;                                                                                     // 225
  },                                                                                                 // 226
                                                                                                     // 227
  /**                                                                                                // 228
   * Define a new route. You must name the route, but as a second parameter you                      // 229
   * can either provide an object of options or a Route instance.                                    // 230
   *                                                                                                 // 231
   * @param {String} name The name of the route                                                      // 232
   * @param {Object} [options] Options to pass along to the route                                    // 233
   * @return {Route}                                                                                 // 234
   * @api public                                                                                     // 235
   */                                                                                                // 236
                                                                                                     // 237
  route: function (name, options) {                                                                  // 238
    var route;                                                                                       // 239
                                                                                                     // 240
    Utils.assert(_.isString(name), 'name is a required parameter');                                  // 241
                                                                                                     // 242
    if (options instanceof Route)                                                                    // 243
      route = options;                                                                               // 244
    else                                                                                             // 245
      route = new Route(this, name, options);                                                        // 246
                                                                                                     // 247
    this.routes[name] = route;                                                                       // 248
    this.routes.push(route);                                                                         // 249
    return route;                                                                                    // 250
  },                                                                                                 // 251
                                                                                                     // 252
  path: function (routeName, params, options) {                                                      // 253
    var route = this.routes[routeName];                                                              // 254
    Utils.warn(route,                                                                                // 255
     'You called Router.path for a route named ' + routeName + ' but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.path(params, options);                                                     // 257
  },                                                                                                 // 258
                                                                                                     // 259
  url: function (routeName, params, options) {                                                       // 260
    var route = this.routes[routeName];                                                              // 261
    Utils.warn(route,                                                                                // 262
      'You called Router.url for a route named "' + routeName + '" but that route doesn\'t seem to exist. Are you sure you created it?');
    return route && route.url(params, options);                                                      // 264
  },                                                                                                 // 265
                                                                                                     // 266
  match: function (path) {                                                                           // 267
    return _.find(this.routes, function(r) { return r.test(path); });                                // 268
  },                                                                                                 // 269
                                                                                                     // 270
  dispatch: function (path, options, cb) {                                                           // 271
    var route = this.match(path);                                                                    // 272
                                                                                                     // 273
    if (! route)                                                                                     // 274
      return this.onRouteNotFound(path, options);                                                    // 275
                                                                                                     // 276
    if (route.where !== (Meteor.isClient ? 'client' : 'server'))                                     // 277
      return this.onUnhandled(path, options);                                                        // 278
                                                                                                     // 279
    var controller = route.getController(path, options);                                             // 280
    this.run(controller, cb);                                                                        // 281
  },                                                                                                 // 282
                                                                                                     // 283
  run: function (controller, cb) {                                                                   // 284
    var self = this;                                                                                 // 285
    var where = Meteor.isClient ? 'client' : 'server';                                               // 286
                                                                                                     // 287
    Utils.assert(controller, 'run requires a controller');                                           // 288
                                                                                                     // 289
    // one last check to see if we should handle the route here                                      // 290
    if (controller.where != where) {                                                                 // 291
      self.onUnhandled(controller.path, controller.options);                                         // 292
      return;                                                                                        // 293
    }                                                                                                // 294
                                                                                                     // 295
    var run = function () {                                                                          // 296
      self._currentController = controller;                                                          // 297
      self._currentController._run();                                                                // 298
    };                                                                                               // 299
                                                                                                     // 300
    // if we already have a current controller let's stop it and then                                // 301
    // run the new one once the old controller is stopped. this will add                             // 302
    // the run function as an onInvalidate callback to the controller's                              // 303
    // computation. Otherwse, just run the new controller.                                           // 304
    if (this._currentController)                                                                     // 305
      this._currentController._stopController(run);                                                  // 306
    else                                                                                             // 307
      run();                                                                                         // 308
  },                                                                                                 // 309
                                                                                                     // 310
  onUnhandled: function (path, options) {                                                            // 311
    throw new Error('onUnhandled not implemented');                                                  // 312
  },                                                                                                 // 313
                                                                                                     // 314
  onRouteNotFound: function (path, options) {                                                        // 315
    throw new Error('Oh no! No route found for path: "' + path + '"');                               // 316
  }                                                                                                  // 317
};                                                                                                   // 318
                                                                                                     // 319
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/server/route_controller.js                                               //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
RouteController = Utils.extend(RouteController, {                                                    // 1
  constructor: function () {                                                                         // 2
    RouteController.__super__.constructor.apply(this, arguments);                                    // 3
    this.request = this.options.request;                                                             // 4
    this.response = this.options.response;                                                           // 5
    this.next = this.options.next;                                                                   // 6
                                                                                                     // 7
    this._dataValue = this.data || {};                                                               // 8
                                                                                                     // 9
    this.data = function (value) {                                                                   // 10
      if (value)                                                                                     // 11
        this._dataValue = value;                                                                     // 12
      else                                                                                           // 13
        return _.isFunction(this._dataValue) ? this._dataValue.call(this) : this._dataValue;         // 14
    };                                                                                               // 15
  },                                                                                                 // 16
                                                                                                     // 17
  _run: function () {                                                                                // 18
    var self = this                                                                                  // 19
      , args = _.toArray(arguments);                                                                 // 20
                                                                                                     // 21
    try {                                                                                            // 22
      // if we're already running, you can't call run again without                                  // 23
      // calling stop first.                                                                         // 24
      if (self.isRunning)                                                                            // 25
        throw new Error("You called _run without first calling stop");                               // 26
                                                                                                     // 27
      self.isRunning = true;                                                                         // 28
      self.isStopped = false;                                                                        // 29
                                                                                                     // 30
      var action = _.isFunction(self.action) ? self.action : self[self.action];                      // 31
      Utils.assert(action,                                                                           // 32
        "You don't have an action named \"" + self.action + "\" defined on your RouteController");   // 33
                                                                                                     // 34
      this.runHooks('onRun');                                                                        // 35
      this.runHooks('onBeforeAction');                                                               // 36
      action.call(this);                                                                             // 37
      this.runHooks('onAfterAction');                                                                // 38
                                                                                                     // 39
    } catch (e) {                                                                                    // 40
      console.error(e.toString());                                                                   // 41
      this.response.end();                                                                           // 42
    } finally {                                                                                      // 43
      this.response.end();                                                                           // 44
    }                                                                                                // 45
  },                                                                                                 // 46
                                                                                                     // 47
  action: function () {                                                                              // 48
    this.response.end();                                                                             // 49
  }                                                                                                  // 50
});                                                                                                  // 51
                                                                                                     // 52
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                   //
// packages/iron-router/lib/server/router.js                                                         //
//                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                     //
var connect = Npm.require('connect');                                                                // 1
var Fiber = Npm.require('fibers');                                                                   // 2
                                                                                                     // 3
var root = global;                                                                                   // 4
                                                                                                     // 5
var connectHandlers                                                                                  // 6
  , connect;                                                                                         // 7
                                                                                                     // 8
if (typeof __meteor_bootstrap__.app !== 'undefined') {                                               // 9
  connectHandlers = __meteor_bootstrap__.app;                                                        // 10
} else {                                                                                             // 11
  connectHandlers = WebApp.connectHandlers;                                                          // 12
}                                                                                                    // 13
                                                                                                     // 14
IronRouter = Utils.extend(IronRouter, {                                                              // 15
  constructor: function (options) {                                                                  // 16
    var self = this;                                                                                 // 17
    IronRouter.__super__.constructor.apply(this, arguments);                                         // 18
    Meteor.startup(function () {                                                                     // 19
      setTimeout(function () {                                                                       // 20
        if (self.options.autoStart !== false)                                                        // 21
          self.start();                                                                              // 22
      });                                                                                            // 23
    });                                                                                              // 24
  },                                                                                                 // 25
                                                                                                     // 26
  start: function () {                                                                               // 27
    connectHandlers                                                                                  // 28
      .use(connect.query())                                                                          // 29
      .use(connect.bodyParser())                                                                     // 30
      .use(_.bind(this.onRequest, this));                                                            // 31
  },                                                                                                 // 32
                                                                                                     // 33
  onRequest: function (req, res, next) {                                                             // 34
    var self = this;                                                                                 // 35
    Fiber(function () {                                                                              // 36
      self.dispatch(req.url, {                                                                       // 37
        request: req,                                                                                // 38
        response: res,                                                                               // 39
        next: next                                                                                   // 40
      });                                                                                            // 41
    }).run();                                                                                        // 42
  },                                                                                                 // 43
                                                                                                     // 44
  run: function (controller, cb) {                                                                   // 45
    IronRouter.__super__.run.apply(this, arguments);                                                 // 46
    if (controller === this._currentController)                                                      // 47
      cb && cb(controller);                                                                          // 48
  },                                                                                                 // 49
                                                                                                     // 50
  stop: function () {                                                                                // 51
  },                                                                                                 // 52
                                                                                                     // 53
  onUnhandled: function (path, options) {                                                            // 54
    options.next();                                                                                  // 55
  },                                                                                                 // 56
                                                                                                     // 57
  onRouteNotFound: function (path, options) {                                                        // 58
    options.next();                                                                                  // 59
  }                                                                                                  // 60
});                                                                                                  // 61
                                                                                                     // 62
Router = new IronRouter;                                                                             // 63
                                                                                                     // 64
///////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron-router'] = {
  RouteController: RouteController,
  Route: Route,
  Router: Router,
  Utils: Utils,
  IronRouter: IronRouter
};

})();
