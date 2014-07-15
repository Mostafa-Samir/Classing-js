var _expect, _classing; //dependincies aliases
if(typeof window == "undefined") { //in node environment
	_expect = require('expect.js');
	_classing = require('../../index.js');
}
else { //in browser environment
	_expect = expect;
	_classing = classing;
}
describe("2.Using Overloaded Functions", function() {
	describe("Non-Typed Overloading", function(){
		var add = Function.create(false, [
			function(a,b) {return a+b;},
			function(a,b,c) {return a + b +c;}
		]);
	
		describe("Valid Calls [On 2 and 3-arguments add function]", function() {

			/** Test 1 **/
			it("Vaild Call : add(1,2) returned 3", function() {
				_expect(add(1,2)).to.be(3);
			});

			/** Test 2 **/
			it("Vaild Call : add(1,2,-1) returned 2", function() {
				_expect(add(1,2,-1)).to.be(2);
			});
		});

		describe("Invalid Calls [On 2 and 3-arguments add function]", function() {

			/** Test 1 **/
			it("Invaild Call : add(1) threw an error [code=105]", function() {
				_expect(function(){add(1)}).to.throwException(function(err){return err.code == 105});
			});

			/** Test 2 **/
			it("Invaild Call : add() threw an error [code=105]", function() {
				_expect(function(){add()}).to.throwException(function(err){return err.code == 105});
			});

			/** Test 3 **/
			it("Invaild Call : add(1,2,3,5,6) threw an error [code=105]", function() {
				_expect(function(){add(1,2,3,5,6)}).to.throwException(function(err){return err.code == 105});
			});

			/** Test 4 **/
			it("Invaild Call : add(1,2,3,5) threw an error [code=105]", function() {
				_expect(function(){add(1,2,3,5)}).to.throwException(function(err){return err.code == 105});
			});
		});
	});

	describe("Typed Overloading", function() {
		var add = Function.create(true, [
			types(Number,Number),
			function(a,b){ return a + b; },
			types(Number,String),
			function(w,z) {return w + parseFloat(z);}
		]);
		describe("Valid Calls [On add(Number,Number),add(Number,String)]", function(){

			/** Test 1 **/
			it("Vaild Call : add(1.1,2.34) returned 3.44", function() {
				_expect(add(1.1,2.34)).to.be(3.44);
			});

			/** Test 1 **/
			it("Vaild Call : add(1.1,'0.34') returned 1.44", function() {
				_expect(add(1.1,'0.34').toFixed(2)).to.be("1.44");
			});
		
		});

		describe("Invaild Calls [On add(Number,Number),add(Number,String)]", function(){

			/** Test 1 **/
			it("Invaild Call : add(1) threw an error [code=105]", function() {
				_expect(function(){add(1)}).to.throwException(function(err){return err.code == 105});
			});

			/** Test 2 **/
			it("Invaild Call : add(1,8,9) threw an error [code=105]", function() {
				_expect(function(){add(1,8,9)}).to.throwException(function(err){return err.code == 105});
			});

			/** Test 3 **/
			it("Invaild Call : add('1',5) threw an error [code=105]", function() {
				_expect(function(){add('1',5)}).to.throwException(function(err){return err.code == 105});
			});

			/** Test 4 **/
			it("Invaild Call : add(1,'5', 7) threw an error [code=105]", function() {
				_expect(function(){add(1,'5',7)}).to.throwException(function(err){return err.code == 105});
			});

			/** Test 5 **/
			it("Invaild Call : add(1,'8','70') threw an error [code=105]", function() {
				_expect(function(){add(1,8,'70')}).to.throwException(function(err){return err.code == 105});
			});

		});
	});
});