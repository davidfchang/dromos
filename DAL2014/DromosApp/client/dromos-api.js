Dromos = (function () {
        function Dromos() {
            this.SERVER_URL = "http://safe-reaches-3195.herokuapp.com";
            this.TRANSPORTS_INFO = new Array();
            this.ROUTES = new Array();
        }
        Dromos.prototype.getRoute = function (data, callback) {
            var _this = this;
            var key = data.city + '-' + data.start + '-' + data.end;
            if (this.ROUTES.hasOwnProperty(key)) {
                callback(this.ROUTES[key]);
                return;
            }

            $.getJSON(this.SERVER_URL + '/routes/' + data.city + '/' + data.start + '/' + data.end + '?callback=?', function (response) {
                if (!response.hasOwnProperty('routes')) {
                    callback(null);
                    return;
                }

                _this.ROUTES[key] = response.routes;
                callback(response.routes);
            });
        };

        Dromos.prototype.getTransportInfo = function (city, callback) {
            var _this = this;
            if (this.TRANSPORTS_INFO.hasOwnProperty(city)) {
                callback(this.TRANSPORTS_INFO[city]);
                return;
            }

            $.getJSON(this.SERVER_URL + '/transports/' + city + '?callback=?', function (response) {
                _this.TRANSPORTS_INFO[city] = response.resultado;
                callback(_this.TRANSPORTS_INFO[city]);
            });
        };
        return Dromos;
    })();