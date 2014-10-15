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
var Template = Package.templating.Template;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var _ = Package.underscore._;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Layout, BlazeUIManager, findComponentWithProp, getComponentData, findComponentWithHelper;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/blaze-layout/layout.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
//XXX Infinite loop issue in this circumstance:                                                                       // 1
// {{#Layout template="MyLayout"}}                                                                                    // 2
//  {{> yield}}                                                                                                       // 3
// {{/Layout}}                                                                                                        // 4
//                                                                                                                    // 5
// because content does a yield lookup for the main region, which in turn                                             // 6
// yields, which results in a stack overflow.                                                                         // 7
                                                                                                                      // 8
var isLogging = false;                                                                                                // 9
                                                                                                                      // 10
var log = function (msg) {                                                                                            // 11
  if (!isLogging)                                                                                                     // 12
    return;                                                                                                           // 13
                                                                                                                      // 14
  if (arguments.length > 1)                                                                                           // 15
    msg = _.toArray(arguments).join(' ');                                                                             // 16
  console.log('%c<BlazeLayout> ' + msg, 'color: green; font-weight: bold; font-size: 1.3em;');                        // 17
};                                                                                                                    // 18
                                                                                                                      // 19
/*****************************************************************************/                                       // 20
/* Meteor Functions */                                                                                                // 21
/*                                                                                                                    // 22
 * These are copied from Core because we need to throw an error at lookup time                                        // 23
 * if a template is not found. The Component.lookup method does not give us a                                         // 24
 * way to do that. We should construct a proper pull request and send to Meteor.                                      // 25
 * Probably the ability to pass a not found callback or something to the lookup                                       // 26
 * method as an option.                                                                                               // 27
/*****************************************************************************/                                       // 28
var findComponentWithProp = function (id, comp) {                                                                     // 29
  while (comp) {                                                                                                      // 30
    if (typeof comp[id] !== 'undefined')                                                                              // 31
      return comp;                                                                                                    // 32
    comp = comp.parent;                                                                                               // 33
  }                                                                                                                   // 34
  return null;                                                                                                        // 35
};                                                                                                                    // 36
                                                                                                                      // 37
var getComponentData = function (comp) {                                                                              // 38
  comp = findComponentWithProp('data', comp);                                                                         // 39
  return (comp ?                                                                                                      // 40
          (typeof comp.data === 'function' ?                                                                          // 41
           comp.data() : comp.data) :                                                                                 // 42
          null);                                                                                                      // 43
};                                                                                                                    // 44
/*****************************************************************************/                                       // 45
/* End Meteor Functions */                                                                                            // 46
/*****************************************************************************/                                       // 47
                                                                                                                      // 48
/**                                                                                                                   // 49
 * Find a template object.                                                                                            // 50
 *                                                                                                                    // 51
 * Similar to Component.lookupTemplate with two differences:                                                          // 52
 *                                                                                                                    // 53
 * 1. Throw an error if we can't find the template. This is useful in debugging                                       // 54
 * vs. silently failing.                                                                                              // 55
 *                                                                                                                    // 56
 * 2. If the template is a property on the component, don't call                                                      // 57
 * getComponentData(self), thereby creating an unnecessary data dependency. This                                      // 58
 * was initially causing problems with {{> yield}}                                                                    // 59
 */                                                                                                                   // 60
