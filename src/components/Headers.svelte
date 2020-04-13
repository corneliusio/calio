{@html markup} <!-- Only this way for code coverage purposes. -->

<script>
    export let headers;

    const days = headers && headers.length
        ? new Array(7).fill('', 0, 7).map((n, i) => headers[i] || n)
        : [];

    const markup = days.map(day => `<span class="calio-head">${day}</span>`).join(`\n`);
</script>
