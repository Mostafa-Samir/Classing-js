test("Private Constructors" , function() {
	throws(function(){
		var C = Class({
			private:{
				Construct : function(){}
			}
		});

		var obj = new C();
	}, function(err) {
		return err.code === 212;
	}, "instantiating a class with a private constructor threw an error[code:212]");

	throws(function(){
		var C = Class({
			private : {
				Construct : function(){}
			}
		});

		var SubC = Class.Extends(C)({})

		var obj = new SubC();
	}, function(err) {
		return err.code === 212;
	}, "implicit calling of private parent constructor threw an error[code:212]");

	throws(function(){
		var C = Class({
			private: {
				Construct : function(){}
			}
		});

		var SubC = Class.Extends(C)({
			public : {
				Construct : function() {
					base();
				}
			}
		});

		var obj = new SubC();
	}, function(err) {
		return err.code === 212;
	}, "explicit calling of private parent constructor threw an error[code:212]");

	var C = Class({
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
	ok(true , "accessing a private constructor form a privliaged method threw no errors");
});

test("Protected Constructors" , function(){
	throws(function() {
		var C = Class({
			protected : {
				Construct : function(){}
			}
		});

		var obj = new C();
	}, function(err){
		return err.code === 212;
	}, "instantiating a class with a protected constructor threw an error[code:212]");

	var C = Class({
		protected : {
			Construct : function() {}
		}
	});

	var SubC = Class.Extends(C)({});
	var obj = new SubC();
	ok(true , "implicit calling of protected parent constructor threw no errors");

	var SubC2 = Class.Extends(C)({
		public: {
			Construct : function() {
				base();
			}
		}
	});
	var obj2 = new SubC2();
	ok(true , "explicit calling of protected parent constructor threw no errors");

	var C2 = Class({
		protected : {
			Construct : function(){}
		},
		public : {
			instance : Static(function(){
				return new C2();
			})
		}
	});
	var obj3 = C2.instance();
	ok(true , "accessing a protected constructor form a privliaged method threw no errors");
});