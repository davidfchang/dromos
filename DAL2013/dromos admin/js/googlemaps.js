(function(){
var callback = function(){},
callbackName = 'gmapscallback'+(new Date()).getTime();
window[callbackName] = callback;
define(['http://maps.googleapis.com/maps/api/js?key=AIzaSyDUPh6_RcQJGJAybNSxbM6ZWYnq8gk1nyg&sensor=true&callback=' + callbackName], function(){
return google.maps;
});
})();