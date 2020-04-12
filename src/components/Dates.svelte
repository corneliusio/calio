{#each dates as day}
    <Day {day} {props} on:select={event => dispatch('select', day)} />
{/each}

<script>
    import Day from './Day.svelte';
    import { createEventDispatcher } from 'svelte';

    export let props;

    const dispatch = createEventDispatcher();

    let { view, disabled } = {};

    $: ({ view, disabled } = props);
    $: dates = makeDates(view, disabled);

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
</script>
