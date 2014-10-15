(function(){

  // --------------------- FAMO.US -----------------------------------------

  // Rig some famo.us deps
  require("famous-polyfills"); // Add polyfills
  require("famous/core/famous"); // Add the default css file

  Application = null;


  // Make sure dom got a body...
  Meteor.startup(function() {

    // Basic deps
    var Engine           = require("famous/core/Engine");
    var Modifier         = require("famous/core/Modifier");
    var RenderController = require("famous/views/RenderController");
    var Transform        = require('famous/core/Transform');  
    var Easing           = require('famous/transitions/Easing');
    var Timer            = require('famous/utilities/Timer');
    var Scrollview       = require('famous/views/Scrollview');
    
    var Transitionable   = require("famous/transitions/Transitionable");
    var SnapTransition   = require("famous/transitions/SnapTransition");
    var SpringTransition = require("famous/transitions/SpringTransition");
    var StateModifier    = require('famous/modifiers/StateModifier');

    var View             = require("famous/core/View");
    var Lightbox         = require("famous/views/Lightbox");
    var Surface          = require("famous/core/Surface"); // This one needs document.body

    var HeaderFooterLayout = require("famous/views/HeaderFooterLayout");
    var GridLayout       = require("famous/views/GridLayout");
    


    Transitionable.registerMethod('snap', SnapTransition);
    Transitionable.registerMethod('spring', SpringTransition);



  //  ----------------------------------- MANEJO DE VIEWS -----------------------------

    function App() {
      View.apply(this, arguments);

            // create and assign a lightbox to this view
            this.lightbox = new Lightbox({
              inOpacity: 0.5,
              outOpacity: 0,
              inTransform: Transform.translate(320,0, 0),
              outTransform: Transform.translate(-320, 0, 1),
              inTransition: { duration: 400, curve: Easing.outBack },
              outTransition: { duration: 150, curve: Easing.easeOut }
              
            });
            this.add(this.lightbox);

            this._eventInput.pipe(this.lightbox);

            this._sectionSurfaces = [];
          }

          App.prototype = Object.create(View.prototype);
          App.prototype.constructor = App;

          App.prototype.addSection = function (name, template, data) {
            // create the div for the meteor template
            var div = document.createElement('div');


            UI.insert(data ? UI.renderWithData(template, data) : UI.render(template), div);

            this._sectionSurfaces[name] = new Surface({
              content: div,
              size: [ undefined, undefined  ],
              classes: ["famous-container"]
            });
          };


          App.prototype.show = function (sectionName) {
            var surface = this._sectionSurfaces[sectionName];
            if (surface) {
              this.lightbox.show(surface);
                setTimeout(function(){
                  //console.log('redimensionando el mapa');
                  //leafletMap.invalidateSize(false);
                }, 500);
            }
          };


          App.prototype.animateRoute = function(routeName) {
            var route = _.find(Router.routes, function(r) { return r.name == routeName; });
            if(!route) {
              return;
            }

            var me = this;
            var controller = route.getController(route.originalPath, route.options);
            var templateName = Router.convertTemplateName(route.name);
            route.options.template = "blank";
            route.options.onBeforeAction = function() { me.show(templateName); }
            me.addSection(templateName, Template[templateName]);
          }

          App.prototype.animateAllRoutes = function () {
            var me = this;
            _.each(Router.routes, function(route) {
              var controller = route.getController(route.originalPath, route.options);
              var templateName = Router.convertTemplateName(route.name);
              route.options.template = "blank";
              route.options.onBeforeAction = function() { me.show(templateName); }
              me.addSection(templateName, Template[templateName]);
            });
          }





        // create the App from the template
        Application = new App();


    //---------------------------- SECCIONES DE LA APLICACION -----------------------------


    Application.addSection('home', Template.home);
    Application.addSection('navigate', Template.navigate);
    Application.addSection('explore', Template.explore);
    Application.addSection('learn', Template.learn, { content: 'The Dromos team rocks!' });
    Application.addSection('create', Template.create);
    Application.addSection('map',Template.map);



      //------------------------- MANEJO DE ENGINE DE FAMO.US ----------------------------

      // establecer viewport para que no traslape con header y footer


      var mainContext = Engine.createContext();

      var layout = new HeaderFooterLayout({
        headerSize: 131,
        footerSize: 20
      });

      layout.header.add(new Surface({
        content: "",
        classes: ["white-bg"],
        properties: {
          lineHeight: "131px",
          textAlign: "center"
        }
      }));



      // CREAR SCROLLVIEW PARA EL CONTENIDO DE LA APLICACIÓN

      var contentScrollView = new Scrollview();
      var contentScrollViewSurfaces = [];

      contentScrollViewSurfaces.push(Application);
      contentScrollView.sequenceFrom (contentScrollViewSurfaces);
      contentScrollView.subscribe(Engine);

      layout.content.add(contentScrollView);


      layout.footer.add(new Surface({
          content: "",
          classes: ["dark-grey-bg"],
          properties: {
              lineHeight: "20px",
              textAlign: "center"
          }
      }));

    
      mainContext.add(layout);







    //--------------------------- MANEJO DE UN MAPA EN UN SURFACE DE FAMO.US ---------------


              var mapdiv = document.createElement('div');
              mapdiv.className += " mapdiv";

              mapdiv.style.width = "100%";
              mapdiv.style.height = ''+ (window.innerHeight - 131) + 'px';
              //mapdiv.style.height = "100%";  

             // console.log(window.innerHeight - 131);
         
              var maptemplate  = Template.map; 
              var mapdata = { content : 'Dummy Data'};

              UI.insert(mapdata ? UI.renderWithData(maptemplate, mapdata) : UI.render(maptemplate), mapdiv);

              Application._sectionSurfaces['map'] = new Surface({
                content: mapdiv,
                size: [undefined, undefined],
                classes: ["famous-container", "leaflet-map-container"]
              });

              DromosApp = DromosConnect('gye',mapdiv);


              
   });


})();
