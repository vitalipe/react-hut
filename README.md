# [ :Hut ]

**Hut is a tiny library that will make your React components pretty again!**

This library was heavily inspired by Clojure and specifically [Reagent](https://github.com/reagent-project/reagent) and was created out 
of my frustration with current "best practices" in React community, such as XML 
embeded in JS, polluting the UI tree with logic only components (HOCs), the use of ES6 classes, etc...

The core ideas behind this tiny library are:

0. **Every component tree is data**, and should be treated as such.
1. **Javascript is better than XML**, and no compile time is better than compile time (in JS).
2. **Creativity matters** - creating your own component DSL should be as simple as writing a function.
3. **No crazy ["wormholes"](https://twitter.com/dan_abramov/status/613477261740797952)** - simple data oriented approach, easy to understand, test and debug.

Hut stands for **H**iccup **U**I **T**ree, and half of this library is just that, [Hiccup](https://github.com/weavejester/hiccup) implemented in Javascript.
The other half is a minimal API for React components, both are independent, but work in synergy.

**(If you're simply looking for a JS Hiccup implementation as an external DSL, try [React.Hiccup](https://www.npmjs.com/package/react.hiccup))**


Table of Contents
=================
* [Hut in 2 Code Samples](#hut-in-2-snippets)
* [Installation](#installation)
* [Docs](#docs)  
  * [**.createHut()** - Hiccup in plain JS](#1-hiccup-in-plain-js-with-createhut)
    * [ClassName tricks with "class-lists" lib]()
      * [Building your Hut]()
      * [Customizing your Hut]()
         * [Transform API]()
  * [**.createHutView()** - Component API](#2-concise-component-api-with-createhutview)
    * [HutView() with a custom Hut]()
    * [Function components & displayName]()
* [F.A.Q](#faq)
* [Building &amp; Testing](#building--testing)


## Hut in 2 Code Samples

Hut implements Hiccup in plain JS, with arrays: 
```javascript
const H = ReactHut.createHut(React);

// inside any render
H([":ul",
    [":li", 1],
    [":li", 2],
    [":li", 3],
    [":li.last", {hidden : true}, "I have props! and the class-name last"]])
 ```
<br>


Hut also implements a concise component API, that can be used with (or without) Hiccup:
```jsx
const HutView = ReactHut.createHutView(H || React);


const GreetingWithTimer = HutView({

  props : {name : ""},
  state :{time : 0},

  tick() {this.setState(time : this.state.time + 1)},

  lifecycle : {
    willMount() { this._tickHandler = setInterval(this.tick, 1000) },
    willUnmount() {clearInterval(this._tickHandler)},
  },

   render({name}, {time}) {
    return [":div.greeating",
              [":label.message", "hello!", name, "I'm alive for", time, "seconds"]];
  }
});

```

**(for more examples look at the demo [todo-mvc app](https://github.com/vitalipe/react-hut/tree/master/test/todo-mvc))**

<br>


## Installation

Hut is a [UMD](https://github.com/umdjs/umd) module, you can use it pretty much in any Javascript environment.

With npm:
```javascript
vat ReactHut = require("react-hut");
```
<br>

With a script tag, download it form [/dist](https://github.com/vitalipe/react-hut/tree/master/dist) first, then:
```javascript
<script src="react-hut.js"></script>
<script>console.log(ReactHut);<script>
```

<br>


# Docs

## `.createHut()` - Hiccup in plain JS  
[Hiccup](https://github.com/weavejester/hiccup) is a popular notation (and library) for working with HTML, in Clojure. Hut simply implements Hiccup in plain Javascript.

Here's the list from the example above:
```javascript
[":ul",
    [":li", 1],
    [":li", 2],
    [":li", 3],
    [":li.last", {hidden : true}, "I have props! and the class-name last"]])
 ```

The same code with JSX:
```jsx
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li hidden={true} className="last">I have props! and the class-name last</li>
</ul>
```

As you can see, there are 4 simple rules here:

1. every component is an array, with the first element is the component.
2. if the 2nd arg is an object, it's treated like `props`.
3. the ...rest are `children`.
4. class names can be inlined so they look like CSS selectors.

<br>

#### ClassName tricks with "class-lists" lib

Because class names are very important, Hut comes with the awesome  [class-lists.js](https://github.com/joaomilho/class-lists) lib built-in:
```javascript
// Hut with class-lists built-in
["div.main.panel", {className : [[state.visible, 'is-visible', 'is-hidden'],
                                 [state.open, 'is-open', 'is-closed']]}];


// JSX:
<div className={classLists("main", "panel", [state.visible, 'is-visible', 'is-hidden'],
                                            [state.open, 'is-open', 'is-closed'])} / >

```
(but don't worry, everything can be easily overridden with transforms)


#### Building your Hut in 1 function call()

The ancient Sumerians used clay to create huts, poor bastards, today we have function calls!

```javascript
const H = ReactHut.createHut(React);

let MyList = () =>
    H(":ul",
         [":li", 1],
         [":li", 2])
```

### Customizing your Hut
This is where it gets interesting.

For the next example, let's say we want to add a custom property called `hidden` to every component, the current "best practice"
is to use a [wrapper component](http://reactpatterns.com/#proxy-component) (or some other voodoo).

**But there's a much better way!**

Because arrays are just data we can easily write a function that will transform this data recursively.
Our hut has built-in support for this goodness, it's called a.. `transform` function (and it takes care of recursion).

Try this:
```javascript
const removeAllWithHiddenProp = (fragment) => 
    (fragment[1] && fragment[1].hidden) ? null : fragment;  

const H = ReactHut.createHut(React, {transform : removeAllWithHiddenProp});

// sweet! now we can have our hidden prop everywhere!
H(":div",
      [MyListComponent {hidden : state.hidden}])
```

**A transform function is just a function that is called on each component definition.**

It can alter the component definition, return a new definition, log, or do nothing.  

Transform functions are really powerful because they allow you to define your own
DSL (domain specific language) for components. Think about them as a poor man's macros,
if Lisp macros are the great pyramids of Giza, a transform is a Sumerian clay hut ;)

#### Transform API

A transform function has the following API:
```javascript
function myTransform([element, props, ...children]) {...}
```

1. `element` -> the string name of a primitive, or a function for custom elements.
2. `props` -> an object with props, or `null`.
3. `childen` -> 0 or more children.

To make changes to the component tree, a transform can:

1. return a new array, with a different component definition.
2. mutate the array the was passed in.
3. return `null` to indicate that we don't want this element (and children) to be rendered. 
4. return a react element (`.reateElement()` or `H()`).


Your transform function will be called on every component definition, top down recursively, this means that 
it has full access to its children before they are evaluated.


<br>
<br>

## `.createHutView()` - Component API 
I personally find the new ES6 class components to be too verbose and clunky.
Especially given that fact that **I never actually had any real use for component inheritance**, even when I implemented
my own class system in ES5, [to leverage OOP patterns like the template method pattern](http://slides.com/vitaliperchonok/deck#/17/6).

Combined with minor annoyances such having to type crap like `getDefaultProps() {return {...}}`
when I just want `props : {...}` or doing `let state = this.state` inside every call to render()..
made me really sad, almost as sad as the ancient Sumerians.

So I came up with the following API for my own projects:
```javascript
// done one per app, just like creating a Hut:
const HutView = ReactHut.createComponentHut(H || React);

const MyComponent = HutView({

  // state and props can be an object or a function,
  // and are converted to getDefaultProps() & getInitialState()
  props : {}
  state : {}

  // lifecycle methods are in one place
  lifecycle : {
    willMount() {},
    didMount() {},
    willUnmount() {},
    willUpdate() {},  
    didUpdate() {},
    willReceiveProps() {}
  },

  shouldUpdate() {return true},

  // mixins are back, but feel free to use Higher(Order(Components))) instead
  mixins : [],

  // render() is a function of .porps & .state, so we pass them as args,
  // it works nicely with the new  destructuring syntax
  render(props,state) {
  
      if (you_like_XML) 
        return <div />
      else // note that if you use hiccup, you don't need to call H()
        return [":div"];
  }
});
```
**In practice, `HutView` is just a thin wrapper around `React.createClass`.**

HutView() will not restrict you of using `getInitialState()` or `componentDidMount()` 
for example, but when there is a conflict, it will simply throw an Error.

```javascript
// this is okay:
const My = HutView({
  getInitialState() {...},
  componentDidMount() {...}
  ...
});

// this is okay:
const My = HutView({
  state : {},
  componentDidMount() {...}
  ...
});

// this will throw an Error:
const My = HutView({
  state : {},
  getInitialState() {...},
  ...
});

```

If you want to restrict the API further, by all means, do it, 
you just need to wrap it in a function.



### HutView() with a custom Hut
When you create yourself a component factory, you can pass it an existing `H` 
with all your custom transforms, or just `React` and it will create it's own private hut, with blackjack! and... hookers!

```javascript
// custom HutView:
const H = ReactHut.createHut(React, {transform : removeAllWithHiddenProp});
const HutViewWithCustomTransforms = ReactHut.createHutView(H);

// both are the same:
const DefaultHutView = ReactHut.createHutView(React);
const DefaultHutView = ReactHut.createHutView(ReactHut.createHut(React));
});


```

### Function components & displayName

It's possible to pass a function to `HutView()`:
```javascript
const MyPureMessage = HutView(({msg}) => [":div.top", ["label.msg", msg]]);
```

The problem with the above code is that it will loose it's `displayName`.
React will try to look up the `.displayName` & `.name` props on the 
function object, and because `.name` prop is set automatically by the JS engine, it 
will show up as empty when wrapped in a function call (`HutView(...)`), this is 
also the reason that minification will screw with display names... 

To keep `displayName`, you can do this:
```javascript
const MyPureMessage = HutView("MyPureMessage", ({msg}) => [":div.top", ["label.msg", msg]]);
// or this:
MyPureMessage.displayName = "MyPureMessage";
```

My preferred way is to just use `H()` for function components:
```javascript
const MyPureMessage = ({msg}) => H([":div.top", ["label.msg", msg]]);

```



<br>


## F.A.Q

### What's wrong with JSX?

Many things, mainly the &lt;XML&gt;syntax&lt;/XML&gt;, the lack of extensions, the {weird
integration with JS}, and above all is the fact that it doesn't provide
me anything useful that plain JS can't provide!

I suspect that many people (me included), tolerated JSX because of the lack of "immediate" alternatives, 
and some that claim to "love it", are probably affected by the ["cognitive ease bias"](https://youtu.be/cebFWOlx848). Lisp users know this as the 
"WTF?! you moved my parenthesis, your language sucks!" effect. 

But that's ok, don't feel bad, I just ported an idiomatic pattern from a much 
better language (Clojure) into a shitty language that I'm more familiar 
with (but less productive), so I'm not judging ;)       

### Why not an external DSL, like [KV](https://kivy.org/docs/guide/lang.html) for example?

Good DSLs are **hard to design**, good DSLs that are useful for many different projects are **really hard to design**.

I'll need to invest a lot of time and effort to design one that doesn't suck, time that I can spend on building applications.
Besides, I'll just end up inventing [another LISP dialect](https://racket-lang.org/) ;) 


### Is it tested?

Yes, [you can look at the specs](https://github.com/vitalipe/react-hut/tree/master/test/spec), or run them with `npm test`, and try the todo-mvc demo app.
There are also micro-benchmarks that mostly test performance edge cases (`npm run benchmark`), 
and 100% test coverage (`npm run test-cover`).

Having said that, note that this particular code was never used in production.


### No compile time, isn't it slow?

Not really.. creating arrays, and looping is really cheap.

The overhead is in the 6%-15% range for a [todo-mvc app](https://github.com/vitalipe/react-hut/blob/master/test/micro-benchmarks/todo-mvc.js).
```
• test/micro-benchmarks/todo-mvc.js:

  • A todo-MVC app with 15 todo items..

    ✔  H()                   34,010.01  ops/sec  ±3.04%  (75 runs)   -8.56%
    ✔  raw .createElement()  37,193.57  ops/sec  ±3.63%  (66 runs)  fastest

  • A todo-MVC app with 100 todo items..

    ✔  H()                   33,965.06  ops/sec  ±2.96%  (73 runs)  -11.86%
    ✔  raw .createElement()  38,534.22  ops/sec  ±3.11%  (73 runs)  fastest
```

Basically, it means that for each 10 elements, you have an overhead of 1
`.createElement()` call per render (not a full blown component!) that's nothing to worry about really..

You can run the micro-benchmarks yourself (`npm run benchmark`),
just note that I created them for testing crazy edge cases, and only optimized
for the todo-mvc example.

### Can I use only `HutView()` or `H()` ? 

Sure, there is nothing that really couples them, initially I only wanted to create the Hiccup part,
but I just can't stand ES6 classes, and I really want a plug & play library...

Hut is super tiny, it's about 3.1k with class-lists included, but you can easily 
customize the build, just look here, and if you need any help, let me know. 


### How does it differ from Hiccup?

Well.. obviously there are no labels in JS, also there are only vectors 
(arrays), no list type (e,g `.map` returns an array)...

There are 2 other things that I didn't implement:

1. No inline IDs (`["div#my-div"]`), only classes, because it's not common to use IDs with React.
2. No wrapper element collapse like with Reagent (no `[":div>:span>:label"]`). 

Both can be easily implemented with transforms.


## Building & Testing

It's very easy to customize Hut, just clone the repo, and run:

```bash
> npm test             # run unit tests against prod build
> npm run  watch       # watch, dev build & run tests 
> npm run  test-cover  # check test coverage  
> npm run  benchmark   # run all micro-benchmarks  
> npm run  build-dev   # unminified dev build
> npm run  build-prod  # build with google closure compiler
> npm run  dist        # build into /dist
```




