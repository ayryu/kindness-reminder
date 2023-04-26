<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";
  import type { Entry } from "src/types/entry.type";
  import { onMount } from 'svelte';

  let startOfToday = new Date().setHours(0,0,0,0);
  let displayedList = [];

  let testResponse = {
    tasklist: []
  };

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
      // /* Test values here!! */
      // let response = testResponse;


      let response = await chrome.storage.local.get(TASKLIST);
      return TASKLIST in response && Array.isArray(response.tasklist) && response.tasklist.length !== 0 ? [...response.tasklist, newEntry] : [newEntry];

    } catch (error) {
      console.log("Error updating list in createListWithAddedEntry", error);
    }
  }

  async function setEntry() {
    let newEntry = await createNewEntry();
    console.log("displayedList in setEntry before doing anything: ", displayedList);
    console.log("createNewEntry called in setEntry: ", newEntry);

    if(newEntry === undefined || (Object.entries(newEntry).length === 0)) {
      console.log("displayedList in setEntry when newEntry is undefined: ", displayedList);
      return;
    }

    let updatedList = await createListWithAddedEntry(newEntry);

    try {
      // /* Test values here!! */
      // testResponse = {tasklist: updatedList};


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
      // /* Test values here!! */
      // let response = testResponse;


      let response = await chrome.storage.local.get(TASKLIST);
      if(TASKLIST in response === false || !Array.isArray(response.tasklist) || response.tasklist.length === 0) {
        console.log("response.tasklist does not exist or is not an array");
        return;
      }
      console.log("unupdated tasklist from removeEntry: ", response.tasklist);
      let updatedList = [...response.tasklist];
      updatedList.splice(index, 1);



      // /* Test values here!! */
      // testResponse = {tasklist: updatedList};


      await chrome.storage.local.set({"tasklist": updatedList});
      displayedList = [...updatedList];
      console.log("updated displayedList once removeEntry is called: ", displayedList);
    } catch (error) {
      console.log("Error removing entry in removeEntry", error);
    }
  }

  async function clearStorage() {
    await chrome.storage.local.clear();
    displayedList = [];
    console.log("updated displayedList once clearStorage is called: ", displayedList);

    // /* Test values here!! */
    // testResponse = {tasklist: []};
  }

  async function displayStoredEntries() {
    // /* Test values here!! */
    // let response = testResponse;


    let response = await chrome.storage.local.get("tasklist");
    displayedList = TASKLIST in response && Array.isArray(response.tasklist) && response.tasklist.length !== 0 ? response.tasklist : displayedList;
    console.log("displayedList in displayStoredEntries", displayedList);
  }

  onMount(async () => {
    await displayStoredEntries();
    console.log("onMount calling displayStoredEntries");
	});

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

  <form on:submit|preventDefault={setEntry}>
    <input bind:value={textInput}>
    <button type="submit">Add</button>
  </form>

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
