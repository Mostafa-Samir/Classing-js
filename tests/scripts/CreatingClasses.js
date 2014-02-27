module("Vaild Definitons");
test("Concrete Classes" , function() {

	/* Begin Test 1 */
	var Person = Class({
		private : {
			name : null,
			age : null,
		},
		public : {
			Name : {
				get : function() {
					return this.name;
				},
				set : function(value) {
					this.name = value;
				}
			},
			getAge : function() { return this.age; },
			setAge : function(a) { this.age = a; }
		}
	});
	ok(true , "Class Defined : no errors were thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	var House = Class({
		private : {
			height : null,
			width : null,
			depth : null,
			count : Static(0),
			getCount : Static(function() { return House.count;}),
		},
		protected : {
			color : "white",
		},
		public : {
			Area : Final(function() { return this.width*this.depth;}),
		}
	});
	ok(true , "Class Defined : no errors were thrown");
	/* End Test 2 */

	/* Begin Test 3 */
	var Car = Final.Class({
		private : {
			model : null,
		},
		public : {
			Model : {
				get : function(){return this.model;},
				set : function(value) {this.model = value;}
			}
		}
	});
	ok(true , "Class Defined : no errors were thrown");
	/* End Test 3 */
});

test("Abstract Classes" , function(){

	/* Begin Test 1 */
	var Shape = Abstract.Class({
		protected : {
			edge : null
		},
		public : {
			area : Abstract(function(){})
		}
	});
	ok(true , "Class Defined : no errors were thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	var Point = Class({
		private : {
			_x : null,
			_y : null,
			_z : null,
		},
		public : {
			Construct : function(x,y,z) {this._x = x;this._y = y; this._z = z;},
			X : {
				get : function(){return this._x},
				set : function(n){}
			},
			Y : {
				get : function(){return this._y},
				set : function(n){}
			},
			Z : {
				get : function(){return this._z},
				set : function(n){}
			}
		}
	});
	var Metric = Abstract.Class({
		protected : {
			rule : null
		},
		public : {
			distance : Abstract(Function.create(xTyped , [
				types(Point,Point),
				function(p,q){}
			]))
		}
	});
	ok(true , "Class Defined : no errors were thrown");
	/* End Test 2 */

	/* Begin Test 2 */
	var Empty = Class({});
	ok(true , "Class Defined : no errors were thrown");
	/* End Test 3 */
});

module("Invalid Definitons");
test("Inavlid Argument", function(){
	/* Begin Test 1 */
	throws(function() {
		var C = Class(function() {
			var b = 50;
			this.B = function() {
				return b;
			}
		});
	} , function(err) {
		return err.code === 201
	} , "a function sent instead of object : an error [code:201] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function() {
		var C = Class("INVALID");
	} , function(err) {
		return err.code === 201
	} , "a string sent instead of object : an error [code:201] was thrown");
	/* End Test 2 */
});

test("Unallowed Access Modifiers" , function(){

	/* Begin Test 1 */
	throws(function(){
		var C = Class({
			public :{},
			protected: {},
			private : {},
			privliged: {}
		})
	} , function(err) {
		return err.code === 202;
	}, "privliged is a not allowed access modifier : an error [code:202] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function(){
		var C = Class({
			static :{},
			public : {}
		});
	} , function(err) {
		return err.code === 202;
	}, "static is a not allowed access modifier : an error [code:202] was thrown");
	/* End Test 2 */
});

test("Setting non-static attributes to objects" , function() {
	/* Begin Test 1 */
	throws(function() {
		var Matrix = Class({
			private : {
				internal : new Array(),
			}
		});
	} , function(err) {
		return err.code === 206;
	} , "attempting to set an attribute to an array , an error [code:206] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function() {
		var Human = Class({
			protected : {
				genes : {}
			}
		});
	} , function(err) {
		return err.code === 206;
	} , "attempting to set an attribute to an object , an error [code:206] was thrown");
	/* End Test 2 */

	/* Begin Test 3 */
	throws(function() {
		var Test = Class({
			public : {
				Standards : new Object()
			}
		});
	} , function(err) {
		return err.code === 206;
	} , "attempting to set an attribute to an object , an error [code:206] was thrown");
	/* End Test 3 */
});

test("Duplicate component name" , function() {

	/* Begin Test 1 */
	throws(function(){
		var C = Class({
			private : {
				x : function(){}
			},
			public : {
				x : 0
			}
		});
	},function(err) {
		return err.code === 207
	} , "Duplicate names : an error [code:207] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function(){
		var C = Class({
			protected : {
				constructor : function(){}
			},
			public : {
				constructor : function(){}
			}
		});
	},function(err) {
		return err.code === 207
	} , "Duplicate names : an error [code:207] was thrown");
	/* End Test 2 */

	/* Begin Test 2 */
	throws(function(){
		var C = Class({
			protected : {
				func : function(a){return a}
			},
			private : {
				func : function(){}
			}
		});
	},function(err) {
		return err.code === 207
	} , "Duplicate names : an error [code:207] was thrown");
	/* End Test 2 */
});

test("Marking a function that has a body as abstract" , function() {
	/* Begin Test 1 */
	throws(function() {
		var C = Class({
			protected : {
				cFunc : Abstract(function() {return "Void"})
			}
		})
	} , function(err) {
		return err.code === 305;
	} , "attempting to mark a function abstract while having a body : an error [code:305] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function() {
		var C = Class({
			protected : {
				cFunc : Abstract(function Hello() {return "Void"})
			}
		})
	} , function(err) {
		return err.code === 305;
	} , "attempting to mark a function abstract while having a body : an error [code:305] was thrown");
	/* End Test 2 */

	/* Begin Test 3 */
	throws(function() {
		var C = Class({
			protected : {
				cFunc : Abstract(xTyped , [
					types(Number),
					function(a) {},
					types(Object , Number),
					function(a,b){return "void";}
				])
			}
		});
	} , function(err) {
		return err.code === 305;
	} , "attempting to mark a function abstract while having a body : an error [code:305] was thrown");
	/* End Test 3 */

	/* Begin Test 4 */
	throws(function() {
		var C = Class({
			protected : {
				cFunc : Abstract(xNonTyped , [
					function(a){},
					function(a,b) {return "Void";},
					function(a,b,c) {}
				])
			}
		});
	} , function(err) {
		return err.code === 305;
	} , "attempting to mark a function abstract while having a body : an error [code:305] was thrown");
	/* End Test 4 */	
});

test("Marking a final function abstract" , function(){

	/* Begin Test 1 */
	throws(function(){
		var C = Class({
			public : {
				cFunc : Abstract(Final(function(){}))
			}
		});
	},function(err) {
		return err.code === 304;
	} , "attempting to mark a final function abstract : an error [code:304] was thrown");
	/* End Test 1 */
});

test("Marking an abstract function as final" , function(){
	/* Begin Test 1 */
	throws(function(){
		var C = Class({
			public : {
				cFunc : Final(Abstract(function(){}))
			}
		})
	} , function(err){
		return err.code === 303;
	} , "attempting to mark an abstract function final : an error [code:303] was thrown");
	/* End Test 1 */
});



test("Marking a private method abstract" , function() {

	/* Begin Test 1 */
	throws(function(){
		var C = Class({
			private : {
				cFunc : Abstract(function(){})
			}
		});
	},function(err){
		return err.code === 203;
	} , "attempting to mark a private method abstract : an error [code:203] was thrown");
	/* End Test 1 */
});