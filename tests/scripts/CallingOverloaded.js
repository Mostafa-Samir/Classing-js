//The non typed overloaded testing function
var joinWith = Function.create(xNonTyped , [
	function(joinChar , a , b) {
		var emptyStr = "";
		return emptyStr + a + joinChar + b;
	},
	function(joinChar ,a,b,c) {
		var emptyStr = "";
		return emptyStr + a + joinChar + b  + joinChar + c;
	},
	function(joinChar , a,b,c,d,f,g) {
		var emptyStr="";
		return emptyStr + a + joinChar + b + joinChar + c + joinChar + d + joinChar + f + joinChar + g;
	}
]);

//Custom constuctor function for testing automatic type recognition
function Complex(re , img ) {
	this.real = re;
	this.imaginary = img;
}

//Custom constructor for testing stamped type recognition
var Human = function(a) {
	this.age = a;
}
xStamp(Human);

//The typed overloaded testing function
var Add = Function.create(xTyped , [
	types(Number,Number),
	function(a,b) {
		return a + b ;
	},
	types(Array,Array),
	function(A,B) {
		if(A.length === B.length) {
			var C = new Array(A.length);
			for(var i = 0 ; i < A.length ; i++) {
				C[i] = A[i] + B[i];
			}
			return C;
		}
	},
	types(Complex,Complex),
	function(Z,W) {
		var newReal = Z.real + W.real;
		var newImaginary = Z.imaginary + W.imaginary;
		return new Complex(newReal , newImaginary);
	},
	types(Human,Human),
	function(H1,H2) {
		return new Human(H1.age + H2.age);
	}
]);

module('Non-typed Overloading');
test('Valid Calls' , function() {
	equal(joinWith("," ,19 , "Hello") , '19,Hello' , 'called joinWith("," ,19 , "Hello") , returned "19,Hello"');
	equal(joinWith("+" , -7 , "Testing" , 50) , "-7+Testing+50" , 'called joinWith("+" , -7 , "Testing" , 50) , returned "-7+Testing+50"');
	equal(joinWith(-12.2 , "k" , 0 , "Unit" , "$" , 80 , "?" ) , 'k-12.20-12.2Unit-12.2$-12.280-12.2?' , 'called joinWith(-12.2 , -"k" , 0 , "Unit" , "$" , 80 , "?" ) , returned "k-12.20-12.2Unit-12.2$-12.280-12.2?"');
});

test('Inavlid Calls' , function(){
	throws(function() {joinWith();} , function(err){return err.code === 105} , "called joinWith() , threw an error [code : 105] , no overloaded instance matches the 0 arguments list");
	throws(function() {joinWith('x');} , function(err){return err.code === 105} , "called joinWith('x') , threw an error [code : 105] , no overloaded instance matches the 1 arguments list");
	throws(function() {joinWith(1 , 2);} , function(err){return err.code === 105} , "called joinWith(1 , 2) ,  threw an error [code : 105] , no overloaded instance matches the 2 arguments list");
	throws(function() {joinWith('*',1 , 2 , 3 , 4);} , function(err){return err.code === 105} , "called joinWith('*',1 , 2 , 3 , 4) , threw an error [code : 105] , no overloaded instance matches the 5 arguments list");
	throws(function() {joinWith(1 , 2,-7,8,10);} , function(err){return err.code === 105} , "called joinWith(1 , 2,-7,8,10) , threw an error [code : 105] , no overloaded instance matches the 5 arguments list");
	throws(function() {joinWith(1 , 2,-7,8,10,1.6);} , function(err){return err.code === 105} , "called joinWith(1 , 2,-7,8,10,1.6) , threw an error [code : 105] , no overloaded instance matches the 6 arguments list");
	throws(function() {joinWith('p',1 , 2,7,98,78,64,-6);} , function(err){return err.code === 105} , "called joinWith('p',1 , 2,7,98,78,64,-6) , threw an error [code : 105] , no overloaded instance matches the 8 arguments list");
	throws(function() {joinWith('~',1 , 2,7,98,78,64,-6,878.655,-946.3,100);} , function(err){return err.code === 105} , "called joinWith('~',1 , 2,7,98,78,64,-6,878.655,-946.3,100) , threw an error [code : 105] , no overloaded instance matches the 11 arguments list");
});

