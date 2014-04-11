test("instanceOf of Own and Parent Classes" , function(){
	var GreatGrandParent = Class({});
	var GrandParent = Class.Extends(GreatGrandParent)({});
	var Parent = Class.Extends(GrandParent)({});
	var Child = Class.Extends(Parent)({});
	var GrandChild = Class.Extends(Child)({})

	var OtherClass = Class.Extends(Parent)({});

	var obj = new Child();

	ok(obj.instanceOf(Child) , "is instanceOf of its Class");
	ok(obj.instanceOf(Parent) , "is instanceOf direct ancestor");
	ok(obj.instanceOf(GrandParent) , "is instanceOf indirect ancestor (one level up)");
	ok(obj.instanceOf(GreatGrandParent) , "is instanceOf indirect ancestor (two levels up)");
	ok(obj.instanceOf(Object) , "is instanceOf Object");
	ok(!obj.instanceOf(GrandChild) , "is not instanceOf a child class");
	ok(!obj.instanceOf(OtherClass), "is not instanceOf some OtherClass");
});

test("instanceOf direct implemented interfaces" , function(){
	var I1 = Interface({ func1 : function(){} });
	var I2 = Interface({ func2 : function(){} });
	var I3 = Interface({ func3 : function(){} });

	var IOther = Interface({ func: function(){} });

	var Child = Class.Implements(I1, I2, I3)({
		public : {
			func1 : function(){},
			func2 : function(){},
			func3 : function(){}
		}
	});

	var obj = new Child();

	ok(obj.instanceOf(I1) , "is instanceOf Interface I1");
	ok(obj.instanceOf(I2) , "is instanceOf Interface I2");
	ok(obj.instanceOf(I3) , "is instanceOf Interface I3");
	ok(!obj.instanceOf(IOther) , "is not instanceOf Interface IOther");
});

test("instanceOf indirect implemented interfaces" , function() {
	var I1 = Interface({ func: function(){} });
	var Parent = Class.Implements(I1)({
		public: {
			func: function(){}
		}
	});
	var Child = Class.Extends(Parent)({});
	var GrandChild = Class.Extends(Child)({});

	var obj1 = new Child();
	var obj2 = new GrandChild();

	ok(obj1.instanceOf(I1) , "is instanceOf indirect implemented Interface (one level up)");
	ok(obj2.instanceOf(I1) , "is instanceOf indirect implemented Interface (two levels up)");


});