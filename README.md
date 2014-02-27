#Classing{js}
Javascript's prototypal object oriented style, although powerful, is tedious, specially for those who come to javascript
from a classical object oriented language like C++, Java or C#.<br/>
<b>Classing{js}</b> is created to solve this problem by creating a classical-like OOP interface that behaves almost exactly
like any regular classical object oriented environment.<br/>
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
Visit the the library's website for more info : www.classingjs.co.nf <br/>
Start a quick tutorial to learn how to use the library : www.classing.co.nf/tutorial <br/>
Follow <b>Classing{js}</b> on <a href = "https://twitter.com/classing_js">Twitter</a> to keep up with what's new.

##Your Contributions are Valuable
There's a lot more to be done in <b>Classing{js}</b>, and your contribution will certailny help acheving this whether it is :
<ul>
<li>a bug report.</li>
<li>a code optimization.</li>
<li>a new feature.</li>
<li>an expansion to other javascript platform.</li>
</ul>
