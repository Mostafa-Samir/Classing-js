var _expect, _classing; //dependincies aliases
if(typeof window == "undefined") { //in node environment
	_expect = require('expect.js');
	_classing = require('../../index.js');
}
else { //in browser environment
	_expect = expect;
	_classing = classing;
}

describe("4.Using Classes", function() {
	var C = _classing.Class({
		public: {
			x: null,
			y: null,
			z: null,
			Construct : Function.create(xTyped, [
				types(),
				function(){this.x = "Empty";},
				types(Number, String, Boolean),
				function(a,b,c){
					this.x = a; this.y = b; this.z = c;
				},
				types(xSelf),
				function(othr) {
					this.x = othr.x; this.y = othr.y; this.z = othr.z;
				}
			])
		}
	});
	describe("Constructing Objects", function() {

		/** Test 1 **/
		it("Object constructed correctly: 0-arguments constructor", function(){
			_expect((new C()).x).to.be("Empty");
		});

		/** Test 2 **/
		it("Object constructed correctly: 3-arguments constructor", function(){
			var obj = new C(1,"Hello", false);
			_expect(obj.y + obj.x + obj.z).to.be("Hello1false");
		});

		/** Test 3 **/
		it("Object constructed correctly: copy constructor", function(){
			var obj = new C(1,"Hello", false);
			var _obj = new C(obj);
			_expect(_obj.y + _obj.x + _obj.z).to.be("Hello1false");
		});

		/** Test 4 **/
		it("Attempt to instantiate an abstract class: error [code=211] was thrown", function(){
			_expect(function(){
				var _C = _classing.Abstract.Class({
					public:{
						f : Abstract(function(){})
					}
				});
				var obj = new _C();
			}).to.throwException(function(err){return err.code == 211});
		});

	});

	describe("Access to Private Components", function() {

		var C = _classing.Class({
			private : {
				x : 70,
				p : "Hi",
				f : function(){return "private";},
				s: Static(-85)
			},
			public: {
				getX : function(){return this.x;},
				P : {get: function(){return this.p}, set:function(v){this.p = v;}},
				callPrivateF: function() {return this.f();},
				whatIss : Static(function(){return C.s;})
			}
		});

		var obj = new C();

		describe("Direct Calling", function(){

			/** Test 1 **/
			it("Private Attribute returned undefined", function(){
				_expect(obj.x).to.be(undefined);
			});

			/** Test 2 **/
			it("Attempt to call a private method threw an error", function(){
				_expect(function(){return obj.f()}).to.throwException(function(err){return err != null});
			})

			/** Test 3 **/
			it("Attempt to call a private static attribute threw an error: inaccessable member", function(){
				_expect(function(){return C.s}).to.throwException(function(err){return err.code == 213});
			})

		});

		describe("Indirect Calling Through Public Components", function(){

			/** Test 1 **/
			it("Private Attribute retunred correctly through public method", function(){
				_expect(obj.getX()).to.be(70);
			});

			/** Test 2 **/
			it("Private Attribute retunred correctly through public property", function(){
				//obj.P = "Hello";
				_expect(obj.P).to.be("Hi");
			});

			/** Test 3 **/
			it("Private Attribute altered and retunred correctly through public property", function(){
				obj.P = "Hello";
				_expect(obj.P).to.be("Hello");
			});

			/** Test 4 **/
			it("Private Static Attribute retunred correctly through public static method", function(){
				
				_expect(C.whatIss()).to.be(-85);
			});

		});

		describe("Access to Protected Components", function(){

			var C = _classing.Class({
				protected: {
					x : 546,
					f : function(){return "VOID";},
					s : Static(14.6)
				},
				public : {
					X : {get : function(){return this.x;}, set:function(v){this.x = v;}},
					callF : function(){ return this.f();},
					S : Static({get : function(){return C.s}, set:function(v){C.s = v;}})
				}
			});

			var obj = new C();

			describe("Direct Calling", function(){


				/** Test 1 **/
				it("Accessing a protected attribute returned undefined", function(){
					_expect(obj.x).to.be(undefined);
				});

				/** Test 2 **/
				it("Invoking a protected method threw an error", function(){
					_expect(function(){obj.f()}).to.throwException(function(err){return err != null});
				});

				/** Test 3 **/

				it("Accessing a protected static attribute threw an error", function(){
					_expect(function(){C.s}).to.throwException(function(err){return err.code == 213;});
				});
			});

			describe("Indirect Calling Through Public Components", function(){

				/** Test 1 **/
				it("Protected attribute returned correctly through public property", function(){
					_expect(obj.X).to.be(546);
				});

				/** Test 2 **/
				it("Protected attribute altered and returned correctly through public property", function(){
					obj.X = -80;
					_expect(obj.X).to.be(-80);
				});

				/** Test 3 **/
				it("Protected method invoked through public method", function(){
					obj.X = -80;
					_expect(obj.callF()).to.be("VOID");
				});

				/** Test 4 **/
				it("Protected static attribute altered & returned correctly through public static property", function(){
					C.S++;
					_expect(C.S).to.be(15.6);
				});

			});
		});

		describe("Accessing Public Components", function(){

			var C = _classing.Class({
				public: {
					msg : "Hello W0rld"
				}
			});

			var obj = new C();

			it("Public property accessed correctly", function(){
				_expect(obj.msg).to.be("Hello W0rld");
			})

		})

	});
})