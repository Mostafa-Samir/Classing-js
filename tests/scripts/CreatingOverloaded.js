module("Non-Typed Overloading");
test("Valid Defintions" , function(){
	/* Begin Test 1 */
	var f1 = Function.create(xNonTyped , [function(a,b){return a + b} , function(a,b,c) {return a*b + c;}]);
	ok(true , "No errors thrown : Overloaded function created");
	/* End Test 1 */

	/* Begin Test 2 */
	var f2 = Function.create(false , [function(){return "Void"} , function(a){return a;}]);
	ok(true , "No errors thrown : Overloaded function created");
	/* End Test 2 */

	/* Begin Test 3 */
	var f3 = Function.create(xNonTyped , [function(){console.log('Hello')} , function(name){console.log('Hello, ' + name)}]);
	ok(true , "No errors thrown : Overloaded function created");
	/* End Test 3 */
});

module("Non-Typed Overloading : Invalid Defintions");
test("Invalid Arguments" , function() {
	/* Begin Test 1 */
	throws(function(){
		var f = Function.create();
	} , function(err) {
		return err.code === 100
	} , "no arguments sent to Function.create : an error [code:100] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function(){
		var f = Function.create(false);
	} , function(err) {
		return err.code === 100
	} , "only one argument sent to Function.create : an error [code:100] was thrown");
	/* End Test 2 */

	/* Begin Test 3 */
	throws(function(){
		var f = Function.create(false , [function(){}] , "extra" , "arguments");
	} , function(err) {
		return err.code === 100
	} , "extra arguments sent to Function.create : an error [code:100] was thrown");
	/* End Test 3 */

	/* Begin Test 4 */
	throws(function(){
		var f = Function.create("false" , [function(){return "void"}]);
	} , function(err) {
		return err.code === 100
	} , "mode variable sent to Function.create as string : an error [code:100] was thrown");
	/* End Test 4 */

	/* Begin Test 5 */
	throws(function(){
		var f = Function.create(false , function(){});
	} , function(err) {
		return err.code === 100
	} , "overloads variable sent to Function.create as function : an error [code:100] was thrown");
	/* End Test 5 */

});

test("Invalid Array Format" , function(){

	/* Begin Test 1 */
	throws(function(){
		var f = Function.create(false , []);
	} , function(err) {
		return err.code === 101
	} , "overloads array sent to Function.create with empty : an error [code:101] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function(){
		var f = Function.create(false , [function(){return "void"} , "function(a){}" , function(a,b){return a+b;}]);
	} , function(err) {
		return err.code === 101
	} , "overloads array sent to Function.create with a non-function element (a string) : an error [code=101] was thrown");
	/* End Test 2 */
});

test("Duplicates" , function() {

	/* Begin Test 1 */
	throws(function(){
		var f = Function.create(false , [function(){return "void"} , function(){return "Void";}]);
	} , function(err) {
		return err.code === 106
	} , "two functions with same number of arguemnts(0) exist : an error [code:106] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function(){
		var f = Function.create(false , [function(a,b,c){return ;} , function(a,b,c){return "Void";}]);
	} , function(err) {
		return err.code === 106
	} , "two functions with same number of arguemnts(3) exist : an error [code:106] was thrown");
	/* End Test 2 */
});

module("Typed Overloading");
test("Valid Defintions" , function() {

	/* Begin Test 1 */
	var f1 = Function.create(xTyped , [types(Number , Number) , function(a,b) {return a + b}]);
	ok(true , "No errors thrown : Overloaded function created");
	/* End Test 1 */

	/* Begin Test 2 */
	function DataHolder(_type , _data) { this.type = _type; this.data = _data; }
	var f2 = Function.create(true , [types(DataHolder) , function(D) {console.log(D.data + ":" + D.type)}]);
	ok(true , "No errors thrown : Overloaded function created");
	/* End Test 2 */

	/* Begin Test 3 */
	var Point2D = function(_x , _y) {this.x = _x; this.y = _y;}
	classing.xStamp(Point2D);
	var f3 = Function.create(xTyped , [types(Point2D) , function(p) { console.log(0)} , types(Point2D,Point2D) , function(p,q) { return Math.sqrt(Math.pow(p.x-q.x , 2) + Math.pow(p.y-q.y , 2))}]);
	ok(true , "No errors thrown : Overloaded function created");
	/* End Test 3 */

});

