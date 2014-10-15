define(["require", "exports", "zepto"], function(require, exports) {
    var Animaciones = (function () {
        function Animaciones() {
            this.Todo = null;
        }
        Animaciones.splash = function () {
            var _this = this;
            this.popUp('#splash a.icon-logo', null, { time: 0.6, delay: 0.4 });
            this.slideUp('#splash a.text-logo', null, { time: 0.4, delay: 0.8, top: '60%' });
            this.animacionesBoton('#splash a.icon-logo', function () {
                _this.fadeScreenTo($('#splash a.icon-logo').attr('href'));
            }, false);
        };

        Animaciones.home = function (animarLogo) {
            if (typeof animarLogo === "undefined") { animarLogo = true; }
            var _this = this;
            if (animarLogo)
                this.slideUp('#home a.icon-logo', null, { time: 0.4, delay: 0.2, top: '10' }, true);

            this.animacionesSeleccionPuntos('#selectOrigin', function () {
                _this.fadeInScreen($('#selectOrigin').attr('href'));
            }, false);

            this.animacionesSeleccionPuntos('#selectDestination', function () {
                _this.fadeInScreen($('#selectDestination').attr('href'));
            }, false);

            this.animacionesBoton('#home a.icon-logo', function () {
                _this.fadeInScreen($('#home a.icon-logo').attr('href'));
            }, false);
        };

        Animaciones.fadeScreenTo = function (screenID) {
            this.slideDown('#splash a.text-logo', null, { time: 0.3, delay: 0, top: '60%' });
            this.slideDown('#splash a.icon-logo', null, { time: 0.3, delay: 0, top: '20%' });
            TweenMax.to('#splash', 0.2, {
                opacity: 0,
                onComplete: function () {
                    window.location.hash = '!' + screenID;
                    TweenMax.from('#screen', 0.2, { opacity: 0 });
                }
            });
        };

        Animaciones.fadeInScreen = function (screenID) {
            TweenMax.to('#screen', 0.2, {
                opacity: 0,
                onComplete: function () {
                    window.location.hash = screenID;
                    TweenMax.to('#screen', 0.2, { opacity: 1 });
                }
            });
        };

        Animaciones.animacionesBoton = function (selector, callback, propagation) {
            var _this = this;
            $(selector).on('click', function (e) {
                _this.popDownButton(selector, callback);
                return propagation;
            });
        };

        Animaciones.animacionesSeleccionPuntos = function (selector, callback, propagation) {
            $(selector).on('click', function (e) {
                if (callback)
                    callback();
                return propagation;
            });
        };

        Animaciones.popDownButton = function (selector, callback, options) {
            if (typeof callback === "undefined") { callback = null; }
            if (typeof options === "undefined") { options = { delay: 0, time: 0.3 }; }
            TweenMax.to(selector, options.time, {
                delay: options.delay,
                scaleX: 0.8,
                scaleY: 0.8,
                ease: Back.easeInOut,
                onComplete: function () {
                    TweenMax.to(selector, options.time, { delay: options.delay, scaleX: 1, scaleY: 1, ease: Bounce.easeOut, onComplete: function () {
                            if (callback)
                                callback();
                        } });
                }
            });
        };

        Animaciones.popUp = function (selector, callback, options) {
            if (typeof callback === "undefined") { callback = null; }
            if (typeof options === "undefined") { options = { delay: 0, time: 0.6 }; }
            TweenMax.from(selector, options.time, { delay: options.delay, opacity: 0, scaleX: 0, scaleY: 0, ease: Back.easeOut, onComplete: function () {
                    if (callback)
                        callback();
                } });
        };

        Animaciones.slideUp = function (selector, callback, options, margin) {
            if (typeof callback === "undefined") { callback = null; }
            if (typeof options === "undefined") { options = { delay: 0, time: 0.6, top: '100%' }; }
            if (typeof margin === "undefined") { margin = false; }
            if (margin)
                TweenMax.from(selector, options.time, { delay: options.delay, opacity: 0, marginTop: options.top, ease: Back.easeOut, onComplete: function () {
                        if (callback)
                            callback();
                    } });
else
                TweenMax.from(selector, options.time, { delay: options.delay, opacity: 0, top: options.top, ease: Back.easeOut, onComplete: function () {
                        if (callback)
                            callback();
                    } });
        };
        Animaciones.slideDown = function (selector, callback, options, margin) {
            if (typeof callback === "undefined") { callback = null; }
            if (typeof options === "undefined") { options = { delay: 0, time: 0.6, top: '100%' }; }
            if (typeof margin === "undefined") { margin = false; }
            if (margin)
                TweenMax.to(selector, options.time, { delay: options.delay, opacity: 0, marginTop: options.top, ease: Back.easeOut, onComplete: function () {
                        if (callback)
                            callback();
                    } });
else
                TweenMax.to(selector, options.time, { delay: options.delay, opacity: 0, top: options.top, ease: Back.easeOut, onComplete: function () {
                        if (callback)
                            callback();
                    } });
        };
        return Animaciones;
    })();
    
    return Animaciones;
});