module('Typed Overloading');
test('Valid Calls' , function(){
	equal(Add(40 , 169.6) , 209.6 , 'called Add(40,169.6) , returned 209.6 {Native type "Number" Recognized}');
	deepEqual(Add([1 , 5 , 9] , [-1 , 70 , -136.8]) , [0 , 75 , -127.80000000000001] , 'called Add([1 , 5 , 9] , [-1 , 70 , -136.8]) , returned [0 , 75 , -127.8] {Native type "Array" Recognized}');
	deepEqual(Add(new Complex(1 , 0) , new Complex(5 , -19.68)) , new Complex(6 , -19.68) , 'called Add(new Complex(1 , 0) , new Complex(5 , -19.68)) , returned Complex {real:6 , imaginary:-19.68} {Custom type "Complex" Recognized via automatic recognition}');
	deepEqual(Add(new Human(50) , new Human(27.25)) , new Human(77.25) , 'called Add(new Human(50) , new Human(27.25)) , returned Human{age:77.25} {Custom type "Human" Recognized via stamped recognition}');
});

test('Inavlid Calls' , function(){
	throws(function(){Add(true , false);} , function(err) {return err.code === 105} , "called Add(true , false) , threw an error [code:105] , no overloaded instance matches the 'Boolean,Boolean' argument list");
	throws(function(){Add(function(){});} , function(err) {return err.code === 105} , "called Add(function(){}) , threw an error [code:105] , no overloaded instance matches the 'Function' argument list");
	throws(function(){Add("K" , "KO" , "LO");} , function(err) {return err.code === 105} , "called Add('K' , 'KO' , 'LO') , threw an error [code:105] , no overloaded instance matches the 'String,String,String' argument list");
	throws(function(){Add(11 , 18 , 7);} , function(err) {return err.code === 105} , "called Add(11,18,7) , threw an error [code:105] , no overloaded instance matches the 'Number,Number,Number' argument list");
	throws(function(){Add(11);} , function(err) {return err.code === 105} , "called Add(11) , threw an error [code:105] , no overloaded instance matches the 'Number' argument list");
	throws(function(){Add(11 , 'x');} , function(err) {return err.code === 105} , "called Add(11,'x') , threw an error [code:105] , no overloaded instance matches the 'Number,String' argument list");
	throws(function(){Add(new Error() , 7);} , function(err) {return err.code === 105} , "called Add(new Error(),7) , threw an error [code:105] , no overloaded instance matches the 'Error,Number' argument list");
	throws(function(){Add([1,2,5,8]);} , function(err) {return err.code === 105} , "called Add([1,2,5,8]) , threw an error [code:105] , no overloaded instance matches the 'Array' argument list");
	throws(function(){Add([1,2,5,8] , [7 , 59 , 75 , 0] , [70 , -1 , 1326.878 , 1] , [0,0,1,-1]);} , function(err) {return err.code === 105} , "called Add([1,2,5,8] , [7 , 59 , 75 , 0] , [70 , -1 , 1326.878 , 1] , [0,0,1,-1]) , threw an error [code:105] , no overloaded instance matches the 'Array,Array,Array,Array' argument list");
	throws(function(){Add(new Complex(7 , 10));} , function(err) {return err.code === 105} , "called Add(new Complex(7,10)) , threw an error [code:105] , no overloaded instance matches the 'Complex' argument list");
	throws(function(){Add(new Complex(7 , 10) , new Complex(0 , -9) , "Hello");} , function(err) {return err.code === 105} , "called Add(new Complex(7,10) , new Complex(0 , -9) , 'Hello') , threw an error [code:105] , no overloaded instance matches the 'Complex,Complex,String' argument list");
	throws(function(){Add(new Human(78) , new Human(19) , 5 , new Human(50));} , function(err) {return err.code === 105} , "called Add(new Human(78) , new Human(19) , 5 , new Human(50)) , threw an error [code:105] , no overloaded instance matches the 'Human,Human,Number,Human' argument list");
});