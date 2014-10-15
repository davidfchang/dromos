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
var Reload = Package.reload.Reload;

/* Package-scope variables */
var define, require, _loadModule, _defineModule, _defineGlobal;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/famono/requirejs_client.js                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
// The library contains all the dependencies, they are not initialized                       // 1
var modules = {};                                                                            // 2
                                                                                             // 3
var getModule = function(name, isDefining) {                                                 // 4
  if (name) {                                                                                // 5
                                                                                             // 6
    var last = '/' + name.split('/').pop();                                                  // 7
    // We either return the module or init an empty module for tracking                      // 8
    return modules[name] || modules[name + '/index'] || modules[name + last] ||              // 9
      (modules[name] = { exports: {}, callbacks: [], loaded: (isDefining) ? false : null }); // 10
                                                                                             // 11
  } else {                                                                                   // 12
    return {};                                                                               // 13
  }                                                                                          // 14
};                                                                                           // 15
                                                                                             // 16
/**                                                                                          // 17
 * @method _require                                                                          // 18
 * @param {String} name Name of module                                                       // 19
 * @returns {Any} Exported data                                                              // 20
 * This function expects that any dependencies are all loaded                                // 21
 * This function will return the module instance or initialize the module                    // 22
 */                                                                                          // 23
require = function(name) {                                                                   // 24
  // Get the module                                                                          // 25
  var module = getModule(name);                                                              // 26
  // Check that the module is loaded                                                         // 27
  if (module.loaded === true) {                                                              // 28
                                                                                             // 29
    // Check if the library is found                                                         // 30
    if (typeof module.f !== 'function') {                                                    // 31
      // If we are loaded and we dont have a function then return then                       // 32
      // assume that we are already initialized and return exports                           // 33
      return module.exports;                                                                 // 34
    } else {                                                                                 // 35
                                                                                             // 36
      // This is the current format Famo.us uses / requireJs or commonJS                     // 37
      module.f(require, {}, module);                                                         // 38
                                                                                             // 39
      // Set the now required library                                                        // 40
      modules[name] = module;                                                                // 41
                                                                                             // 42
      // Clean up, help GC                                                                   // 43
      module.f = null;                                                                       // 44
                                                                                             // 45
      // We return the things we want to export                                              // 46
      return module.exports;                                                                 // 47
                                                                                             // 48
    }                                                                                        // 49
                                                                                             // 50
  } else {                                                                                   // 51
    // The module is not defined                                                             // 52
    throw new Error('Famono: library "' + name + '" not defined');                           // 53
  }                                                                                          // 54
                                                                                             // 55
};                                                                                           // 56
                                                                                             // 57
/**                                                                                          // 58
 * @method _loadScript                                                                       // 59
 * @param {String} libraryName Library to load                                               // 60
 * @param {Function} callback (err, libraryName)                                             // 61
 * This method loads javascript libraries                                                    // 62
 */                                                                                          // 63
var _loadScript = function(libraryName, callback) {                                          // 64
  // Get pointer to the head tag                                                             // 65
  var head = document.getElementsByTagName('head').item(0);                                  // 66
                                                                                             // 67
  // Create script element                                                                   // 68
  var script = document.createElement('script');                                             // 69
                                                                                             // 70
  // Set the onload event                                                                    // 71
  script.onload = function() {                                                               // 72
    callback(null, libraryName);                                                             // 73
  };                                                                                         // 74
                                                                                             // 75
  // Set the on error event                                                                  // 76
  script.onerror = function(err) {                                                           // 77
    callback(err, libraryName);                                                              // 78
  };                                                                                         // 79
                                                                                             // 80
  // Set the type to js                                                                      // 81
  script.type = 'text/javascript';                                                           // 82
                                                                                             // 83
  // Set src to module                                                                       // 84
  script.src = '/lib/' + libraryName;                                                        // 85
                                                                                             // 86
  // Inject the script tag                                                                   // 87
  head.appendChild(script);                                                                  // 88
};                                                                                           // 89
                                                                                             // 90
