// DEPENDECIES
/// <amd-dependency path="zepto" 	/>
/// <amd-dependency path="can" 		/>
/// <amd-dependency path="parse" 	/>

// DEFINITIONS
/// <reference path="zepto.d.ts" 	/>
/// <reference path="can.d.ts" 		/>
/// <reference path="generic.d.ts" />

// IMPORTS
/// <reference path="ParseObject.ts"/>
/// <reference path="Animaciones.ts"/>

import ParseObject = require("ParseObject");
import Animaciones = require("Animaciones");

class Main{
	private datos:Object        = { points: [{id:'0',name:'uno'},{id:'1',name:'dos'},{id:'2',name:'tres'},{id:'4',name:'cuatro'}] }
	private Todo:canModelExtend = null
	private Points:ParseObject 	= null;
	private pointsList:Object;
	private popup:any;
	private map:any;
	private selectPoints:Object = {'origin':0, 'destination':0};
	private routes_aux:Array = [];

	constructor(){
		console.log('conectandome con parse...');
		var config = {	"APP_ID"	: "uzykZtzKo7Sj1Sa2gz3V8ZeywQCwmM37eg6NMUQj",
						"CLIENT_KEY": "e7KVecVPNqsV2hFKuUnaa8dlJ9wrqj6VhPHcNcVp",
						"JS_KEY"	: "sMxD2qMSqszQapkqPPXp2qAJ2SKmA4phNggeOnGD",
						"REST_KEY"	: "uEmw4vOKoAHMmmauE0z4By1Osl1YSR4tBxnBMwDY"}

		this.Points = new ParseObject( 'POIS', config );
		var actualLocation = new Parse.GeoPoint(-2.2033013966843797, -79.85762756054686);
		this.Points.nearTo( 'location', actualLocation, 10, (data)=>{ this.nearPoints(data) } );
	}


	public init(){
		console.log('App iniciada');
		var list = this.datos;//new this.Todo.List({});

		var screenManager = can.Control({
			init: function(){
				this.element.html(can.view('splash'));
			},
			goHome: function(){
				this.element.html(can.view('home'));
			},
			setPoints: function( points ) {
				this.options.points = points;
				this.on();
				this.element.html(can.view('selectPoint', this.options.points));
			},
			setRoutes: function( routes ){
				this.options.routes = routes;
				this.on();
				this.element.html(can.view('routes', this.options.routes));
			},

			'.pointList a click': function(el, ev) {
				console.log(el);
			}
		});


		var view;
		var Routing = can.Control({
			init: ()=> {
				view = new screenManager($('#screen'));
				Animaciones.splash();
			},
			' route':()=>{ 
				view.goHome();
				Animaciones.home();
			},
			'selectPoint/:type route': (get)=> {
				var data = this.getPoints( get );
				view.setPoints( data );
				view.element.show();
			},
			'home/:type/:id route': (get)=> {
				view.goHome();
				this.selectPoints[get.type]=get.id;
				Animaciones.home(false);
			},
			'dromosMe route': ()=>{
				var data = this.getRoutes(this.selectPoints['origin'], this.selectPoints['destination'])
				view.setRoutes( data );
				view.element.show();
			}
		});

		new Routing(document.body);
	}

	public nearPoints( points ){
		if( points == null ) console.log('nada');
		this.pointsList = points;
	}

	private getPoints( get ){
		return {type:get.type, points:this.pointsList}
	}




/*===========================================================================*/
/*===========================================================================*/
/*===========================================================================*/
/*===========================================================================*/
	

	/* 	Find Routes Jumps
	================================================================================*/
	private getJumpsBetween( originRoutes:Array, destinationRoutes:Array ):Array
	{
		var max_acceptable_jumps:number = 10;
		var reach_max_jumps:boolean = false;
		var nodes_routes:Array = [originRoutes];
		var destination_routes:Array = destinationRoutes;
		var match_counter:number = 0;
		var min_matchs:number = 1;

		while( !reach_max_jumps ){
			var all_xing_routes = this.getXingRoutesFrom( _.last(nodes_routes) );

			_.each(nodes_routes, (route)=>{
				all_xing_routes = _.difference(all_xing_routes, route);
			});
			console.log('-----------------------')
			console.log(all_xing_routes)

			if( _.intersection( all_xing_routes, destination_routes ).length ){ 
				reach_max_jumps = true; 
				match_counter++;
				all_xing_routes = _.intersection( all_xing_routes, destination_routes )
				console.log('INTERSECTA');
				console.log(destination_routes)
				console.log(all_xing_routes)
			}

			if( all_xing_routes.length ) nodes_routes.push(all_xing_routes);
			else{ reach_max_jumps = true; }
			

			if( match_counter >= min_matchs ) reach_max_jumps = true;
			if( nodes_routes.length == max_acceptable_jumps ){ reach_max_jumps = true; }
		}

		if( match_counter > 0 ){
			//nodes_routes.push(destinationRoutes);
			return nodes_routes
		}
		else
			return null;
	}

