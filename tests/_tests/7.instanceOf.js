var _expect, _classing; //dependincies aliases
if(typeof window == "undefined") { //in node environment
	_expect = require('expect.js');
	_classing = require('../../index.js');
}
else { //in browser environment
	_expect = expect;
	_classing = classing;
}

describe("7.Object::instanceOf", function(){
	describe("instanceOf Own and Parent Classess", function(){

		var GGC = _classing.Class({});
		var GC = _classing.Class.Extends(GGC)({});
		var C = _classing.Class.Extends(GC)({});
		var OC = _classing.Class.Extends(GGC)({});
		var CC = _classing.Class.Extends(C)({});

		/** Test 1 **/
		it("Is instance of its class", function(){
			_expect((new CC()).instanceOf(CC)).to.be(true);
		});

		/** Test 2 **/
		it("Is instance of its ditrect ancestor", function(){
			_expect((new CC()).instanceOf(C)).to.be(true);
		});

		/** Test 3 **/
		it("Is instance of its inditrect ancestor (one level up)", function(){
			_expect((new CC()).instanceOf(GC)).to.be(true);
		});

		/** Test 4 **/
		it("Is instance of its inditrect ancestor (two levels up)", function(){
			_expect((new CC()).instanceOf(GGC)).to.be(true);
		});

		/** Test 5 **/
		it("Is not instance of its child class ", function(){
			_expect((new C()).instanceOf(CC)).to.be(false);
		});

		/** Test 6 **/
		it("Is instance of Object", function(){
			_expect((new CC()).instanceOf(Object)).to.be(true);
		});

		/** Test 7 **/
		it("Is not instance of some other class", function(){
			_expect((new CC()).instanceOf(OC)).to.be(false);
		});

	});

	describe("instanceOf direct implemented interfaces", function(){

		var I = _classing.Interface({x : function(){}});
		var oI = _classing.Interface({y : function(){}});

		var C = _classing.Class.Implements(I)({
			public : {
				x : function(){}
			}
		});

		/** Test 1 **/
		it("Is instance of implemented interface", function(){
			_expect((new C()).instanceOf(I)).to.be(true);
		});

		/** Test 2 **/
		it("Is not instance of some other not implemented interface", function(){
			_expect((new C()).instanceOf(oI)).to.be(false);
		});

	});


	describe("instanceOf indirect implemented interfaces", function(){

		var I = _classing.Interface({x : function(){}});
		var I2 = _classing.Interface({y : function(){}});
		var GC = _classing.Class.Implements(I)({
			public : {
				x : function(){}
			}
		});
		var C = _classing.Class.Extends(GC).Implements(I2)({
			public : {
				y  :function(){}
			}
		});

		var CC = _classing.Class.Extends(C)({})

		/** Test 1 **/
		it("Is instance of indirect implemented interface (one level up)", function(){
			_expect((new CC()).instanceOf(I2)).to.be(true);
		});

		/** Test 2 **/
		it("Is instance of indirect implemented interface (two levels up)", function(){
			_expect((new CC()).instanceOf(I)).to.be(true);
		});

	});
})