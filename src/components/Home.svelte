<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";

  let startOfToday = new Date().setHours(0,0,0,0);
  let displayedList = [];

  const TASKLIST = "tasklist";

  let textInput = '';

  async function createNewEntry() {
    let objectId = (+new Date * Math.random()).toString(36).substring(0,6);
    return {
      id: objectId,
      userInput: textInput,
      dateCreated: new Date()
    };
  }

  async function updateList(newEntry: object) {
    try {
      let response = await chrome.storage.local.get(TASKLIST);
      return TASKLIST in response ? [...response.tasklist, newEntry] : [newEntry];
    } catch (error) {
      console.log("Error updating list in updateList", error);
    }
  }

  async function setEntry() {
    let newEntry = await createNewEntry();
    let updatedList = await updateList(newEntry);

    try {
      await chrome.storage.local.set({"tasklist": updatedList});
      displayedList = displayedList.length !== 0 ? [...displayedList, newEntry] : [newEntry];
      textInput = '';
    } catch (error) {
      console.log("Error setting new entry in setEntry", error);
    }
  }

  let returnValueFromSet = {
    tasklist: [
      {
        id: "pewofke",
        userInput: textInput,
        dateCreated: new Date()
      },
      {
        id: "khjl3t4w",
        userInput: textInput,
        dateCreated: new Date()
      },
    ]
  };

  async function clearStorage() {
    await chrome.storage.local.clear();
  }

  async function displayStoredEntries() {
    let response = await chrome.storage.local.get("tasklist");
    displayedList = TASKLIST in response ? response.tasklist : displayedList;

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

    // console.log("Organized History", organizedHistory);
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
<button on:click={setEntry}>Add</button>
<button on:click={clearStorage}>Clear All</button>

<div id="checklist">
  {#await displayStoredEntries()}
  <p>Add a task</p>
  {:then returnValue}
    {#each displayedList as entry}
      <label>
        <input type=checkbox name="selectedTasks" value={entry.userInput}>
        {entry.userInput}
      </label>
      <!-- <span on:click={() => removeFromStorage(element[0])}>❌</span> -->
    {/each}
  {/await}
</div>

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
