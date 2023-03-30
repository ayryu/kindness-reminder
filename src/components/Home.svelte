<script lang="ts">
  let startOfToday = new Date().setHours(0,0,0,0);

  let historyItemsPromise: Promise<chrome.history.HistoryItem[]> = chrome.history.search({
    text: "", startTime: startOfToday
  });

  let organizedHistoryPromise: Promise<{}> = 
    historyItemsPromise
      .then((elements) => {
        let organizedHistory = {};
        for (let item of elements) {
          let hostname = new URL(item.url).hostname;
          // once hostname key is established
          // it's values should be an array of HistoryItems
          if(!Array.isArray(organizedHistory[hostname])) {
            organizedHistory[hostname] = [item];
          } else if(Array.isArray(organizedHistory[hostname])) {
            organizedHistory[hostname].push(item);
          }
        }
        return organizedHistory;
      }
  );

  let obj = 
  {
    "google":  ["google.com", "google.com/1"],
    "youtube": ["youtube.com"],
  };

</script>

<div>
  <p>
    Start of Today: <span>{new Date(startOfToday)}</span>
  </p>

  {#await organizedHistoryPromise}
    <p>...waiting</p>
  {:then organizedHistoryObject}
    {#each Object.entries(organizedHistoryObject) as [hostname, HistoryItems]}
    <p>
      Host: <span>{hostname}</span>
    </p>
    <ul>
      <!-- HistoryItems keys are index values -->
      {#each Object.values(HistoryItems) as historyItem}
        <li><a href="{historyItem.url}" rel="noopener" target="_blank">
          Item: {historyItem.title}
        </a></li>
      {/each}
    </ul>
    {/each}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>

<style scoped>
</style>
