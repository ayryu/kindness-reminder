<script lang="ts">
  import { Button, breakpoints } from "carbon-components-svelte";

  let startOfToday = new Date().setHours(0,0,0,0);

  async function organizeHistoryPromise(): Promise<{}> {
    const historyItems = await chrome.history.search({text: "", startTime: startOfToday});
    
    let organizedHistory = {};
    for (let item of historyItems) {
      let hostname = new URL(item.url).hostname;
        Array.isArray(organizedHistory[hostname]) ?
          organizedHistory[hostname].push(item) :  
          organizedHistory[hostname] = [item];
    }

    return organizedHistory;
  }

  let obj = 
  {
    "google":  ["google.com", "google.com/1"],
    "youtube": ["youtube.com"],
  };

</script>

<Button>Primary button</Button>
  {breakpoints.md}

<div>
  <p>
    Start of Today: <span>{new Date(startOfToday)}</span>
  </p>

  {#await organizeHistoryPromise()}
    <p>...waiting</p>
  {:then organizedHistoryObject}
    {#each Object.entries(organizedHistoryObject) as [hostname, HistoryItems]}
    <p>
      Host: <span>{hostname}</span>
    </p>
    <ul>
      <!-- HistoryItems keys are index values -->
      {#each Object.values(HistoryItems) as historyItem}
        {#if historyItem.title.trim().length !== 0}
        <li><a href="{historyItem.url}" rel="noopener" target="_blank">
          Item: {historyItem.title}
        </a></li>
        {/if}
      {/each}
    </ul>
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

<style scoped>
</style>
