/**
	xStamp : attaches a timestamp to a constructor function
			 which is considered an intermidate data to identify instances of this constructor
	@param {function} Constructor : the constructro function
**/
classing.xStamp = function(Constructor) {
	if(typeof Constructor === "function") {
		Constructor.timestamp = classing.xSelf.timestamp;
		classing.xSelf.timestamp++;
	}
}

/**
	_xTypes : a special , limited access type to feed arguments type lists while overloading functions
	@param {numbr} count : the number of arguments
	@param {string} list : the list of types
**/
classing._xTypes = function(count , list) {
	if(classing._xTypes.caller === classing.types) {
		this.count = count;
		this.list = list;
	}
	else {
		throw classing.xError("000" , "Not Allowed");
	}
}

/**
	types : a creator function for the _xTypes objects
	@params {functions} : the constructor functions of the types (either native or custom)
	@return {Object : _xTypes} : the _xTypes Object Created
**/
classing.types = function() {
	var count = arguments.length;
    var list = "";
    for(var i = 0 ; i < count ; i++) {
    	if(arguments[i] === classing.xSelf) {
    		list += classing.xSelf.timestamp;
    		continue;
    	}
    	if(typeof arguments[i] !== "function") {
    		throw classing.xError("103" , "Invalid Type");
    	}
        if(arguments[i].timestamp) {
           list += arguments[i].timestamp;
        }
        else {
        	var _str = arguments[i].toString();
        	var _typeName = _str.match(/function\s*(\w+)/)[1];
        	list += _typeName;
    	}

        if(i !== arguments.length - 1) {
        	list += ",";
        }
    }
    var xList = new classing._xTypes(count , list);
    return xList;
}
//global shortcut for types function
Object.defineProperty(_global, 'types' , {get: function(){return classing.types}, set:function(v){}});


