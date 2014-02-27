test("Valid Extensions" , function() {
	/* Begin Test 1 */
	var Parent = Class({
		protected : {
			pVal : "Hello"
		}
	}); 
	var Child = Class.Extends(Parent)({});
	ok(true , "a concrete class extinstion is made. No errors thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	var Parent = Abstract.Class({
		protected : {
			abstractMethod : Abstract(function(){})
		}
	}); 
	var Child = Class.Extends(Parent)({
		protected : {
			abstractMethod : function(){return "Void";}
		}
	});
	ok(true , "a conceret class extends an abstract class and implements the abstract method. No errors thrown");
	/* End Test 2 */

	/* Begin Test 3 */
	var Parent = Abstract.Class({
		protected : {
			abstractMethod : Abstract(function(){})
		}
	}); 
	var Child = Abstract.Class.Extends(Parent)({});
	ok(true , "an abstract class extends another abstract class [the abstract method in parent is not implemented]. No errors thrown");
	/* End Test 3 */
});

test("Invalid Extensions" , function(){
	/* Begin Test 1 */
	throws(function() {
		var Base = function() {
			this.Val = 50;
		};
		var Derived = Class.Extends(Base)({});
	} , function(err) {
		return err.code === 307;
	} , "Extending a non-library class. An error [code:307] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function() {
		var Base = Final.Class({
			public : {
				val : 70
			}
		})
		var Derived = Class.Extends(Base)({});
	} , function(err) {
		return err.code === 301 ;
	} , "Extending a final class. An error [code:301] was thrown");
	/* End Test 2 */

	/* Begin Test 3 */
	throws(function() {
		var Base = Abstract.Class({
			public : {
				abstractMethod : Abstract(function(){})
			}
		})
		var Derived = Class.Extends(Base)({});
	} , function(err) {
		return err.code === 209;
	} , "Extending an abstract class without implementing the abstract method or declaring the derived class as abstract. An error [code:209] was thrown");
	/* End Test 3 */

	/* Begin Test 4 */
	throws(function() {
		var Base = Abstract.Class({
			public : {
				abstractMethod : Abstract(function(){})
			}
		})
		var Derived = Class.Extends(Base)({
			public : {
				abstractMethod : function(a,b,c){return a + b + c;}
			}
		});
	} , function(err) {
		return err.code === 205 ;
	} , "Extending an abstract class with a mismatch in the decleration of the implemented method and the abstract method. An error [code:205] was thrown");
	/* End Test 4 */

	/* Begin Test 5 */
	throws(function() {
		var Base = Class({
			public : {
				finalMethod : Final(function(){return "Hello";})
			}
		})
		var Derived = Class.Extends(Base)({
			public : {
				finalMethod : function(a,b,c){return a + b + c;}
			}
		});
	} , function(err) {
		return err.code === 204 ;
	} , "Attempting to override a final method. An error [code:205] was thrown");
	/* End Test 5 */

	/* Begin Test 6 */
	throws(function() {
		var Base = Class({
			protected : {
				method : function(){return "Hello";}
			}
		})
		var Derived = Class.Extends(Base)({
			public : {
				method : function(a,b,c){return a + b + c;}
			}
		});
	} , function(err) {
		return err.code === 216 ;
	} , "Attempting to override a method in a different access level. An error [code:216] was thrown");
	/* End Test 6 */

	/* Begin Test 7 */
	throws(function() {
		var Base = Class({
			public : {
				method : function(){return "Hello";}
			}
		})
		var Derived = Class.Extends(Base)({
			public : {
				method : Abstract(function(a,b,c){})
			}
		});
	} , function(err) {
		return err.code === 215 ;
	} , "Attempting to override a concrete method with an abstract method. An error [code:215] was thrown");
	/* End Test 7 */
});

