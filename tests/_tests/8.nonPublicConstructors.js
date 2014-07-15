var _expect, _classing; //dependincies aliases
if(typeof window == "undefined") { //in node environment
	_expect = require('expect.js');
	_classing = require('../../index.js');
}
else { //in browser environment
	_expect = expect;
	_classing = classing;
}

describe("8.Non-Public Constructors", function(){
	describe("Private Constructors", function(){

		/** Test 1 **/
		it("Instantiating a class with a private constructor threw an error[code = 212]", function(){
			_expect(function(){
				var C = _classing.Class({
					private:{
						Construct : function(){}
					}
				});

				var obj = new C();
			}).to.throwException(function(err){return err.code == 212;});
		});

		/** Test 2 **/
		it("Implicit calling of private parent constructor threw an error[code = 212]", function(){
			_expect(function(){
				var C = _classing.Class({
					private : {
						Construct : function(){}
					}
				});

				var SubC = _classing.Class.Extends(C)({})

				var obj = new SubC();
			}).to.throwException(function(err){return err.code == 212;});
		});

		/** Test 3 **/
		it("Explicit calling of private parent constructor threw an error[code = 212]", function(){
			_expect(function(){
				var C = _classing.Class({
					private : {
						Construct : function(){}
					}
				});

				var SubC = _classing.Class.Extends(C)({
					public : {
						Construct : function() {
							base();
						}
					}
				})

				var obj = new SubC();
			}).to.throwException(function(err){return err.code == 212;});
		});

		/** Test 4 **/
		it("Accessing a private constructor form a privliaged method threw no errors", function(){
			_expect(function(){
				var C = _classing.Class({
					private : {
						Construct : function(){}
					},
					public: {
						instance : Static(function() {
							return new C();
						})
					}
				});
				var obj = C.instance();

			}).to.not.throwException(function(err){return err == null;});
		});

	});

	describe("Protected Constructors", function(){

		/** Test 1 **/
		it("Instantiating a class with a protected constructor threw an error[code = 212]", function(){
			_expect(function(){
				var C = _classing.Class({
					protected:{
						Construct : function(){}
					}
				});

				var obj = new C();
			}).to.throwException(function(err){return err.code == 212;});
		});

		/** Test 2 **/
		it("Implicit calling of protected parent constructor threw no errors", function(){
			_expect(function(){
				var C = _classing.Class({
					protected : {
						Construct : function(){}
					}
				});

				var SubC = _classing.Class.Extends(C)({})

				var obj = new SubC();
			}).to.not.throwException(function(err){return err == null;});
		});

		/** Test 3 **/
		it("Explicit calling of protected parent constructor threw no errors", function(){
			_expect(function(){
				var C = _classing.Class({
					protected : {
						Construct : function(){}
					}
				});

				var SubC = _classing.Class.Extends(C)({
					public : {
						Construct : function() {
							base();
						}
					}
				})

				var obj = new SubC();
			}).to.not.throwException(function(err){return err == null});
		});

		/** Test 4 **/
		it("Accessing a protected constructor form a privliaged method threw no errors", function(){
			_expect(function(){
				var C = _classing.Class({
					protected : {
						Construct : function(){}
					},
					public: {
						instance : Static(function() {
							return new C();
						})
					}
				});
				var obj = C.instance();

			}).to.not.throwException(function(err){return err == null;});
		});

	});
});