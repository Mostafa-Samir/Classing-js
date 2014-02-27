var Creature = Class({
	private : {
		counter : Static(0),
		species : null,
		copy : function(other) {
			this.species = other.species;
			this.name = other.name;
		}
	},
	protected : {
		name : null,
		combineInfo : function() {
			return this.species + " : " + this.name;
		}
	},
	public : {
		Construct : Function.create(xTyped , [
			types(),
			function() {
				this.id = Date.now() + ":" + Creature.counter;
				Creature.counter ++;
				this.species = "unknown";
				this.name = "unknown";
			},
			types(String , String),
			function(sp , nm) {
				this.id = Date.now() + ":" + Creature.counter;
				Creature.counter ++;
				this.species = sp;
				this.name = nm;
			},
			types(xSelf),
			function(other) {
				this.id = Date.now() + ":" + Creature.counter;
				Creature.counter ++;
				this.copy(other);
			}
		]),

		Species : {
			get : function() {
				return this.species;
			},
			set : function() {}
		},

		Name : {
			get : function() {
				return this.name;
			},
			set : Function.create(xTyped , [
				types(String),
				function(nm) {
					this.name = nm;
				}
			])
		},

		getInfo : function() {
			return this.combineInfo();
		},

		getCount : Static(function() {
			return Creature.counter;
		}),

		id : 0
	}
});

var abstractClass = Abstract.Class({
	public : {
		abstractMethod : Abstract(function(){})
	}
})

var User;

test("Consructing Objects" , function() {

	var checkReference = "";

	// 0-arguments constructor
	var Unknown = new Creature();
	checkReference = Unknown.Species + "," + Unknown.Name; //should be "unknown,unknown"
	ok(checkReference === "unknown,unknown" , "Object Constructed Correctly : 0-arguments constructor ");

	// 2-arguments constructor
	User = new Creature("Homo sapien" , "John Doe");
	checkReference = User.Species + "," + User.Name; //should be "Homo sapien,John Doe"
	ok(checkReference === "Homo sapien,John Doe" , "Object Constructed Correctly : 2-arguments constructor ");

	// copy constructor
	var UserTwin = new Creature(User);
	checkReference = User.Species + "," + User.Name; //should be "Homo sapien,John Doe"
	ok(checkReference === "Homo sapien,John Doe" , "Object Constructed Correctly : copy constructor calling the private function 'copy'");

	//creating an object form abstract class
	throws(function(){
		return new abstractClass();
	} , function(err) {
		return err.code === 211;
	} , 'instantiating from an abstract class failed : an error [code:211] was thrown');
});

module("Access to Private Components");
test("Direct Calling" , function() {
	ok(User.species === undefined , "User.species returned undefined");
	throws(function() {
		User.copy(User)
	} , function(err) { 
		return err instanceof TypeError
	} , "User.copy(User) threw an error : Object has no method 'copy' ");
	throws(function() {
		return Creature.counter;
	} , function(err) {
		return err.code === 213;
	} , "Creature.counter (private static) threw an error : inaccessable member");
});

test("Indirect Calling through public Components" , function() {
	User.Species = "Homo Erectus";
	ok(User.Species === "Homo sapien" , "the public property 'User.Species' accessed the private attribute 'species' , changing it to 'Homo Erectus' didn't take place because the setter function of property performs no action");

	ok(true , "the private function 'copy' is accessed in the public copy constructor in 'Consructing Objects:3' ");

	ok(Creature.getCount() === 3 , 'priavte static "counter" is accessed through the public static function "getCount"');
});

module("Access to Protected Components");
test("Direct Calling", function() {
	ok(User.name === undefined , "User.name returned undefined");
	throws(function() {
		User.combineInfo();
	} , function(err) { 
		return err instanceof TypeError
	} , "User.combineInfo() threw an error : Object has no method 'combineInfo' ");
});

test("Indirect Calling through public Components" , function(){
	User.Name = "Jane Doe";
	ok(User.Name === "Jane Doe" , "the public property 'User.Name' accessed the protected attribute 'name' and changed it to 'Jane Doe'");

	ok(User.getInfo() === "Homo sapien : Jane Doe" , "the public method 'getInfo' invoked the protected method 'combineInfo'");
});

module("The Publics");
test("the public attribute" , function() {
	var id = User.id;
	var reg = new RegExp(/[0-9]+:[0-9]+/);
	ok(reg.test(id) , "the public attribute 'id' works correctly")
})