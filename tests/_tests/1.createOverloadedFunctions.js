var _expect, _classing; //dependincies aliases
if(typeof window == "undefined") { //in node environment
	_expect = require('expect.js');
	_classing = require('../../index.js');
}
else { //in browser environment
	_expect = expect;
	_classing = classing;
}

describe("1.Creating Overloaded Functions", function() {
describe("Non-Typed Overloading", function() {
	describe("Valid Defintions", function() {

		/** Test 1 **/
		it("No errors thrown: Overloaded function created", function() {
			_expect(function() {
				var f = Function.create(xNonTyped , [
					function(a,b){return a + b} ,
					function(a,b,c) {return a*b + c;}
				]);
			}).to.not.throwException(function(err){ return err == null});
		});

		/** Test 2 **/
		it("No errors thrown: Overloaded function created", function() {
			_expect(function() {
				var f = Function.create(false , [
					function(){return "Void"} , 
					function(a){return a;}
				]);
			}).to.not.throwException(function(err) {return err == null});
		});
	});

	describe("Invalid Defintions", function() {
		describe("Invalid Arguments", function() {

			/** Test 1 **/
			it("An error [code=100] was thrown: No arguments sent to Function.create", function(){
				_expect(function() {
					var f = Function.create();
				}).to.throwException(function(err){return err.code == 100});
			});

			/** Test 2 **/
			it("An error [code=100] was thrown: Only one argument was sent to Function.create", function(){
				_expect(function() {
					var f = Function.create(false);
				}).to.throwException(function(err){return err.code == 100});
			});

			/** Test 3 **/
			it("An error [code=100] was thrown: extra arguments were sent to Function.create", function(){
				_expect(function() {
					var f = Function.create(false, [function(){}], "extra");
				}).to.throwException(function(err){return err.code == 100});
			});

			/** Test 4 **/
			it("An error [code=100] was thrown: mode argument sent as non-boolean", function(){
				_expect(function() {
					var f = Function.create("false", [function(){}]);
				}).to.throwException(function(err){return err.code == 100});
			});

			/** Test 5 **/
			it("An error [code=100] was thrown: overloads argument sent as non-array", function(){
				_expect(function() {
					var f = Function.create(false, function(){});
				}).to.throwException(function(err){return err.code == 100});
			});

		});
		
		describe("Invalid Array Format", function() {

			/** Test 1 **/
			it("An error [code=101] was thrown: overloads sent as an empty array", function(){
				_expect(function() {
					var f = Function.create(false, []);
				}).to.throwException(function(err){return err.code == 101});
			});

			/** Test 2 **/
			it("An error [code=101] was thrown: overloads array has some non-function elements", function(){
				_expect(function() {
					var f = Function.create(false, [function(){}, "func"]);
				}).to.throwException(function(err){return err.code == 101});
			});
		});

		describe("Duplicates", function() {

			/** Test 1 **/
			it("An error [code=106] was thrown: two functions with same number of parameters exist", function(){
				_expect(function() {
					var f = Function.create(false, [function(a){}, function(b){}]);
				}).to.throwException(function(err){return err.code == 106});
			});

		});
	})
});

describe("Typed Overloading", function() {
	describe("Valid Defintions", function() {

		/** Test 1 **/
		it("No errors thrown: Overloaded function created [Native Types]", function() {
			_expect(function() {
				var f = Function.create(xTyped , [
					types(String, Number),
					function(a,b){}
				]);
			}).to.not.throwException(function(err){ return err == null});
		});

		/** Test 2 **/
		it("No errors thrown: Overloaded function created [Automatic Type Recognition]", function() {
			_expect(function() {
				function CustomType() {this.x = 7};
				var f = Function.create(true , [
					types(CustomType),
					function(a){}
				]);
			}).to.not.throwException(function(err) {return err == null});
		});

		/** Test 3 **/
		it("No errors thrown: Overloaded function created [Stamped Type]", function() {
			_expect(function() {
				var CustomType = function() {this.x = 7};
				_classing.xStamp(CustomType);
				var f = Function.create(true , [
					types(CustomType),
					function(a){}
				]);
			}).to.not.throwException(function(err) {return err == null});
		});
	});

	describe("Invalid Defintions", function() {
		describe("Invalid Type", function() {

			/** Test 1 **/
			it("An error [code=103] was thrown: A non-constructor function type was sent", function(){
				_expect(function() {
					var f = Function.create(true,[
						types(Math),
						function(a){}
					]);
				}).to.throwException(function(err){return err.code == 103});
			});
		});
		
		describe("Invalid Array Format", function() {

			/** Test 1 **/
			it("An error [code=101] was thrown: overloads sent as an empty array", function(){
				_expect(function() {
					var f = Function.create(true, []);
				}).to.throwException(function(err){return err.code == 101});
			});

			/** Test 2 **/
			it("An error [code=101] was thrown: missing typelist or function", function(){
				_expect(function() {
					var f = Function.create(true, [types(),function(){}, types(Number)]);
				}).to.throwException(function(err){return err.code == 101});
			});

			/** Test 2 **/
			it("An error [code=101] was thrown: array has non-typelist nor function elements", function(){
				_expect(function() {
					var f = Function.create(true, ["types()",function(){}, types(Number)]);
				}).to.throwException(function(err){return err.code == 101});
			});
		});

		describe("Duplicates", function() {

			/** Test 1 **/
			it("An error [code=106] was thrown: two functions with same parameters list exist", function(){
				_expect(function() {
					var f = Function.create(true, [types(Number),function(a){},types(Number), function(b){}]);
				}).to.throwException(function(err){return err.code == 106});
			});

		});

		describe("Types-Parameters Number Mismatch", function(){

			/** Test 1 **/
			it("An error [code=102] was thrown: typelist length != parameters count", function(){
				_expect(function() {
					var f = Function.create(true, [types(Number,String),function(a){}]);
				}).to.throwException(function(err){return err.code == 102});
			});

		});
	})
});
});

