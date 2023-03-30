<script lang="ts">
  let urlVisits: Date;

  let searching: Promise<chrome.history.HistoryItem[]> = chrome.history.search({
      text: "",
      startTime: 0,
      maxResults: 1
    });

  searching.then(listVisits);

  function listVisits(historyItems: chrome.history.HistoryItem[]) {
    if (historyItems.length) {
      const gettingVisits = chrome.history.getVisits({
        url: historyItems[0].url
      });
      gettingVisits.then(gotVisits);
    }
  }

  function gotVisits(visits: chrome.history.VisitItem[]) {
    for (const visit of visits) {
      urlVisits = new Date(visit.visitTime);
    }
  }

  // let count: number = 0;
  // export let count: number;
  // let message: string = null;

  // const increment = () => { count += 1; };
  // const decrement = () => { count -= 1; };

  // const handleSave = () => {
  //   chrome.storage.sync.set({count}).then(() => {
  //     message = 'Updated!';

  //     setTimeout(() => {
  //       message = null;
  //     }, 2000);
  //   });
  // };
</script>

<div>
  <p>
    <!-- Current count: <span>{count}</span> -->
    Latest recorded visit: <span>{urlVisits}</span>
  </p>
  <div>
    <!-- <button on:click={decrement}>-</button>
    <button on:click={increment}>+</button> -->
    <!-- <button on:click={handleSave}>Save</button>
    {#if message}<span>{message}</span>{/if} -->
  </div>
</div>

<style scoped>
  button {
    color: blue;
    /* padding: theme('spacing.2') theme('spacing.4');
    font-size: theme('fontSize.base'); */
    border: 1px solid;
    /* box-shadow: theme('boxShadow.lg');
    background-color: theme('backgroundColor.blue.50'); */
  }

  button:hover,
  button:focus {
    background-color: theme('colors.blue.800');
    color: theme('colors.blue.50');
  }
</style>
