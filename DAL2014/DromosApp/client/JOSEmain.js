DromosConnect= (function () {
        function Main(city, mapContainer) {
            var _this = this;
            //var Dromos = require('dromos-api');
            this.dromosAPI = new Dromos();

            //var Map = require('map');
            this.map = new Map(mapContainer);

            this.city = city;
            this.dromosAPI.getTransportInfo(city, function (response) {
                $('#buscar_ruta .autocomplete input').autocomplete({
                    lookup: response[0].data[2]
                });
            });

            setTimeout(function(){

            $('#buscar_ruta').submit(function () {
                _this.dromosAPI.getRoute({
                    city: _this.city,
                    start: $('#desde').val(),
                    end: $('#hasta').val()
                }, function (response) {
                    var stops = response[0].stops;

                    _this.map.center(stops[0].latitude, stops[0].longitude);

                    _this.map.removeMarkers();
                    for (var j = 0; j < stops.length; j++) {
                        _this.map.addMarker(stops[j]);
                    }

                   setTimeout(function(){
                          _this.map.refresh();
                   }, 300);
                    Application.show('map');
                });

                return false;
            });
            }, 2000);


        }


        return Main;
    })();