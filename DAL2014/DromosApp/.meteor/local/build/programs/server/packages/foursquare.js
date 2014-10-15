(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var OAuth = Package.oauth.OAuth;
var Oauth = Package.oauth.Oauth;
var HTTP = Package.http.HTTP;
var ServiceConfiguration = Package['service-configuration'].ServiceConfiguration;

/* Package-scope variables */
var Foursquare;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/foursquare/foursquare_server.js                                                         //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
Foursquare = {};                                                                                    // 1
                                                                                                    // 2
Oauth.registerService('foursquare', 2, null, function(query) {                                      // 3
                                                                                                    // 4
  var accessToken = getAccessToken(query);                                                          // 5
  var identity = getIdentity(accessToken);                                                          // 6
                                                                                                    // 7
  return {                                                                                          // 8
    serviceData: {                                                                                  // 9
      id: identity.id,                                                                              // 10
      accessToken: accessToken,                                                                     // 11
      email: identity.contact.email                                                                 // 12
    },                                                                                              // 13
    options: {                                                                                      // 14
      profile: {                                                                                    // 15
        firstName: identity.firstName,                                                              // 16
        lastName: identity.lastName                                                                 // 17
      }                                                                                             // 18
    }                                                                                               // 19
  };                                                                                                // 20
});                                                                                                 // 21
                                                                                                    // 22
var userAgent = "Meteor";                                                                           // 23
if (Meteor.release)                                                                                 // 24
  userAgent += "/" + Meteor.release;                                                                // 25
                                                                                                    // 26
var getAccessToken = function (query) {                                                             // 27
  var config = ServiceConfiguration.configurations.findOne({service: 'foursquare'});                // 28
  if (!config)                                                                                      // 29
    throw new ServiceConfiguration.ConfigError("Service not configured");                           // 30
                                                                                                    // 31
  var response;                                                                                     // 32
  try {                                                                                             // 33
    response = HTTP.post(                                                                           // 34
      "https://foursquare.com/oauth2/access_token", {                                               // 35
        headers: {                                                                                  // 36
          Accept: 'application/json',                                                               // 37
          "User-Agent": userAgent                                                                   // 38
        },                                                                                          // 39
        params: {                                                                                   // 40
          code: query.code,                                                                         // 41
          client_id: config.clientId,                                                               // 42
          client_secret: config.secret,                                                             // 43
          grant_type: 'authorization_code',                                                         // 44
          redirect_uri: Meteor.absoluteUrl("_oauth/foursquare?close"),                              // 45
          state: query.credentialToken                                                              // 46
        }                                                                                           // 47
      });                                                                                           // 48
  } catch (err) {                                                                                   // 49
    throw _.extend(new Error("Failed to complete OAuth handshake with Foursquare. " + err.message), // 50
                   {response: err.response});                                                       // 51
  }                                                                                                 // 52
  if (response.data.error) { // if the http response was a json object with an error attribute      // 53
    throw new Error("Failed to complete OAuth handshake with Foursquare. " + response.data.error);  // 54
  } else {                                                                                          // 55
    return response.data.access_token;                                                              // 56
  }                                                                                                 // 57
};                                                                                                  // 58
                                                                                                    // 59
var getIdentity = function (accessToken) {                                                          // 60
  try {                                                                                             // 61
    return HTTP.get(                                                                                // 62
      "https://api.foursquare.com/v2/users/self", {                                                 // 63
        headers: {"User-Agent": userAgent},                                                         // 64
        params: {oauth_token: accessToken}                                                          // 65
      }).data.response.user;                                                                        // 66
  } catch (err) {                                                                                   // 67
    throw _.extend(new Error("Failed to fetch identity from Foursquare. " + err.message),           // 68
                   {response: err.response});                                                       // 69
  }                                                                                                 // 70
};                                                                                                  // 71
                                                                                                    // 72
                                                                                                    // 73
Foursquare.retrieveCredential = function(credentialToken) {                                         // 74
  return Oauth.retrieveCredential(credentialToken);                                                 // 75
};                                                                                                  // 76
                                                                                                    // 77
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.foursquare = {
  Foursquare: Foursquare
};

})();
