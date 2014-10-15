define(["require", "exports", "parseObject", "zepto", "can", "parse"], function(require, exports, __ParseObject__) {
    var ParseObject = __ParseObject__;

    var Main = (function () {
        function Main() {
            this.datos = { numeros: ['uno', 'dos', 'tres', 'cuatro'] };
            this.Todo = null;
            this.Points = null;
            console.log('conectandome con parse');
            var config = {
                "APP_ID": "uzykZtzKo7Sj1Sa2gz3V8ZeywQCwmM37eg6NMUQj",
                "CLIENT_KEY": "e7KVecVPNqsV2hFKuUnaa8dlJ9wrqj6VhPHcNcVp",
                "JS_KEY": "sMxD2qMSqszQapkqPPXp2qAJ2SKmA4phNggeOnGD",
                "REST_KEY": "uEmw4vOKoAHMmmauE0z4By1Osl1YSR4tBxnBMwDY"
            };
            this.Points = new ParseObject('POIS', config);
        }
        Main.prototype.initializeMap = function () {
            var _this = this;
            console.log('iniciando el mapa LeafLet');

            this.map = L.map('mapCanvas').setView([-2.2033013966843797, -79.85762756054686], 13);
            this.popup = L.popup();
            var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            var osmAttrib = 'Map data © OpenStreetMap contributors';
            L.tileLayer(osmUrl, { attribution: osmAttrib, maxZoom: 18 }).addTo(this.map);

            this.map.on('click', function (e) {
                _this.onMapClick(e);
            });
            $('#newPointData').on('submit', function (e) {
                return _this.saveNewPoint(e);
            });
            $('#formularioNuevoPunto').hide();
        };

        Main.prototype.onMapClick = function (e) {
            this.popup.setLatLng(e.latlng).setContent("Nuevo punto aqui<br/>" + e.latlng.toString()).openOn(this.map);

            $('#latitud').val(e.latlng.lat);
            $('#longitud').val(e.latlng.lng);

            $('#formularioNuevoPunto').show();
        };

        Main.prototype.saveNewPoint = function (e) {
            var _this = this;
            var newPoint = {
                name: $('#nombre').val(),
                tags: $('#tags').val().split(','),
                routes: $('#rutas').val().split(','),
                description: $('#descripcion').val(),
                description: $('#foto').val().split(','),
                location: new Parse.GeoPoint({
                    latitude: parseFloat($('#latitud').val()),
                    longitude: parseFloat($('#longitud').val())
                })
            };

            $('#nombre').val('');
            $('#tags').val('');
            $('#rutas').val('');
            $('#descripcion').val('');
            $('#fotos').val('');
            $('#longitud').val('');
            $('#latitud').val('');
            $('#formularioNuevoPunto').hide();

            this.Points.create(newPoint, function (point) {
                _this.onSavedPoint(point);
            });
            return false;
        };

        Main.prototype.onSavedPoint = function (point) {
            console.log('punto grabado');
            var latitude = point.get('location').latitude;
            var longitude = point.get('location').longitude;
            var marker = L.marker([latitude, longitude]).addTo(this.map);
        };

        Main.prototype.init = function () {
            console.log('App iniciada');
            var list = this.datos;

            var TodoBoard = can.Control({
                init: function () {
                    this.element.html(can.view('todoBoard', list));
                },
                '.delete click': function (el, ev) {
                    el.parent().data('todo').destroy();
                }
            });

            var Routing = can.Control({
                init: function () {
                    new TodoBoard($('#board'));
                }
            });

            new Routing(document.body);
        };
        return Main;
    })();
    
    return Main;
});
