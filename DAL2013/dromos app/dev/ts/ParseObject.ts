/// <reference path="generic.d.ts" />

class ParseObject{
	private db:any = null;
	private Model:any;
	private objectName:String;

	constructor ( object, conexion ){
		this.objectName = object;
		Parse.initialize( conexion.APP_ID, conexion.JS_KEY );
		this.Model = Parse.Object.extend(object);
	}


	public create( data:Object, callback:Function = null ){
		var newObject = new this.Model();
		newObject.save( data,{
						success: (objectUpdated)=>{callback(objectUpdated)},
						error: (obj, error)=>{ callback(null); this.onError(error); }
						});
	}

	private onError( error ){
		console.log('Failed to create new '+this.objectName);
		console.log('Error code: '+error.description);
	}

	public update( objectOld:any, data:Object, callback:Function = null )
	{
		objectOld.save( data,{
						success: (objectUpdated)=>{callback(objectUpdated)},
						error: (obj, error)=>{ callback(null); this.onError(error); }
						});
	}

	public nearTo( field:String, geoPoint:Object, radius:Number = 0.3, callback:Function = null ){
		var query  = new Parse.Query( this.Model );
		var point  = new Parse.GeoPoint(geoPoint);
				
		query.withinKilometers( field, geoPoint, radius );
		query.find({
			success : ( results )=>{ callback(results) },
			error 	: ()=>{ callback( null ) }
		});
	}

}
export = ParseObject
