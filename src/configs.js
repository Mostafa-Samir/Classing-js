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
					if(_setter.caller === Class) {
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