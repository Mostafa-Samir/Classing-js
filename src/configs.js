/**
	* _instantiateOnce : a constructor function that is can be used only once to create
						 the xSelf constant
**/
var _instantiateOnce = (function() {
	var flag = false;
	return function() {
		var _timestamp = Date.now();
		if(flag) {
			throw xError("000" , "not allowed");
		}
		else {
			flag = true;
			Object.defineProperty(this , 'timestamp' , {
				get : function() {
					return _timestamp;
				},
				set : function _setter(value) {
					var c = _setter.caller;
					if(_setter.caller === Class || _setter.caller === Interface) {
						_timestamp = value
					}
				}
			});
		}
	}
})();

/**
	*Library's Constant keywords : xTyped , xNonTyped , xSelf
**/
Object.defineProperty(window , 'xTyped' , {value:true , writable:false});
Object.defineProperty(window , 'xNonTyped' , {value:false , writable:false});
Object.defineProperty(window , 'xSelf' , {value : new _instantiateOnce() , writable:false});
/**
	*base : a global variable used to reference the Base class in inhertance
**/
var base = null;

/**
	xError : a custom error constructor to distinguish the library's errors from native errors
	@param {String} code : code of the error
	@param {String} msg : message of the error
	@return {Error} : The Error Object to throw
**/
function xError(code , msg) {
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