test("Acessing Protected Components in Child Classes" , function(){
	/* Begin Test 1 */
	var Parent = Class({
		protected : {
			pAttr : 70
		}
	});
	var Child = Class.Extends(Parent)({
		public : {
			getTheProtcetedAttr: function() {
				return this.pAttr;
			}
		}
	});
	var obj = new Child();
	ok(obj.getTheProtcetedAttr() === 70 , "protcetd attribute accessed from 'this' in a child object");
	/* End Test 1 */

	/* Begin Test 2 */
	var Parent = Class({
		private : {
			msg : "a string declared in private"
		},
		protected : {
			pMethod : function() {
				return this.msg;
			} 
		}
	});
	var Child = Class.Extends(Parent)({
		public : {
			invokeProtecetdMethod: function() {
				return this.pMethod();
			}
		}
	});
	var obj = new Child();
	ok(obj.invokeProtecetdMethod() === "a string declared in private" , "protcetd method invoked from 'this' in a child object");
	/* End Test 2 */

	/* Begin Test 3 */
	var Parent = Class({
		private : {
			msg : "a string declared in private"
		},
		protected : {
			pProperty : {
				get : function() {
					return this.msg;
				},
				set : function(n) {
					this.msg = n;
				}
			} 
		}
	});
	var Child = Class.Extends(Parent)({
		public : {
			setProtecetedProperty : function(val) {
				this.pProperty = val;
			},
			getProtecetdProperty : function() {
				return this.pProperty;
			}
		}
	});
	var obj = new Child();
	obj.setProtecetedProperty("changed from child");
	ok(obj.getProtecetdProperty() === "changed from child" , "protcetd property accessed from 'this' in a child object");
	/* End Test 3 */

	/* Begin Test 4 */
	var Parent = Class({
		protected : {
			counter : Static(0)
		},
		public : {
			Construct : function() {
				Parent.counter++;
			}
		}
	});
	var Child = Class.Extends(Parent)({
		public : {
			getParentCounter : function() {
				return Parent.counter;
			}
		}
	});
	var obj = new Child();
	ok(obj.getParentCounter() === 1 , "protcetd static component accessed from 'Parent' within a child's method");
	/* End Test 4 */	
});

test("Acessing Public Components in Child Classes" , function(){
	/* Begin Test 1 */
	var Parent = Class({
		public : {
			attr : 70
		}
	});
	var Child = Class.Extends(Parent)({});
	var obj = new Child();
	ok(obj.attr === 70 , "public attribute accessed directly from a child object");
	/* End Test 1 */

	/* Begin Test 2 */
	var Parent = Class({
		private : {
			msg : "a string declared in private"
		},
		public : {
			method : function() {
				return this.msg;
			} 
		}
	});
	var Child = Class.Extends(Parent)({});
	var obj = new Child();
	ok(obj.method() === "a string declared in private" , "public method invoked directly from a child object");
	/* End Test 2 */

	/* Begin Test 3 */
	var Parent = Class({
		private : {
			msg : "a string declared in private"
		},
		public : {
			property : {
				get : function() {
					return this.msg;
				},
				set : function(n) {
					this.msg = n;
				}
			} 
		}
	});
	var Child = Class.Extends(Parent)({});
	var obj = new Child();
	obj.property = "changed from child";
	ok(obj.property === "changed from child" , "public property accessed directly from a child object");
	/* End Test 3 */

	/* Begin Test 4 */
	var Parent = Class({
		public : {
			counter : Static(0),
			Construct : function() {
				Parent.counter++;
			}
		}
	});
	var Child = Class.Extends(Parent)({
		public : {
			getParentCounter : function() {
				return Parent.counter;
			}
		}
	});
	var obj = new Child();
	ok(obj.getParentCounter() === 1 , "public static component accessed from 'Parent' within a child's method");
	/* End Test 4 */	
});

test("Using the 'base' Keyword" , function(){
	/* Begin Test 1 */
	var Parent = Class({
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
	var Child = Class.Extends(Parent)({
		public : {
			Construct : function(str) {
				base(str);
			}
		}
	});

	var obj = new Child("Test String");
	ok(obj.val === "Test String" , "invoking the parent constructor with 'base' as a function");
	/* End Test 1 */

	/* Begin Test 2 */
	var Parent = Class({
		public : {
			Greet : function() {
				return "Hi";
			}
		}
	});
	var Child = Class.Extends(Parent)({
		public : {
			Greet : function() {
				return base.Greet() + ",Welcome";
			}
		}
	});

	var obj = new Child();
	ok(obj.Greet() === "Hi,Welcome" , "an overriden methods invokes the original method in parent");
	/* End Test 2 */

	/* Begin Test 3 */
	var Parent = Class({
		protected : {
			val : 50
		}
	});
	var Child = Class.Extends(Parent)({
		public : {
			changeValFromThisTo : function(n){this.val = n},
			changeValFromBaseTo : function(n){base.val = n},
			getValFromThis: function(){return this.val},
			getValFromBase: function(){return base.val}
		}
	});

	var obj = new Child();
	obj.changeValFromThisTo(7846.6);
	ok(obj.getValFromBase() === 7846.6 , "changing an inhereted component with 'this' also changes the corresponding in 'base'");
	/* End Test 3 */

	/* Begin Test 4 */
	obj.changeValFromBaseTo(-702.65);
	ok(obj.getValFromThis() === -702.65 , "changing an inhereted component with 'base' also changes the corresponding in 'this'");
	/* End Test 4 */
})