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
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var _ = Package.underscore._;
var Template = Package.templating.Template;
var Random = Package.random.Random;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Foursquare;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/foursquare/template.foursquare_configure.js                                //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
                                                                                       // 1
Template.__define__("configureLoginServiceDialogForFoursquare", (function() {          // 2
  var self = this;                                                                     // 3
  var template = this;                                                                 // 4
  return [ HTML.Raw("<p>\n    First, you'll need to get a Foursquare Client ID. Follow these steps:\n  </p>\n  "), HTML.OL(HTML.Raw('\n    <li>\n      Visit <a href="https://foursquare.com/developers/register" target="blank">https://foursquare.com/developers/register</a>\n    </li>\n    '), HTML.LI("\n      Set Download / welcome page url to: ", HTML.SPAN({
    "class": "url"                                                                     // 6
  }, function() {                                                                      // 7
    return Spacebars.mustache(self.lookup("siteUrl"));                                 // 8
  }), "\n    "), "\n    ", HTML.LI("\n      Set Redirect URI(s) to: ", HTML.SPAN({     // 9
    "class": "url"                                                                     // 10
  }, function() {                                                                      // 11
    return Spacebars.mustache(self.lookup("siteUrl"));                                 // 12
  }, "_oauth/foursquare?close"), "\n    "), "\n  ") ];                                 // 13
}));                                                                                   // 14
                                                                                       // 15
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/foursquare/foursquare_configure.js                                         //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
Template.configureLoginServiceDialogForFoursquare.siteUrl = function () {              // 1
  return Meteor.absoluteUrl();                                                         // 2
};                                                                                     // 3
                                                                                       // 4
Template.configureLoginServiceDialogForFoursquare.fields = function () {               // 5
  return [                                                                             // 6
    {property: 'clientId', label: 'Client ID'},                                        // 7
    {property: 'secret', label: 'Client Secret'}                                       // 8
  ];                                                                                   // 9
};                                                                                     // 10
                                                                                       // 11
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/foursquare/foursquare_client.js                                            //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
Foursquare = {};                                                                       // 1
                                                                                       // 2
// Request Foursquare credentials for the user                                         // 3
// @param options {optional}                                                           // 4
// @param credentialRequestCompleteCallback {Function} Callback function to call on    // 5
//   completion. Takes one argument, credentialToken on success, or Error on           // 6
//   error.                                                                            // 7
Foursquare.requestCredential = function (options, credentialRequestCompleteCallback) { // 8
  // support both (options, callback) and (callback).                                  // 9
  if (!credentialRequestCompleteCallback && typeof options === 'function') {           // 10
    credentialRequestCompleteCallback = options;                                       // 11
    options = {};                                                                      // 12
  }                                                                                    // 13
                                                                                       // 14
  var config = ServiceConfiguration.configurations.findOne({service: 'foursquare'});   // 15
  if (!config) {                                                                       // 16
    credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError("Service not configured"));
    return;                                                                            // 18
  }                                                                                    // 19
  var credentialToken = Random.id();                                                   // 20
                                                                                       // 21
  var loginUrl =                                                                       // 22
        'https://foursquare.com/oauth2/authenticate' +                                 // 23
        '?client_id=' + config.clientId +                                              // 24
        '&response_type=code' +                                                        // 25
        '&redirect_uri=' + Meteor.absoluteUrl('_oauth/foursquare?close') +             // 26
        '&state=' + credentialToken;                                                   // 27
                                                                                       // 28
  Oauth.initiateLogin(credentialToken, loginUrl, credentialRequestCompleteCallback,    // 29
                                {width: 900, height: 450});                            // 30
};                                                                                     // 31
                                                                                       // 32
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.foursquare = {
  Foursquare: Foursquare
};

})();

//# sourceMappingURL=18618c28fe92277fb25d61f881d0b5e417f87f9c.map
