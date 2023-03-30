<script lang="ts">
  let startOfToday = new Date().setHours(0,0,0,0);

  let historyItemsPromise: Promise<chrome.history.HistoryItem[]> = chrome.history.search({
    text: "", startTime: startOfToday
  });

</script>

<div>
  <p>
    Start of Today: <span>{new Date(startOfToday)}</span>
  </p>
  {#await historyItemsPromise}
    <p>...waiting</p>
  {:then historyItems} 
    {#each historyItems as item}
    <p>
      Page visited: <a href="{item.url}" rel="noopener" target="_blank">{item.title}</a>
    </p>
    <p>
      last visit time: <span>{new Date(item.lastVisitTime)}</span>
    </p>
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

<style scoped>
</style>
