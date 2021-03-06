/**
	*xAreCompatiable : checks if an implementation of an abstract method matches the description of the previosly defined abstract method
	@param {Object} abstractRecord : the record that holds the description of the abstract method
	@param {function} implementation : the candidate method to implement the abstract method 
	@param {string} accesssLevel : the access level in which the implementation resides
	@return {boolean} : true if the implementation is compatiable , false otherwise
**/
classing.xAreCompatiable = function(abstractRecord , implementation , accessLevel) {
	if(abstractRecord.accessLevel === accessLevel) {
		if(abstractRecord.description.isOverloaded) {
			if(implementation._meta_) {
				if(abstractRecord.description.isTyped === implementation._meta_.isTyped) {
					if(abstractRecord.description.isTyped) {
					var max = abstractRecord.description.types.length;
					var counter = 0
					var implementationTypes = implementation._meta_.types;
					var len = implementationTypes.length;
					for(var i = 0 ; i < len ; i++) {
						var indxInAbstractRecord = -1;
						for(var j = 0 ; j < max ; j++){
							if(abstractRecord.description.types[j] === implementationTypes[i]){
								indxInAbstractRecord = j;
								break;
							}
						}
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
							var indxInAbstractRecord = -1;
							for(var j = 0 ; j < max ; j++){
								if(abstractRecord.description.counts[j] === implementationCounts[i]) {
									indxInAbstractRecord = j;
									break;
								}
							}
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


classing.Class = (function() {
	
	//Static Helper function

	/**
		*theEYE : a function that can carry out unallowed operations
		@param {number} option : a number that specifys the job to be done by theEYE
								 0 => extracts the _extendingUnit
								 1 => return an instance of an abstract class
								 2 => extracts the _hiddenUnit
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
		else if(option === 2) {
			if(obj.hasOwnProperty('_eu_')) {
				return obj._eu_;
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
		*xDefineIn : a function that defines proprties on objects.
		@param {Object} obj : the object to define proprties on
		@param {String} type : the type of property to be defined , there are 8 types : {method , property , protected-static , private-static , public-static, inherited , link , _eu_}
		@param {String} key : the name of the property to be defined
		@param {Object} extra : an extra argument that differ from type to type as follows
			'method , property' => extra is the defintion object
			'protected-static' => extra is the following object
									 {
									own : the _privliagedDictionary of the class,
									childs : the _privliagedChilds of the class,
									loc : the defintion object
									 }
			'private-static' => extra is the following object
								{
									  own : the _privliagedDictionary of the class
									  loc : the defintion object
								}
			'public-static' => {loc : the defintion object}
			'inheriterd' => extra is undefined
			'link' => extra is the _hiddenUnit object
			'_eu_' => extra is the _hiddenUnit object
	**/
	function xDefineIn(obj , type , key , extra) {
		if(type === "method") {
			obj[key] = function() {
				/** Begin Resolving arguments **/
					var args = [];
					var len = arguments.length;
					var counter = 0 ;
					while(counter < len) {
						args.push(arguments[counter]);
						if(args[counter].constructor.timestamp === obj.constructor.timestamp) {
							args[counter] = theEYE(0 , args[counter]);
						}
						counter++;
					}
				/** End Resolving Arguments **/
	
				classing.base =  obj._super;
				return extra[key].apply(obj , args);
				classing.base =  null;
			}
		}
		else if(type === "property") {
			Object.defineProperty(obj , key , {
				get : function() {
					classing.base =  obj._super;
					return extra[key].get.apply(obj , []);
					classing.base =  null;
				},
				set: function(newVal) {
					/** Resolving the 'newVal' argument **/
						if(newVal.constructor.timestamp === obj.constructor.timestamp) {
							newVal = theEYE(0 , newVal);
						}
					classing.base =  obj._super;
					return extra[key].set.apply(obj , [newVal]);
					classing.base =  null;
				},
				enumerable: true
			});
		}
		else if(type === "protected-static") {
			if(typeof extra.loc[key] === "object" && extra.loc[key].___xisProperty) {
				Object.defineProperty(obj , key ,  {
					get: function _getter() {
						var callingFunction = _getter.caller;
						if((extra.own[callingFunction.privliagedMark] || extra.childs[callingFunction.privliagedMark])  || (callingFunction.caller._meta_ && (extra.own[callingFunction.caller.privliagedMark] || extra.childs[callingFunction.caller.privliagedMark])))
						{
							return extra.loc[key].referTo[key];
						}
						else {
							throw classing.xError("213" , "inaccessable member");
						}
					},
					set : function _setter(newVal) {
						var callingFunction = _setter.caller;
						if((extra.own[callingFunction.privliagedMark] || extra.childs[callingFunction.privliagedMark])  || (callingFunction.caller._meta_ && (extra.own[callingFunction.caller.privliagedMark] || extra.childs[callingFunction.caller.privliagedMark]))){
								extra.loc[key].referTo[key] = newVal;
						}
						else {
							throw classing.xError("213","inaccessable member");
						}
					},
					enumerable: true
				});
			}
			else {
				Object.defineProperty(obj , key ,  {
					get: function _getter() {
						var callingFunction = _getter.caller;
						if((extra.own[callingFunction.privliagedMark] || extra.childs[callingFunction.privliagedMark])  || (callingFunction.caller._meta_ && (extra.own[callingFunction.caller.privliagedMark] || extra.childs[callingFunction.caller.privliagedMark])))
						{
							return extra.loc[key].value;
						}
						else {
							throw classing.xError("213" , "inaccessable member");
						}
					},
					set : function _setter(newVal) {
						var callingFunction = _setter.caller;
						if((extra.own[callingFunction.privliagedMark] || extra.childs[callingFunction.privliagedMark])  || (callingFunction.caller._meta_ && (extra.own[callingFunction.caller.privliagedMark] || extra.childs[callingFunction.caller.privliagedMark]))){
								extra.loc[key].value = newVal;
						}
						else {
							throw classing.xError("213","inaccessable member");
						}
					},
					enumerable: true
				});
			}
		}
		else if(type === "private-static") {
			if(typeof extra.loc[key] === "object" && extra.loc[key].___xisProperty) {
				Object.defineProperty(obj , key ,  {
					get: function _getter() {
						var callingFunction = _getter.caller;
						if(extra.own[callingFunction.privliagedMark] || (callingFunction.caller._meta_ && extra.own[callingFunction.caller.privliagedMark] !== -1)) {
							return extra.loc[key].referTo[key];
						}
						else {
							throw classing.xError("213","inaccessable member");
						}
					},
					set : function _setter(newVal) {
						var callingFunction = _setter.caller;
						if(extra.own[callingFunction.privliagedMark] || (callingFunction.caller._meta_ && extra.own[callingFunction.caller.privliagedMark] !== -1)) {
								extra.loc[key].referTo[key] = newVal;
						}
						else {
							throw classing.xError("213","inaccessable member");
						}
					},
					enumerable: true
				});
			}
			else {
				Object.defineProperty(obj , key ,  {
					get: function _getter() {
						var callingFunction = _getter.caller;
						if(extra.own[callingFunction.privliagedMark] || (callingFunction.caller._meta_ && extra.own[callingFunction.caller.privliagedMark] !== -1)) {
							return extra.loc[key].value;
						}
						else {
							throw classing.xError("213","inaccessable member");
						}
					},
					set : function _setter(newVal) {
						var callingFunction = _setter.caller;
						if(extra.own[callingFunction.privliagedMark] || (callingFunction.caller._meta_ && extra.own[callingFunction.caller.privliagedMark] !== -1)) {
								extra.loc[key].value = newVal;
						}
						else {
							throw classing.xError("213","inaccessable member");
						}
					},
					enumerable: true
				});
			}
		}
		else if(type === 'public-static') {
			if(typeof extra.loc[key] === "object" && extra.loc[key].___xisProperty) {
				Object.defineProperty(obj , key , {
					get : function() {
						return extra.loc[key].referTo[key];
					},
					set : function(newVal) {
						extra.loc[key].referTo[key] = newVal;
					},
					enumerable: true
				});
			}
			else {
				obj[key] = extra.loc[key].value;
			}
		}
		else if(type === "inherited") {
			Object.defineProperty(obj , key , {
				get : function() {
					return obj._super[key];
				},
				set: function(n) {
					obj._super[key] = n;
				},
				enumerable: true
			});
		}
		else if(type === "link") {
			Object.defineProperty(obj , key , {
				get: function() {
					return extra[key];
				},
				set: function(n) {
					extra[key] = n;
				},
				enumerable: true
			});
		}
		else if(type === "_eu_") {
			Object.defineProperty(obj , key , {
				get : function() {return extra[key];},
				set : function(val) {extra[key] = val;},
				enumerable: true
			});
		}
	}

	 var xEmptyParent = {
			_metadata :{
				methods:{},
				proprties:{},
				attributes:{},
				abstracts:{}
			}
		}

	 return function (definition) {
		var _reservedTimestamp = classing.xSelf.timestamp;
		classing.xSelf.timestamp++;
		/**
		* Level 0 Validation : Validating the definition.
		* Validation Rule :
			- definition must be an object
			- Only three access modifiers are available : public , protected , private
		**/
		if(typeof definition !== "object") {
			throw classing.xError("201", "Invalid Definition");
		}
		//Creating the Class
		return (function() {

			var _methodMarkerCounter = 0;

			//saving the class options in the closure of the class
			var classProprties = {
				isAbstract : classing.Class.options.isAbstract,
				isFinal : classing.Class.options.isFinal,
				parent : classing.Class.options.parent === null ? xEmptyParent : classing.Class.options.parent,
				interfaces : classing.Class.options.interfaces,
				timestamp : _reservedTimestamp,
				constructorAccessLevel : "public"

			};

			//resetting class options
			classing.Class.options.parent = null;
			classing.Class.options.interfaces = null;
			classing.Class.options.isExtending = false;
			classing.Class.options.isImplementing = false;
			classing.Class.options.isAbstract = false;
			classing.Class.options.isFinal = false;

			var _privliagedDictionary = {};
			var _privliagedChilds = {};

			var _staticComponents = {};

			var _ownAbstrcats = {};
			var _ancestorsAbstracts = {};

			var _metadata_ = {
				methods : {},
				proprties : {},
				attributes : {},
				abstracts:null,
				constructorAccessLevel: "public",
				_implements:{},
				_extends:classProprties.parent === xEmptyParent ? "_root_" : classProprties.parent,
			}

			var _staticProprties = {};

			var _ownComponentsNames = {};

			var constructor = function(){}; //Default Constructor

			//Importing interfaces methods
			if(classProprties.interfaces !== null) {
				var len = classProprties.interfaces.length;
				for(var i = 0 ; i < len ; i++) {
					var currentInterface = classProprties.interfaces[i];
					_metadata_._implements["" + currentInterface.timestamp] = true;
					for(record in currentInterface.components) {
						_ancestorsAbstracts[record] = currentInterface.components[record];
					}
				}
			}

			classProprties.interfaces = undefined; //Dispose classProprties.interfaces 

			//Combining parent's abstracts (if any) within the '_ancestorsAbstracts' variable
			if(classProprties.parent._metadata.abstracts) {
				for(record in classProprties.parent._metadata.abstracts) {
					_ancestorsAbstracts[record] = classProprties.parent._metadata.abstracts[record];
				}
			}

			for(modifier in definition) {
				if(typeof definition[modifier] !== 'object') {
					throw classing.xError("201" , "Invalid definition");
				}
				if(modifier !== "public" && modifier !== "private" && modifier !== "protected") {
					throw classing.xError("202" , modifier + ": undefined access modifier");
				}
				var currentModifier = definition[modifier];
				for(key in currentModifier) {
					//checking if this component's name already used
					if(_ownComponentsNames[key]) {
						throw classing.xError("207","class cannot have two components with the same name");
					}
					/* Begin Methods Case */
					if(typeof currentModifier[key] === 'function') {

						//Checking if the method is a constructor
						if(key === "Construct") {
							if(currentModifier[key].isAbstract) {
								throw classing.xError("214" , "a constructor cannot be abstract");
							}
							classProprties.constructorAccessLevel = modifier;
							_metadata_.constructorAccessLevel = modifier;
							constructor = currentModifier[key];
							currentModifier[key].privliagedMark = _reservedTimestamp + ":" + _methodMarkerCounter;
							_privliagedDictionary[_reservedTimestamp + ":" + _methodMarkerCounter] = true;
							_methodMarkerCounter++;

							continue;
						}
						//Checking if the method is overriding an inherited method
						else if(classProprties.parent._metadata.methods[key]) {
							if(currentModifier[key].isAbstract) {
								throw classing.xError("215" , "an abstract method cannot override a concrete one");
							}
							if(classProprties.parent._metadata.methods[key].accessLevel !== modifier) {
								throw classing.xError("216" , "overriding a method in a different access level is not allowed");
							}
							if(classProprties.parent._metadata.methods[key].isFinal) {
								throw classing.xError("204","Cannot override a final method");
							}
						}
						//Checking if the method is implementing an abstract method
						else if(_ancestorsAbstracts[key]) {
							if(classing.xAreCompatiable(_ancestorsAbstracts[key] , currentModifier[key] , modifier)) {
								_ancestorsAbstracts[key] = undefined;
								//marking the abstrcat record as undefined is equivelant to saying that this abstrcat method is implemented
							}
							else {
								throw classing.xError("205","on function " + key + ": mismatch between implementation and abstract decleration");
							}
						}
						//Checking if the method itself is abstract
						if(currentModifier[key].isAbstract) {
							if(modifier === "private") {
								throw classing.xError("203" , "marking a private method as abstract is not allowed");
							}
							_ownAbstrcats[key] = {
								accessLevel: modifier,
								description: currentModifier[key]._meta_
							}
							currentModifier[key] = undefined;
						}
						//if the method is not abstrcat 
						else {
							//Marking the method as privliaged to access the private/protected statics
							currentModifier[key].privliagedMark = _reservedTimestamp + ":" + _methodMarkerCounter;
							_privliagedDictionary[_reservedTimestamp + ":" + _methodMarkerCounter] = true;
							_methodMarkerCounter++;

							_ownComponentsNames[key] = true;
							if(modifier !== "private") {
								_metadata_.methods[key] = {
									isFinal : currentModifier[key].isFinal,
									accessLevel : modifier
								}
							}
						}
					}
					/* End Methods Case */
					else if(typeof currentModifier[key] === "object") {
						//Checking if the component is static
						if(currentModifier[key] !== null && currentModifier[key].isStatic) {
							//Checking if it's a static method
							if(typeof currentModifier[key].value === "function") {
								//Marking the method as privilaged
								currentModifier[key].value.privliagedMark = _reservedTimestamp + ":" + _methodMarkerCounter;
								_privliagedDictionary[_reservedTimestamp + ":" + _methodMarkerCounter] = true;
								_methodMarkerCounter++;
							}
							//Checking if it's a static property
							else if(typeof currentModifier[key].value === "object") {
								var staticMax = 2;
								for(prop in currentModifier[key].value) {
									if((prop === "get" || prop == "set") && (typeof currentModifier[key].value[prop] === "function")) {
										staticMax--;
									}
									else {
										break;
									}
								}
								if(staticMax === 0) {
									//Marking the setter and getter as privliaged
									currentModifier[key].value.get.privliagedMark = _reservedTimestamp + ":" + _methodMarkerCounter;
									_privliagedDictionary[_reservedTimestamp + ":" + _methodMarkerCounter] = true;
									_methodMarkerCounter++;
									currentModifier[key].value.set.privliagedMark = _reservedTimestamp + ":" + _methodMarkerCounter;
									_privliagedDictionary[_reservedTimestamp + ":" + _methodMarkerCounter] = true;
									_methodMarkerCounter++;

									Object.defineProperty(_staticProprties , key , {
										get : currentModifier[key].value.get,
										set : currentModifier[key].value.set
									});

									currentModifier[key] = {
										___xisProperty : true,
										isStatic : true,
										referTo : _staticProprties
									}
								}
							}
							_staticComponents[key] = {accessLevel : modifier}
							_ownComponentsNames[key] = true;
						}
						//
						else {
							if(currentModifier[key] !== null) {
								//Checking if its a property
								var max = 2;
								for(prop in currentModifier[key]) {
									if((prop === "get" || prop == "set") && (typeof currentModifier[key][prop] === "function")) {
										max--;
									}
									else {
										break;
									}
								}
								if(max === 0) {
									//Marking the setter and getter as privliaged
									currentModifier[key].get.privliagedMark = _reservedTimestamp + ":" + _methodMarkerCounter;
									_privliagedDictionary[_reservedTimestamp + ":" + _methodMarkerCounter] = true;
									_methodMarkerCounter++;
									currentModifier[key].set.privliagedMark = _reservedTimestamp + ":" + _methodMarkerCounter;
									_privliagedDictionary[_reservedTimestamp + ":" + _methodMarkerCounter] = true;
									_methodMarkerCounter++;

									currentModifier[key].isProperty = true;
									_ownComponentsNames[key] = true;
									if(modifier !== "private") {
										_metadata_.proprties[key] = {
											accessLevel : modifier
										}
									}
								}
								else {
									throw classing.xError("206","setting a non-static attribute to an object is not allowed");
								}
							}
							else {
								_ownComponentsNames[key] = true;
								if(modifier !== "private") {
									_metadata_.proprties[key] = {
										accessLevel : modifier
									}
								}
							}
						}
					}
					else {
						_ownComponentsNames[key] = true;
						if(modifier !== "private") {
							_metadata_.proprties[key] = {
								accessLevel : modifier
							}
						}
					} 
				}
			}

			/**
				* Level 1 Validation : Validating the relation between the class and abstract methods.
				* Validation Rule :
					- an abstract class must contain at least one abstract method (own or inherited)
					- an abstract method (own or inherited) must be contained in an abstract class
			**/
			for(record in _ancestorsAbstracts) {
				if(_ancestorsAbstracts[record] !== undefined) {
					_ownAbstrcats[record] = _ancestorsAbstracts[record];
				}
			}

			_metadata_.abstracts = _ownAbstrcats;

			var len = Object.keys(_ownAbstrcats).length;
			if(len == 0 && classProprties.isAbstract) {
				throw classing.xError("208","an abstrcat class must contain at least one abstract method");
			}
			if(len > 0 && !classProprties.isAbstract) {
				throw classing.xError("209","an abstract method must be contained in an abstract class");
			}

			_ancestorsAbstracts = undefined; //Dispose _ancestorsAbstracts
			_ownComponentsNames = undefined; //Dispose _ownComponentsNames

			var _constructor = function() {
				var $this = this;
				/** Begin Resolving arguments **/
					var args = [];
					var len = arguments.length;
					var counter = 0 ;
					while(counter < len) {
						args.push(arguments[counter]);
						if(args[counter].constructor.timestamp === classProprties.timestamp) {
							args[counter] = theEYE(0 , args[counter]);
						}
						counter++;
					}
				/** End Resolving Arguments **/

				classing.base =  function() {
					if(classProprties.parent !== xEmptyParent) {
						if(classProprties.parent.isAbstract) {
							$this._super = theEYE(1 , classProprties.parent , arguments);
						}
						else {
							$this._super = {};
							classProprties.parent.apply($this._super , arguments);
						}
					}
					else {
						$this._super = new Object();
					}
				}
				classing.base.isBase =  true;

				constructor.apply($this , args);

					//checking if the constructor called the parent's constructor
					if($this._super === null) {
						if(classProprties.parent === xEmptyParent) {
							$this._super = new Object();
						}
						else {
							try {
								if(classProprties.parent.isAbstract || classProprties.parent._metadata.constructorAccessLevel === "protected") {
									$this._super = theEYE(1 , classProprties.parent , []);
								}
								else {
									$this._super = new classProprties.parent();
								}
							}
							catch(ex) {
								if(ex.code !== 212) {
									throw classing.xError("210","parent class doesn't contain a default constructor");
								}
								throw ex;
							}
						}
					}

					$this._super = theEYE(2 , $this._super); //extracting the _extendingUnit of the super object

					//linking inherited components in _hiddenUnit to components in _super
					for(key in $this._super) {
						if(!$this[key]) {
							xDefineIn($this , 'inherited' , key);
						}
					}
                }

				var _classPattern = function() {

					var instantiator = _classPattern.caller;
					var pMark = !instantiator.isBase ? (instantiator.privliagedMark ? instantiator.privliagedMark : "") : instantiator.caller.privliagedMark;

					if(classProprties.constructorAccessLevel !== "public" && instantiator !== theEYE && !_privliagedDictionary[pMark] && !(_privliagedChilds[pMark] && classProprties.constructorAccessLevel === "protected")) {
						throw classing.xError("212" , "inaccessable constructor");
					}

					if(classProprties.isAbstract && _classPattern.caller !== theEYE) {
						throw classing.xError("211","Cannot instantiate an abstract class");
					}
					else {
						var _hiddenUnit = {};
						var _extendingUnit = {};
						_extendingUnit["publics"] = {};
						var _this = this;
						_hiddenUnit["_super"] = null;
						_hiddenUnit.constructor = _classPattern;

						for(modifier in definition) {
							var currentModifier = definition[modifier];
							for(key in currentModifier) {
								var mightNeedLink = false;
								if(currentModifier[key] !== null) {
									if(currentModifier[key] !== undefined && !currentModifier[key].isStatic && key != "Construct") {
										mightNeedLink = true;
										if(typeof currentModifier[key] === "function") {
											xDefineIn(_hiddenUnit , 'method' , key , definition[modifier]);
										}
										else if(currentModifier[key].isProperty) {
											xDefineIn(_hiddenUnit , 'property' , key , definition[modifier]);
										}
										else {
											_hiddenUnit[key] = definition[modifier][key];
										}
									}
									if(modifier === "public" || modifier === "protected") {
										xDefineIn(_extendingUnit , '_eu_' , key , _hiddenUnit);
										if(modifier === "public") {
											_extendingUnit.publics[key] = true;
										}
									}
								}
								else {
									mightNeedLink = true;
									_hiddenUnit[key] = null;
									if(modifier === "public" || modifier === "protected") {
										xDefineIn(_extendingUnit , '_eu_' , key , _hiddenUnit);
										if(modifier === "public") {
											_extendingUnit.publics[key] = true;
										}
									}
								}
								
								//linking public components in user-visible object to the corresponding in _hiddenUnit
								if(modifier === "public" && mightNeedLink) {
									xDefineIn(_this , 'link' , key , _hiddenUnit);
								}
							}
						}

						_constructor.apply(_hiddenUnit , arguments);


						//linking inherited public components 
						if(_hiddenUnit._super.publics) {
							for(key in _hiddenUnit._super.publics) {
								if(!_this[key]) {
									xDefineIn(_this , 'link' , key , _hiddenUnit);
								}
							}
						}

						// adding a refernece to the _hiddenUnit as a property of the object only accessable by theEYE
						Object.defineProperty(_this , '_hu_' , {
							get : function _getter() {
								if(_getter.caller === theEYE) {
									return _hiddenUnit;
								}
							},
							set : function(n){}
						});

						// adding a refernece to the _extendingUnit as a property of the object only accessable by theEYE
						Object.defineProperty(_this , '_eu_' , {
							get : function _getter() {
								if(_getter.caller === theEYE) {
									return _extendingUnit;
								}
							},
							set : function(n){}
						});
					}
				}

				//Attatching static components
				for(key in _staticComponents) {
					var accotiatedAccessLevel = _staticComponents[key].accessLevel;
					switch(accotiatedAccessLevel) {
						case "public": 
							xDefineIn(_classPattern , 'public-static' , key , {
								loc : definition[accotiatedAccessLevel]
							});break;
						case "protected":
							xDefineIn(_classPattern , 'protected-static' , key , {
								own : _privliagedDictionary,
								childs : _privliagedChilds,
								loc : definition[accotiatedAccessLevel]
							});break;
						case "private" :
							xDefineIn(_classPattern , 'private-static' , key , {
								own : _privliagedDictionary,
								loc : definition[accotiatedAccessLevel]
							});break;
					}
				}

				_staticComponents = undefined; //Dispose _staticComponents

				_classPattern.__extendProtectedStaticAccess = function(childsPrivlaged) {
					if(_classPattern.__extendProtectedStaticAccess.caller.caller === classing.Class) {
						for(key in childsPrivlaged) {
							_privliagedChilds[key] = true;
						}
					}
				}

				if(classProprties.parent !== xEmptyParent) {
					classProprties.parent.__extendProtectedStaticAccess(_privliagedDictionary);
				}

				//marking the class to distinguish it form other non-classy structures
			Object.defineProperty(_classPattern , 'xClass' , {
				value : true,
				writable:false,
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
			_classPattern._metadata = _metadata_;

			return _classPattern;
		})();
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
classing.Class.options = {
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
		@return {function} : the Class function (to continue the definition of the class)
**/
classing.Class.Extends = function(parentRef) {
	if(!classing.Class.options.isImplementing && !parentRef !== undefined && parentRef.xClass) {
		if(!parentRef.isFinal) {
			classing.Class.options.parent = parentRef;
			classing.Class.options.isExtending = true;
			return classing.Class;
		}
		else {
			throw classing.xError("301","Cannot extend a final class");
		}
	}
	else {
		if(classing.Class.options.isImplementing) {
			throw classing.xError("302" , "Invalid Decleration");
		}
		throw classing.xError("307","attempting to extend a non Classing{js} Class or undefined");
	}
}

/**
	Implements
		marks the class as implementing one or more interfaces and stores refernces to these
		interfaces.
		@params {functions} : the list of interfaces the class is implementing
		@return {function} : the Class function (to continue the definition of the class)	
**/
classing.Class.Implements = function() {
	var args = [];
	var len = arguments.length;
	if(len !== 0) {
		var counter = 0;
		while(counter < len) {
			args.push(arguments[counter]);
			if(args[counter] === undefined || !args[counter].isInterface) {
				throw classing.xError("306","attempting to implement a non-interface or undefined");
			}
			counter++;
		}
		classing.Class.options.isImplementing = true;
		classing.Class.options.interfaces = args;
		return classing.Class;
	}
	else {
		throw classing.xError("302","Invalid Decleration");
	}
}

classing.Static = function(variable) {
	var staticWrapper = {
		value:variable,
		isStatic:true
	};

	return staticWrapper;
}
// a global shortcut for Static function
Object.defineProperty(_global, 'Static' ,{get : function() {return classing.Static}, set:function(v){}});


/**
	Final is a Class modifier that marks a function/class unextendable

	*Final(method) : Takes a single method and marks it final
		@param {function} method : an function to be marked final
		@return {function} : the marked function
**/
classing.Final = function(method) {
	if(method.isAbstract) {
			throw classing.xError("303","abstract methods cannot be final");
	}
	method.isFinal = true;
	return method;
}
// a global shortcut for Final function
Object.defineProperty(_global, 'Final' ,{
	value : function(method) {
		return classing.Final(method);
}});

/**
	Final.Class : marks the class to be created as Final
		@return {function} : Class function.
**/
Object.defineProperty(classing.Final , 'Class' , { 
	get : function() {
		classing.Class.options.isFinal = true;
		return classing.Class;
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
classing.Abstract = function(method) {
	if(method.isFinal) {
		throw classing.xError("304","final methods cannot be abstract");
	}
	if(method._meta_) {
		if(!method.isEmpty) {
			throw classing.xError("305","An abstract method cannot have implementation");
		}
		method.isAbstract = true;
		return method;
	}
	else if(!classing.Abstract.isNotImplemented(method)) {
		throw classing.xError("305","An abstract method cannot have implementation");
	}

	method.isAbstract = true;
	method._meta_= {argsCount : method.length};
	return method;
}
// a global shortcut for Abstract function
Object.defineProperty(_global, 'Abstract' ,{
	value : function(method) {
		return classing.Abstract(method);
}});

/**
	Abstract.isNotImplemented : checks the method to make sure that its empty
		@param {function} method : the function to be checked
		@return {boolean} : true if it's empty , false otherwise.
**/

classing.Abstract.isNotImplemented = function(method) {
	var notImplementedPattern = new RegExp(/function\s*\w*\([A-Za-z0-9,$_ ]*\)\s*\{\s*\}/);
	var methodStr = method.toString();
	return notImplementedPattern.test(methodStr);
	
}

/**
	Abstract.Class : marks the class to be created as abstract
		@return {function} : Class function.
**/

Object.defineProperty(classing.Abstract , 'Class' , { 
	get : function() {
		classing.Class.options.isAbstract = true;
		return classing.Class;
	},
	set : function(newVal) {}
});