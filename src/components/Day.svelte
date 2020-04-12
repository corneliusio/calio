<span class="calio-day {classes}" on:click={event => dispatch('select', day)}>
    {day.date()}
</span>

<script>
    import Epoch from '../modules/Epoch';
    import { createEventDispatcher } from 'svelte';

    const today = new Epoch();
    const dispatch = createEventDispatcher();

    export let day;
    export let props = {};

    let { selection, disabled, min, max, mode, view } = {};

    $: ({ selection, disabled, min, max, mode, view } = props);

    $: isActive = (() => {
        return new Array()
            .concat(selection)
            .filter(Boolean)
            .find(s => day.isSame(s));
    })();

    $: isDisabled = (() => {
        return (disabled.find(d => d.isSame && d.isSame(day)))
            || (min && day.isBefore(min))
            || (max && day.isAfter(max));
    })();

    $: isRanged = (() => {
        if (mode === 'range' && selection) {
            let [ start, end ] = selection;

            if (start && end) {
                return day.isAfter(start) && day.isBefore(end);
            }
        }

        return false;
    })();

    $: classes = [
        day.isSame(today) && 'is-today',
        view && view.endOfMonth().isBefore(day) && 'is-next',
        view && view.startOfMonth().isAfter(day) && 'is-prev',
        isDisabled && 'is-disabled',
        isRanged && 'is-ranged',
        isActive && 'is-active'
    ].filter(Boolean).join(' ');
</script>

<style type="text/postcss">
    :global(.calio-day) {
        cursor: pointer;
        color: var(--color, #333);
    }

    :global(.calio-day:hover) {
        color: var(--color-hover, var(--color, #333));
        background: var(--bg-hover, #EEE);
    }

    :global(.calio-day.is-today) {
        font-weight: 900;
    }

    :global(.calio-day.is-prev),
    :global(.calio-day.is-next) {
        color: var(--color-inactive, #CCC);
        background: var(--bg-inactive, transparent);
    }

    :global(.calio-day.is-disabled) {
        pointer-events: none;
        color: var(--color-disabled, var(--color-inactive, #CCC));
        background: var(--bg-disabled, transparent);
        opacity: var(--opacity-disabled, 0.5);
    }

    :global(.calio-day.is-ranged) {
        color: var(--color-ranged, var(--color-active, white));
        background: var(--bg-ranged, var(--bg-active, rgba(100, 149, 237, 0.66)));
    }

    :global(.calio-day.is-active) {
        color: var(--color-active, white);
        background: var(--bg-active, rgb(100, 149, 237));
    }
</style>
