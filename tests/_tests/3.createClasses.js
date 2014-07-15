var _expect, _classing; //dependincies aliases
if(typeof window == "undefined") { //in node environment
	_expect = require('expect.js');
	_classing = require('../../index.js');
}
else { //in browser environment
	_expect = expect;
	_classing = classing;
}
describe("3.Creating Classes", function() {
	describe("Valid Defintions", function(){

		/** Test 1 **/
		it("No errors thrown: Concerete class created", function(){
			_expect(function(){
				var C = _classing.Class({
					private:{x:50},
					protected:{f : function(){}},
					public:{d : {get:function(){},set:function(v){}}}
				});
			}).to.not.throwException(function(err){return err == null});
		});

		/** Test 2 **/
		it("No errors thrown: Final concerete class created", function(){
			_expect(function(){
				var C = _classing.Final.Class({
					private:{x:Static(50)},
					protected:{f : Final(function(){})},
					public:{om : Function.create(false, [function(){},function(a){}])}
				});
			}).to.not.throwException(function(err){return err == null});
		});

		/** Test 3 **/
		it("No errors thrown: Empty concerete class created", function(){
			_expect(function(){
				var C = _classing.Class({});
			}).to.not.throwException(function(err){return err == null});
		});

		/** Test 4 **/
		it("No errors thrown: Abstract class created", function(){
			_expect(function(){
				var C = _classing.Abstract.Class({
					public:{f:Abstract(function(){})}
				});
			}).to.not.throwException(function(err){return err == null});
		});

		/** Test 5 **/
		it("No errors thrown: Abstract class created [with an abstract overloaded method", function(){
			_expect(function(){
				var C = _classing.Abstract.Class({
					public:{f:Abstract(Function.create(true, [types(Number),function(a){}]))}
				});
			}).to.not.throwException(function(err){return err == null});
		});

	});

	describe("Invalid Defintions", function() {
		describe("Invalid Arguments", function(){

			/** Test 1 **/
			it("An error [code=201] was thrown: non-object passed to Class", function(){
				_expect(function(){
					var C = _classing.Class("{public : {x:70}");
				}).to.throwException(function(err){return err.code == 201})
			});

			/** Test 2 **/
			it("An error [code=201] was thrown: non-object passed to Class", function(){
				_expect(function(){
					var C = _classing.Class(function() {
						public.x = 70;
					});
				}).to.throwException(function(err){return err.code == 201})
			});
		});

		describe("Unallowed Access Modifier", function(){

			/** Test 1 **/
			it("An error [code=202] was thrown: privilaged is not a modifier", function(){
				_expect(function(){
					var C = _classing.Class({
						privilaged: {g:50}
					});
				}).to.throwException(function(err){return err.code == 202})
			});

			/** Test 2 **/
			it("An error [code=202] was thrown: static is not a modifier", function(){
				_expect(function(){
					var C = _classing.Class({
						static: {g:50}
					});
				}).to.throwException(function(err){return err.code == 202})
			});
		});

		describe("Setting non-static attributes to objects", function(){

			/** Test 1 **/
			it("An error [code=206] was thrown: an instance attribute is set to a new array", function(){
				_expect(function(){
					var C = _classing.Class({
						public : {
							x : new Array()
						}
					});
				}).to.throwException(function(err){return err.code == 206})
			});

			/** Test 2 **/
			it("An error [code=206] was thrown: an instance attribute is set to object literal", function(){
				_expect(function(){
					var C = _classing.Class({
						public : {
							x : {z : 70}
						}
					});
				}).to.throwException(function(err){return err.code == 206})
			});

		});

		describe("Duplicate Components Name", function(){

			/** Test 1 **/
			it("An error [code=207] was thrown: two components wth the same name exist", function(){
				_expect(function(){
					var C = _classing.Class({
						public : {
							x : null
						},
						private: {
							x : "null"
						}
					});
				}).to.throwException(function(err){return err.code == 207})
			});

			/** Test 2 **/
			it("An error [code=207] was thrown: two components wth the same name exist", function(){
				_expect(function(){
					var C = _classing.Class({
						protected : {
							x : function(a){}
						},
						private: {
							x : "null"
						}
					});
				}).to.throwException(function(err){return err.code == 207})
			});

		});

		describe("Mark Implemented Methods as Abstract", function(){

			/** Test 1 **/
			it("An error [code=305] was thrown: an implemented method is marked abstract", function(){
				_expect(function(){
					var C = _classing.Abstract.Class({
						public : {
							f : Abstract(function(a){return a;})
						}
					});
				}).to.throwException(function(err){return err.code == 305})
			});

			/** Test 2 **/
			it("An error [code=305] was thrown: an implemented overloaded method is marked abstract", function(){
				_expect(function(){
					var C = _classing.Abstract.Class({
						public : {
							f : Abstract(Function.create(true,[
								types(Number),
								function(a){return a;}
							]))
						}
					});
				}).to.throwException(function(err){return err.code == 305})
			});
		});

		describe("Marking a final method abstract", function(){

			/** Test 1 **/
			it("An error [code=304] was thrown: a final method is marked abstract", function(){
				_expect(function(){
					var C = _classing.Abstract.Class({
						public : {
							f : Abstract(Final(function(){}))
						}
					});
				}).to.throwException(function(err){return err.code == 304})
			});

		});

		describe("Marking an abstract method final", function() {

			/** Test 1 **/
			it("An error [code=304] was thrown: a final method is marked abstract", function(){
				_expect(function(){
					var C = _classing.Abstract.Class({
						public : {
							f : Abstract(Final(function(){}))
						}
					});
				}).to.throwException(function(err){return err.code == 304})
			});

		});

		describe("Marking a private method abstract", function(){

			/** Test 1 **/
			it("An error [code=203] was thrown: a private method is marked abstract", function(){
				_expect(function(){
					var C = _classing.Abstract.Class({
						private : {
							f : Abstract(function(){})
						}
					});
				}).to.throwException(function(err){return err.code == 203})
			});

		});
	});
});