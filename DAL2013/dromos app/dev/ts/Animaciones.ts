// DEPENDECIES
/// <amd-dependency path="zepto" 	/>

// DEFINITIONS
/// <reference path="generic.d.ts" />
/// <reference path="zepto.d.ts" 	/>

class Animaciones{
	private Todo:canModelExtend = null
	

	constructor(){
	}


	public static splash(){
		this.popUp('#splash a.icon-logo',null,{time:0.6,delay:0.4});
		this.slideUp('#splash a.text-logo',null,{time:0.4,delay:0.8,top:'60%'});
		this.animacionesBoton(	'#splash a.icon-logo',
								()=>{ this.fadeScreenTo( $('#splash a.icon-logo').attr('href') ) }, 
								false);
	}


	public static home( animarLogo:boolean = true ){
		if( animarLogo )
			this.slideUp('#home a.icon-logo',null,{time:0.4,delay:0.2,top:'10'},true);
		
		this.animacionesSeleccionPuntos( '#selectOrigin',
								()=>{ this.fadeInScreen( $('#selectOrigin').attr('href') ) }, 
								false );

		this.animacionesSeleccionPuntos( '#selectDestination',
								()=>{ this.fadeInScreen( $('#selectDestination').attr('href') ) }, 
								false );

		this.animacionesBoton(	'#home a.icon-logo',
								()=>{ this.fadeInScreen( $('#home a.icon-logo').attr('href') ) }, 
								false);
	}


	public static fadeScreenTo( screenID ){
		this.slideDown('#splash a.text-logo',null,{time:0.3,delay:0,top:'60%'});
		this.slideDown('#splash a.icon-logo',null,{time:0.3,delay:0,top:'20%'});
		TweenMax.to( '#splash', 0.2, { opacity:0, onComplete:()=>{
			window.location.hash = '!'+screenID;
			TweenMax.from( '#screen', 0.2, { opacity:0 });
		}});
	}

	public static fadeInScreen( screenID ){
		TweenMax.to( '#screen', 0.2, { opacity:0, onComplete:()=>{
			window.location.hash = screenID;
			TweenMax.to( '#screen', 0.2, { opacity:1 });
		} });
	}


	public static animacionesBoton( selector:string, callback:Function, propagation:boolean ){
		$(selector).on('click', (e:Event):boolean=>{
			this.popDownButton( selector, callback );
			return propagation;
		})
	}

	public static animacionesSeleccionPuntos( selector:string, callback:Function, propagation:boolean ){
		$(selector).on('click', (e:Event):boolean=>{
			if( callback ) callback();
			return propagation;
		})
	}

	public static popDownButton( selector:String, callback:Function = null, options:any = {delay:0,time:0.3} ){
		TweenMax.to( selector, options.time, { delay:options.delay, scaleX:0.8, scaleY:0.8, ease: Back.easeInOut, onComplete:()=>{
			TweenMax.to( selector, options.time, { delay:options.delay, scaleX:1, scaleY:1, ease: Bounce.easeOut, onComplete:()=>{if( callback ) callback()} });
		}});
	}

	public static popUp( selector:String, callback:Function = null, options:any = {delay:0,time:0.6} ){
		TweenMax.from( selector, options.time, { delay:options.delay, opacity:0, scaleX:0, scaleY:0, ease: Back.easeOut, onComplete:()=>{if( callback ) callback()} })
	}

	public static slideUp( selector:String, callback:Function = null, options:any = {delay:0,time:0.6,top:'100%'}, margin:boolean=false ){
		if( margin )
			TweenMax.from( selector, options.time, { delay:options.delay, opacity:0, marginTop:options.top, ease: Back.easeOut, onComplete:()=>{if( callback ) callback()} })

		else
			TweenMax.from( selector, options.time, { delay:options.delay, opacity:0, top:options.top, ease: Back.easeOut, onComplete:()=>{if( callback ) callback()} })
	}
	public static slideDown( selector:String, callback:Function = null, options:any = {delay:0,time:0.6,top:'100%'}, margin:boolean=false ){
		if( margin )
			TweenMax.to( selector, options.time, { delay:options.delay, opacity:0, marginTop:options.top, ease: Back.easeOut, onComplete:()=>{if( callback ) callback()} })
		else
			TweenMax.to( selector, options.time, { delay:options.delay, opacity:0, top:options.top, ease: Back.easeOut, onComplete:()=>{if( callback ) callback()} })
	}

}
export = Animaciones