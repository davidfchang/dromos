define(["require", "exports"], function(require, exports) {
    var ParseObject = (function () {
        function ParseObject(object, conexion) {
            this.db = null;
            this.objectName = object;
            Parse.initialize(conexion.APP_ID, conexion.JS_KEY);
            this.Model = Parse.Object.extend(object);
        }
        ParseObject.prototype.create = function (data, callback) {
            if (typeof callback === "undefined") { callback = null; }
            var _this = this;
            var newObject = new this.Model();
            newObject.save(data, {
                success: function (objectUpdated) {
                    callback(objectUpdated);
                },
                error: function (obj, error) {
                    callback(null);
                    _this.onError(error);
                }
            });
        };

        ParseObject.prototype.onError = function (error) {
            console.log('Failed to create new ' + this.objectName);
            console.log('Error code: ' + error.description);
        };

        ParseObject.prototype.update = function (objectOld, data, callback) {
            if (typeof callback === "undefined") { callback = null; }
            var _this = this;
            objectOld.save(data, {
                success: function (objectUpdated) {
                    callback(objectUpdated);
                },
                error: function (obj, error) {
                    callback(null);
                    _this.onError(error);
                }
            });
        };

        ParseObject.prototype.nearTo = function (field, geoPoint, radius, callback) {
            if (typeof radius === "undefined") { radius = 0.3; }
            if (typeof callback === "undefined") { callback = null; }
            var query = new Parse.Query(this.Model);
            var point = new Parse.GeoPoint(geoPoint);

            query.withinKilometers(field, point, radius);
            query.find({
                success: function (results) {
                    callback(results);
                },
                error: callback(null)
            });
        };
        return ParseObject;
    })();
    
    return ParseObject;
});
