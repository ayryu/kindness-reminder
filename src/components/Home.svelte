<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";
  import type { Entry } from "src/types/entry.type";
  // import { Entry } from "src/classes/Entry";

  let startOfToday = new Date().setHours(0,0,0,0);
  let displayedList = [];

  const TASKLIST = "tasklist";
  let testResponse = {
    tasklist: []
  };

  let categories = [
    {
        name: "categoryA",
        id: "f32432",
        order: 0,
        items: [
          {
            id: "34tho3i4th",
            userInput: "input",
            dateCreated: new Date(),
            checked: false,
          },
          {
            id: "w34oigh4",
            userInput: "input",
            dateCreated: new Date(),
            checked: false,
          }
        ]
      },
      {
        name: "categoryB",
        id: "l34jthk",
        order: 1,
        items: [
          {
            id: "o32ifjh",
            userInput: "input",
            dateCreated: new Date(),
            checked: false,
          },
          {
            id: "4otihw43",
            userInput: "input",
            dateCreated: new Date(),
            checked: false,
          }
        ]
      }
  ];

  let currentStructure = {
    tasklist: [
      {
        id: "o32ifjh",
        userInput: "input",
        dateCreated: new Date(),
        checked: false,
      },
      {
        id: "w34oigh4",
        userInput: "input",
        dateCreated: new Date(),
        checked: false,
      }
    ]
  };

  let textInput = '';

  let displayEntries = displayStoredEntries();
  let historyResults = organizeHistoryPromise();

  // create new Entry object
  // if Entry object is missing info, the following functions should fail
  // pull existing list from storage
  // create new array with existing list and add new Entry object
  // set updated array to storage

  async function getCategory() {
    
  }

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
      dateCreated: new Date(),
      checked: false,
    };
  }

  async function createListWithAddedEntry(newEntry: Entry) {
    try {
      // /* Test values here!! */
      // let response = testResponse;

      /* displayedList state is up-to-date, local storage state is not */
      console.log("displayedList in createListWithAddedEntry before doing anything: ", displayedList);
      return displayedList.length !== 0 ? [...displayedList, newEntry] : [newEntry];

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
    console.log("updatedList in setEntry", updatedList);

    try {
      // /* Test values here!! */
      // testResponse = {tasklist: updatedList};


      await chrome.storage.local.set({"tasklist": updatedList});
      // displayedList = displayedList.length !== 0 ? [...updatedList] : [newEntry];
      displayedList = [...updatedList];
      console.log("displayedList after set in storage: ", displayedList);
      textInput = '';
    } catch (error) {
      console.log("Error setting new entry in setEntry", error);
    }
  }

  async function updateEntry(entryToUpdate: Entry, index: number) {
    console.log("index", index);
    console.log("updated Entry", entryToUpdate);
    const testUpdatingList = [...displayedList];
    testUpdatingList.splice(index, 1, entryToUpdate);
    console.log("new updated list", testUpdatingList);

    displayedList = testUpdatingList;
    await chrome.storage.local.set({"tasklist": displayedList});
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
    // /* Test values here!! */
    // testResponse = {tasklist: []};


    await chrome.storage.local.clear();
    // displayedList should be cleared after local storage
    displayedList = [];
    console.log("updated displayedList once clearStorage is called: ", displayedList);
  }

  async function displayStoredEntries() {
    // /* Test values here!! */
    // let response = testResponse;


    let response = await chrome.storage.local.get("tasklist");
    displayedList = TASKLIST in response && Array.isArray(response.tasklist) && response.tasklist.length !== 0 ? response.tasklist : displayedList;
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

  <div id="categories">
    {#each categories as category, index (category.id)}
    {/each}
  </div>

  {#if displayedList.length > 0}
  <div id="checklist">
    {#await displayEntries}
    <p>Add a task</p>
    {:then}
      {#each displayedList as entry, index (entry.id)}
        <div class="entry">
          <label>
            <input bind:checked={entry.checked} on:change={() => updateEntry(entry, index)} type=checkbox name="selectedTasks" value={entry.userInput}>
            <span class:checked={entry.checked}>{entry.userInput}</span>
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
  .checked {
    text-decoration: line-through;
  }
</style>
