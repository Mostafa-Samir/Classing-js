#Classing{js}
Javascript's prototypal object oriented style, although powerful, is tedious, specially for those who come to javascript
from a classical object oriented language like C++, Java or C#.<br/>
<b>Classing{js}</b> is created to solve this problem by creating a classical-like OOP interface that behaves almost exactly
like any regular classical object oriented environment.<br/>
#Features
<ul>
<li><p>Typed and non-typed function overloading with the ability to recognize custom types.</p></li>
<li><p>Creating All types of classes : concrete , final concrete and abstract.</p></li>
<li><p>Defining components in any of the three access levels : private , protected and public.</p></li>
<li><p>Defining abstrcat and final methods.</p></li>
<li><p>Defining static components.</p></li>
<li><p>Extending any non-final class.</p></li>
<li><p>Overriding non-final methods in derived classes.</p></li>
<li><p>Accessing the base class constructor and components through the keyword <code>base</code>.</p></li>
<li><p>Creating and implemeting mutiple interfaces.</p></li>
</ul>


Here's an example of what you can do with <b>Classing{js}:</b>
``` javascript
var Shape = Abstract.Class({
    public : {
        Area : Abstract(function(){}),
        Circumference : Abstract(function(){})
    }
});
var Circle = Class.Extends(Shape)({
    private : {
        raduis : null
    },
    public : {
        Radius : {
            get : function(){return this.raduis},
            set : function(value){this.raduis = value}
        },
        Area : function() {return Math.PI*this.raduis*this.raduis;},
        Circumference : function(){return 2*Math.PI*this.raduis;}
    }
});
```
Visit the the library's <a href="mostafa-samir.github.io/classingjs/">website</a> for more info<br/>
Start a quick <a href="mostafa-samir.github.io/classingjs/tutorial/">tutorial</a> to learn how to use the library  <br/>
Follow <b>Classing{js}</b> on <a href = "https://twitter.com/classing_js">Twitter</a> to keep up with what's new.

##Your Contributions are Valuable
There's a lot more to be done in <b>Classing{js}</b>, and your contribution will certailny help acheving this whether it is:
<ul>
<li>a bug report.</li>
<li>a code optimization.</li>
<li>a new feature.</li>
<li>an expansion to other javascript platform.</li>
</ul>
