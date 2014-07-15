var _expect, _classing; //dependincies aliases
if(typeof window == "undefined") { //in node environment
	_expect = require('expect.js');
	_classing = require('../../index.js');
}
else { //in browser environment
	_expect = expect;
	_classing = classing;
}

describe("6.Using Interfaces", function(){
	describe("Creating Interfaces", function(){
		describe("Valid Defintions", function(){

			/** Test 1 **/
			it("No Errors: An interface with a non-overloaded function is created", function(){
				_expect(function(){
					var I = _classing.Interface({
						func : function(a,b){}
					});
				}).to.not.throwException(function(err){return err == null});
			});

			/** Test 2 **/
			it("No Errors: An interface with an overloaded function is created", function(){
				_expect(function(){
					var I = _classing.Interface({
						func : Function.create(xTyped, [
							types(Number,Number),
							function(a,b){},
							types(String,String),
							function(w,z){}
						])
					});
				}).to.not.throwException(function(err){return err == null});
			});

		});

		describe("Invalid Defintions", function(){

			/** Test 1 **/
			it("A non function component exists in defintion [error code=401]", function(){
				_expect(function(){
					var I = _classing.Interface({
						x : 70
					});
				}).to.throwException(function(err){return err.code == 401;});
			});

			/** Test 2 **/
			it("An implmented non-overloaded function exists in defintion [error code=402]", function(){
				_expect(function(){
					var I = _classing.Interface({
						x : function(a,b){return "void";}
					});
				}).to.throwException(function(err){return err.code == 402;});
			});

			/** Test 3 **/
			it("An implmented overloaded function exists in defintion [error code=402]", function(){
				_expect(function(){
					var I = _classing.Interface({
						x : Function.create(false,[function(a,b){return "void";}])
					});
				}).to.throwException(function(err){return err.code == 402;});
			});

		});

	});

	describe("Implementing Interfaces", function(){
		describe("Valid Implementation", function(){

			/** Test 1 **/
			it("No Errors : Concerete class implemented an interface correctly", function(){
				_expect(function(){
					var I = _classing.Interface({x : function(){}});
					var C = _classing.Class.Implements(I)({
						public : {
							x : function(){return "void";}
						}
					})

					if((new C()).x() !== "void") {
						throw new Error();
					}
				}).to.not.throwException(function(err){return err == null});
			});

			/** Test 2 **/
			it("No Errors : Abstract class implemented an interface correctly", function(){
				_expect(function(){
					var I = _classing.Interface({x : function(){}});
					var C = _classing.Abstract.Class.Implements(I)({})
				}).to.not.throwException(function(err){return err == null});
			});

			/** Test 3 **/
			it("No Errors : Concerete class implemented multiple interfaces correctly", function(){
				_expect(function(){
					var I = _classing.Interface({x : function(){}});
					var I1 = _classing.Interface({y : function(){}});
					var C = _classing.Class.Implements(I,I1)({
						public : {
							x : function(){return "void";},
							y: function(){return "diov";}
						}
					})

					if((new C()).x() !== "void" || (new C()).y() !== "diov") {
						throw new Error();
					}
				}).to.not.throwException(function(err){return err == null});
			});

		});

		describe("Invalid Implementation", function(){

			/** Test 1 **/
			it("Attempting to implement nothing [error code = 302]", function(){
				_expect(function(){
					var C = _classing.Class.Implements()({});
				}).to.throwException(function(err){return err.code == 302;});
			});	

			/** Test 2 **/
			it("Attempting to implement a non-library [error code = 306]", function(){
				_expect(function(){
					var I = function(){this.x = function(){}}
					var C = _classing.Class.Implements(I)({});
				}).to.throwException(function(err){return err.code == 306;});
			});

			/** Test 3 **/
			it("Attempting to implement an interface without methods Implementation [error code = 209]", function(){
				_expect(function(){
					var I = _classing.Interface({x : function(){}})
					var C = _classing.Class.Implements(I)({});
				}).to.throwException(function(err){return err.code == 209;});
			});

			/** Test 4 **/
			it("Attempting to implement an interface with an Implementation mismatch [error code = 205]", function(){
				_expect(function(){
					var I = _classing.Interface({x : function(){}})
					var C = _classing.Class.Implements(I)({
						public : {
							x : function(a,b,c){return "nothing";}
						}
					});
				}).to.throwException(function(err){return err.code == 205;});
			});

		})
	})
});