(function(){Venues = new Meteor.Collection("venues");


/*

Icon.Default.imagePath = 'packages/leaflet/images'

var mapBaseLayers = L.tileLayer.provider('Stamen.Watercolor').addTo(map)
//L.tileLayer.provider('MapBox.YourName.MyMap');


var baseLayers = ['Stamen.Watercolor', 'OpenStreetMap.Mapnik'],
    overlays = ['OpenWeatherMap.Clouds'];


var layerControl = L.control.layers.provided(baseLayers, overlays).addTo(map);
//layerControl.addBaseLayer(layer, name);

var layers = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/roads/x={x}&y={y}&z={z}', {
  attribution: '<a href="http://dromos.me/">Dromos</a> map data by <a href="http://openstreetmap.org">OpenStreetMap</a>'
});


///LAYERS PEPA
Provider names for leaflet-providers.js
OpenStreetMap.Mapnik, OpenMapSurfer.AdminBounds


var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});
var OpenMapSurfer_AdminBounds = L.tileLayer('http://openmapsurfer.uni-hd.de/tiles/adminb/x={x}&y={y}&z={z}', {
  attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});




*/

 
Meteor.methods({
  addVenue : function(venueName, venueLat, venueLong){
    console.log('Adding Venue');
    var venueId = Venues.insert({
          'venueName' : venueName,
          'venueLat' : venueLat,
          'venueLong' : venueLong,
          'submittedOn': new Date(),
          'submittedBy' : Meteor.userId()
      });
    return venueId;
  }

});



})();
