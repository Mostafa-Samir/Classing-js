module("Creating Interfaces");
test("Valid Definetions" , function(){
	var I1 = classing.Interface({
		func1 : function(a,b,u){}
	});
	ok(true , "an interface with a regular function was created. No errors were thrown");
	var I2 = classing.Interface({
		func1 : Function.create(xTyped , [
			types(String),
			function(str){}
		]),
		func2 : Function.create(xNonTyped , [
			function(a,b){}
		])
	});
	ok(true , "an interface with two overloaded functions was created. No errors were thrown");
});

test("Invalid Definetions" , function() {
	throws(function(){
		var I1 = classing.Interface({
			j : "String"
		});
	} , function(err) {
		return err.code === 401;
	} , "attempting to define a non-function component in the interface. An err [code:401] was thrown");

	throws(function(){
		var I1 = classing.Interface({
			j : function(){return "Void"}
		});
	} , function(err) {
		return err.code === 402;
	} , "attempting to define a regular function with a body in the interface. An err [code:402] was thrown");

	throws(function(){
		var I1 = classing.Interface({
			j : Function.create(xNonTyped , [
				function(){},
				function(a){return a}
			])
		});
	} , function(err) {
		return err.code === 402;
	} , "attempting to define an overloaded function with a body in the interface. An err [code:402] was thrown");
	
});

module("Implementing Interfaces");
test("Valid Implementation" , function() {
	var IPayable = classing.Interface({
		salary : function(){}
	});
	var Employee = classing.Class.Implements(IPayable)({
		public : {
			salary : function() {return "5000$";}
		}
	})
	ok(true , "a concrete class implemented the interface. No errors were thrown");

	var AbstractEmployee = classing.Abstract.Class.Implements(IPayable)({});
	ok(true , "an abstract class implemented the interface(without implementing the method). No errors were thrown");

	var IFirable = classing.Interface({
		fire : function(){}
	});
	var IPromotable = classing.Interface({
		promote : function(){}
	});
	var Employee = classing.Class.Implements(IPayable, IPromotable, IFirable)({
		private: {
			_salary : 5000
		},
		public : {
			salary : function(){return "$" + this._salary;},
			promote : function(){this.salary = 7000;},
			fire : function(){return "You're Fired";}
		}
	})
	ok(true , "a concrete class implemented multiple Interfaces. No errors were thrown");
});

test("Invalid Implementation" , function(){
	throws(function(){
		var Test = classing.Class.Implements()({});
	} , function(err){
		return err.code === 302;
	} , "attempting to implement nothing. An error [code:302] was thrown");

	throws(function(){
		var IFraud = {
			pretend : function(){}
		}
		var Test = classing.Class.Implements(IFraud)({});
	} , function(err){
		return err.code === 306;
	} , "attempting to implement a non-library interface. An error [code:302] was thrown");

	throws(function(){
		var IPayable = classing.Interface({
			salary : function(){}
		});
		var Employee = classing.Class.Implements(IPayable)({});
	} , function(err){
		return err.code === 209;
	} , "attempting to implement an interface without implementing its methods. An error [code:209] was thrown");

	throws(function(){
		var IPayable = classing.Interface({
			salary : function(){}
		});
		var Employee = classing.Class.Implements(IPayable)({
			protected : {
				salary : function() {return "$5000";}
			}
		});
	} , function(err){
		return err.code === 205;
	} , "attempting to implement an interface's method (public by default) in the private access level (a mismatch between Implementation and decleration). An error [code:302] was thrown");

})

