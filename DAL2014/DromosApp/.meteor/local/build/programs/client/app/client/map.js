(function(){Map = (function () {
        function Map(container) {
            var _this = this;
            this.markers = new Array();
            this.map = new L.Map(container,{
                doubleClickZoom: true, attributionControl: false
              });

            this.map.setView([-2.1637515, -79.9623555], 12);
            this.map._layersMaxZoom = 18;
            this.map._layersMinZoom = 0;
            this.map._maxNativeZoom = 18;
            this.map._layersMaxZoom = 18;
            this.map._layersMinZoom = 0;
            this.map._continousWorld = true;

            L.Icon.Default.imagePath = 'packages/leaflet/images';


            var layerControl = L.control.layers(this.getLayers(), this.getOverlays(), { collapsed: true }).addTo(this.map);
            var layerScales = L.control.scale({ metric: true, position: 'bottomleft' }).addTo(this.map);

            L.Util.requestAnimFrame(this.map.invalidateSize, this.map, !1, this.map._container);
            setTimeout(function () {
                _this.map.invalidateSize(false);
            }, 300);
        }
        Map.prototype.getLayers = function () {
             var dromosLight = L.tileLayer.provider('MapBox.davicho.hi14j103', {
                attribution: '',  detectRetina: false, reuseTiles: true, maxNativeZoom: 19
              }).addTo(this.map); //add para que salga como default

              var dromosLargeFonts = L.tileLayer.provider('MapBox.davicho.i54nhca7', {
                attribution: '',  detectRetina: false, reuseTiles: true, maxNativeZoom: 19
              });



            return {
                '<img src = "/images/isotipo.png" width="10px"/> Living City': dromosLight,
                '<img src = "/images/isotipo.png" width="10px"/>  Myopic': dromosLargeFonts,
                'OpenStreetMap': L.tileLayer.provider('OpenStreetMap.Mapnik', {attribution: ''}),
                 'OpenCycleMap': L.tileLayer.provider('Thunderforest.OpenCycleMap', {attribution: ''}),
                'OpenTransport': L.tileLayer.provider('Thunderforest.Transport', {attribution: ''}),
                'Stamen Toner': L.tileLayer.provider('Stamen.Toner', {attribution: ''}),
                'Stamen Watercolor': L.tileLayer.provider('Stamen.Watercolor', {attribution: ''}),
                'Esri World Imagery': L.tileLayer.provider('Esri.WorldImagery', {attribution: ''}),
            };

        };

        Map.prototype.refresh = function(){
            //this.map.invalidateSize(false);
            L.Util.requestAnimFrame(this.map.invalidateSize,this.map,!1,this.map._container);; //para que todos los tiles carguen

        }

        Map.prototype.getOverlays = function () {
            return {
                  'OpenMapSurfer Bounds' : L.tileLayer.provider('OpenMapSurfer.AdminBounds', {attribution: '', }),
                  };
        };

        Map.prototype.center = function (lat, lon) {
            this.map.setView(new L.LatLng(lat, lon));
        };

        Map.prototype.drawRoute = function (waypoints) {
            L.Routing.control({
                waypoints: [waypoints[0], waypoints[waypoints.length - 1]],
                geocoder: L.Control.Geocoder.nominatim()
            }).addTo(this.map);
        };

        Map.prototype.addMarker = function (poi) {
            var marker = new L.LatLng(poi.latitude, poi.longitude, true);
            var plotmark = new L.Marker(marker);

            plotmark.data = poi.venue;
            plotmark.bindPopup("<h5>" + poi.venue + "</h5>");

            this.map.addLayer(plotmark);
            this.markers.push(plotmark);
        };

        Map.prototype.removeMarkers = function () {
            for (var i = 0; i < this.markers.length; i++) {
                this.map.removeLayer(this.markers[i]);
            }

            this.markers = [];
        };
        return Map;
    })();

})();