var lookupTemplate = function (name) {                                                                                // 61
  // self should be an instance of Layout                                                                             // 62
  var self = this;                                                                                                    // 63
  var comp;                                                                                                           // 64
  var result;                                                                                                         // 65
  var contentBlocksByRegion = self._contentBlocksByRegion;                                                            // 66
                                                                                                                      // 67
  if (!name)                                                                                                          // 68
    throw new Error("BlazeLayout: You must pass a name to lookupTemplate");                                           // 69
                                                                                                                      // 70
  if (contentBlocksByRegion[name]) {                                                                                  // 71
    result = contentBlocksByRegion[name];                                                                             // 72
  } else if ((comp = findComponentWithProp(name, self))) {                                                            // 73
    result = comp[name];                                                                                              // 74
  } else if (_.has(Template, name)) {                                                                                 // 75
    result = Template[name];                                                                                          // 76
  } else if (result = UI._globalHelper(name)) {}                                                                      // 77
                                                                                                                      // 78
  if (typeof result === 'function' && !result._isEmboxedConstant) {                                                   // 79
    return function (/* args */ ) {                                                                                   // 80
      // modified from Core to call function in context of the                                                        // 81
      // component, not a data context.                                                                               // 82
      return result.apply(self, arguments);                                                                           // 83
    }                                                                                                                 // 84
  } else if (result) {                                                                                                // 85
    return result                                                                                                     // 86
  } else {                                                                                                            // 87
    throw new Error("BlazeLayout: Sorry, couldn't find a template named " + name + ". Are you sure you defined it?"); // 88
  }                                                                                                                   // 89
}                                                                                                                     // 90
                                                                                                                      // 91
