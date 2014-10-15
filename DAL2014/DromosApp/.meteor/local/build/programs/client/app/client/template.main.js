(function(){
UI.body.contentParts.push(UI.Component.extend({render: (function() {
  var self = this;
  return [ HTML.Raw('<!--header-->\n	<div class="header mediumgrey-bg centered">\n		<a href="/">\n		<img src="/images/isotipo.png" style=" width: 50px; margin-top: 10px; position:relative; text-align: centered;">\n		</a> \n	</div>\n\n	'), Spacebars.include(self.lookupTemplate("loginButtons")), HTML.Raw("	\n\n	<!--main content-->\n	"), HTML.DIV({
    "class": "container centered",
    id: "main"
  }, "\n		", Spacebars.include(self.lookupTemplate("navigationMenu")), "\n	"), HTML.Raw('\n\n\n	<!--footer-->\n 	<div class="dark-grey-bg-footer centered tiny footer">\n 		<a href="http://dromos.me"> Dromos 2014</a> - All rights reserved. :: \n\n 	<!-- basic router navigation for debugging -->\n 		<a href="/"> home </a> - \n		<a href="/navigate"> navigate </a> - \n		<a href="/explore"> explore </a> - \n		<a href="/create"> create </a> -\n		<a href="/learn"> learn </a> -\n		<a href="/map"> map </a> \n		\n\n	</div>') ];
})}));
Meteor.startup(function () { if (! UI.body.INSTANTIATED) { UI.body.INSTANTIATED = true; UI.DomRange.insert(UI.render(UI.body).dom, document.body); } });

Template.__define__("hello", (function() {
  var self = this;
  var template = this;
  return function() {
    return Spacebars.mustache(self.lookup("greeting"));
  };
}));

Template.__define__("from", (function() {
  var self = this;
  var template = this;
  return function() {
    return Spacebars.mustache(self.lookup("pickFrom"));
  };
}));

Template.__define__("to", (function() {
  var self = this;
  var template = this;
  return function() {
    return Spacebars.mustache(self.lookup("pickTo"));
  };
}));

Template.__define__("map2", (function() {
  var self = this;
  var template = this;
  return [ function() {
    return Spacebars.mustache(self.lookup("content"));
  }, HTML.Raw('\n	    <div id="container" class="container">\n	      <div id="map" class="map"></div>\n	    </div>') ];
}));

Template.__define__("map", (function() {
  var self = this;
  var template = this;
  return "";
}));

Template.__define__("blank", (function() {
  var self = this;
  var template = this;
  return "";
}));

Template.__define__("home", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<div id="wrapper-home" style="width=100%; height=100%;">\n		<div id="contenido-home" style="margin:20px; width=100%; height=400px;">\n			<h2>¡Qué tal!</h2>\n			Bienvenido a la versión de demostración de DROMOS (\'camino\' en Griego), una aplicación de Ecuatorianos para Ecuatorianos. ¡Únete a una comunidad de ciudadanos como tú, que aman su ciudad, y quieren hacerla aún más bacán!<br>\n			¡Estarás ayudando a más compatriotas y extranjeros a recorrer y conocer todo lo que tu tierra puede ofrecer!\n			<br>\n			Pronto estaremos agregando más información como: puntos seguros, paradas informales, hitos populares, y más.\n	<!--\n			<input type="button" class="main-options navigate blue-bg-hover" value="Navigate" />\n			<input type="button" class="main-options discover" value="Discover (soon)" />\n			<input type="button" class="main-options learn" value="Learn (soon)" />\n			<input type="button" class="main-options create" value="Create (soon)" />\n		    <input type="button" class="main-options navigate blue-bg-hover" value="About" />\n		    <button>About</button>\n		-->\n		</div>\n		\n		<div id="fondo-home" style="width: 100%;\n			    height: 450px;\n			    background-image: url(\'/images/gye_sunset.jpg\');\n			    background-size: cover;\n			    background-repeat: no-repeat;\n			    background-position: 50% 50%;">\n		</div>\n	</div>');
}));