/**                                                                                          // 91
 * @method loadModuleDefinition                                                              // 92
 * @param {String} name module to load                                                       // 93
 * @param {Function} callback() is called when module is defined                             // 94
 * This function load module definitions                                                     // 95
 */                                                                                          // 96
var loadModuleDefinition = function(name, f) {                                               // 97
  // Make sure the callback is set                                                           // 98
  if (typeof f !== 'function')                                                               // 99
    throw new Error('Famono: loadModuleDefinition require a callback as function');          // 100
  // Get the module                                                                          // 101
  var module = getModule(name);                                                              // 102
  // Check if module is loaded                                                               // 103
  if (module.loaded === true) {                                                              // 104
    // We callback instantly                                                                 // 105
    f();                                                                                     // 106
  } else {                                                                                   // 107
    // Add the function                                                                      // 108
    module.callbacks.push(f);                                                                // 109
    // load module...                                                                        // 110
    if (module.loaded === null) {                                                            // 111
      // Set the module to be loading                                                        // 112
      module.loaded = false;                                                                 // 113
      // We are not loading the module so we start loading                                   // 114
      _loadScript(name, function(err) {                                                      // 115
        if (err) {                                                                           // 116
          // On error we reset                                                               // 117
          // XXX: should we start a retry algorithm? eg. 5 attepmts then final               // 118
          // failure?                                                                        // 119
          module.loaded = null;                                                              // 120
        }                                                                                    // 121
        // We dont have to do anything else - the module will trigger loaded                 // 122
      });                                                                                    // 123
    }                                                                                        // 124
  }                                                                                          // 125
};                                                                                           // 126
                                                                                             // 127
/**                                                                                          // 128
 * @method moduleDefineDone                                                                  // 129
 * @param {String} name module to mark as defined                                            // 130
 * @param {Function} f The module function                                                   // 131
 * This function marks modules as defined                                                    // 132
 */                                                                                          // 133
var moduleDefineDone = function(name, f) {                                                   // 134
  if (name) {                                                                                // 135
    var module = getModule(name);                                                            // 136
    // Set loaded flag                                                                       // 137
    module.loaded = true;                                                                    // 138
    // Register the library                                                                  // 139
    module.f = f;                                                                            // 140
    // Call back all listeners                                                               // 141
    while (module.callbacks.length) {                                                        // 142
      // We pop out the listener callbacks                                                   // 143
      module.callbacks.pop()(null, name);                                                    // 144
    }                                                                                        // 145
  }                                                                                          // 146
};                                                                                           // 147
                                                                                             // 148
/**                                                                                          // 149
 * @method loadLibraries                                                                     // 150
 * @param {Array} deps List of dependencies to load                                          // 151
 * @param {Function} callback This function is called when deps are loaded                   // 152
 * This function makes sure only to run callback when all dependecies are loaded             // 153
 */                                                                                          // 154
var loadLibraries = function(deps, callback) {                                               // 155
  // Expected callbacks                                                                      // 156
  var count = deps && deps.length;                                                           // 157
  // Load dependencies                                                                       // 158
  if (count) {                                                                               // 159
    // Load each dep                                                                         // 160
    for (var i = 0; i < deps.length; i++) {                                                  // 161
      // We wait until the submodules have loaded                                            // 162
      loadModuleDefinition(deps[i], function() {                                             // 163
        if (--count === 0) callback(moduleDefineDone);                                       // 164
      });                                                                                    // 165
                                                                                             // 166
    }                                                                                        // 167
  } else {                                                                                   // 168
    // Call back instantly if we dont have any dependencies                                  // 169
    callback(moduleDefineDone);                                                              // 170
  }                                                                                          // 171
};                                                                                           // 172
                                                                                             // 173
/**                                                                                          // 174
 * @method _loadModule                                                                       // 175
 * @param {Array} deps List of dependencies to load                                          // 176
 * @param {Function} f This function is called when deps are loaded                          // 177
 * Dependencies are passed on to function f as parametres                                    // 178
 */                                                                                          // 179
