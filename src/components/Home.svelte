<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";

  let startOfToday = new Date().setHours(0,0,0,0);
  let storageList = [];

  let textInput = '';

  async function setToStorage() {
    let objectId = (+new Date * Math.random()).toString(36).substring(0,6);
    let object = 
      {
        [objectId] : 
          {
            task: textInput,
            dateCreated: new Date()
          }
      };
    await chrome.storage.local.set(object);
    storageList = [...storageList, object];
  }

  async function clearStorage() {
    await chrome.storage.local.clear();
  }

  async function getFromStoragePromise() {
    let response = await chrome.storage.local.get();
    console.log("unaltered response", response);
    console.log("Object.entries", Object.entries(response));
    return response;
  }

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

<div>
  <!-- <p>
    Start of Today: <span>{new Date(startOfToday)}</span>
  </p> -->

<input bind:value={textInput}>
<button on:click={setToStorage}>Add</button>
<button on:click={clearStorage}>Clear All</button>


<!-- {#if storageList.length !== 0} -->
<div id="checklist">
  {#await getFromStoragePromise()}
  <p>...waiting</p>
  {:then resultsObject}
    {#each Object.entries(resultsObject) as element, index (element)}
      <label>
        <input type=checkbox name="selectedTasks" value={element[1].task}>
        {element[1].task}
      </label>
      <!-- currently element[0] is the id of the object -->
      <!-- <span on:click={() => removeFromStorage(element[0])}>❌</span> -->
    {/each}
  {:catch error}
        <p style="color: red">{error.message}</p>
  {/await}
</div>
<!-- {/if} -->


  {#await organizeHistoryPromise()}
    <p>...waiting</p>
  {:then organizedHistoryObject}
  <Accordion size="xl" align="start">
      {#each Object.entries(organizedHistoryObject) as [hostname, HistoryItems]}
        <AccordionItem title="{hostname}">
          <ul>
            {#each Object.values(HistoryItems) as historyItem}
              {#if historyItem.title.trim().length !== 0}
              <li><a href="{historyItem.url}" rel="noopener noreferrer" target="_blank">
                Item: {historyItem.title}
              </a></li>
              {/if}
            {/each}
          </ul>
        </AccordionItem>
      {/each}
    </Accordion>
    {:catch error}
      <p style="color: red">{error.message}</p>
  {/await}
</div>

<style scoped>
  #checklist {
    display: flex;
    flex-direction: column;
  }
</style>