Layout = UI.Component.extend({                                                                                        // 92
  kind: 'Layout',                                                                                                     // 93
                                                                                                                      // 94
  init: function () {                                                                                                 // 95
    var self = this;                                                                                                  // 96
                                                                                                                      // 97
    var layout = this;                                                                                                // 98
                                                                                                                      // 99
    var tmpl = Deps.nonreactive(function () {                                                                         // 100
      return self.get('template') || self.template || '_defaultLayout';                                               // 101
    });                                                                                                               // 102
                                                                                                                      // 103
    var tmplDep = new Deps.Dependency;                                                                                // 104
                                                                                                                      // 105
    // get the initial data value                                                                                     // 106
    var data = Deps.nonreactive(function () { return self.get(); });                                                  // 107
    var dataDep = new Deps.Dependency;                                                                                // 108
    var regions = this._regions = new ReactiveDict;                                                                   // 109
    var content = this.__content;                                                                                     // 110
                                                                                                                      // 111
    // a place to put content defined like this:                                                                      // 112
    // {{#contentFor region="footer"}}content{{/contentFor}}                                                          // 113
    // this will be searched in the lookup chain.                                                                     // 114
    var contentBlocksByRegion = this._contentBlocksByRegion = {};                                                     // 115
                                                                                                                      // 116
    /**                                                                                                               // 117
    * instance methods                                                                                                // 118
    */                                                                                                                // 119
                                                                                                                      // 120
    this.template = function (value) {                                                                                // 121
      if (arguments.length > 0) {                                                                                     // 122
        if (!value)                                                                                                   // 123
          value = '_defaultLayout';                                                                                   // 124
                                                                                                                      // 125
        if (!EJSON.equals(value, tmpl)) {                                                                             // 126
          tmpl = value;                                                                                               // 127
          tmplDep.changed();                                                                                          // 128
        }                                                                                                             // 129
      } else {                                                                                                        // 130
        tmplDep.depend();                                                                                             // 131
        return tmpl;                                                                                                  // 132
      }                                                                                                               // 133
    };                                                                                                                // 134
                                                                                                                      // 135
    var emboxedData = UI.emboxValue(function () {                                                                     // 136
      log('return data()');                                                                                           // 137
      dataDep.depend();                                                                                               // 138
      return data;                                                                                                    // 139
    });                                                                                                               // 140
                                                                                                                      // 141
    this.setData = function (value) {                                                                                 // 142
      log('setData', value);                                                                                          // 143
      if (!EJSON.equals(value, data)) {                                                                               // 144
        data = value;                                                                                                 // 145
        dataDep.changed();                                                                                            // 146
      }                                                                                                               // 147
    };                                                                                                                // 148
                                                                                                                      // 149
    this.getData = function () {                                                                                      // 150
      return emboxedData();                                                                                           // 151
    };                                                                                                                // 152
                                                                                                                      // 153
    this.data = function () {                                                                                         // 154
      return self.getData();                                                                                          // 155
    };                                                                                                                // 156
                                                                                                                      // 157
    /**                                                                                                               // 158
     * Set a region template.                                                                                         // 159
     *                                                                                                                // 160
     * If you want to get the template for a region                                                                   // 161
     * you need to call this._regions.get('key');                                                                     // 162
     *                                                                                                                // 163
     */                                                                                                               // 164
    this.setRegion = function (key, value) {                                                                          // 165
      if (arguments.length < 2) {                                                                                     // 166
        value = key;                                                                                                  // 167
        key = 'main';                                                                                                 // 168
      } else if (typeof key === 'undefined') {                                                                        // 169
        key = 'main';                                                                                                 // 170
      }                                                                                                               // 171
                                                                                                                      // 172
      regions.set(key, value);                                                                                        // 173
    };                                                                                                                // 174
                                                                                                                      // 175
    //TODO add test                                                                                                   // 176
    this.getRegionKeys = function () {                                                                                // 177
      return _.keys(regions.keys);                                                                                    // 178
    };                                                                                                                // 179
                                                                                                                      // 180
    //TODO add test                                                                                                   // 181
    this.clearRegion = function (key) {                                                                               // 182
      regions.set(key, null);                                                                                         // 183
    };                                                                                                                // 184
                                                                                                                      // 185
    // define a yield region to render templates into                                                                 // 186
    this.yield = UI.Component.extend({                                                                                // 187
      init: function () {                                                                                             // 188
        var self = this;                                                                                              // 189
                                                                                                                      // 190
        var data = Deps.nonreactive(function () { return self.get(); });                                              // 191
        var region;                                                                                                   // 192
                                                                                                                      // 193
        if (_.isString(data))                                                                                         // 194
          region = data;                                                                                              // 195
        else if (_.isObject(data))                                                                                    // 196
          region = data.region || 'main';                                                                             // 197
        else                                                                                                          // 198
          region = 'main';                                                                                            // 199
                                                                                                                      // 200
        self.region = region;                                                                                         // 201
                                                                                                                      // 202
        // reset the data function to use the layout's                                                                // 203
        // data                                                                                                       // 204
        this.data = function () {                                                                                     // 205
          return layout.getData();                                                                                    // 206
        };                                                                                                            // 207
      },                                                                                                              // 208
                                                                                                                      // 209
      render: function () {                                                                                           // 210
        var self = this;                                                                                              // 211
        var region = self.region;                                                                                     // 212
                                                                                                                      // 213
        // returning a function tells UI.materialize to                                                               // 214
        // create a computation. then, if the region template                                                         // 215
        // changes, this comp will be rerun and the new template                                                      // 216
        // will get put on the screen.                                                                                // 217
        return function () {                                                                                          // 218
          var regions = layout._regions;                                                                              // 219
          // create a reactive dep                                                                                    // 220
          var tmpl = regions.get(region);                                                                             // 221
                                                                                                                      // 222
          if (tmpl)                                                                                                   // 223
            return lookupTemplate.call(layout, tmpl);                                                                 // 224
          else if (region === 'main' && content) {                                                                    // 225
            return content;                                                                                           // 226
          }                                                                                                           // 227
          else                                                                                                        // 228
            return null;                                                                                              // 229
        };                                                                                                            // 230
      }                                                                                                               // 231
    });                                                                                                               // 232
                                                                                                                      // 233
    // render content into a yield region using markup. when you call setRegion                                       // 234
    // manually, you specify a string, not a content block. And the                                                   // 235
    // lookupTemplate method uses this string name to find the template. Since                                        // 236
    // contentFor creates anonymous content we need a way to add this into the                                        // 237
    // lookup chain. But then we need to destroy it if it's not used anymore.                                         // 238
    // not sure how to do this.                                                                                       // 239
    this.contentFor = UI.Component.extend({                                                                           // 240
      init: function () {                                                                                             // 241
        var self = this;                                                                                              // 242
        var data = Deps.nonreactive(function () { return self.get(); });                                              // 243
                                                                                                                      // 244
        var region;                                                                                                   // 245
                                                                                                                      // 246
        if (_.isString(data))                                                                                         // 247
          region = data;                                                                                              // 248
        else if (_.isObject(data))                                                                                    // 249
          region = data.region;                                                                                       // 250
                                                                                                                      // 251
        self.region = region;                                                                                         // 252
                                                                                                                      // 253
        if (!region)                                                                                                  // 254
          throw new Error("{{#contentFor}} requires a region argument like this: {{#contentFor region='footer'}}");   // 255
      },                                                                                                              // 256
                                                                                                                      // 257
      render: function () {                                                                                           // 258
        var self = this;                                                                                              // 259
        var region = self.region;                                                                                     // 260
                                                                                                                      // 261
        var contentBlocksByRegion = layout._contentBlocksByRegion;                                                    // 262
                                                                                                                      // 263
        if (contentBlocksByRegion[region]) {                                                                          // 264
          delete contentBlocksByRegion[region];                                                                       // 265
        }                                                                                                             // 266
                                                                                                                      // 267
        // store away the content block so we can find it during lookup                                               // 268
        // which happens in the yield function.                                                                       // 269
        contentBlocksByRegion[region] = self.__content;                                                               // 270
                                                                                                                      // 271
        // this will just set the region to itself but when the lookupTemplate                                        // 272
        // function searches it will check contentBlocksByRegion first, so we'll                                      // 273
        // find the content block there.                                                                              // 274
        layout.setRegion(region, region);                                                                             // 275
                                                                                                                      // 276
        // don't render anything for now. let the yield template control this.                                        // 277
        return null;                                                                                                  // 278
      }                                                                                                               // 279
    });                                                                                                               // 280
                                                                                                                      // 281
    this._defaultLayout = function () {                                                                               // 282
      return UI.block(function () {                                                                                   // 283
        return lookupTemplate.call(layout, 'yield');                                                                  // 284
      });                                                                                                             // 285
    };                                                                                                                // 286
  },                                                                                                                  // 287
                                                                                                                      // 288
  render: function () {                                                                                               // 289
    var self = this;                                                                                                  // 290
    // return a function to create a reactive                                                                         // 291
    // computation. so if the template changes                                                                        // 292
    // the layout is re-endered.                                                                                      // 293
    return function () {                                                                                              // 294
      // reactive                                                                                                     // 295
      var tmplName = self.template();                                                                                 // 296
                                                                                                                      // 297
      //XXX hack to make work with null/false values.                                                                 // 298
      //see this.template = in ctor function.                                                                         // 299
      if (tmplName === '_defaultLayout')                                                                              // 300
        return self._defaultLayout;                                                                                   // 301
      else if (tmplName) {                                                                                            // 302
        var tmpl = lookupTemplate.call(self, tmplName);                                                               // 303
        // it's a component                                                                                           // 304
        if (typeof tmpl.instantiate === 'function')                                                                   // 305
          // See how __pasthrough is used in overrides.js                                                             // 306
          // findComponentWithHelper. If __passthrough is true                                                        // 307
          // then we'll continue past this component in looking                                                       // 308
          // up a helper method. This allows this use case:                                                           // 309
          // <template name="SomeParent">                                                                             // 310
          //  {{#Layout template="SomeLayout"}}                                                                       // 311
          //    I want a helper method on SomeParent                                                                  // 312
          //    called {{someHelperMethod}}                                                                           // 313
          //  {{/Layout}}                                                                                             // 314
          // </template>                                                                                              // 315
          tmpl.__passthrough = true;                                                                                  // 316
        return tmpl;                                                                                                  // 317
      }                                                                                                               // 318
      else {                                                                                                          // 319
        return self['yield'];                                                                                         // 320
      }                                                                                                               // 321
    };                                                                                                                // 322
  }                                                                                                                   // 323
});                                                                                                                   // 324
                                                                                                                      // 325
