var _expect, _classing; //dependincies aliases
if(typeof window == "undefined") { //in node environment
	_expect = require('expect.js');
	_classing = require('../../index.js');
}
else { //in browser environment
	_expect = expect;
	_classing = classing;
}

describe("5.Extending Classes", function(){
	describe("Vaild Extensions", function(){

		/** Test 1 **/
		it("No Errors Thrown : Concrete class extended", function(){
			_expect(function(){
				var C = _classing.Class({
					public : {
						x : 1
					}
				});

				var CC = _classing.Class.Extends(C)({});

				if((new CC()).x != 1) {
					throw new Error();
				}
			}).to.not.throwException(function(err) { return err == null});
		});

		/** Test 2 **/
		it("No Errors Thrown : Abstract class extended", function(){
			_expect(function(){
				var C = _classing.Abstract.Class({
					public : {
						x : Abstract(function(){})
					}
				});

				var CC = _classing.Class.Extends(C)({
					public : {
						x : function(){return "void";}
					}
				});

				if((new CC()).x() != "void") {
					throw new Error();
				}
			}).to.not.throwException(function(err) { return err == null });
		});

		/** Test 3 **/
		it("No Errors Thrown : Abstract class extended by another abstract class", function(){
			_expect(function(){
				var C = _classing.Abstract.Class({
					public : {
						x : Abstract(function(){})
					}
				});

				var CC = _classing.Abstract.Class.Extends(C)({});

			}).to.not.throwException(function(err) { return err == null });
		});

	});

	describe("Invalid Extensions", function() {

		/** Test 1 **/
		it("Extending a non-library Class: an error [code=307] was thrown", function(){
			_expect(function(){
				function C() {this.x = 50;}
				var CC = _classing.Class.Extends(C)({});
			}).to.throwException(function(err) { return err.code == 307 });
		});

		/** Test 2 **/
		it("Extending a final Class: an error [code=301] was thrown", function(){
			_expect(function(){
				var C = _classing.Final.Class({});
				var CC = _classing.Class.Extends(C)({});
			}).to.throwException(function(err) { return err.code == 301 });
		});

		/** Test 3 **/
		it("Extending an abstract class without implmentation : an error [code=209] was thrown", function(){
			_expect(function(){
				var C = _classing.Abstract.Class({
					public : {
						f : Abstract(function(){})
					}
				});
				var CC = _classing.Class.Extends(C)({});
			}).to.throwException(function(err) { return err.code == 209 });
		});

		/** Test 4 **/
		it("Extending an abstract class with implmentation mismatch: an error [code=205] was thrown", function(){
			_expect(function(){
				var C = _classing.Abstract.Class({
					public : {
						f : Abstract(function(a,b){})
					}
				});
				var CC = _classing.Class.Extends(C)({
					public :{
						f: function(a){}
					}
				});
			}).to.throwException(function(err) { return err.code == 205 });
		});

		/** Test 5 **/
		it("Attempting to override a final method : an error [code=204] was thrown", function(){
			_expect(function(){
				var C = _classing.Class({
					public : {
						f : Final(function(a,b){})
					}
				});
				var CC = _classing.Class.Extends(C)({
					public :{
						f: function(a){}
					}
				});
			}).to.throwException(function(err) { return err.code == 204 });
		});

		/** Test 6 **/
		it("Attempting to override a method in a different access lvl: an error [code=216] was thrown", function(){
			_expect(function(){
				var C = _classing.Class({
					public : {
						f : function(a,b){}
					}
				});
				var CC = _classing.Class.Extends(C)({
					private :{
						f: function(a){}
					}
				});
			}).to.throwException(function(err) { return err.code == 216 });
		});

		/** Test 7 **/
		it("Attempting to override a concrete method with an abstract: an error [code=215] was thrown", function(){
			_expect(function(){
				var C = _classing.Class({
					public : {
						f : function(a,b){}
					}
				});
				var CC = _classing.Class.Extends(C)({
					private :{
						f: Abstract(function(a){})
					}
				});
			}).to.throwException(function(err) { return err.code == 215 });
		});
	});

	describe("Accessing Protected Components form Child Classes", function(){

		/** Test 1 **/
		it("Protected attribute accesed through 'this'", function(){
			var C = _classing.Class({
				protected : {
					x : 70
				}
			});
			var CC = _classing.Class.Extends(C)({
				public : {
					f : function() {return this.x;}
				}
			});

			_expect((new CC()).f()).to.be(70);
		});

		/** Test 2 **/
		it("Protected method accesed through 'this'", function(){
			var C = _classing.Class({
				protected : {
					f : function(){return "protected";}
				}
			});
			var CC = _classing.Class.Extends(C)({
				public : {
					ff : function() {return this.f();}
				}
			});

			_expect((new CC()).ff()).to.be("protected");
		});

		/** Test 3 **/
		it("Protected property accesed through 'this'", function(){
			var C = _classing.Class({
				protected : {
					P : {get : function(){return -970;}, set: function(v){}}
				}
			});
			var CC = _classing.Class.Extends(C)({
				public : {
					f : function() {return this.P;}
				}
			});

			_expect((new CC()).f()).to.be(-970);
		});

		/** Test 4 **/
		it("Protected Static accesed through 'Parent' in child's method", function(){
			var C = _classing.Class({
				protected : {
					S : Static(-760)
				}
			});
			var CC = _classing.Class.Extends(C)({
				public : {
					f : function() {return C.S;}
				}
			});

			_expect((new CC()).f()).to.be(-760);
		});

	});

	describe("Accessing Public Components form Child Classes", function(){

		/** Test 1 **/
		it("Public attribute accesed directly and through 'this'", function(){
			var C = _classing.Class({
				public : {
					x : 70
				}
			});
			var CC = _classing.Class.Extends(C)({
				public : {
					f : function() {return this.x;}
				}
			});
			var obj = new CC();

			_expect(obj.x == 70 && obj.f() == obj.x).to.be(true);
		});

		/** Test 2 **/
		it("Public method accesed through 'this'", function(){
			var C = _classing.Class({
				public : {
					f : function(){return "protected";}
				}
			});
			var CC = _classing.Class.Extends(C)({
				public : {
					ff : function() {return this.f();}
				}
			});
			var obj = new CC();

			_expect(obj.f() == "protected" && obj.f() == obj.ff()).to.be(true);
		});

		/** Test 3 **/
		it("Public property accesed through 'this'", function(){
			var C = _classing.Class({
				public : {
					P : {get : function(){return -970;}, set: function(v){}}
				}
			});
			var CC = _classing.Class.Extends(C)({
				public : {
					f : function() {return this.P;}
				}
			});
			var obj = new CC();

			_expect(obj.P == -970 && obj.P == obj.f()).to.be(true);
		});

		/** Test 4 **/
		it("Public Static accesed through 'Parent' in child's method", function(){
			var C = _classing.Class({
				public : {
					S : Static(-760)
				}
			});
			var CC = _classing.Class.Extends(C)({
				public : {
					f : function() {return C.S;}
				}
			});

			_expect((new CC()).f()).to.be(-760);
		});

	});

	describe("Using the 'base' keyword", function(){

		/** Test 1 **/
		it("Invoking the parent constructor with base as a function", function(){
			var Parent = _classing.Class({
				public: {
					val : null,
					Construct : Function.create(xTyped , [
						types(String),
						function(str) {
							this.val = str;
						}
					])
				}
			});
			var Child = _classing.Class.Extends(Parent)({
				public : {
					Construct : function(str) {
						base(str);
					}
				}
			});

			var obj = new Child("Test String");

			_expect(obj.val).to.be("Test String");
		});

		/** Test 2 **/
		it("An overriding method invokes the original method in parent", function(){
			var Parent = _classing.Class({
				public : {
					Greet : function() {
						return "Hi";
					}
				}
			});
			var Child = _classing.Class.Extends(Parent)({
				public : {
					Greet : function() {
						return base.Greet() + ",Welcome";
					}
				}
			});
		
			var obj = new Child();		

			_expect(obj.Greet()).to.be("Hi,Welcome");
		});

		/** Begin Common for tests 3,4 **/
		var _Parent = _classing.Class({
			protected : {
				val : 50
			}
		});	
		var _Child = _classing.Class.Extends(_Parent)({
			public : {
				changeValFromThisTo : function(n){this.val = n},
				changeValFromBaseTo : function(n){base.val = n},
				getValFromThis: function(){return this.val},
				getValFromBase: function(){return base.val}
			}
		});

		var _obj = new _Child();
		/** End Common for tests 3,4 **/

		/** Test 3 **/
		it("Changing an inhereted component with 'this' also changes the corresponding in 'base'", function(){
		
			_obj.changeValFromThisTo(7846.6);		

			_expect(_obj.getValFromBase()).to.be(7846.6);
		});

		/** Test 3 **/
		it("Changing an inhereted component with 'base' also changes the corresponding in 'this'", function(){
		
			_obj.changeValFromBaseTo(-702.65);

			_expect(_obj.getValFromThis()).to.be(-702.65);
		});

	});
});