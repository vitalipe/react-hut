# react-hut

Hut is a tiny library that will make your render() functions pretty again.


It stands for **H**iccup **U**I **T**ree, and it's just that, [Hiccup](https://github.com/weavejester/hiccup) implemented in Javascript.
The main idea of hut is to use plain Javascript to represent UI components, and 
treat your component tree as data.

**(If you're looking for a JS Hiccup implementation as an extrenal DSL, try [React.Hiccup](https://www.npmjs.com/package/react.hiccup))**

With Hut, we get the following benefits:

* No need for any external compilation tools.
* Easy to extend - just write a simple function.
* Very easy to debug and understand, no wrapper components voodoo, just data.
* Familiar to any JS developer- if you're familiar with arrays and functions, you're familiar with Hut.  

<br>

## Basic Example
Here's an example of a simple list:
```javascript
[":ul", 
   [":li", 1],
   [":li", 2],
   [":li", 3],
   [":li", {hidden : true}, "I have props!"]]
 ```
As you can see, there are 3 simple rules here:

1. every component is an array, with the first element is the component.
2. if the 2nd arg is an object, it's treated like `props`.
3. the rest are `children`.

**That's it!**

Well... almost... there is one more thing, because class-names are important, It's possible to inline them so they look like CSS selectors, 
and the awesome  class-lists.js lib is built into Hut (can be easily replaced if you prefer `classNames()`)

Here's an example with inline class names and `class-lists`:
```javascript
[":ul", {className : [[state.visible, 'is-visible', 'is-hidden'],
                      [state.open, 'is-open', 'is-closed']]},
   
   [":li.item.first", 1],
   [":li.item", 2],
   [":li.item", 3]]
```


The same code with JSX:
```jsx
<ul className={classlists([state.visible, 'is-visible', 'is-hidden'],
                          [state.open, 'is-open', 'is-closed'])}>
  
  <li className="item first">1</li>
  <li className="item">2</li>
  <li className="item">3</li>
</ul>
```


    
<br>    

## Real World Example
Here's a more complete example:
```javascript
[":main",
    [":ul.item-list", {className : [
                        [state.visible, 'is-visible', 'is-hidden'],
                        [state.open, 'is-open', 'is-closed']]},  
       
       [":li.menu-item", {onClick : navigateToSettings}, "settings screen"],
       [":li.menu-item", {onClick : navigateToMain}, "main screen"],
       
       options
           .map(({title, id}) => [":li.menu-item.dynamic-item", {key : id }, title])],
       
    [LogoutButton, {onClick : logout}, "logout"]]
```

The same code with JSX:
```jsx
<main>
    <ul className={classlists("my-list", [visible, 'is-visible', 'is-hidden'],
                                         [open, 'is-open', 'is-closed'])}>
        
        <li className="menu-item" onClick={navigateToSettings}>settings screen</li>
        <li className="menu-item" onClick={navigateToMain}>main screen</li>
        
        { 
          options
            .map(({title, id}) => <li key={id} className="menu-item dynamic-item">{title}</li>
        }
    </ul>
    
    <LogoutButton onClick={app.logout}>logout</LogoutButton>
</main>
```

<br>


## Basic usage

<br>

## Writing Extensions

## F.A.Q