	private getXingRoutesFrom( routes ){
		var all_xing_routes:Array = routes;
		_.each(this.pointsList, ( point )=>{
			var match = _.intersection(all_xing_routes, point.attributes.routes);
			if( match.length){
				all_xing_routes = _.union(all_xing_routes, point.attributes.routes);
			}
		});
		return _.difference(all_xing_routes,routes);
	}


	/* 	Find Points of intersection between routes
	================================================================================*/
	private getIntersectionPointsFrom( routes_jumps:Array ):Array{
		if( !routes_jumps.length ) return null;

		var all_points:Array = [];

		for( var i=routes_jumps.length-1; i>=1; i-- ){
			var origin_routes = routes_jumps[i];
			var destination_routes = _.difference(routes_jumps[i-1],origin_routes);

			console.log(origin_routes);
			console.log(destination_routes);

			var points:Array = this.findIntersectionPointsBetween(origin_routes, destination_routes);
			all_points.push( points );
		}
		return all_points;
	}


	private findIntersectionPointsBetween( routesOrigin:any, routesDestination:any ):Array{
		var all_intersections:Array = [];
		

		_.each(routesOrigin, (routeOrigin)=>{
			_.each(routesDestination, (routeDestination)=>{
				console.log('---------------------');
				var points = this.getIntersectionPoints( 	
									this.pointsList,
									routeOrigin,
									routeDestination );

				if( points.length ){
					console.log(routeOrigin);
					console.log(routeDestination);
					all_intersections = _.union(all_intersections, points[0]);
					//all_intersections = _.union(all_intersections, points);
					console.log(points.length);
				}
			});
		});
		return all_intersections;
	}

	private getIntersectionPoints( pointsList:Object, route_origin:any, route_destination:any ):Array{
		var matchPoints:Array =[];
		var route_jump:Array = [route_origin, route_destination];

		_.each(pointsList, ( point )=>{
			var match = _.intersection(route_jump, point.attributes.routes);
			if( match.length > 1 ) matchPoints.push(point);
		});

		return matchPoints;
	}



	/* Generate the routes
	================================================================================*/
	private generateRoutesFrom( intersection_points ):Array{
		intersection_points.reverse();

		var routes:Array = [];
		_.each(intersection_points[0], ( point )=>{
			console.log('rutas'+point.get('routes'))
			routes.push([point]);
		});


		_.each(intersection_points, ( points, jump )=>{
			if( jump == 0 ) return //evito el primer salto
			this.routes_aux=[];
			_.each( routes, ( route_points )=>{
				_.each(points,(point)=>{
					var match = _.intersection( 
									point.attributes.routes,
									_.last(route_points).attributes.routes
								);
					console.log(point.attributes.routes)
					if( match.length ){
						console.log(route_points)
						var new_route = route_points.push(point);
						this.routes_aux.push(new_route);
					}
				});
			});
			if(typeof this.routes_aux[0] == 'Object')
				routes = this.routes_aux;
		});

		console.log(routes)
		return routes;
	}


	/* Get the Routes Between two points
	================================================================================*/
	private getRoutes( origin_id:String, destination_id:String ){

		//origin_id = 'RS1MycL8PZ';
		//destination_id='UcVAYthn9W';

		console.log('generando rutas...');
		var origin 	 	= _.findWhere( this.pointsList, {id:origin_id});
		var destination = _.findWhere( this.pointsList, {id:destination_id});
		
		var intersection = _.intersection(
								origin.attributes.routes,
								destination.attributes.routes);

		if( intersection.length ){
			return {routes: [{steps:[origin,destination]}] };
		}

		console.log('================================================');
		console.log('Obteniendo saltos...');
		var jumps:Array = this.getJumpsBetween(
									origin.attributes.routes,
									destination.attributes.routes
								);
		
		console.log('================================================');
		console.log('Obteniendo Intersecciones...');
		var intersection_points:Array = this.getIntersectionPointsFrom(jumps);

		console.log('================================================');
		console.log('Obteniendo Posibles rutas...');
		var all_posible_routes:Array = this.generateRoutesFrom( intersection_points )
		console.log('================================================');
		console.log(all_posible_routes);



		if( jumps == null ){
			console.log('No hay forma de unir los dos puntos');
			console.log('en un numero de saltos aceptables');
			console.log('se tiene que buscar soluciones a pie');
		}

		var matchRoutes:Array = [];
		_.each(all_posible_routes, (route)=>{
			var complete_route = _.union([origin],route,[destination]);
			
			var first = _.first(route);
			console.log(first);
			if( first ){
				var distanceFromOrigin = origin.get('location').kilometersTo( first.get('location') );
				console.log(all_posible_routes.length)
				if( distanceFromOrigin < 3.5 || all_posible_routes.length < 3 ){
					var obj:Object = {steps:complete_route, distanceOrigin: distanceFromOrigin };
					matchRoutes.push(obj)
				}
			}
		})


		console.log('================================================');
		console.log('Rutas encontrados');

		matchRoutes = _.sortBy(matchRoutes,( route )=>{ return route.distanceOrigin });
		
		return {routes:matchRoutes};
	}
}
export = Main