/**                                                                                                                   // 326
 * Put Layout into the template lookup chain so                                                                       // 327
 * we can do this:                                                                                                    // 328
 * {{#Layout template="MyLayout"}}                                                                                    // 329
 *  Some content                                                                                                      // 330
 * {{/Layout}}                                                                                                        // 331
 */                                                                                                                   // 332
Template.Layout = Layout;                                                                                             // 333
                                                                                                                      // 334
BlazeUIManager = function (router) {                                                                                  // 335
  var self = this;                                                                                                    // 336
  this.router = router;                                                                                               // 337
  this._component = null;                                                                                             // 338
                                                                                                                      // 339
  _.each([                                                                                                            // 340
    'setRegion',                                                                                                      // 341
    'clearRegion',                                                                                                    // 342
    'getRegionKeys',                                                                                                  // 343
    'getData',                                                                                                        // 344
    'setData'                                                                                                         // 345
  ], function (method) {                                                                                              // 346
    self[method] = function () {                                                                                      // 347
      if (self._component) {                                                                                          // 348
        return self._component[method].apply(this, arguments);                                                        // 349
      }                                                                                                               // 350
    };                                                                                                                // 351
  });                                                                                                                 // 352
                                                                                                                      // 353
  // proxy the "layout" method to the underlying component's                                                          // 354
  // "template" method.                                                                                               // 355
  self.layout = function () {                                                                                         // 356
    if (self._component)                                                                                              // 357
      return self._component.template.apply(self, arguments);                                                         // 358
    else                                                                                                              // 359
      throw new Error('Layout has not been rendered yet');                                                            // 360
  };                                                                                                                  // 361
};                                                                                                                    // 362
                                                                                                                      // 363
