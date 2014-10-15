define(["require", "exports", "ParseObject", "Animaciones", "zepto", "can", "parse"], function(require, exports, __ParseObject__, __Animaciones__) {
    var ParseObject = __ParseObject__;
    var Animaciones = __Animaciones__;

    var Main = (function () {
        function Main() {
            var _this = this;
            this.datos = { points: [{ id: '0', name: 'uno' }, { id: '1', name: 'dos' }, { id: '2', name: 'tres' }, { id: '4', name: 'cuatro' }] };
            this.Todo = null;
            this.Points = null;
            this.selectPoints = { 'origin': 0, 'destination': 0 };
            this.routes_aux = [];
            console.log('conectandome con parse...');
            var config = {
                "APP_ID": "uzykZtzKo7Sj1Sa2gz3V8ZeywQCwmM37eg6NMUQj",
                "CLIENT_KEY": "e7KVecVPNqsV2hFKuUnaa8dlJ9wrqj6VhPHcNcVp",
                "JS_KEY": "sMxD2qMSqszQapkqPPXp2qAJ2SKmA4phNggeOnGD",
                "REST_KEY": "uEmw4vOKoAHMmmauE0z4By1Osl1YSR4tBxnBMwDY"
            };

            this.Points = new ParseObject('POIS', config);
            var actualLocation = new Parse.GeoPoint(-2.2033013966843797, -79.85762756054686);
            this.Points.nearTo('location', actualLocation, 10, function (data) {
                _this.nearPoints(data);
            });
        }
        Main.prototype.init = function () {
            var _this = this;
            console.log('App iniciada');
            var list = this.datos;

            var screenManager = can.Control({
                init: function () {
                    this.element.html(can.view('splash'));
                },
                goHome: function () {
                    this.element.html(can.view('home'));
                },
                setPoints: function (points) {
                    this.options.points = points;
                    this.on();
                    this.element.html(can.view('selectPoint', this.options.points));
                },
                setRoutes: function (routes) {
                    this.options.routes = routes;
                    this.on();
                    this.element.html(can.view('routes', this.options.routes));
                },
                '.pointList a click': function (el, ev) {
                    console.log(el);
                }
            });

            var view;
            var Routing = can.Control({
                init: function () {
                    view = new screenManager($('#screen'));
                    Animaciones.splash();
                },
                ' route': function () {
                    view.goHome();
                    Animaciones.home();
                },
                'selectPoint/:type route': function (get) {
                    var data = _this.getPoints(get);
                    view.setPoints(data);
                    view.element.show();
                },
                'home/:type/:id route': function (get) {
                    view.goHome();
                    _this.selectPoints[get.type] = get.id;
                    Animaciones.home(false);
                },
                'dromosMe route': function () {
                    var data = _this.getRoutes(_this.selectPoints['origin'], _this.selectPoints['destination']);
                    view.setRoutes(data);
                    view.element.show();
                }
            });

            new Routing(document.body);
        };

        Main.prototype.nearPoints = function (points) {
            if (points == null)
                console.log('nada');
            this.pointsList = points;
        };

        Main.prototype.getPoints = function (get) {
            return { type: get.type, points: this.pointsList };
        };

        Main.prototype.getJumpsBetween = function (originRoutes, destinationRoutes) {
            var max_acceptable_jumps = 10;
            var reach_max_jumps = false;
            var nodes_routes = [originRoutes];
            var destination_routes = destinationRoutes;
            var match_counter = 0;
            var min_matchs = 1;

            while (!reach_max_jumps) {
                var all_xing_routes = this.getXingRoutesFrom(_.last(nodes_routes));

                _.each(nodes_routes, function (route) {
                    all_xing_routes = _.difference(all_xing_routes, route);
                });
                console.log('-----------------------');
                console.log(all_xing_routes);

                if (_.intersection(all_xing_routes, destination_routes).length) {
                    reach_max_jumps = true;
                    match_counter++;
                    all_xing_routes = _.intersection(all_xing_routes, destination_routes);
                    console.log('INTERSECTA');
                    console.log(destination_routes);
                    console.log(all_xing_routes);
                }

                if (all_xing_routes.length)
                    nodes_routes.push(all_xing_routes);
else {
                    reach_max_jumps = true;
                }

                if (match_counter >= min_matchs)
                    reach_max_jumps = true;
                if (nodes_routes.length == max_acceptable_jumps) {
                    reach_max_jumps = true;
                }
            }

            if (match_counter > 0) {
                return nodes_routes;
            } else
                return null;
        };

        Main.prototype.getXingRoutesFrom = function (routes) {
            var all_xing_routes = routes;
            _.each(this.pointsList, function (point) {
                var match = _.intersection(all_xing_routes, point.attributes.routes);
                if (match.length) {
                    all_xing_routes = _.union(all_xing_routes, point.attributes.routes);
                }
            });
            return _.difference(all_xing_routes, routes);
        };

        Main.prototype.getIntersectionPointsFrom = function (routes_jumps) {
            if (!routes_jumps.length)
                return null;

            var all_points = [];

            for (var i = routes_jumps.length - 1; i >= 1; i--) {
                var origin_routes = routes_jumps[i];
                var destination_routes = _.difference(routes_jumps[i - 1], origin_routes);

                console.log(origin_routes);
                console.log(destination_routes);

                var points = this.findIntersectionPointsBetween(origin_routes, destination_routes);
                all_points.push(points);
            }
            return all_points;
        };

        Main.prototype.findIntersectionPointsBetween = function (routesOrigin, routesDestination) {
            var _this = this;
            var all_intersections = [];

            _.each(routesOrigin, function (routeOrigin) {
                _.each(routesDestination, function (routeDestination) {
                    console.log('---------------------');
                    var points = _this.getIntersectionPoints(_this.pointsList, routeOrigin, routeDestination);

                    if (points.length) {
                        console.log(routeOrigin);
                        console.log(routeDestination);
                        all_intersections = _.union(all_intersections, points[0]);

                        console.log(points.length);
                    }
                });
            });
            return all_intersections;
        };

        Main.prototype.getIntersectionPoints = function (pointsList, route_origin, route_destination) {
            var matchPoints = [];
            var route_jump = [route_origin, route_destination];

            _.each(pointsList, function (point) {
                var match = _.intersection(route_jump, point.attributes.routes);
                if (match.length > 1)
                    matchPoints.push(point);
            });

            return matchPoints;
        };

        Main.prototype.generateRoutesFrom = function (intersection_points) {
            var _this = this;
            intersection_points.reverse();

            var routes = [];
            _.each(intersection_points[0], function (point) {
                console.log('rutas' + point.get('routes'));
                routes.push([point]);
            });

            _.each(intersection_points, function (points, jump) {
                if (jump == 0)
                    return;
                _this.routes_aux = [];
                _.each(routes, function (route_points) {
                    _.each(points, function (point) {
                        var match = _.intersection(point.attributes.routes, _.last(route_points).attributes.routes);
                        console.log(point.attributes.routes);
                        if (match.length) {
                            console.log(route_points);
                            var new_route = route_points.push(point);
                            _this.routes_aux.push(new_route);
                        }
                    });
                });
                if (typeof _this.routes_aux[0] == 'Object')
                    routes = _this.routes_aux;
            });

            console.log(routes);
            return routes;
        };

        Main.prototype.getRoutes = function (origin_id, destination_id) {
            console.log('generando rutas...');
            var origin = _.findWhere(this.pointsList, { id: origin_id });
            var destination = _.findWhere(this.pointsList, { id: destination_id });

            var intersection = _.intersection(origin.attributes.routes, destination.attributes.routes);

            if (intersection.length) {
                return { routes: [{ steps: [origin, destination] }] };
            }

            console.log('================================================');
            console.log('Obteniendo saltos...');
            var jumps = this.getJumpsBetween(origin.attributes.routes, destination.attributes.routes);

            console.log('================================================');
            console.log('Obteniendo Intersecciones...');
            var intersection_points = this.getIntersectionPointsFrom(jumps);

            console.log('================================================');
            console.log('Obteniendo Posibles rutas...');
            var all_posible_routes = this.generateRoutesFrom(intersection_points);
            console.log('================================================');
            console.log(all_posible_routes);

            if (jumps == null) {
                console.log('No hay forma de unir los dos puntos');
                console.log('en un numero de saltos aceptables');
                console.log('se tiene que buscar soluciones a pie');
            }

            var matchRoutes = [];
            _.each(all_posible_routes, function (route) {
                var complete_route = _.union([origin], route, [destination]);

                var first = _.first(route);
                console.log(first);
                if (first) {
                    var distanceFromOrigin = origin.get('location').kilometersTo(first.get('location'));
                    console.log(all_posible_routes.length);
                    if (distanceFromOrigin < 3.5 || all_posible_routes.length < 3) {
                        var obj = { steps: complete_route, distanceOrigin: distanceFromOrigin };
                        matchRoutes.push(obj);
                    }
                }
            });

            console.log('================================================');
            console.log('Rutas encontrados');

            matchRoutes = _.sortBy(matchRoutes, function (route) {
                return route.distanceOrigin;
            });

            return { routes: matchRoutes };
        };
        return Main;
    })();
    
    return Main;
});
