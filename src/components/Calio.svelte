<div class="calio" bind:this={el}>
    <Headers {headers} />
    <Dates {props} on:select={onSelect} />
</div>

<script>
    import Epoch from '../modules/Epoch';
    import Dates from './Dates.svelte';
    import Headers from './Headers.svelte';
    import { createEventDispatcher, onMount, tick, setContext } from 'svelte';

    const today = new Epoch();
    const dispatcher = createEventDispatcher();

    let initial = null;

    export { initial as value };
    export let headers = [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ];
    export let mode = 'single';
    export let strict = false;
    export let disabled = [];
    export let limit = null;
    export let min = null;
    export let max = null;

    let el;
    let value = initial;
    let view = new Epoch();

    onMount(() => {
        tick().then(() => {
            view && dispatchEvents(el, 'view', view);
            initial && selection && dispatchEvents(el, 'selection', selection);
        });
    });

    $: computed = {
        min: makeMyDay(min),
        max: makeMyDay(max),
        disabled: new Array()
            .concat(disabled)
            .filter(Boolean)
            .map(makeMyDay)
    };

    $: props = {
        disabled: computed.disabled,
        min: computed.min,
        max: computed.max,
        selection,
        view,
        mode
    };

    $: selection = getSelection(value, computed.min, computed.max, computed.disabled);

    $: dispatchEvents(el, 'selection', selection);
    $: dispatchEvents(el, 'view', view);
    $: dispatchEvents(el, 'disabled', computed.disabled);
    $: dispatchEvents(el, 'min', computed.min);
    $: dispatchEvents(el, 'max', computed.max);

    function getSelection(newValue, min, max, disabled) {
        newValue = Array.isArray(newValue)
            ? newValue.map(makeMyDay)
            : makeMyDay(newValue);

        newValue = Array.isArray(newValue) && mode === 'single'
            ? newValue[0]
            : newValue;

        switch (mode) {
            case 'range' :
                newValue = structureRange(newValue);
                break;
            case 'multi' :
                newValue = structureMulti(newValue, limit);
                break;
            default :
                [ newValue, view ] = structureSingle(newValue, view);
                break;
        }

        if (newValue && newValue.length) {
            newValue = filterInvalidDatesMin(newValue, min);
            newValue = filterInvalidDatesMax(newValue, max);
            newValue = filterInvalidDatesDisabled(newValue, disabled);
        }

        return value = newValue;
    }

    function filterInvalidDatesMin(newValue, min) {
        if (min) {
            min.isAfter(view.clone().endOfMonth()) && goTo(min);

            if (mode === 'single') {
                if (min.isAfter(newValue)) {
                    return null;
                }
            } else {
                const valid = newValue.filter(s => s.isAfter(min) || s.isSame(min));

                newValue = valid.length ? valid : null;
            }
        }

        return newValue;
    }

    function filterInvalidDatesMax(newValue, max) {
        if (max) {
            max.isBefore(view.clone().endOfMonth()) && goTo(max);

            if (mode === 'single') {
                if (max.isBefore(newValue)) {
                    return null;
                }
            } else {
                const valid = newValue.filter(s => s.isBefore(max) || s.isSame(max));

                newValue = valid.length ? valid : null;
            }
        }

        return newValue;
    }

    function filterInvalidDatesDisabled(newValue, disabled) {
        if (disabled.length && newValue) {
            if (mode === 'single') {
                if (disabled.find(d => d.isSame(newValue))) {
                    return null;
                }
            } else {
                const valid = newValue.filter(s => disabled.find(d => !d.isSame(s)));

                if (mode === 'range' && strict && valid.length === 2) {
                    if (disabled.find(d => d.isBetween(...valid))) {
                        return null;
                    }
                }

                return valid.length ? valid : null;
            }
        }

        return newValue;
    }

    function structureRange(newValue) {
        newValue = toCleanArray(newValue);

        if (newValue.length > 2) {
            newValue = [ newValue.pop() ];
        }

        newValue = newValue.sort((a, b) => a.timestamp() - b.timestamp());

        return newValue;
    }

    function structureMulti(newValue, limit) {
        newValue = toCleanArray(newValue);

        if (limit && newValue.length > limit) {
            newValue = newValue.splice(0, limit);
        }

        newValue = newValue.sort((a, b) => a.timestamp() - b.timestamp());

        return newValue;
    }

    function structureSingle(newValue, newView) {
        return newValue ? [
            newValue,
            !newView.isSameMonth(newValue)
                ? newValue.clone().startOfMonth()
                : newView.clone()
        ] : [
            null,
            newView
        ];
    }

    function dispatchEvents(el, key, data) {
        if (data && typeof data.clone === 'function') {
            data = data.clone();
        } else if (Array.isArray(data)) {
            data = data.map(d => d.clone());
        }

        if (el) {
            el.parentNode.dispatchEvent(new CustomEvent(`calio:${key}`, {
                detail: data,
                bubbles: true
            }));
        }

        dispatcher(key, data);
    }

    function toCleanArray(data) {
        return new Array().concat(data).filter(Boolean);
    }

    function onSelect(event) {
        select(event.detail);
    }

    export function select(day = null) {
        let current = toCleanArray(value);

        if (!day) {
            return value = null;
        }

        if (mode === 'single') {
            value = value && value.isSame(day)
                ? null
                : day;
        } else if (current.length) {
            let index = current.findIndex(s => day.isSame(s));

            if (index > -1) {
                current.splice(index, 1);
            } else {
                current.push(day);
            }

            value = current;
        } else {
            value = day;
        }
    }

    export function makeMyDay(day = null, ...rest) {
        return day
            ? (day instanceof Epoch)
                ? day.clone()
                : rest.length
                    ? new Epoch(day, ...rest)
                    : Array.isArray(day)
                        ? day.filter(Boolean).length ? new Epoch(day) : null
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
