# Calio IE11 Support

> ### I am offering these instructions as a convenience. IE11 is not officially supported and I _do not_ guarantee that these instructions will remain an option for future updates to Calio.

#### 1. Make sure you're transpiling your javascript with something like [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)

#### 2. Include polyfills for the following Array methods.

- [Array.prototype.fill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#Polyfill)
- [Array.prototype.includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill)
- [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#Polyfill)
- [Array.prototype.findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#Polyfill)

This can be handled automatically if you are using [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).

#### 3. Add the following minimum styling that works in IE11
**Note:** The default specificity for the Calio styles is not very high. However, in the following CSS, the `#calio` selector has been added to the styles to ensure they overwrite any built-in styles. Any additional selector should work in it's place.

```css
#calio .calio {
    display: block;
    width: 100%;
    overflow: hidden;
    text-align: center;
    user-select: none;
}

#calio .calio-head {
    color: #333;
    font-weight: bold;
}

#calio .calio-head,
#calio .calio-day {
    display: block;
    cursor: pointer;
    color: #333;
    width: 2.25rem;
    line-height: 2rem;
    float: left;
}

#calio .calio-head:nth-child(7n + 1),
#calio .calio-day:nth-child(7n + 1) {
    clear: left;
}

#calio .calio-day:hover {
    color: #333;
    background: #EEE;
}

#calio .calio-day.is-today {
    font-weight: 900;
}

#calio .calio-day.is-prev,
#calio .calio-day.is-next {
    color: #CCC;
    background: transparent;
}

#calio .calio-day.is-disabled {
    pointer-events: none;
    color: #CCC;
    background: transparent;
    opacity: 0.5;
}

#calio .calio-day.is-ranged {
    color: white;
    background: rgba(100, 149, 237, 0.66);
}

#calio .calio-day.is-active {
    color: white;
    background: rgb(100, 149, 237);
}
```
