<div class="calio" bind:this={el}>
    {#each head as day}
        <span class="calio-head">{day}</span>
    {/each}
    {#each dates as day}
        <Day {day} {...data} on:select={event => select(day)} />
    {/each}
</div>

<script>
    import { dispatchEvents, makeDates, updateRange, updateMulti, updateSingle } from '../util';
    import { createEventDispatcher } from 'svelte';
    import LilEpoch from '../modules/LilEpoch';
    import Day from './Day.svelte';

    const today = new LilEpoch();
    const dispatcher = createEventDispatcher();

    let el;
    let data;
    let selection = null;
    let view = new LilEpoch();

    export let headers = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    export let mode = 'single';
    export let strict = false;
    export let disabled = [];
    export let value = null;
    export let limit = null;
    export let min = null;
    export let max = null;

    new Array().concat(value).forEach(v => select(v));

    $: computed = {
        min: makeMyDay(min),
        max: makeMyDay(max),
        disabled: new Array()
            .concat(disabled)
            .filter(Boolean)
            .map(makeMyDay)
    }

    $: data = {
        min: computed.min,
        max: computed.max,
        disabled: computed.disabled,
        headers,
        view,
        mode,
        strict,
        selection,
        limit,
        el
    };

    $: dates = makeDates(view, computed.disabled);
    $: head = headers.length
        ? new Array(7).fill('', 0, 7).map((n, i) => headers[i] || n)
        : [];

    $: dispatchEvents(dispatcher, el, 'selection', selection);
    $: dispatchEvents(dispatcher, el, 'view', view);
    $: dispatchEvents(dispatcher, el, 'min', computed.min);
    $: dispatchEvents(dispatcher, el, 'max', computed.max);
    $: dispatchEvents(dispatcher, el, 'update', data);

    export function state() {
        return data;
    };

    export function select(day) {
        day = makeMyDay(day);

        if (day) {
            if (computed.disabled.find(d => d.isSame(day))
                || (computed.min && day.isBefore(computed.min))
                || (computed.max && day.isAfter(computed.max))) {
                return;
            }

            switch (mode) {
                case 'range' :
                    [ selection ] = updateRange(day, selection, strict, computed.disabled);
                    break;
                case 'multi' :
                    [ selection ] = updateMulti(day, selection, limit);
                    break;
                default :
                    [ selection, view ] = updateSingle(day, view);
                    break;
            }
        }
    }

    export function makeMyDay(day = null) {
        return day
            ? (day instanceof LilEpoch)
                ? day
                : Array.isArray(day)
                    ? new LilEpoch(...day)
                    : new LilEpoch(day)
            : null;
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
</script>

<style type="text/postcss">
    .calio {
        display: inline-grid;
        grid-template-columns: repeat(7, var(--size-x, var(--size, 2.25em)));
        grid-auto-rows: var(--size-y, var(--size, 2em));
        line-height: var(--size-y, var(--size, 2em));
        text-align: center;
        user-select: none;
    }

    .calio-head {
        color: var(--color, #333);
        font-weight: bold;
    }
</style>
