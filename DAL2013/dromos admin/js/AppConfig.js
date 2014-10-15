require.config({
    paths: {
        zepto: ['http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min', 'lib/zepto.min'],
        can: ['lib/can', 'http://canjs.com/release//1.1.7/can.zepto'],
        parse: ['lib/parse.min'],
        Leaflet: ['lib/leaflet', 'http://cdn.leafletjs.com/leaflet-0.6.4/leaflet'],
        google: ['googlemaps']
    },
    shim: {
        Leaflet: {
            exports: 'L'
        },
        zepto: {
            deps: ['Leaflet']
        },
        can: {
            deps: ['zepto', 'Leaflet']
        }
    }
});

require(['Main', 'Leaflet'], function (App, L) {
    var app = new App();
    app.initializeMap();
});