BlazeUIManager.prototype = {                                                                                          // 364
  render: function (props, parentComponent) {                                                                         // 365
    this._component = UI.render(Layout.extend(props || {}), parentComponent || UI.body);                              // 366
    return this._component;                                                                                           // 367
  },                                                                                                                  // 368
                                                                                                                      // 369
  insert: function (parentDom, parentComponent, props) {                                                              // 370
    UI.DomRange.insert(this.render(props, parentComponent).dom, parentDom || document.body);                          // 371
  }                                                                                                                   // 372
};                                                                                                                    // 373
                                                                                                                      // 374
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/blaze-layout/overrides.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// some temporary overrides of blaze which hopefully will be resolved in core soon.                                   // 1
                                                                                                                      // 2
findComponentWithProp = function (id, comp) {                                                                         // 3
  while (comp) {                                                                                                      // 4
    if (typeof comp[id] !== 'undefined')                                                                              // 5
      return comp;                                                                                                    // 6
    comp = comp.parent;                                                                                               // 7
  }                                                                                                                   // 8
  return null;                                                                                                        // 9
};                                                                                                                    // 10
                                                                                                                      // 11
getComponentData = function (comp) {                                                                                  // 12
  comp = findComponentWithProp('data', comp);                                                                         // 13
  return (comp ?                                                                                                      // 14
          (typeof comp.data === 'function' ?                                                                          // 15
           comp.data() : comp.data) :                                                                                 // 16
          null);                                                                                                      // 17
};                                                                                                                    // 18
                                                                                                                      // 19
var findComponentOfKind = function (kind, comp) {                                                                     // 20
  while (comp) {                                                                                                      // 21
    if (comp.kind === kind)                                                                                           // 22
      return comp;                                                                                                    // 23
    comp = comp.parent;                                                                                               // 24
  }                                                                                                                   // 25
  return null;                                                                                                        // 26
};                                                                                                                    // 27
                                                                                                                      // 28
