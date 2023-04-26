<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";
  import type { Entry } from "src/types/entry.type";
  import { onMount } from 'svelte';

  let startOfToday = new Date().setHours(0,0,0,0);
  let displayedList = [];

  const TASKLIST = "tasklist";

  let textInput = '';

  let displayEntries = displayStoredEntries();
  let historyResults = organizeHistoryPromise();

  // create new Entry object
  // if Entry object is missing info, the following functions should fail
  // pull existing list from storage
  // create new array with existing list and add new Entry object
  // set updated array to storage

  async function createNewEntry() {
    if(textInput.trim().length === 0) {
      console.log("textInput from createNewEntry", textInput);
      console.log("current displayedList: ", displayedList);
      textInput = '';
      return;
    }
    let objectId = (+new Date * Math.random()).toString(36).substring(0,6);
    return {
      id: objectId,
      userInput: textInput,
      dateCreated: new Date()
    };
  }

  async function createListWithAddedEntry(newEntry: Entry) {
    try {
      let response = await chrome.storage.local.get(TASKLIST);
      return TASKLIST in response ? [...response.tasklist, newEntry] : [newEntry];
    } catch (error) {
      console.log("Error updating list in createListWithAddedEntry", error);
    }
  }

  async function setEntry() {
    console.log("displayedList in setEntry before doing anything: ", displayedList);
    let newEntry = await createNewEntry();
    console.log("createNewEntry called in setEntry: ", newEntry);
    if(newEntry === undefined || (Object.entries(newEntry).length === 0)) {
      console.log("displayedList in setEntry when newEntry is undefined: ", displayedList);
      return;
    }
    let updatedList = await createListWithAddedEntry(newEntry);

    try {
      await chrome.storage.local.set({"tasklist": updatedList});
      displayedList = displayedList.length !== 0 ? [...displayedList, newEntry] : [newEntry];
      console.log("displayedList after set in storage: ", displayedList);
      textInput = '';
    } catch (error) {
      console.log("Error setting new entry in setEntry", error);
    }
  }

  async function removeEntry(index: number) {
    try {
      let response = await chrome.storage.local.get(TASKLIST);
      if(TASKLIST in response === false || !Array.isArray(response.tasklist)) {
        console.log("response.tasklist does not exist or is not an array");
        return;
      }
      console.log("unupdated tasklist from removeEntry: ", response.tasklist);
      let updatedList = [...response.tasklist];
      updatedList.splice(index, 1);

      await chrome.storage.local.set({"tasklist": updatedList});
      displayedList = [...updatedList];
      console.log("updated tasklist once entry is removed: ", displayedList);
    } catch (error) {
      console.log("Error removing entry in removeEntry", error);
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
    displayedList = [];
  }

  async function displayStoredEntries() {
    let response = await chrome.storage.local.get("tasklist");
    displayedList = TASKLIST in response ? response.tasklist : displayedList;
    console.log("displayedList in displayStoredEntries", displayedList);
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

  onMount(async () => {
		const response = await chrome.storage.local.get("tasklist");
		displayedList = TASKLIST in response ? response.tasklist : displayedList;
	});

</script>

<div>
  <!-- <p>
    Start of Today: <span>{new Date(startOfToday)}</span>
  </p> -->

<input bind:value={textInput}>
<button on:click={setEntry}>Add</button>
<button on:click={clearStorage}>Clear All</button>

{#if displayedList.length > 0}
<div id="checklist">
  {#await displayEntries}
  <p>Add a task</p>
  {:then}
    {#each displayedList as entry, index (entry.id)}
      <div class="entry">
        <label>
          <input type=checkbox name="selectedTasks" value={entry.userInput}>
          {entry.userInput}
        </label>
        <span on:click={() => removeEntry(index)}>❌</span>
      </div>
    {/each}
  {/await}
</div>
{/if}

  {#await historyResults}
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
  .entry {
    display: flex;
    /* flex-direction: row; */
  }
</style>
