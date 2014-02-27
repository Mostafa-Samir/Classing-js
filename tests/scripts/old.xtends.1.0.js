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
	xStamp : attaches a timestamp to a constructor function
			 which is considered an intermidate data to identify instances of this constructor
	@param {function} Constructor : the constructro function
**/
function xStamp(Constructor) {
	if(typeof Constructor === "function") {
		Constructor.timestamp = Date.now();
	}
}


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
	_xTypes : a special , limited access type to feed arguments type lists while overloading functions
	@param {numbr} count : the number of arguments
	@param {string} list : the list of types
**/
function _xTypes(count , list) {
	if(_xTypes.caller === types) {
		this.count = count;
		this.list = list;
	}
	else {
		throw xError("000" , "Not Allowed");
	}
}

/**
	types : a creator function for the _xTypes objects
	@params {functions} : the constructor functions of the types (either native or custom)
	@return {Object : _xTypes} : the _xTypes Object Created
**/
function types() {
	var count = arguments.length;
    var list = "";
    for(var i = 0 ; i < arguments.length ; i++) {
    	if(arguments[i] === xSelf) {
    		list += xSelf.timestamp;
    		continue;
    	}
    	if(typeof arguments[i] !== "function") {
    		throw xError("103" , "Invalid Type");
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
    var xList = new _xTypes(count , list);
    return xList;
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
		*The 'Function.create'
		*creates an overloaded function pattern 
		*@param {Boolean} typed : sets the overloading mode to typed (if true) or non-typed (if false)
		*@param {Array} def : array of overloading instances
		*@param {Object} flag : flag for invalid extra arguments
		*@return {function} : returns the overloaded function pattern
		**/
		if(typed === undefined || !def || flag) {
			throw xError("100" , "invalid arguments");
		}
		else if(typeof typed !== "boolean" || !(def instanceof Array )) {
			throw xError("100" , "invalid arguments");
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
				/**
				checking the format of the array :
					- must be non-empty and of even size
					- even elements are string lists of valid types
					- odd elements are function having a number of arguments equal to number of types
				 	 in the string list
				**/ 
				var _compressed = new Array();
				if(len === 0 || len % 2 !== 0) {
					throw  xError("101" , "inavalid array format");
				}
				else {
					for(var i = 0 ; i < len ; i = i + 2) {
						var _list , argsCount;
						if(!(def[i] instanceof _xTypes) || typeof def[i + 1] !== "function") {
							throw xError("101" , "inavalid array format");
						}
						else {
							if(def[i + 1].length !== def[i].count) {
								throw xError("102" , "arguments number mismatch");
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
						_map[i] = new Object();
					}

					//filling the map
					for(var i = 0 ; i < _compressed.length ; i++) {
						var current = _compressed[i];
						_metadata.types.push(current.types);
						if(_map[current.length][current.types] !== undefined) {
							throw xError("106" , "duplicate arguments list found");
						}
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
							throw xError("105", "no overloaded instance of the function matches the argument list");
						}
						var target = map[count][argsTypes];
						if(!target) {
							throw xError("105", "no overloaded instance of the function matches the argument list");
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
					throw xError("101","inavlid array format");
				}
				else {
					for(var i = 0 ; i < len ; i++) {
						if(typeof def[i] !== "function") {
							throw xError("101","inavlid array format");
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
						if(_map[mapLocation] !== undefined) {
							throw xError("106" , "duplicate arguments list found");
						}
						_map[mapLocation] = def[i];
					}

					_metadata.counts = Object.keys(_map);

					_pattern = function() {
						var max = _max;
						var map = _map;
						var args = Array.prototype.slice.call(arguments); //passed arguments
						var len = args.length; //number of passed arguments
						if(len > max) {
							throw xError("105" , "no overloaded instance of the function matches the argument list");
							return;
						}
						var target = map[len];
						if(!target) {
							throw xError("105" , "no overloaded instance of the function matches the argument list");
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

/**
	Interface : creates an interface (a structure that contains only public abstract methods to be implemented by a class or more)
	@param {defintion} : the definition of the interface
	@return {Object} : the object representing the interface

**/
function Interface(defintion) {
	var decleartions = Object.getOwnPropertyNames(defintion);

	var abstracts = new Array();

	for(var i = 0 ; i < decleartions.length ; i++) {
		var currentComponent = defintion[decleartions[i]];
		if(typeof currentComponent !== "function") {
			throw xError("401" , "Interfaces contain only methods"); //interfaces contain only functions
		}
		else {
			if(currentComponent.isEmpty !== undefined) {
				//the function is defined using Function.create
				if(!currentComponent.isEmpty) {
					throw xError("402","an interface method cannot have any implementation"); //every function must be empty
				}
				else {
					currentComponent._meta_.isOverloaded = true;
					var abstractRecord = { 
						name : decleartions[i],
						accessLevel : "public",
						description : currentComponent._meta_
					}
					abstracts.push(abstractRecord);
				}
			}
			else {
				//the function is defined in the ordinary way
				if(!Abstract.isNotImplemented(currentComponent)) {
					throw xError("402","an interface method cannot have any implementation");
				}
				else {
					var abstractRecord = {
						name : decleartions[i],
						accessLevel : "public",
						description : {
							isOverloaded : false,
							argsCount : currentComponent.length
						}
					}
					abstracts.push(abstractRecord);
				}
			}
		}

	}

	var InterfaceObject = new Object();
	Object.defineProperty(InterfaceObject , 'components' , {value : abstracts , writable:false});
	Object.defineProperty(InterfaceObject , 'isInterface' , {value : true , writable:false});

	return InterfaceObject;
}

var base = null;
/**

**/
var Class = (function() {
	
	//Static Helper functions

	/**
		*theEYE : a function that can carry out unallowed operations
		@param {number} option : a number that specifys the job to be done by theEYE
								 0 => extract _hiddenUnit
								 1 => return an instance of an abstract class
		@param {Object/Function} obj : the object whose _hiddenUnit is to be viewed / the abstrcat class constructor function of which an instance is to be created
		@param {Array} args : the argument list to be passed in the creation of the instance of the abstract class
		@return {Object} : the _hiddenUnit of the object / the instance of the abstract class
	**/
	function theEYE(option , obj , args) {
		if(option === 0) {
			if(obj.hasOwnProperty('_hu_')) {
				return obj._hu_;
			}
			else {
				return obj;
			}
		}
		else {
			var instance = new Object();
			obj.apply(instance , args);
			return instance;
		}
	}
	/**
		*isProperty : checks if an  object is a property if it contains only get and set methods
		@param {Object} obj : object to be checked
		@return {boolean} : true if the object is a property , false otherwise
	**/
	function isProperty(obj) {
		var keys = Object.keys(obj);
		if(keys.length === 2) {
			var keysString = keys.join(".");
			if(keysString === "get.set" || keysString === "set.get") {
				if(typeof obj[keys[0]] === "function" && typeof obj[keys[1]] === "function") {
					
					return true;
				}
			}
		}

		return false
	}

	/**
		*areCompatiable : checks if an implementation of an abstract method matches the description of the previosly defined abstract method
		@param {Object} abstractRecord : the record that holds the description of the abstract method
		@param {function} implementation : the candidate method to implement the abstract method 
		@param {string} accesssLevel : the access level in which the implementation resides
		@return {boolean} : true if the implementation is compatiable , false otherwise
	**/
	function areCompatiable(abstractRecord , implementation , accessLevel) {
		if(abstractRecord.accessLevel === accessLevel) {
			if(abstractRecord.description.isOverloaded) {
				if(implementation._meta_) {
					if(abstractRecord.description.isTyped === implementation._meta_.isTyped) {
						if(abstractRecord.description.isTyped) {
							var max = abstractRecord.description.types.length;
							var counter = 0;
							var implementationTypes = implementation._meta_.types;
							for(var i = 0 ; i < implementationTypes.length ; i++) {
								var indxInAbstractRecord = abstractRecord.description.types.indexOf(implementationTypes[i]);
								if(indxInAbstractRecord === -1) {
									return false;
								}
								else {
									counter++;
								}
							}

							if(counter === max) {
								return true;
							}
						}
						else {
							var max = abstractRecord.description.counts.length;
							var counter = 0;
							var implementationCounts = implementation._meta_.counts;
							for(var i = 0 ; i < implementationCounts.length ; i++) {
								var indxInAbstractRecord = abstractRecord.description.counts.indexOf(implementationCounts[i]);
								if(indxInAbstractRecord === -1) {
									return false;
								}
								else {
									counter++;
								}
							}

							if(counter === max) {
								return true;
							}
						}
					}
				}
			}
			else {
				if(abstractRecord.description.argsCount === implementation.length) {
					return true;
				}
			}
		}
		return false;
	}

	/**
		*defineIn : a function that defines proprties on objects created to avoid the propblems of
					the locality of the for loops counters.
		@param {Object} obj : the object to define proprties on
		@param {String} type : the type of property to be defined , there are 5 types : {method , property , protected-static , private-static , inherited , link}
		@param {String} key : the name of the property to be defined
		@param {Array} extras : an array of extra arguments that differ form one type to other as follows
								{
									'method' : [
													extras[0] => the _super object,
													extras[1] => the reference to the defined method
											   ],

									'property':[
													extras[0] => the _super object
													extras[1] => the reference to the getter method
													extras[2] => the reference to the setter method
											   ],

									'protected-static': [
															extras[0] => array of references to the methods of the class itself
															extras[1] => array of references to the methods of the childs classes
															extras[2] => reference to the array of containers prStatics
															extras[3] => the index of the targeted container in prStatics
														],

									'private-static': 	[
															extras[0] => array of references to the methods of the class itself
															extras[1] => reference to the array of containers prStatics
															extras[2] => the index of the targeted container in prStatics
														],

									'inherited':[
													extras[0] => reference to the _super object
												],

									'link' : 	[
													extras[0] => reference to the container in _hiddenUnit
												]
								}
	**/
	function defineIn(obj , type , key , extras) {
		if(type === "method") {
			obj[key] = function() {
				/** Begin Resolving arguments**/
						//Begin Converting to Array
							var args = [];
							var len = arguments.length;
							var counter = 0 ;
							while(counter < len) {
								args.push(arguments[counter]);
								counter++;
							}
						//End Converting to Array
						//Begin extracting _hiddenUnits
							for(var k = 0 ; k < args.length ; k++) {
								if(args[k].constructor.timestamp === obj.constructor.timestamp) {
									args[k] = theEYE(0 , args[k]);
								}
							}
						//End extracting _hiddenUnits
					/** End Resolving Arguments**/
				base = obj._super;
				return extras[0].apply(obj , args);
				base = null;
			}
		}
		else if(type === "property") {
			Object.defineProperty(obj , key , {
				get : function() {
					base = obj._super;
					return extras[0].apply(obj , []);
					base = null;
				},
				set: function(newVal) {
					/** Resolving the 'newVal' argument **/
						if(newVal.constructor.timestamp === obj.constructor.timestamp) {
							theEYE(0 , newVal);
						}
					base = obj._super;
					return extras[1].apply(obj , [newVal]);
					base = null;
				}
			});
		}
		else if(type === "protected-static") {
			Object.defineProperty(obj , key ,  {
				get: function _getter() {
					if(extras[0].own.concat(extras[0].childs).indexOf(_getter.caller) !== -1 || (_getter.caller.caller._meta_ && extras[0].own.concat(extras[0].childs).indexOf(_getter.caller.caller) !== -1)) {
						return extras[1][extras[2]];
					}
					else {
						throw xError("213" , "inaccessable member");
					}
				},
				set : function _setter(newVal) {
					if(extras[0].own.concat(extras[0].childs).indexOf(_setter.caller) !== -1 || (_setter.caller.caller._meta_ && extras[0].own.concat(extras[0].childs).indexOf(_setter.caller.caller) !== -1)) {
							extras[1][extras[2]] = newVal;
					}
					else {
						throw xError("213","inaccessable member");
					}
				}
			});
		}
		else if(type === "private-static") {
			Object.defineProperty(obj , key ,  {
				get: function _getter() {
					if(extras[0].own.indexOf(_getter.caller) !== -1 || (_getter.caller.caller._meta_ && extras[0].own.indexOf(_getter.caller.caller) !== -1)) {
						return extras[1][extras[2]];
					}
					else {
						throw xError("213","inaccessable member");
					}
				},
				set : function _setter(newVal) {
					if(extras[0].own.indexOf(_setter.caller) !== -1 || (_setter.caller.caller._meta_ && extras[0].own.indexOf(_setter.caller.caller) !== -1)) {
							extras[1][extras[2]] = newVal;
					}
					else {
						throw xError("213","inaccessable member");
					}
				}
			});
		}
		else if(type === "inherited") {
			Object.defineProperty(obj , key , {
				get : function() {
					return extras[0][key];
				},
				set: function(n) {
					extras[0][key] = n;
				}
			});
		}
		else if(type === "link") {
			Object.defineProperty(obj , key , {
				get: function() {
					return extras[0][key];
				},
				set: function(n) {
					extras[0][key] = n;
				}
			});
		}
	}


	 return function (definition) {
	var _reservedTimestamp = xSelf.timestamp;
	/**
	* Level 0 Validation : Validating the definition.
	* Validation Rule :
		- definition must be an object
		- Only three access modifiers are available : public , protected , private
	**/
	var allowedAccessModifiers = ["public" , "protected" ,"private"];
	if(typeof definition !== "object") {
		throw xError("201", "Invalid Definition");
	}
	var accessModifiers = Object.keys(definition);
	for(var counter = 0 ; counter < accessModifiers.length ; counter++) {
		var currentModifier = accessModifiers[counter];
		if(allowedAccessModifiers.indexOf(currentModifier) === -1) {
			throw xError("202" , currentModifier + ": undefined access modifier");
		}
	}

	//Seperate Containers for the the methods , attributes and proprties of the class
	var publicMethods = new Array();
	var publicAttributes = new Array();
	var publicProprties = new Array();

	var protectedMethods = new Array();
	var protectedAttributes = new Array();
	var protectedProprties = new Array();

	var privateMethods = new Array();
	var privateAttributes = new Array();
	var privateProprties = new Array();

	var ownAbstracts = new Array(); //holds the abstract methods that are defined in the class
	var ancestorAbstracts = new Array(); //holds the inherited abstract methods

	//The names arrays are to hold only the name of the methods
	var publicMethodsNames = new Array();
	var protectedMethodsNames = new Array();
	var privateMethodsNames = new Array();
	var ancestorAbstractsNames = new Array();
	var ownComponentsNames = new Array(); //this array holds the names of all the components of the class to detect duplicate names
	var inheritedComponentsNames = new Array();
	var overridenMethodsName = new Object();

	//The flags array is to hold boolean flags about wheter an ancestor abstarct method was overriden or not
	var ancestorAbstractsFlags = new Array();

	var publicStatics = new Array();
	var protectedStatics = new Array();
	var privateStatics = new Array();

	//a variable that holds the constructor of the class
	//by default it contains an empty constructor
	var constructor = function(){};

	//point 1
	//Here we handle the extending if exists
	if(Class.options.isExtending) {
		var parentMeta = Class.options.parent._metadata;
		for(var i = 0 ; i < 2 ; i++) {

			var modifier = (i === 0) ? "protected" : "public";

			var methodsContainer;
			var methodsNamesContainer;
			var proprtiesContainer;
			var attributesContainer;

			switch(i) {
				case 0 : methodsContainer = protectedMethods;
							methodsNamesContainer = protectedMethodsNames;
							proprtiesContainer = protectedProprties;
							attributesContainer = protectedAttributes;
							break;
				case 1 : methodsContainer = publicMethods;
							methodsNamesContainer = publicMethodsNames;
							proprtiesContainer = publicProprties;
							attributesContainer = publicAttributes;
							break;
			}

			//populating form inherited methods
			for(var j = 0 ; j < parentMeta[modifier].methods.length ; j++) {
				var currentMethod = parentMeta[modifier].methods[j]; 
				currentMethod.content = null;
				methodsContainer.push(currentMethod);
				methodsNamesContainer.push(currentMethod.name);
				inheritedComponentsNames.push(currentMethod.name);
			}

			//populating form inhrited proprties
			for(var j = 0 ; j < parentMeta[modifier].proprties.length ; j++) {
				var currentProperty = parentMeta[modifier].proprties[j]; 
				var propertyRecord = {
					name : currentProperty,
					content: null,
				};
				proprtiesContainer.push(propertyRecord);
				inheritedComponentsNames.push(currentProperty);
			}

			//populating form inhrited attributes
			for(var j = 0 ; j < parentMeta[modifier].attributes.length ; j++) {
				var currentAttribute = parentMeta[modifier].attributes[j]; 
				var attributeRecord = {
					name : currentAttribute,
					content: null,
				};
				attributesContainer.push(attributeRecord);
				inheritedComponentsNames.push(currentAttribute);
			}
		}

		ancestorAbstracts = parentMeta.abstracts;
		ancestorAbstractsNames = ancestorAbstracts.map(function(a) {
			return a.name;
		});
		ancestorAbstractsFlags = new Array(ancestorAbstracts.length);
		for(var k = 0 ; k < ancestorAbstractsFlags.length ; k++) {
			ancestorAbstractsFlags[k] = false
		}
	}
	

	//Here we handle the impleminting if exists

	if(Class.options.isImplementing) {
		for(var i = 0 ; i < Class.options.interfaces.length ; i++) {
			var currentInterface = Class.options.interfaces[i];
			var currentInterfaceComponentsNames = currentInterface.components.map(function(a) {
				return a.name;
			});
			ancestorAbstracts = ancestorAbstracts.concat(currentInterface.components);
			ancestorAbstractsNames = ancestorAbstractsNames.concat(currentInterfaceComponentsNames);
			for(var j = 0 ; j < currentInterface.components.length ; j++) {
				ancestorAbstractsFlags.push(false);
			}
		}
	}

	//metadata of the class
	var _meta_ = {
		protected: {
			attributes: new Array(),
			methods: new Array(),
			proprties: new Array()
		},
		public: {
			attributes: new Array(),
			methods: new Array(),
			proprties: new Array()
		},
		abstracts: null
	}

	//Populating the containers from the class defintion
	for(var i = 0 ; i < 3 ; i++) {
		var modifier = allowedAccessModifiers[i];
		var methodsContainer;
		var methodsNamesContainer;
		var attributesContainer;
		var proprtiesContainer;
		var staticsContainer;

		switch(i) {
			case 0: methodsContainer = publicMethods;
					methodsNamesContainer = publicMethodsNames;
					attributesContainer = publicAttributes;
					proprtiesContainer = publicProprties;
					staticsContainer = publicStatics;
					break;
			case 1: methodsContainer = protectedMethods;
					methodsNamesContainer = protectedMethodsNames;
					attributesContainer = protectedAttributes;
					proprtiesContainer = protectedProprties;
					staticsContainer = protectedStatics;
					break;
			case 2: methodsContainer = privateMethods;
					methodsNamesContainer = privateMethodsNames;
					attributesContainer = privateAttributes;
					proprtiesContainer = privateProprties;
					staticsContainer = privateStatics;
					break;
		}

		if(definition[modifier] !== undefined) {
			var currentModifier = definition[modifier];
			var keys = Object.keys(currentModifier);
			for(var j = 0 ; j < keys.length ; j++) {
				var currentKey = keys[j];
				if(ownComponentsNames.indexOf(currentKey) === -1) {
					var currentComponent = currentModifier[currentKey];
					var currentComponentType = typeof currentComponent;
					if(currentComponentType === "function") {
						if(currentKey === "Construct") {
							if(i === 0) {
								constructor = currentComponent;
								ownComponentsNames.push("Construct");
							}
							else {
								console.warn("private/protected constructor is useless");
								ownComponentsNames.push("Construct");
							}

							continue;
						}

						if(currentComponent.isAbstract) {
							if(i === 2) {
								throw xError("203","an abstract method cannot be private");
							}
							var record = {
								name: currentKey,
								accessLevel: modifier,
								description: currentComponent._meta_
							}
							ownAbstracts.push(record);
							ownComponentsNames.push(currentKey);
							delete currentComponent;
							/**The Abstract method is an empty method and it's never used
								Deleting it is to free the memory from useless objects**/
						}
						else {
							var indxInConcreteMethods = methodsNamesContainer.indexOf(currentKey);
							//checking if the current method overrides an inherited method
							if(indxInConcreteMethods != -1) {
								var existingMethod = methodsContainer[indxInConcreteMethods];
								if(existingMethod.isFinal) { //if the inherited method is final , overriding is not allowed
									throw xError("204","Cannot override a final method");
								}
								else {
									methodsContainer[indxInConcreteMethods].content = currentComponent;
									ownComponentsNames.push(currentKey);
									if(_meta_[modifier]) {
										_meta_[modifier].methods.push({name:currentKey , isFinal : currentComponent.isFinal});
									}
									overridenMethodsName[currentKey] = true;
									ownComponentsNames.push(currentKey);
								}
							}
							else { 
								//checking if the current method is overriding an inherited abstract method
								var indxInAbstractMethods = ancestorAbstractsNames.indexOf(currentKey);
								if(indxInAbstractMethods !== -1) {
									var theAbstractRecord = ancestorAbstracts[indxInAbstractMethods];
									//checking if the implementation is compatiable with the abstract deceleration
									if(areCompatiable(theAbstractRecord , currentComponent , modifier)) {
										ancestorAbstractsFlags[indxInAbstractMethods] = true;
									}
									else {
										throw xError("205","on function " + currentKey + ": mismatch between implementation and abstract decleration");
									}
								}
								var methodRecord = {
									name: currentKey,
									content: currentComponent
								}
								methodsContainer.push(methodRecord);
								methodsNamesContainer.push(currentKey);
								ownComponentsNames.push(currentKey);
								if(_meta_[modifier]) {
										_meta_[modifier].methods.push({name:currentKey , isFinal : currentComponent.isFinal});
								}
							}	
						}
					}//end of function case
					else if(currentComponentType === "object") {
						if(currentComponent !== null && currentComponent.isStatic) {
							var staticRecord = {
								name: currentKey,
								content: currentComponent.value
							}
							staticsContainer.push(staticRecord);
							ownComponentsNames.push(currentKey);
						}
						else if(currentComponent !== null && isProperty(currentComponent)) {
							var propertyRecord = {
								name : currentKey,
								content: currentComponent
							}
							proprtiesContainer.push(propertyRecord);
							ownComponentsNames.push(currentKey);
							if(_meta_[modifier]) {
								_meta_[modifier].proprties.push(currentKey);
							}
						}
						else {
							if(currentComponent !== null) {
								throw xError("206","setting a non-static attribute to an object is not allowed");
							}

							var attributeRecord = {
								name : currentKey,
								content: currentComponent
							}
							attributesContainer.push(attributeRecord);
							ownComponentsNames.push(currentKey);
							if(_meta_[modifier]) {
								_meta_[modifier].attributes.push(currentKey);
							}
						}
					}
					else {
						var attributeRecord = {
							name : currentKey,
							content: currentComponent
						}
						attributesContainer.push(attributeRecord);
						ownComponentsNames.push(currentKey);
						if(_meta_[modifier]) {
								_meta_[modifier].attributes.push(currentKey);
						}
					}
				}
				else {
					throw xError("207","class cannot have two components with the same name");
				}
			}
		}
	}

	_meta_.abstracts = ownAbstracts;

	/**
	* Level 1 Validation : Validating the relation between the class and abstract methods.
	* Validation Rule :
		- an abstract class must contain at least one abstract method (own or inherited)
		- an abstract method (own or inherited) must be contained in an abstract class
	**/
	var allAbstrcatsOverriden = true;
	for(var i = 0 ; i < ancestorAbstractsFlags.length ; i++) {
		if(!ancestorAbstractsFlags[i]) {
			allAbstrcatsOverriden = false;
			ownAbstracts.push(ancestorAbstracts[i]);
		}
	}
	if(Class.options.isAbstract) {
		if(ownAbstracts.length === 0 && (ancestorAbstracts.length === 0 || allAbstrcatsOverriden)) {
			throw xError("208","an abstrcat class must contain at least one abstract method");
		}
	}
	else {
		if(ownAbstracts.length !== 0 || (ancestorAbstracts.length !== 0 && !allAbstrcatsOverriden)) {
			throw xError("209","an abstract method must be contained in an abstract class");
		}
	}

	//updating xSelf's timestamp for the upcoming class
	xSelf.timestamp = Date.now() + 1;

	//Creating the Class
		return (function() {
			
			var classProprties = {
				isAbstract : Class.options.isAbstract,
				isFinal : Class.options.isFinal,
				parent : Class.options.parent,
				timestamp : _reservedTimestamp
			};

			/**
				*saving all methods in a static place to be visible to every instance of the class
				*methods include the getters and setters of proprtries.
			**/

			//each method is wrapped into a function that relinks the 'base' variable with the '_super' of the calling object
			function _saveMethod(key , val) {
				_methods[key] = val;
			}
			var prStatics = []; //container for the protected and private sataic members
			var _methods = new Object();
			var _childsMethodsRefs = new Array();
			var _methodsRefs = new Array();
			for(var i = 0 ; i < 3 ; i++) {
				var methodsContainer;
				var proprtiesContainer;

				switch(i) {
					case 0: methodsContainer = publicMethods;
							proprtiesContainer = publicProprties;
							break;
					case 1: methodsContainer = protectedMethods;
							proprtiesContainer = protectedProprties;
							break;
					case 2: methodsContainer = privateMethods;
							proprtiesContainer = privateProprties;
							break;
				}

				for(var j = 0 ; j < methodsContainer.length ; j++) {
					var currentRecord = methodsContainer[j];
					_saveMethod(currentRecord.name , currentRecord.content);
					_methodsRefs.push(currentRecord.content);
				}
				for(var j = 0 ; j < proprtiesContainer.length ; j++) {
					var currentRecord = proprtiesContainer[j];
					_saveMethod(currentRecord.name + ".get", currentRecord.content.get);
					_saveMethod(currentRecord.name + ".set", currentRecord.content.set);
					_methodsRefs.push(currentRecord.content.get);
					_methodsRefs.push(currentRecord.content.set);
				}
			}

			_methodsRefs.push(constructor);

			var _constructor = function() {
					var $this = this;
					/** Begin Resolving arguments**/
						//Begin Converting to Array
							var args = [];
							var len = arguments.length;
							var counter = 0 ;
							while(counter < len) {
								args.push(arguments[counter]);
								counter++;
							}
						//End Converting to Array
						//Begin extracting _hiddenUnits
							for(var k = 0 ; k < args.length ; k++) {
								if(args[k].constructor.timestamp === classProprties.timestamp) {
									args[k] = theEYE(0 , args[k]);
								}
							}
						//End extracting _hiddenUnits
					/** End Resolving Arguments**/
					base = function() {
						if(Class.parent !== null) {
							if(classProprties.parent.isAbstract) {
								$this._super = theEYE(1 , classProprties.parent , arguments);
							}
							else {
								 classProprties.parent.apply($this._super , arguments);
							}
						}
						else {
							$this._super = new Object();
						}
					}
					constructor.apply($this , args);

					//checking if the constructor called the parent's constructor
					if($this._super === null) {
						if(classProprties.parent === null) {
							$this._super = new Object();
						}
						else {
							try {
								if(classProprties.parent.isAbstract) {
									$this._super = theEYE(1 , classProprties.parent , []);
								}
								else {
									$this._super = new classProprties.parent();
								}
							}
							catch(ex) {
								throw xError("210","parent class doesn't contain a default constructor");
							}
						}
					}

					$this._super = theEYE(0 , $this._super); //extracting the _hiddenUnit of the super object

					//linking inherited components in _hiddenUnit to components in _super
					var nonPrivateComponents = new Object();
					for(var i = 0 ; i < inheritedComponentsNames.length ; i++) {
						var currentName = inheritedComponentsNames[i];
						nonPrivateComponents[currentName] = true;
						if(!overridenMethodsName[currentName]) {
							defineIn($this , "inherited" , currentName , [$this._super]);
						}
					}

					//deleting private components form the _super object
					var allComponents = Object.keys($this._super);
					for(var i = 0 ; i < allComponents.length ; i++) {
						var currentComponent = allComponents[i];
						if(!nonPrivateComponents[currentComponent] && currentComponent !== "_super") {
							$this._super[currentComponent] = undefined;
						}
					}
				}


			var _classPattern =  function() {
				if(!classProprties.isAbstract || (classProprties.isAbstract && _classPattern.caller === theEYE)) {
					var _hiddenUnit = new Object();
					var _this = this;
					_hiddenUnit["_super"] = null;
					_hiddenUnit.constructor = _classPattern;

					for(var i = 0 ; i < 3 ; i++) {
						var methodsContainer;
						var proprtiesContainer;
						var attributesContainer;

						switch(i) {
							case 0: methodsContainer = publicMethods;
									attributesContainer = publicAttributes;
									proprtiesContainer = publicProprties;
									break;
							case 1: methodsContainer = protectedMethods;
									attributesContainer = protectedAttributes;
									proprtiesContainer = protectedProprties;
									break;
							case 2: methodsContainer = privateMethods;
									attributesContainer = privateAttributes;
									proprtiesContainer = privateProprties;
									break;
						}

						for(var j = 0 ; j < methodsContainer.length ; j++) {
							var methodName = methodsContainer[j].name;
							defineIn(_hiddenUnit , 'method' , methodName , [_methods[methodName]]);
							if(i === 0) {
								defineIn(_this , 'link' , methodName , [_hiddenUnit]);
								//_this[methodName] = _hiddenUnit[methodName];
							}
						}

						for(var j = 0 ; j < proprtiesContainer.length ; j++) {
							var propertyName = proprtiesContainer[j].name;
							defineIn(_hiddenUnit , 'property' ,propertyName , [_methods[propertyName + ".get"] , _methods[propertyName  + ".set"]]);
							if(i === 0) {
								defineIn(_this , 'link' , propertyName , [_hiddenUnit]);
								//_this[propertyName] = _hiddenUnit[propertyName];
							}

						}

						for(var j = 0 ; j < attributesContainer.length ; j++) {
							var attributeName = attributesContainer[j].name;
							_hiddenUnit[attributeName] = attributesContainer[j].content;

							if(i === 0) {
								defineIn(_this , 'link' , attributeName , [_hiddenUnit]);
								//_this[attributeName] = _hiddenUnit[attributeName];
							}

						}
					}

					_constructor.apply(_hiddenUnit , arguments);

					// adding a refernece to the _hiddenUnit as a property of the object only accessable by theEYE
					Object.defineProperty(_this , '_hu_' , {
						get : function _getter() {
							if(_getter.caller === theEYE) {
								return _hiddenUnit;
							}
						},
						set : function(n){}
					});
				}
				else {
					throw xError("211","Cannot instantiate an abstract class");
				}
			}

			//Attaching Static members
			for(var i = 0 ; i < publicStatics.length ; i++) {
				Object.defineProperty(_classPattern , publicStatics[i].name ,  {
					value: publicStatics[i].content,
					writable:true
				});
				if(typeof publicStatics[i].content === "function") {
					_methodsRefs.push(publicStatics[i].content);
				}
			}

			var obj = {};
			Object.defineProperty(obj , 'own' , {get:function(){return _methodsRefs},set:function(n){}});
			Object.defineProperty(obj , 'childs' , {get:function(){return _childsMethodsRefs},set:function(n){}});

			for(var i = 0 ; i < privateStatics.length ; i++) {
				var indx = prStatics.push(privateStatics[i].content);
				if(typeof prStatics[indx - 1] === "function") {
					_methodsRefs.push(privateStatics[i].content);
				}
				defineIn(_classPattern , 'private-static' , privateStatics[i].name , [obj , prStatics , indx - 1]);
			}

			for(var i = 0 ; i < protectedStatics.length ; i++) {
				var indx = prStatics.push(protectedStatics[i].content);
				if(typeof prStatics[indx - 1] === "function") {
					_methodsRefs.push(privateStatics[i].content);
				}
				defineIn(_classPattern , 'protected-static' , protectedStatics[i].name , [obj , prStatics , indx - 1]);
			}

			/**
				*__extendProtectedAccess : extends the allowed functions to access protected statics to the methods of the child class
				@param {Array} childsRefs : the array of references to the child's methods
			**/
			_classPattern.__extendProtectedStaticAccess = function(childsRefs) {
				if(_classPattern.__extendProtectedStaticAccess.caller.caller === Class) {
					_childsMethodsRefs = _childsMethodsRefs.concat(childsRefs);
				}
			}

			if(Class.options.parent !== null && Class.options.parent.isClassy) {
				Class.options.parent.__extendProtectedStaticAccess(_methodsRefs);
			}

			//marking the class to distinguish it form other non-classy structures
			Object.defineProperty(_classPattern , 'isClassy' , {
				value : true,
				writable:false
			});

			//attaching isAbstract and isFinal flags
			Object.defineProperty(_classPattern , 'isAbstract' , {
				get : function() {return classProprties.isAbstract},
				set : function(n) {}
			});
			Object.defineProperty(_classPattern , 'isFinal' , {
				get : function() {return classProprties.isFinal},
				set : function(n) {}
			});

			//stamping the class for type recognition
			Object.defineProperty(_classPattern , 'timestamp' , {value : _reservedTimestamp , writable:false});

			//Attaching metadata
			_classPattern._metadata = _meta_;

			//resetting class options
			Class.options.parent = null;
			Class.options.interfaces = null;
			Class.options.isExtending = false;
			Class.options.isImplementing = false;
			Class.options.isAbstract = false;
			Class.options.isFinal = false;

			return _classPattern;

		})();
	//nxsp
}
})();

/**
options is an object that holds the configurations of the class to be created.
	- parent {Object} : holds a reference to the parent object (if any).
	- interfaces {Array} : holds the interfaces that the class implements.
	- isExtending {Boolean} : holds true if the class extends a parent class , false otherwise.
	- isImplementing {Boolean} : holds true if the class extends any interface , false otherwise.
	- isAbstract {Boolean} : holds true if the class is declared abstract , false otherwise.
	- isFinal {Boolean} : holds true if the class is declared final , false otherwise.
**/
Class.options = {
	parent:null,
	interfaces : null,
	isExtending:false,
	isImplementing:false,
	isAbstract:false,
	isFinal:false
};

/**
	Extends 
		marks the class as extening a parent class an stores the reference that parent
		@param {function} parentRef : the reference to the parent class
		@return {function} : the Class function (to continue the defintion of the class)
**/
Class.Extends = function(parentRef) {
	if(!parentRef !== undefined && parentRef.isClassy) {
		if(!parentRef.isFinal) {
			Class.options.parent = parentRef;
			Class.options.isExtending = true;
			return Class;
		}
		else {
			throw xError("301","Cannot extend a final class");
		}
	}
	else {
		throw xError("307","attempting to extend a non Xtends:js Class or undefined");
	}
}

/**
	Implements
		marks the class as implementing one or more interfaces and stores refernces to these
		interfaces.
		@params {functions} : the list of interfaces the class is implementing
		@return {function} : the Class function (to continue the definition of the class)	
**/
Class.Implements = function() {
	var args = Array.prototype.slice.call(arguments);
	if(args.length != 0) {
		for(var i = 0 ; i < args.length ; i++) {
			if(args[i] === undefined || !args[i].isInterface) {
				throw xError("306","attempting to implement a non-interface or undefined");
			}
		}
		Class.options.isImplementing = true;
		Class.options.interfaces = args;
		return Class;
	}
	else {
		throw xError("302","Invalid Decleration");
	}
}

Class.Extends.Implements = Class.Implements;

var Static = function(variable) {
	var staticWrapper = {
		value:variable,
		isStatic:true
	};

	return staticWrapper;
}

/**
	Final is a Class modifier that marks a function/class unextendable

	*Final(method) : Takes a single method and marks it final
		@param {function} method : an function to be marked final
		@return {function} : the marked function

	*Final(typed,overloads) : marks an overloaded function as final
		@param {boolean} typed : a flag to specify typed or nontyped overloading
		@param {array} overloads : array of overloading instances
		@return {function} : the marked overloaded function

**/
var Final = Function.create(true , [
	types(Function),
	function(method) {
		if(method.isAbstract) {
			throw xError("303","abstract methods cannot be final");
		}
		method.isFinal = true;
		return method;
	},
	types(Boolean,Array),
	function(typed , overloads) {
		var method = Function.create(typed , overloads);
		method.isFinal = true;
		return method;
	}
]);
/**
	Final.Class : marks the class to be created as Final
		@return {function} : Class function.
**/
Object.defineProperty(Final , 'Class' , { 
	get : function() {
		window['Class'].options.isFinal = true;
		return window['Class'];
	},
	set : function(newVal) {}
});

/**
	Abstract is a modifier that marks a function/class as abstract
	
	*Abstract(method) : Takes a single method and marks it abstract
		@param {function} method : an empty function to be marked abstract
		@return {function} : the marked function

	*Abstract(typed,overloads) : marks an overloaded function as abstract
		@param {boolean} typed : a flag to specify typed or nontyped overloading
		@param {array} overloads : array of overloading instances
		@return {function} : the marked overloaded function

**/
var Abstract = Function.create(true , [
	types(Function),
	function(method) {
		if(method.isFinal) {
			throw xError("304","final methods cannot be abstract");
		}
		else if(!Abstract.isNotImplemented(method)) {
			throw xError("305","An abstract method cannot have implementation");
		}

		method.isAbstract = true;
		method._meta_= {argsCount : method.length};
		return method;
	},
	types(Boolean,Array),
	function(typed , overloads) {
		for(var i = 0 ; i < overloads.length ; i++) {
			if(typeof overloads[i] === "function") {
				if(!Abstract.isNotImplemented(overloads[i])) {
					throw xError("305","an abstract method cannot have implementation");
				}
			}
		}

		var overloaded = Function.create(typed , overloads);
		overloaded._meta_.isOverloaded = true;
		overloaded.isAbstract = true;

		return overloaded;
	}
]);

/**
	Abstract.isNotImplemented : checks the method to make sure that its empty
		@param {function} method : the function to be checked
		@return {boolean} : true if it's empty , false otherwise.
**/

Abstract.isNotImplemented = function(method) {
	var notImplementedPattern = new RegExp(/function\s*\w*\([A-Za-z0-9,$_]*\)\s*\{\s*\}/);
	var methodStr = method.toString();
	return notImplementedPattern.test(methodStr);
	
}

/**
	Abstract.Class : marks the class to be created as abstract
		@return {function} : Class function.
**/

Object.defineProperty(Abstract , 'Class' , { 
	get : function() {
		window['Class'].options.isAbstract = true;
		return window['Class'];
	},
	set : function(newVal) {}
});