Template.__define__("create", (function() {
  var self = this;
  var template = this;
  return [ UI.If(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ "\n		", HTML.TEXTAREA({
      rows: "3",
      "class": "input-xxlarge",
      name: "venueName",
      id: "venueName",
      placeholder: "Venue Name:"
    }), "\n		", HTML.BR(), "\n		", HTML.TEXTAREA({
      rows: "3",
      "class": "input-xxlarge",
      name: "venueLat",
      id: "venueLat",
      placeholder: "Latitude:"
    }), "\n		", HTML.BR(), "\n		", HTML.TEXTAREA({
      rows: "3",
      "class": "input-xxlarge",
      name: "venueLong",
      id: "venueLong",
      placeholder: "Longitude:"
    }), "\n		", HTML.BR(), "\n		", HTML.INPUT({
      type: "button",
      "class": "btn-info add-venue",
      value: "Add Venue"
    }), "\n	" ];
  })), "\n\n	", UI.Unless(function() {
    return Spacebars.call(self.lookup("currentUser"));
  }, UI.block(function() {
    var self = this;
    return [ "\n		", HTML.DIV({
      id: "wrapper-create",
      style: "width=100%; height=100%;"
    }, "\n			", HTML.DIV({
      id: "contenido-create",
      style: "margin:20px; width=100%; height=400px;"
    }, "\n				", HTML.H2("Crea"), "\n				¿Conoces paradas de buses que no están en ningún mapa? ¡Ingresa a Dromos y construye una ciudad más bacán con nosotros! Sólo tienes que registrarte arriba, y listo.\n				", HTML.BR(), "\n				¡Estamos organizando mingas de datos con ciudadanos rodados, que conozcan los verdaderos paraderos y rutas secretas!\n		", HTML.Comment('\n				<input type="button" class="main-options navigate blue-bg-hover" value="Navigate" />\n				<input type="button" class="main-options discover" value="Discover (soon)" />\n				<input type="button" class="main-options learn" value="Learn (soon)" />\n				<input type="button" class="main-options create" value="Create (soon)" />\n			    <input type="button" class="main-options navigate blue-bg-hover" value="About" />\n			    <button>About</button>\n			'), "\n			"), "\n			\n			", HTML.DIV({
      id: "fondo-create",
      style: "width: 100%;\n				    height: 450px;\n				    background-image: url('/images/gye_traffic.jpg');\n				    background-size: cover;\n				    background-repeat: no-repeat;\n				    background-position: 50% 50%;"
    }, "\n			"), "\n		"), "\n\n\n\n\n\n	" ];
  })) ];
}));

Template.__define__("navigate", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<div id="wrapper-navigate" style="width=100%; height=100%;width=100%;">\n		<div id="contenido-navigate" style="margin:20px; width=100%;">\n\n			<h2>Navega</h2>\n			<div id="navigate-form" style="margin:20px; width=100%;">\n				<form id="buscar_ruta" action="/map">\n					<div id="autocomplete_desde" class="autocomplete seven columns" style="width=100%;">\n						<label>Desde:</label>\n						<input type="text" id="desde" width="100%" name="desde" placeholder=" mi lugar de partida">\n					</div>\n					<div id="autocomplete_hasta" class="autocomplete seven columns" style="width=100%;">\n						<label>Hasta:</label>\n						<input type="text" id="hasta" width="100%" name="hasta" placeholder=" mi lugar de destino">\n					</div>\n					<div class="two columns">\n						<br>\n						<input type="submit" value="Buscar" class="blue-bg-hover">\n					</div>\n				</form>\n			</div>\n			DROMOS es diferente a otras opciones de navegación. Te guiamos pensando en hitos en vez de direcciones, para que puedas preguntar cómo llegar sin perderte.  <br>\n			Pronto estaremos alimentando información de horas pico, seguridad y rutas informales, para crear junto contigo ciudades más amigables e inteligentes.\n\n		</div>\n	</div>');
}));

