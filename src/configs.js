var classing = {}; //Library's Namespace
var _global = (typeof window != 'undefined' && this === window) ? window : global;

/**
	* _instantiateOnce : a constructor function that is can be used only once to create
						 the xSelf constant
**/
classing._instantiateOnce = (function() {
	var flag = false;
	return function() {
		var _stamp = 1010;
		if(flag) {
			throw classing.xError("000" , "not allowed");
		}
		else {
			flag = true;
			Object.defineProperty(this , 'timestamp' , {
				get : function() {
					return _stamp;
				},
				set : function _setter(value) {
					var caller = _setter.caller;
					if(caller === classing.Class || caller === classing.Interface || caller === classing.xStamp) {
						_stamp = value
					}
				}
			});
		}
	}
})();

/**
	*Library's Constant keywords : xTyped , xNonTyped , xSelf
**/
Object.defineProperty(classing , 'xTyped' , {value:true , writable:false});
Object.defineProperty(classing , 'xNonTyped' , {value:false , writable:false});
Object.defineProperty(classing , 'xSelf' , {value : new classing._instantiateOnce() , writable:false});
Object.defineProperty(classing , 'base', {value : null, writable:true});
//global shortcuts for the library's constants
Object.defineProperty(_global, 'xTyped' ,{get : function() {return classing.xTyped}, set:function(v){}});
Object.defineProperty(_global, 'xNonTyped' ,{get : function() {return classing.xNonTyped}, set:function(v){}});
Object.defineProperty(_global, 'xSelf' ,{get : function() {return classing.xSelf}, set:function(v){}});
/**
	*base : a global variable used to reference the Base class in inhertance
**/
Object.defineProperty(_global, 'base', {get:function(){return classing.base}, set:function(v){}});


/**
	xError : a custom error constructor to distinguish the library's errors from native errors
	@param {String} code : code of the error
	@param {String} msg : message of the error
	@return {Error} : The Error Object to throw
**/
classing.xError = function(code , msg) {
	var err = new Error();
	err.name = "xError";
	err.code = parseInt(code);
	err.message = "[code=" + err.code + "]:" + msg;

	return err;
}

/**
	Object::instanceOf : a custom method that checks if the calling object is an instance of someclass or an interface
	@param {Function/Object} ancestor : the Class or Interface to be checked against
	@return {Boolean} : true if the object is instance of the class/intrface specified, false otherwise 
**/
Object.defineProperty(Object.prototype , 'instanceOf' ,{ 
	value : function(ancestor) {
		var isInstace = false;
		if(typeof ancestor !== "object") {
			isInstace = this instanceof ancestor;
		}

		if(!isInstace) {
			if(ancestor.timestamp) {
				var constructor = this.constructor;
				while(constructor !== "_root_") {
					if(constructor._metadata._implements["" + ancestor.timestamp]) {
						isInstace = true;
						break;
					}
					else if(constructor._metadata._extends === ancestor) {
						isInstace = true;
						break;
					}
					else {
						constructor = constructor._metadata._extends; //go up the tree
					}
				}
			}
		}

		return isInstace;
	},
	enumerable:false
});
