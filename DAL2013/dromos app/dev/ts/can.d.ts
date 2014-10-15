interface Can{
	isDeferred(obj);
	cid(object, name);
	addEvent(event, fn);
	removeEvent(event, fn);
	dispatch(event);
	buildFragment(html, nodes);
	Deferred(func);
	//when = Deferred.when();
	each(elements, callback, context);
	trigger(obj, event, args, bubble);
	bind(ev, cb);
	unbind(ev, cb);
	delegate(selector, ev, cb);
	undelegate(selector, ev, cb);
	makeArray(arr);
	proxy(f, ctx);
	ajax(options);
	trim(str);
	isEmptyObject(object);
	extend(first);
	get(wrapped, index);
	Construct;
	Observe;
	bindAndSetup();
	unbindAndTeardown(ev, handler);
	//List = Observe.List = list;
	compute(getterSetter, context, eventName);
	Model:_canModel;
	view;
	Control: _canControl;
	route(url, defaults);
	//Control.processors.route(el, event, selector, funcName, controller);
	/*view.Scanner = Scanner(options);
	        can.view.lists(list, renderer);*/
}

interface Mustache{
	//Mustache(options, helpers);
	txt(context, mode, name);
	get(ref, contexts, isHelper, isArgument);
	resolve(value, lastValue, name, isArgument);
	registerHelper(name, fn);
	getHelper(name, options);
	render(partial, context);
	renderPartial(partial, context, options);
}

interface canModelExtend{
	List(obj:Object): void;
}
interface canControlExtend{
	(element:Object): void;
	element:any
}

interface _canModel{
	(obj:Object, config:Object):canModelExtend
	exten(obj:Object, config:Object):canModelExtend;
}
interface _canControl{
	(obj:Object):canControlExtend
	extend(obj:Object):canControlExtend;
}



declare var can: Can;
declare var mustache: Mustache;

//declare var can: any;
//declare var mustache: any;