// added a '__passthrough' property that allows helpers through                                                       // 29
findComponentWithHelper = function (id, comp) {                                                                       // 30
  while (comp) {                                                                                                      // 31
    if (comp.__helperHost) {                                                                                          // 32
      if (typeof comp[id] !== 'undefined')                                                                            // 33
        return comp;                                                                                                  // 34
                                                                                                                      // 35
      // if __pasthrough == true on the component we will continue                                                    // 36
      // looking up the parent chain to find a component with the                                                     // 37
      // property of <id>. Otherwise just halt right now and return null.                                             // 38
      else if (! comp.__passthrough)                                                                                  // 39
        return null;                                                                                                  // 40
    }                                                                                                                 // 41
    comp = comp.parent;                                                                                               // 42
  }                                                                                                                   // 43
  return null;                                                                                                        // 44
};                                                                                                                    // 45
                                                                                                                      // 46
// Override {{> yield}} and {{#contentFor}} to find the closest                                                       // 47
// enclosing layout                                                                                                   // 48
var origLookup = UI.Component.lookup;                                                                                 // 49
UI.Component.lookup = function (id, opts) {                                                                           // 50
  var self = this;                                                                                                    // 51
  var comp, result;                                                                                                   // 52
                                                                                                                      // 53
  if (id === 'yield') {                                                                                               // 54
    throw new Error("Sorry, would you mind using {{> yield}} instead of {{yield}}? It helps the Blaze engine.");      // 55
  } else if (id === 'contentFor') {                                                                                   // 56
    var layout = findComponentOfKind('Layout', this);                                                                 // 57
    if (!layout)                                                                                                      // 58
      throw new Error("Couldn't find a Layout component in the rendered component tree");                             // 59
    else {                                                                                                            // 60
      result = layout[id];                                                                                            // 61
    }                                                                                                                 // 62
                                                                                                                      // 63
  // found a property or method of a component                                                                        // 64
  // (`self` or one of its ancestors)                                                                                 // 65
  } else if (! /^\./.test(id) && (comp = findComponentWithHelper(id, self))) {                                        // 66
    result = comp[id];                                                                                                // 67
                                                                                                                      // 68
  } else {                                                                                                            // 69
    return origLookup.apply(this, arguments);                                                                         // 70
  }                                                                                                                   // 71
                                                                                                                      // 72
  if (typeof result === 'function' && ! result._isEmboxedConstant) {                                                  // 73
    // Wrap the function `result`, binding `this` to `getComponentData(self)`.                                        // 74
    // This creates a dependency when the result function is called.                                                  // 75
    // Don't do this if the function is really just an emboxed constant.                                              // 76
    return function (/*arguments*/) {                                                                                 // 77
      var data = getComponentData(self);                                                                              // 78
      return result.apply(data === null ? {} : data, arguments);                                                      // 79
    };                                                                                                                // 80
  } else {                                                                                                            // 81
    return result;                                                                                                    // 82
  };                                                                                                                  // 83
};                                                                                                                    // 84
                                                                                                                      // 85
var origLookupTemplate = UI.Component.lookupTemplate;                                                                 // 86
UI.Component.lookupTemplate = function (id, opts) {                                                                   // 87
  if (id === 'yield') {                                                                                               // 88
    var layout = findComponentOfKind('Layout', this);                                                                 // 89
    if (!layout)                                                                                                      // 90
      throw new Error("Couldn't find a Layout component in the rendered component tree");                             // 91
    else {                                                                                                            // 92
      return layout[id];                                                                                              // 93
    }                                                                                                                 // 94
  } else {                                                                                                            // 95
    return origLookupTemplate.apply(this, arguments);                                                                 // 96
  }                                                                                                                   // 97
};                                                                                                                    // 98
                                                                                                                      // 99
if (Package['iron-router']) {                                                                                         // 100
  Package['iron-router'].Router.configure({                                                                           // 101
    uiManager: new BlazeUIManager                                                                                     // 102
  });                                                                                                                 // 103
}                                                                                                                     // 104
                                                                                                                      // 105
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['blaze-layout'] = {
  Layout: Layout
};

})();

//# sourceMappingURL=592b260d8b0a77c3e0726efb1b17ffc49ff49115.map
