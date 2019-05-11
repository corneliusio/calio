# IE11 Styles

#### Add the following minimum styling for IE11 support
The default specificity for the Calio styles is not very high. However, in the following CSS, the `body` selector has been added to the styles to ensure they overwrite any built-in styles. Any additional selector should work in it's place.

```css
body .calio {
    display: block;
    width: 100%;
    overflow: hidden;
    text-align: center;
    user-select: none;
}

body .calio-head {
    color: #333;
    font-weight: bold;
}

body .calio-head,
body .calio-day {
    display: block;
    cursor: pointer;
    color: #333;
    width: 2.25rem;
    line-height: 2rem;
    float: left;
}

body .calio-head:nth-child(7n + 1),
body .calio-day:nth-child(7n + 1) {
    clear: left;
}

body .calio-day:hover {
    color: #333;
    background: #EEE;
}

body .calio-day.is-today {
    font-weight: 900;
}

body .calio-day.is-prev,
body .calio-day.is-next {
    color: #CCC;
    background: transparent;
}

body .calio-day.is-disabled {
    pointer-events: none;
    color: #CCC;
    background: transparent;
    opacity: 0.5;
}

body .calio-day.is-ranged {
    color: white;
    background: rgba(100, 149, 237, 0.66);
}

body .calio-day.is-active {
    color: white;
    background: rgb(100, 149, 237);
}
```
