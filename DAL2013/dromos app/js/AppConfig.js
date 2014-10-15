require.config({
    paths: {
        zepto: ['http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min', 'lib/zepto.min'],
        can: ['lib/can', 'http://canjs.com/release//1.1.7/can.zepto'],
        parse: ['lib/parse.min'],
        Leaflet: ['lib/leaflet', 'http://cdn.leafletjs.com/leaflet-0.6.4/leaflet'],
        underscore: ['lib/underscore.min', 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.2.1/underscore-min.js'],
        tweenMax: ['lib/TweenMax.min', 'http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.0/TweenMax.min']
    },
    shim: {
        Leaflet: {
            exports: 'L'
        },
        underscore: {
            exports: '_'
        },
        zepto: {
            deps: ['Leaflet']
        },
        can: {
            deps: ['zepto', 'Leaflet']
        }
    }
});

require(['Main', 'underscore', 'tweenMax'], function (App, _) {
    var app = new App();
    app.init();
});
