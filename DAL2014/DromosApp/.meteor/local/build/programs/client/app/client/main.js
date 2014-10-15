(function(){
// --------------------- METEOR TEMPLATES -----------------------------------------



  Template.hello.greeting = function () {
    return "Welcome to Dromos!";
  };

  Template.hello.pleaselogin = function () {
    return "Please login first :)";
  };

  Template.hello.userbar = function () {
    return "Please login first :)";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined'){ 
        console.log("You pressed the button");
      }
    }
  });

  Template.create.events({
      'click input.add-venue' : function(event){
          event.preventDefault();
          var venueName = document.getElementById("venueName").value;
          var venueLat = document.getElementById("venueLat").value;
          var venueLong = document.getElementById("venueLong").value;
          Meteor.call("addVenue",VenueText,function(error , venueId){
            console.log('added '+ venueName +' with Id .. '+venueId);
          });
          document.getElementById("venueName").value = "";
          document.getElementById("venueLat").value = "";
          document.getElementById("venueLong").value = "";  
      }
  });

Template.navigate.rendered = function(){

/*  setTimeout(function(){
    $('#desde').autocomplete({
      lookup: ["Parada Aeropuerto","Parada Cdla. Simón Bolivar","Parada Centro de Convenciones Este","Parada Centro de Convenciones Oeste","Parada Aviación Naval Oeste","Parada Aviación Naval Este","Parada Aviación Civil Oeste","Parada Aviación Civil Este","Parada Coliseo Voltaire Paladines Polo","Parada Colegio San Agustín","Parada Plaza del Centenario","Parada Maternidad Enrique Sotomayor","Parada de las Cuatro Manzanas","Parada Parroquia Bolivar","Parada Hospital del Niño","Parada Estadio Capwell Este","Parada Estadio Capwell Oeste","Parada Bloques del IESS Este","Parada Bloques del IESS Oeste","Parada Plaza de Artes Este","Parada Plaza de Artes Oeste","Parada Barrio del Seguro","Parada Sagrada Familia Oeste","Parada Sagrada Familia Este","Parada Viejo Cangrejal","Parada Mall del Sur","Parada Hospital del IESS","Parada Ciudadela Sopeña","Parada Santa Leonor Este","Parada Santa Leonor Oeste","Parada Base Naval Este","Parada Pradera 1","Parada Base Naval Oeste","Parada La Atarazana","Parada Hospital Luis Vernaza","Parada Boca Nueve","Parada La Catedral","Parada de Transferencia IESS","Parada Las Peñas","Parada Jardines del Malecon","Parada Banco Central","Parada El Correo","Parada de Transferencia Biblioteca Municipal","Parada Plaza de Integración","Parada La Providencia Oeste","Parada La Providencia Este","Parada El Astillero Oeste","Parada El Astillero Este","Hospital León Becerra Oeste","Parada Hospital León Becerra Este","Parada Barrio Centenario Oeste","Parada Barrio Centenario Este","Parada Barrio Cuba Este","Parada Barrio Cuba Oeste","Parada Mercado Caraguay","Parada Pradera 2","Parada Los Tulipanes","Parada Floresta 1","Parada Floresta 2","Parada Guasmo Norte","Parada Guasmo Sur","Parada Guasmo Central","Terminal Río Daule","Terminal de Integración 25 de Julio","Parada Colegio Aguirre Abad","Parque Iglesia de la Victoria","Parada Ciudadela 9 de Octubre","Terminal Guasmo"],
    });
    $('#hasta').autocomplete({
      lookup: ["Parada Aeropuerto","Parada Cdla. Simón Bolivar","Parada Centro de Convenciones Este","Parada Centro de Convenciones Oeste","Parada Aviación Naval Oeste","Parada Aviación Naval Este","Parada Aviación Civil Oeste","Parada Aviación Civil Este","Parada Coliseo Voltaire Paladines Polo","Parada Colegio San Agustín","Parada Plaza del Centenario","Parada Maternidad Enrique Sotomayor","Parada de las Cuatro Manzanas","Parada Parroquia Bolivar","Parada Hospital del Niño","Parada Estadio Capwell Este","Parada Estadio Capwell Oeste","Parada Bloques del IESS Este","Parada Bloques del IESS Oeste","Parada Plaza de Artes Este","Parada Plaza de Artes Oeste","Parada Barrio del Seguro","Parada Sagrada Familia Oeste","Parada Sagrada Familia Este","Parada Viejo Cangrejal","Parada Mall del Sur","Parada Hospital del IESS","Parada Ciudadela Sopeña","Parada Santa Leonor Este","Parada Santa Leonor Oeste","Parada Base Naval Este","Parada Pradera 1","Parada Base Naval Oeste","Parada La Atarazana","Parada Hospital Luis Vernaza","Parada Boca Nueve","Parada La Catedral","Parada de Transferencia IESS","Parada Las Peñas","Parada Jardines del Malecon","Parada Banco Central","Parada El Correo","Parada de Transferencia Biblioteca Municipal","Parada Plaza de Integración","Parada La Providencia Oeste","Parada La Providencia Este","Parada El Astillero Oeste","Parada El Astillero Este","Hospital León Becerra Oeste","Parada Hospital León Becerra Este","Parada Barrio Centenario Oeste","Parada Barrio Centenario Este","Parada Barrio Cuba Este","Parada Barrio Cuba Oeste","Parada Mercado Caraguay","Parada Pradera 2","Parada Los Tulipanes","Parada Floresta 1","Parada Floresta 2","Parada Guasmo Norte","Parada Guasmo Sur","Parada Guasmo Central","Terminal Río Daule","Terminal de Integración 25 de Julio","Parada Colegio Aguirre Abad","Parque Iglesia de la Victoria","Parada Ciudadela 9 de Octubre","Terminal Guasmo"]
    });
  }, 400);*/

}


