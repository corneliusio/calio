<div class="calio" bind:this={el}>
    {#each computed.headers as day}
        <span class="calio-head">{day}</span>
    {/each}
    {#each dates as day}
        <Day {day} {...props} on:select={event => select(day)} />
    {/each}
</div>

<script>
    import { createEventDispatcher, onMount, tick, setContext } from 'svelte';
    import Epoch from '../modules/Epoch';
    import Day from './Day.svelte';

    const today = new Epoch();
    const dispatcher = createEventDispatcher();

    export let headers = [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ];
    export let mode = 'single';
    export let strict = false;
    export let disabled = [];
    export let value = null;
    export let limit = null;
    export let min = null;
    export let max = null;

    let el;
    let view = new Epoch();
    let selection = Array.isArray(value)
        ? value.map(makeMyDay)
        : makeMyDay(value);

    onMount(() => {
        goToSelection();
        view && dispatchEvents(dispatcher, el, 'view', view);
        selection && dispatchEvents(dispatcher, el, 'selection', selection);
    });

    $: computed = {
        min: makeMyDay(min),
        max: makeMyDay(max),
        headers: headers.length
            ? new Array(7).fill('', 0, 7).map((n, i) => headers[i] || n)
            : [],
        disabled: new Array()
            .concat(disabled)
            .filter(Boolean)
            .map(makeMyDay)
    };

    $: dates = makeDates(view, computed.disabled);

    $: props = {
        disabled: computed.disabled,
        min: computed.min,
        max: computed.max,
        selection,
        view,
        mode
    };

    $: dispatchEvents(dispatcher, el, 'selection', selection);
    $: dispatchEvents(dispatcher, el, 'view', view);

    $: watchInvalidDatesMin(computed.min);
    $: watchInvalidDatesMax(computed.max);
    $: watchInvalidDatesDisabled(computed.disabled);

    function dispatchEvents(dispatch, el, key, data) {
        if (data && typeof data.clone === 'function') {
            data = data.clone();
        } else if (Array.isArray(data)) {
            data = data.map(d => {
                return typeof d.clone === 'function'
                    ? d.clone()
                    : d;
            });
        }

        if (el) {
            el.parentNode.dispatchEvent(new CustomEvent(`calio:${key}`, {
                detail: data,
                bubbles: true
            }));
        }

        dispatch(key, data);
    }

    function watchInvalidDatesMin(min) {
        if (min) {
            min.isAfter(view.clone().endOfMonth()) && goTo(min);

            if (selection && selection.length) {
                if (mode === 'single') {
                    min.isAfter(selection) && select(min);
                } else {
                    const valid = selection.filter(s => min.isAfter(s));

                    valid.length ? tick().then(() => selection = valid) : select(min);
                }
            }
        }

        dispatchEvents(dispatcher, el, 'min', min);
    }

    function watchInvalidDatesMax(max) {
        if (max) {
            max.isBefore(view) && goTo(max);

            if (selection && selection.length) {
                if (mode === 'single') {
                    max.isBefore(selection) && select(max);
                } else {
                    const valid = selection.filter(s => max.isAfter(s));

                    valid.length ? tick().then(() => selection = valid) : select(max);
                }
            }
        }

        dispatchEvents(dispatcher, el, 'max', max);
    }

    function watchInvalidDatesDisabled(disabled) {
        if (selection && selection.length) {
            if (mode === 'single') {
                computed.disabled.find(d => d.isSame(selection)) && select(null);
            } else {
                const valid = computed.disabled.length && selection.filter(s => {
                    return !computed.disabled.find(d => d.isSame(s));
                });

                valid.length ? tick().then(() => selection = valid) : select(null);

                if (mode === 'range' && strict && selection.length === 2) {
                    computed.disabled.find(d => d.isBetween(...selection)) && select(null);
                }
            }
        }

        dispatchEvents(dispatcher, el, 'disabled', disabled);
    }

    function makeDates(view, disabled) {
        let current = view.clone().startOfMonth(),
            dates = [],
            dayOfFirst,
            dayOfLast;

        dayOfFirst = current.dayOfWeek();

        for (let i = 0; i < dayOfFirst; i++) {
            dates.unshift(current.clone().date(-i));
        }

        current.endOfMonth();

        for (let i = 1, days = current.date(); i <= days; i++) {
            dates.push(current.clone().date(i));
        }

        dayOfLast = current.dayOfWeek();
        current.startOfMonth().addMonth();

        for (let i = 1; i < (7 - dayOfLast); i++) {
            dates.push(current.clone().date(i));
        }

        return dates;
    }

    function updateRange(day, current, strict, disabled) {
        let selection = new Array().concat(current).filter(Boolean) || [],
            index = selection.findIndex(s => s.isSame(day));

        if (index > -1) {
            selection.splice(index, 1);

            return selection;
        } else if (selection.length > 1) {
            return [ day.clone() ];
        }

        selection = [ ...selection, day.clone() ].sort((a, b) => {
            return a.timestamp() - b.timestamp();
        });

        if (strict) {
            let [ start, end ] = selection,
                isInvalid = end && !!disabled.find(d => {
                    return d.isAfter(start) && d.isBefore(end);
                });

            if (isInvalid) {
                return current;
            }
        }

        return selection;
    }

    function updateMulti(day, current, limit) {
        let selection = new Array().concat(current).filter(Boolean) || [],
            index = selection.findIndex(s => s.isSame(day));

        if (index > -1) {
            selection.splice(index, 1);

            return selection;
        } else if (!limit || selection.length < limit) {
            selection = [ ...selection, day.clone() ].sort((a, b) => {
                return a.timestamp() - b.timestamp();
            });

            return selection;
        }

        return selection;
    }

    function updateSingle(day, view) {
        return [
            day.clone(),
            !view.isSameMonth(day)
                ? day.clone().startOfMonth()
                : view
        ];
    }

    export async function select(day = null) {
        await tick();
        day = makeMyDay(day);

        if (!day) {
            selection = null;
        } else {
            if (computed.disabled.find(d => d.isSame(day))
                || (computed.min && day.isBefore(computed.min))
                || (computed.max && day.isAfter(computed.max))) {
                return;
            }

            switch (mode) {
                case 'range' :
                    selection = updateRange(day, selection, strict, computed.disabled);
                    break;
                case 'multi' :
                    selection = updateMulti(day, selection, limit);
                    break;
                default :
                    [ selection, view ] = updateSingle(day, view);
                    break;
            }
        }
    }

    export function makeMyDay(day = null) {
        return day
            ? (day instanceof Epoch)
                ? day
                : Array.isArray(day)
                    ? new Epoch(...day)
                    : new Epoch(day)
            : null;
    }

    export function setMin(date) {
        min = date || null;
    }

    export function setMax(date) {
        max = date || null;
    }

    export function setDisabled(date) {
        disabled = date;
    }

    export function goToYear(y) {
        view = view.clone().year(y);
    }

    export function goToNextYear() {
        view = view.clone().addYear();
    }

    export function goToLastYear() {
        view = view.clone().subYear();
    }

    export function goToMonth(m) {
        view = view.clone().startOfMonth().month(m - 1);
    }

    export function goToNextMonth() {
        view = view.clone().startOfMonth().addMonth();
    }

    export function goToLastMonth() {
        view = view.clone().startOfMonth().subMonth();
    }

    export function goToThisMonth() {
        view = today.clone().startOfMonth();
    }

    export function goToSelection() {
        if (mode === 'single' && selection) {
            view = selection.clone().startOfMonth();
        }
    }

    export function goTo(day) {
        day = makeMyDay(day);

        if (day) {
            view = day.clone().startOfMonth();
        }
    }

    $: if (process.env.NODE_ENV === 'testing') {
        setContext('el', el);
        setContext('props', props);
        setContext('computed', computed);
        setContext('selection', selection);
        setContext('view', view);
        setContext('headers', headers);
        setContext('mode', mode);
        setContext('strict', strict);
        setContext('disabled', disabled);
        setContext('value', value);
        setContext('limit', limit);
        setContext('min', min);
        setContext('max', max);
        setContext('dates', dates);
    }
</script>

<style type="text/postcss">
    :global(.calio) {
        display: inline-grid;
        grid-template-columns: repeat(7, var(--size-x, var(--size, 2.25em)));
        grid-auto-rows: var(--size-y, var(--size, 2em));
        line-height: var(--size-y, var(--size, 2em));
        text-align: center;
        user-select: none;
    }

    :global(.calio-head) {
        color: var(--color, #333);
        font-weight: bold;
    }
</style>
