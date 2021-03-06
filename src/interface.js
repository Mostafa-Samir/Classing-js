/**
	Interface : creates an interface (a structure that contains only public abstract methods to be implemented by a class or more)
	@param {defintion} : the definition of the interface
	@return {Object} : the object representing the interface

**/
classing.Interface = function(defintion) {

	var abstracts = {};

	var reservedTimestamp = classing.xSelf.timestamp;
	classing.xSelf.timestamp++;

	for(key in defintion) {
		var currentComponent = defintion[key];
		if(typeof currentComponent !== "function") {
			throw classing.xError("401" , "Interfaces contain only methods"); //interfaces contain only functions
		}
		else {
			if(currentComponent.isEmpty !== undefined) {
				//the function is defined using Function.create
				if(!currentComponent.isEmpty) {
					throw classing.xError("402","an interface method cannot have any implementation"); //every function must be empty
				}
				else {
					currentComponent._meta_.isOverloaded = true;
					abstracts[key] = { 
						accessLevel : "public",
						description : currentComponent._meta_
					}
				}
			}
			else {
				//the function is defined in the ordinary way
				if(!classing.Abstract.isNotImplemented(currentComponent)) {
					throw classing.xError("402","an interface method cannot have any implementation");
				}
				else {
					abstracts[key] = {
						accessLevel : "public",
						description : {
							isOverloaded : false,
							argsCount : currentComponent.length
						}
					}
				}
			}
		}

	}

	var InterfaceObject = new Object();
	Object.defineProperty(InterfaceObject , 'components' , {value : abstracts , writable:false});
	Object.defineProperty(InterfaceObject , 'isInterface' , {value : true , writable:false});
	Object.defineProperty(InterfaceObject , 'timestamp' , {value: reservedTimestamp, writable:false});

	return InterfaceObject;
}