module("Typed Overloading : Invalid Defintions");

test("Invalid Type" , function() {

	/* Begin Test 1 */
	throws(function() {
		var f = Function.create(xTyped , [types(Math), function(k) {return k.sqrt;}]);
	},function(err) {
		return err.code === 103;
	} , "a non constructor function (the 'Math' object) was sent to types : an error [code:103] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function() {
		var Obj = {x : 50};
		var f = Function.create(xTyped , [types(Obj), function(k) {return k.sqrt;}]);
	},function(err) {
		return err.code === 103;
	} , "a non constructor function (custom object) was sent to types : an error [code:103] was thrown");
	/* End Test 2 */

	/* Begin Test 3 */
	throws(function() {
		var Obj = {x : 50};
		var f = Function.create(xTyped , [types("Number"), function(k) {return k.sqrt;}]);
	},function(err) {
		return err.code === 103;
	} , "a non constructor function (a string) was sent to types : an error [code:103] was thrown");
	/* End Test 3 */

});

test("Invalid Array Format" , function(){

	/* Begin Test 1 */
	throws(function(){
		var f = Function.create(true , []);
	} , function(err) {
		return err.code === 101;
	} , "overloads array sent to Function.create empty : an error [code:101] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function(){
		var f = Function.create(true , [types(Number) , function(a){} , types(Function)]);
	} , function(err) {
		return err.code === 101;
	} , "length of overloads array sent to Function.create is not even(a missing type list or a missing function) : an error [code:101] was thrown");
	/* End Test 2 */

	/* Begin Test 3 */
	throws(function(){
		var f = Function.create(true , [function(a){} , types(Number)]);
	} , function(err) {
		return err.code === 101;
	} , "expected an _xTypes Object found a function : an error [code:101] was thrown");
	/* End Test 3 */

	/* Begin Test 4 */
	throws(function(){
		var f = Function.create(true , [types(Number) , types(Boolean)]);
	} , function(err) {
		return err.code === 101;
	} , "expected a function found an _xTypes Object : an error [code:101] was thrown");
	/* End Test 4 */

	/* Begin Test 5 */
	throws(function(){
		var f = Function.create(true , [types(Number) , "function(a){}"]);
	} , function(err) {
		return err.code === 101;
	} , "neither a function nor an _xTypes Object found (a String) : an error [code:101] was thrown");
	/* End Test 5 */

	/* Begin Test 6 */
	throws(function(){
		var f = Function.create(true , [741 , function(a) {return;}]);
	} , function(err) {
		return err.code === 101;
	} , "neither a function nor an _xTypes Object found (a Number) : an error [code:101] was thrown");
	/* End Test 6 */
});

test("Types-Arguments Number Mismatch" , function(){

	/* Begin Test 1 */
	throws(function() {
		var f = Function.create(xTyped , [types(Number) , function() { return "void"}]);
	} , function(err){
		return err.code === 102;
	}, "1 type was specified , 0 parameters found in associated function : an error [code:102] was throws");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function() {
		var f = Function.create(xTyped , [types(Number,Object,String) , function(a,b,v,g) { return "void"}]);
	} , function(err){
		return err.code === 102;
	}, "3 types was specified , 4 parameters found in associated function : an error [code:102] was throws");
	/* End Test 2 */
});

test("Duplicates" , function(){

	/* Begin Test 1 */
	throws(function(){
		var f = Function.create(xTyped , [types(Number,Number) , function(a,b){return a+b;} , types(Number,Number), function(a,b) {return a*b;}]);
	}, function(err){
		return err.code === 106;
	} , "two function had the 'Number,Number' parameter list : an error [code:106] was thrown");
	/* End Test 1 */

	/* Begin Test 2 */
	throws(function(){
		var f = Function.create(xTyped , [types(Function,Object,String) , function(func,Obj,name){return obj[name] = func ;} , types(Function,Object,String), function(func,obj,name) {func[name] = obj;}]);
	}, function(err){
		return err.code === 106;
	} , "two function had the 'Function,Object,String' parameter list : an error [code:106] was thrown");
	/* End Test 2 */
});