_loadModule = function(deps, f) {                                                            // 180
  //throw new Error('Not implemented');                                                      // 181
  // Check for function                                                                      // 182
  if (typeof f !== 'function')                                                               // 183
    throw new Error('Famono: define require a function');                                    // 184
  // Convert strings to array of string                                                      // 185
  if (deps === '' + deps) deps = [deps];                                                     // 186
  // XXX: deps can be a string or an array of strings                                        // 187
  // 1. ensure all deps are loaded by checking modules[]                                     // 188
  loadLibraries(deps, function(done) {                                                       // 189
    // 2. ensure all deps are initialized by checking modules[]                              // 190
    var result = [];                                                                         // 191
    // Init the dependecies                                                                  // 192
    for (var i = 0; i < deps.length; i++) result.push(require(deps[i]));                     // 193
    // 3. run f                                                                              // 194
    f.apply({}, result);                                                                     // 195
  });                                                                                        // 196
};                                                                                           // 197
                                                                                             // 198
/**                                                                                          // 199
 * @method _defineModule                                                                     // 200
 * @param {String} name Name of module                                                       // 201
 * @param {Array} deps List of dependencies to load                                          // 202
 * @param {Function} f The module                                                            // 203
 */                                                                                          // 204
_defineModule = function(name, deps, f) {                                                    // 205
  // Get module                                                                              // 206
  var module = getModule(name, true);                                                        // 207
  // Check for function                                                                      // 208
  if (typeof f !== 'function')                                                               // 209
    throw new Error('Famono: library "' + name + '" require a function');                    // 210
                                                                                             // 211
  // Check library                                                                           // 212
  if (module.loaded === true)                                                                // 213
    throw new Error('Famono: library "' + name + '" already defined');                       // 214
                                                                                             // 215
  // 1. Make sure the deps are loaded                                                        // 216
  loadLibraries(deps, function(done) {                                                       // 217
    // Mark this module as loaded                                                            // 218
    done(name, f);                                                                           // 219
    // Check if this is a global?                                                            // 220
    if (name === null) f(require, {}, { exports: window });                                  // 221
  });                                                                                        // 222
}                                                                                            // 223
                                                                                             // 224
/**                                                                                          // 225
 * @method _defineGlobal                                                                     // 226
 * @param {String} name Name of module                                                       // 227
 * @param {Array} deps List of dependencies to load                                          // 228
 * @param {Function} f The module                                                            // 229
 */                                                                                          // 230
_defineGlobal = function(f) {                                                                // 231
  // Define a global thing...                                                                // 232
  define(null, [], f);                                                                       // 233
};                                                                                           // 234
                                                                                             // 235
/**                                                                                          // 236
 * @method define                                                                            // 237
 * @param {String} [name] Name of module                                                     // 238
 * @param {Array} deps List of dependencies to load                                          // 239
 * @param {Function} f The module                                                            // 240
 *                                                                                           // 241
 * > If no name is passed then deps are passed to f as arguments                             // 242
 */                                                                                          // 243
define = function(/* name, deps, f or deps, f */) {                                          // 244
  if (arguments.length === 1) {                                                              // 245
    // Return the load module                                                                // 246
    return _defineGlobal.apply(this, arguments);                                             // 247
                                                                                             // 248
    // define([deps, ... , deps], function() {});                                            // 249
  } else if (arguments.length === 2) {                                                       // 250
    // Return the load module                                                                // 251
    return _loadModule.apply(this, arguments);                                               // 252
                                                                                             // 253
    // define('name', [deps, ... , deps], function() {});                                    // 254
  } else if (arguments.length == 3) {                                                        // 255
    // Return the define module                                                              // 256
    return _defineModule.apply(this, arguments);                                             // 257
                                                                                             // 258
    // Invalid arguments                                                                     // 259
  } else {                                                                                   // 260
    throw new Error('define got invalid number of arguments');                               // 261
  }                                                                                          // 262
};                                                                                           // 263
///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.famono = {
  define: define,
  require: require
};

})();

//# sourceMappingURL=b612aae15ceb3167b387a0325f1ab50b01865bad.map