Template.__define__("explore", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<div id="wrapper-explore" style="width=100%; height=100%;">\n		<div id="contenido-explore" style="margin:20px; width=100%; ">\n			<h2>Explora (se viene)</h2>\n			¡En esta sección podrás explorar tu ciudad como nunca antes!<br>\n			Podrás descubrir hitos cercanos a tu ubicación, y dejarte sorprender con nuevas experiencias.\n			<br>\n			¡Estamos buscando ciudadanos de verdad, que conozcan los verdaderos huecos!\n	<!--\n			<input type="button" class="main-options navigate blue-bg-hover" value="Navigate" />\n			<input type="button" class="main-options discover" value="Discover (soon)" />\n			<input type="button" class="main-options learn" value="Learn (soon)" />\n			<input type="button" class="main-options create" value="Create (soon)" />\n		    <input type="button" class="main-options navigate blue-bg-hover" value="About" />\n		    <button>About</button>\n		-->\n		</div>\n		\n		<div id="fondo-explore" style="width: 100%;\n			    height: 450px;\n			    background-image: url(\'/images/gye_bridge.jpg\');\n			    background-size: cover;\n			    background-repeat: no-repeat;\n			    background-position: 50% 50%;">\n		</div>\n	</div>');
}));

Template.__define__("learn", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<div id="wrapper-learn" style="width=100%; height=100%;">\n		<div id="contenido-learn" style="margin:20px; width=100%; height=400px;">\n			<h2>Aprende (se viene)</h2>\n			¡En esta sección podrás saber la pepa de los puntos que visitas!<br>\n			Más allá de simples tips, queremos que realmente conozcas el contexto histórico, turístico y humano de cada hito, y cómo éste hace de Guayaquil una ciudad más especial.\n			<br>\n			¡Estamos buscando historiadores y guías urbanos de verdad, que conozcan los verdaderos relatos Guayacas!\n	<!--\n			<input type="button" class="main-options navigate blue-bg-hover" value="Navigate" />\n			<input type="button" class="main-options discover" value="Discover (soon)" />\n			<input type="button" class="main-options learn" value="Learn (soon)" />\n			<input type="button" class="main-options create" value="Create (soon)" />\n		    <input type="button" class="main-options navigate blue-bg-hover" value="About" />\n		    <button>About</button>\n		-->\n		</div>\n		\n		<div id="fondo-explore" style="width: 100%;\n			    height: 450px;\n			    background-image: url(\'/images/gye_statue.jpg\');\n			    background-size: cover;\n			    background-repeat: no-repeat;\n			    background-position: 50% 50%;">\n		</div>\n	</div>\n<!--\n    <button>Home</button>\n-->');
}));

Template.__define__("navigationMenu", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<div class="codrops-menu">\n				<div class="main clearfix">\n					<nav id="menu" class="nav">					\n						<ul>\n							<li>\n								<a href="/">\n									<span class="icon">\n										<i aria-hidden="true" class="icon-isotipo_a"></i>\n									</span>\n									<span>Inicio</span>\n								</a>\n							</li>\n							<li>\n								<a href="/navigate">\n									<span class="icon"> \n										<i aria-hidden="true" class="icon-road_b"></i>\n									</span>\n									<span>Navega</span>\n								</a>\n							</li>\n							<li>\n								<a href="/explore">\n									<span class="icon">\n										<i aria-hidden="true" class="icon-explore_b"></i>\n									</span>\n									<span>Explora</span>\n								</a>\n							</li>\n							<li>\n								<a href="/create">\n									<span class="icon">\n										<i aria-hidden="true" class="icon-create_b"></i>\n									</span>\n									<span>Crea</span>\n								</a>\n							</li>\n							<li>\n								<a href="/learn">\n									<span class="icon">\n										<i aria-hidden="true" class="icon-discover_b"></i>\n									</span>\n									<span>Aprende</span>\n								</a>\n							</li>\n							<li>\n								<a href="/map">\n									<span class="icon">\n										<i aria-hidden="true" class="icon-direction"></i>\n									</span>\n									<span>Mapa</span>\n								</a>\n							</li>\n						</ul>\n					</nav>\n				</div>\n\n		</div>');
}));

})();
