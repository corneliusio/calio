{#each days as day}
    <span class="calio-head">{day}</span>
{/each}

<script>
    export let headers;

    const days = headers && headers.length
        ? new Array(7).fill('', 0, 7).map((n, i) => headers[i] || n)
        : [];
</script>
