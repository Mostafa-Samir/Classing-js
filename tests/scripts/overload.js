function _libError(code , msg) {
	var err = new Error();
	err.name = "_libError";
	err.code = parseInt(code);
	err.message = "[code=" + err.code + "]," + msg;

	return err;
}

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
			var argsCounts = Object.keys(internalMap);
			for(var i = 0 ; i < argsCounts.length ; i++) {
				var typeLists = Object.keys(internalMap[parseInt(argsCounts[i])]);
				for(var j = 0 ; j < typeLists.length ; j++) {
					if(!Abstract.isNotImplemented(internalMap[argsCount[i]][typeLists[j]])) {
						return false;
					}
				}
			}
		}
		else {
			var argsCounts = Object.keys(internalMap);
			for(var i = 0 ; i < argsCounts.length ; i++) {
				if(!Abstract.isNotImplemented(internalMap[argsCounts[i]])) {
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
				type = obj.constructor.timestamp.toString();
			}
			else {
				var _constructor = Object.getPrototypeOf(obj).constructor.toString();
				var _name = _constructor.match(/function\s*(\w*)/)[1];
				if(_name !== "") {
					type = _name;
				}
				else {
					type = "Object";
				}
			}
		}

		type = type[0].toUpperCase() + type.substring(1);
		return type;
	}
	
	return function(typed , def , flag) {
		/**
		*creates an overloaded function pattern 
		*@param {Boolean} typed : sets the overloading mode to typed (if true) or non-typed (if false)
		*@param {Array} def : array of overloading instances
		*@param {Object} flag : flag for invalid extra arguments
		*@return {function} : returns the overloaded function pattern
		**/
		if(typed === undefined || !def || flag) {
			throw _libError("100" , "invalid arguments");
		}
		else if(typeof typed !== "boolean" || !(def instanceof Array )) {
			throw _libError("100" , "invalid arguments");
		}
		else {
			var len = def.length ;
			var _metadata = {
				isTyped : false,
			}
			var _pattern;
			if(typed) {
				_metadata.isTyped = true;
				_metadata.types = new Array();
				/*
				checking the format of the array :
					- must be non-empty and of even size
					- even elements are string lists of valid types
					- odd elements are function having a number of arguments equal to number of types
				 	 in the string list
				*/ 
				var _compressed = new Array();
				if(len === 0 && len % 2 !== 0) {
					throw  _libError("101" , "inavalid array format");
				}
				else {
					for(var i = 0 ; i < len ; i = i + 2) {
						var _list , argsCount;
						if(typeof def[i] !== "string" || typeof def[i + 1] !== "function") {
							throw _libError("101" , "inavalid array format");
						}
						else {
							_list = def[i].split(",");
							for(var j = 0 ; j < _list.length ; j++) {
								_list[j] = _list[j].trim();
								var invalidCharacter = _list[j].match(/[\+\-\*\/\=\%\!\&\^\?\:\|\\\{\}]/);
								if(invalidCharacter !== null) {
									throw _libError("103" , "Invalid Type Name");
								}
								else {
									var _stamp = null;
									eval("if(" + _list[j] + ".timestamp) { _stamp = " + _list[j] + ".timestamp;}");
									if(_stamp !== null) {
										_list[j] = _stamp.toString();
									}
								}
							}
							argsCount = def[i + 1].length;
							if(argsCount !== _list.length) {
								throw _libError("104","typeList-function mismatch");
							}
							def[i + 1].types = _list.join(",");
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
						_map[i] = new Object();
					}

					//filling the map
					for(var i = 0 ; i < _compressed.length ; i++) {
						var current = _compressed[i];
						_metadata.types.push(current.types);
						_map[current.length][current.types] = current ;
					}

					_pattern = function() {
						var max = _max;
						var map = _map;
						var args = Array.prototype.slice.call(arguments);
						var count = args.length;
						var argsTypes = args.map(function(a) {
							return _type(a);
						}).join(",");

						if(count > max) {
							throw _libError("105", "no overloaded instance of the function matches the argument list");
						}
						var target = map[count][argsTypes];
						if(!target) {
							throw _libError("105", "no overloaded instance of the function matches the argument list");
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
				/*
					checking the format of the array
					must be non-empty and of elements of only functions
				*/
				if(len === 0) {
					throw _libError("100","inavlid argument");
				}
				else {
					for(var i = 0 ; i < len ; i++) {
						if(typeof def[i] !== "function") {
							throw _libError("100","inavlid argument");
						}
					}

					//sorting the array of functions
					def.sort(function(a,b) {
						return b.length - a.length;
					});

					//Creating an argument length - instance map
					var _max = def[0].length; //maximum number of arguements in provided instances
					var _map = new Array();
					for(var i = 0 ; i < def.length ; i++) {
						var mapLocation = def[i].length;
						_map[mapLocation] = def[i];
					}

					_metadata.counts = Object.keys(_map);

					_pattern = function() {
						var max = _max;
						var map = _map;
						var args = Array.prototype.slice.call(arguments); //passed arguments
						var len = args.length; //number of passed arguments
						if(len > max) {
							throw _libError("105" , "no overloaded instance of the function matches the argument list");
							return;
						}
						var target = map[len];
						if(!target) {
							throw _libError("105" , "no overloaded instance of the function matches the argument list");
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