Template.navigationMenu.rendered = function(){  


    var changeClass = function (r,className1,className2) {
      var regex = new RegExp("(?:^|\\s+)" + className1 + "(?:\\s+|$)");
      if( regex.test(r.className) ) {
        r.className = r.className.replace(regex,' '+className2+' ');
        }
        else{
        r.className = r.className.replace(new RegExp("(?:^|\\s+)" + className2 + "(?:\\s+|$)"),' '+className1+' ');
        }
        return r.className;
    };  

    //  Creating our button in JS for smaller screens
    var menuElements = document.getElementById('menu');
    menuElements.insertAdjacentHTML('afterBegin','<button type="button" id="menutoggle" class="navtoogle" aria-hidden="true"><i aria-hidden="true" class="icon-th-list"> </i> Menu</button>');


    //  Toggle the class on click to show / hide the menu
    document.getElementById('menutoggle').onclick = function() {
      changeClass(this, 'navtoogle active', 'navtoogle');
    }

    // http://tympanus.net/codrops/2013/05/08/responsive-retina-ready-menu/comment-page-2/#comment-438918
    document.onclick = function(e) {
      var mobileButton = document.getElementById('menutoggle'),
        buttonStyle =  mobileButton.currentStyle ? mobileButton.currentStyle.display : getComputedStyle(mobileButton, null).display;

      if(buttonStyle === 'block' && e.target !== mobileButton && new RegExp(' ' + 'active' + ' ').test(' ' + mobileButton.className + ' ')) {
        changeClass(mobileButton, 'navtoogle active', 'navtoogle');
      }
    }

};



Template.loginButtons.rendered = function() {
    $('#login-sign-in-link').text('Ingresar ▾');
    $('.login-close-text').text('Cerrar');
    $('#login-username-or-email-label').text('Email');
    $('#login-password-label').text('Clave');
    $('#signup-link').text('Konto erstellen');
    $('#forgot-password-link').text('Olvidé mi clave');
    $('#login-buttons-forgot-password').text('Recuperar');
    $('#back-to-login-link').text('Pseudo');
    $('#login-username-label').text('Username');
    $('#login-buttons-open-change-password').text('Cambiar clave');
    $('#login-buttons-logout').text('Salir');
    $('#reset-password-new-password-label').text('Nueva clave');
    $('#login-old-password-label').text('Clave anterior');
    $('#login-password-label').text('Clave nueva');
    $('#login-buttons-do-change-password').text('Cambiar clave');
    $('#login-buttons-reset-password-button').text('Cambiar');


    if ($('.message.info-message').text().indexOf('Email sent') != -1) $('.message.info-message').text('Email enviado');
     $('#just-verified-dismiss-button').parent().html('<div class="btn btn-warning" id="just-verified-dismiss-button">Ocultar</div> verificación de email');

    if ($('#login-buttons-password').text().indexOf('Sign in') != -1) {
      $('#login-buttons-password').text('Ingresar');
    } else {
      $('#login-buttons-password').text('Crear mi cuenta');
    }

    if ($('.message.error-message').text().indexOf('Username must be at least 3 characters long') != -1) {
       $('.message.error-message').text('El usuario debe tener al menos 3 caracteres');
    } else if ($('.message.error-message').text().indexOf('Incorrect password') != -1 || $('.message.error-message').text().indexOf('User not found') != -1) {
        $('.message.error-message').text('El usuario o la clave están incorrectos');
    }


};


Template.map2.rendered = function() {
    $(window).resize(function() {
      //console.log($(window).height());
      var mapdiv = document.getElementsByClassName('mapdiv')[0];
      mapdiv.style.height = ''+ (window.innerHeight - 131) + 'px';
    });
};



// --------------------- IRON-ROUTER -----------------------------------------


  App = {};
  Helpers = {};

  App.subscriptions = {
    /*SUBSCRIPTIONS*/
  }


  Helpers.menuItemClass = function(routeName) {
    if(!Router.current(true)) return "";
    if(!Router.routes[routeName]) return "";
    var currentPath = Router.current(true).path;
    var routePath = Router.routes[routeName].originalPath;

    var params = Router.current(true).params;
    for(var key in params) {
      if(key != "hash")
        routePath = routePath.replace(":" + key, params[key]);
    }

    if(routePath === "/")
      return currentPath == routePath ? "active" : "";
    return currentPath.indexOf(routePath) == 0 ? "active" : "";
  };

  _.each(Helpers, function (helper, key) {
    Handlebars.registerHelper(key, helper)
  });



  Router.map(function () {

    this.route('home', {
      path: '/',
      template: 'blank',
      onBeforeAction: function(){
        Application.show('home');
      }
    });
/*
    this.route('navigate', {
        path: '/navigate/:_desde/:_hasta/',
        template: 'blank',
        onBeforeAction: function () {
            Application.show('navigate');
        }
    });
*/
    this.route('navigate', {
        path: '/navigate',
        template: 'blank',
        onBeforeAction: function () {
            Application.show('navigate');
        }
    });

    this.route('explore', {
        path: '/explore',
        template: 'blank',
        onBeforeAction: function () {
            Application.show('explore');
        }
    });

    this.route('create', {
        path: '/create',
        template: 'blank',
        onBeforeAction: function () {
            Application.show('create');
        }
    });

    this.route('learn', {
        path: '/learn',
        template: 'blank',
        onBeforeAction: function () {
            Application.show('learn');
        }
    });

    this.route('map', {
        path: '/map',
        template: 'blank',
        onBeforeAction: function () {
            Application.show('map');
        }
    });


  });




})();
