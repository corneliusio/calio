# Calio

[![Github file size](https://img.shields.io/github/size/corneliusio/calio/dist/calio.min.js.svg?style=flat-square)]() [![gzip file size](http://img.badgesize.io/https://unpkg.com/calio/dist/calio.min.js?compression=gzip&label=gzip&style=flat-square)]() [![license](https://img.shields.io/github/license/corneliusio/calio.svg?style=flat-square)](https://github.com/corneliusio/calio/blob/master/LICENSE)

Calio is an unopinionated date picker built for modern browsers using [Svelte](https://svelte.technology/).  
What does that mean? Zero-dependency, vanilla JS that is lean and ready to use where ever you need a date picker.

---

## Browser support

| Chrome | Edge | Firefox | Safari / iOS | UC Android | Samsung |
| ------ | ---- | ------- | ------------ | ---------- | ------- |
| 60+    | 14+  | 53+     | 10+          | 11+        | 6+      |

**Note: This module does not support IE.**

---

## Usage

```shell
npm install calio --save
```

```js
import Calio from 'calio';
```

or manually include `calio.min.js` in your HTML:

```html
<script src="https://unpkg.com/calio/dist/calio.min.js"></script>
```

Then, instantiate your date picker!

```js
new Calio('#calio');
```

---

## Examples

You may notice at this point that this really is **just a date picker**. Where's the navigation? What about the currently month being viewed? These are not imposed on you out of the box, but can easily be added in *whatever way works best for your design*. Here are a couple striped down examples of how you may integrate Calio into your project, more API details can be found further below.

### Navigation
```html
<button class="prev">Prev</button>
<button class="today">Today</button>
<button class="next">Next</button>

<div id="calio"></div>

<script src="https://unpkg.com/calio/dist/calio.min.js"></script>
<script>
    const calio = new Calio('#calio');

    document.querySelector('.today').addEventListener('click', event => calio.goToToday());
    document.querySelector('.prev').addEventListener('click', event => calio.goToLastMonth());
    document.querySelector('.next').addEventListener('click', event => calio.goToNextMonth());
</script>
```

That wasn't too bad, was it!

### Current
Displaying things like the current selection or view is pretty easy too.
```html
<h4 class="viewing"></h4>
<div id="calio"></div>
<h5 class="selected"></h5>

<script src="https://unpkg.com/calio/dist/calio.min.js"></script>
<script>
    const calio = new Calio('#calio');
    const viewing = document.querySelector('.viewing');
    const selected = document.querySelector('.selected');

    calio.on('view', view => {
        viewing.textContent = view.format('mmmm yyyy');
    });

    calio.on('select', selection => {
        selected.textContent = selection.format('mediumDate');
    });

    calio.fire('view', calio.get().view); // Fire this so we update our view text when loaded.
</script>
```

---

## Options

### Defaults:

```js
new Calio(el, {
    headers: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    mode: 'single',
    value: null,
    limit: null,
    min: null,
    max: null    
});
```

### headers
An array of values you would like to use as the days of the week. You can also disable headers all together by passing `false`.

```js
new Calio(el, {
    headers: ['S', 'M', 'T', 'W', 'T', 'F', 'S']   
});
```

### mode *`single|multi|range`*
`single` - *(default)* acts as a basic date picker, the user picks a single date at any given time.  
`multi` - allows the user select multiple dates at once.  
`range` - allows the user to select only two dates at a time&mdash;highlighting all dates between their selections.

```js
new Calio(el, {
    mode: 'range'
});
```

### value
An initial value for the date picker. This can be:  
- a Javascript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object  
- a string or number accepted by Javascript's [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object  
- or a returned selection item from another instance of Calio.

```js
new Calio(el, {
    value: '1988-11-25'
});
```

In the case of `multi` or `range` mode, this should be an array of any of the above types.

```js
new Calio(el, {
    mode: 'range',
    value: [
        new Date(2018, 5, 1),
        '2018-06-03'
    ]
});
```

If you need to pass the year, month, and day to the underling `Date` object as individual arguments for any of the modes pass them as an array of arrays. **e.g.** `[[2018, 0, 1]]`

```js
new Calio(el, {
    mode: 'multi',
    value: [
        [2018, 5, 1],
        [2018, 5, 2],
        [2018, 5, 3]
    ]
});
```

### limit
##### *Only applies to mode: 'multi'*  
The number of selections that can be made in `multi` mode. Has no effect in `single` or `range` modes.

```js
new Calio(el, {
    mode: 'multi',
    limit: 3
});
```

### min
A minimum date that can be selected. Can accept any type that `value` does. Any date on the datepicker before the provided minimum will not be selectable.

```js
new Calio(el, {
    min: new Date()
});
```

### max
A maximum date that can be selected. Can accept any type that `value` does. Any date on the datepicker after the provided maximum will not be selectable.

```js
new Calio(el, {
    max: new Date()
});
```

> ## The rest of this readme is still a WIP.

## Events

### view

### select

---

## API

### goToYear(y)

### goToNextYear()

### goToLastYear()

### goToMonth(m)

### goToNextMonth()

### goToLastMonth()

### goToToday()

### goToSelection()
##### *Only works in mode: 'single'*  

### goTo(day)

### makeMyDay(day)

### select(day)

---

## Styling

```css
#calio {
    --size;
    --size-x;
    --size-y;
    --color;
    --color-hover;
    --bg-hover;
    --color-inactive;
    --bg-inactive;
    --color-disabled;
    --bg-disabled;
    --opacity-disabled;
    --color-ranged;
    --bg-ranged;
    --color-active;
    --bg-active;
}
```

[MIT License](LICENSE). &copy; 2017 [Cornelius Ukena](https://cornelius.io).