Function.create = (function() {

	/**
		_isEmpty : a Static function that checks if the fuctions used in the overloaded declerations are empty
				   Used in marking abstract functions and interface's functions
		@param {boolean} typedFlag : true if typed overloaded , false otherwise
		@param {Array} internalMap : the map of functions inside the overloaded function
		@return {boolean} : true if all functions are empty , false otherwise 
	**/
	function _isEmpty(typedFlag , internalMap) {
		if(typedFlag) {
			for(i in internalMap) {
				for(j in internalMap[i]) {
					if(!classing.Abstract.isNotImplemented(internalMap[i][j])) {
						return false;
					}
				}
			}
		}
		
		else {
			for(i in internalMap) {
				if(!classing.Abstract.isNotImplemented(internalMap[i])) {
					return false;
				}
			}
		}
		return true;
	}

	/**
		_type : returns the type (or the stamp) of an object for argument types matching in overloaded functions
		@param {Object} : the object to identify its type
		@return {String} : the type (or the stamp) of the object
	**/
	function _type(obj) {
		var type = typeof obj;
		if(type === "object") {
			if(obj.constructor.timestamp) {
				return obj.constructor.timestamp.toString();
			}
			else {
				var _constructor = Object.getPrototypeOf(obj).constructor.toString();
				var _name = _constructor.match(/function\s*(\w*)/)[1];
				if(_name !== "") {
					return _name;
				}
				else {
					return "Object";
				}
			}
		}

		type = type[0].toUpperCase() + type.substring(1);
		return type;
	}
	
	return function(typed , def , flag) {
		/**
		*The 'Function.create'
		*creates an overloaded function pattern 
		*@param {Boolean} typed : sets the overloading mode to typed (if true) or non-typed (if false)
		*@param {Array} def : array of overloading instances
		*@param {Object} flag : flag for invalid extra arguments
		*@return {function} : returns the overloaded function pattern
		**/
		if(typed === undefined || !def || flag) {
			throw classing.xError("100" , "invalid arguments");
		}
		else if(typeof typed !== "boolean" || !(def instanceof Array )) {
			throw classing.xError("100" , "invalid arguments");
		}
		else {
			var len = def.length ;
			var _metadata = {
				isTyped : false,
			}
			var _pattern;
			if(typed) {
				_metadata.isTyped = true;
				_metadata.types = [];
				/**
				checking the format of the array :
					- must be non-empty and of even size
					- even elements are string lists of valid types
					- odd elements are function having a number of arguments equal to number of types
				 	 in the string list
				**/ 
				var _compressed = [];
				if(len === 0 || len % 2 !== 0) {
					throw  classing.xError("101" , "inavalid array format");
				}
				else {
					for(var i = 0 ; i < len ; i = i + 2) {
						var _list , argsCount;
						if(!(def[i] instanceof classing._xTypes) || typeof def[i + 1] !== "function") {
							throw classing.xError("101" , "inavalid array format");
						}
						else {
							if(def[i + 1].length !== def[i].count) {
								throw classing.xError("102" , "arguments number mismatch");
							}
							def[i + 1].types = def[i].list;
							_compressed.push(def[i + 1]);
						}
					}

					//sorting the array of functions
					_compressed.sort(function(a,b) {
						return b.length - a.length;
					});

					//creating a (typeList , argumentsCount)-instance map
					var _max = _compressed[0].length;
					var _map = new Array(_max + 1);
					for(var i = 0 ; i <= _max ; i++) { //intializing the map
						_map[i] = {};
					}

					//filling the map

					for(var i = 0 ; i < len / 2 ; i++) {
						var current = _compressed[i];
						_metadata.types.push(current.types);
						if(_map[current.length][current.types] !== undefined) {
							throw classing.xError("106" , "duplicate arguments list found");
						}
						_map[current.length][current.types] = current ;
					}

					_pattern = function() {
						var max = _max;
						var map = _map;

						var args = [];
						var count = arguments.length;
						var counter = 0 ;
						while(counter < count) {
							args.push(arguments[counter]);
							counter++;
						}

						var argsTypes = "";
						for(var i = 0 ; i < count ; i++) {
							argsTypes += _type(args[i]);
							if(i !== count - 1) {
								argsTypes += ",";
							} 
						}


						if(count > max) {
							throw classing.xError("105", "no overloaded instance of the function matches the argument list");
						}
						var target = map[count][argsTypes];
						if(!target) {
							throw classing.xError("105", "no overloaded instance of the function matches the argument list");
						}
						else {
							return target.apply(this , args);
						}
					}

					_pattern._meta_ = _metadata;
					Object.defineProperty(_pattern , 'isEmpty' , {get:function() {return _isEmpty(true , _map);} , set:function(val){}});
				}
			}
			else {
				_metadata.counts = new Array();
				/**
					checking the format of the array
					must be non-empty and of elements of only functions
				**/
				if(len === 0) {
					throw classing.xError("101","inavlid array format");
				}
				else {
					for(var i = 0 ; i < len ; i++) {
						if(typeof def[i] !== "function") {
							throw classing.xError("101","inavlid array format");
						}
					}

					//sorting the array of functions
					def.sort(function(a,b) {
						return b.length - a.length;
					});

					//Creating an argument length - instance map
					var _max = def[0].length; //maximum number of arguements in provided instances
					var _map = [];
					for(var i = 0 ; i < len ; i++) {
						var mapIndx = def[i].length;
						if(_map[mapIndx] !== undefined) {
							throw classing.xError("106" , "duplicate arguments list found");
						}
						_map[mapIndx] = def[i];
						_metadata.counts.push(mapIndx);
					}


					_pattern = function() {
						var max = _max;
						var map = _map;

						var args = [];
						var count = arguments.length;
						var counter = 0 ;
						while(counter < count) {
							args.push(arguments[counter]);
							counter++;
						}

						if(count > max) {
							throw classing.xError("105" , "no overloaded instance of the function matches the argument list");
							return;
						}
						var target = map[count];
						if(!target) {
							throw classing.xError("105" , "no overloaded instance of the function matches the argument list");
							return;
						}
						else {
							return target.apply(this,args);
						}
					}
					_pattern._meta_ = _metadata;
					Object.defineProperty(_pattern , 'isEmpty' , {get:function() {return _isEmpty(false , _map);} , set:function(val){}});

				}
			}

			return _pattern ;
		}
	}
})();
