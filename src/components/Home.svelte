<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";
  import type { Entry } from "src/types/entry.type";

  let startOfToday = new Date().setHours(0,0,0,0);
  let displayedList = [];

  const TASKLIST = "tasklist";
  let testResponse = {
    tasklist: []
  };

  let rawResponse = {
    tasklist: [
      {
        id: "o32ifjh",
        name: "Category 1",
        items: [
          {
            id: "abcd1234",
            input: "Item 1",
            checked: false,
            dateCreated: new Date(),
          },
          {
            id: "efgh5678",
            input: "Item 2",
            checked: false,
            dateCreated: new Date(),
          },
        ],
      },
      {
        id: "w34oigh4",
        name: "Category 2",
        items: [
          {
            id: "ijkl9012",
            input: "Item 3",
            checked: false,
            dateCreated: new Date(),
          },
          {
            id: "mnop3456",
            input: "Item 4",
            checked: false,
            dateCreated: new Date(),
          },
        ],
      },
    ],
  };

  let categories = rawResponse.tasklist;
  let categoryList = [];

  let textInput = '';
  let categoryInput = '';

  let displayEntries = displayStoredEntries();
  let historyResults = organizeHistoryPromise();

  // create new Entry object
  // if Entry object is missing info, the following functions should fail
  // pull existing list from storage
  // create new array with existing list and add new Entry object
  // set updated array to storage

  function changeInput(categoryIndex: number, itemIndex: number, entry) {
    console.log("categories after running changeInput", categories);

    // const updatedList = [...categories];
    // console.log("updatedList in changeInput", updatedList);

    // const items = updatedList[categoryIndex].items;
    // console.log("items in changeInput", items);

    // const updatedItem = { ...items[itemIndex], input: entry.input };
    // console.log("updatedItem in changeInput", updatedItem);

    // items.splice(itemIndex, 1, updatedItem);
    // console.log("items in changeInput", items);

    // categories = updatedList;
    // console.log("categories after running changeInput", categories);
  }

  async function createNewCategory() {
    if(categoryInput.trim().length === 0) {
      console.log("categoryInput from createNewCategory", categoryInput);
      console.log("current categoryList: ", categoryList);
      categoryInput = '';
      return;
    }
    let objectId = (+new Date * Math.random()).toString(36).substring(0,6);
    return {
      id: objectId,
      name: categoryInput,
      dateCreated: new Date(),
      checked: false,
      items: [],
    };
  }

  async function createListWithAddedCategory(category) {
    try {
      // /* Test values here!! */
      // let response = testResponse;

      /* categoryList state is up-to-date, local storage state is not */
      console.log("categoryList in createListWithAddedCategory before doing anything: ", categoryList);
      return categoryList.length !== 0 ? [...categoryList, category] : [category];

    } catch (error) {
      console.log("Error updating list in createListWithAddedCategory", error);
    }
  }

  async function setCategory() {
    let newCategory = await createNewCategory();
    console.log("categoryList in setCategory before doing anything: ", categoryList);
    console.log("newCategory created in setCategory: ", newCategory);

    if(newCategory === undefined || (Object.entries(newCategory).length === 0)) {
      console.log("categoryList in setCategory when newCategory is undefined: ", categoryList);
      return;
    }

    let updatedCategoryList = await createListWithAddedCategory(newCategory);
    console.log("updatedCategoryList in setCategory", updatedCategoryList);

    try {
      // /* Test values here!! */
      // testResponse = {tasklist: updatedList};


      await chrome.storage.local.set({"tasklist": updatedCategoryList});
      categoryList = [...updatedCategoryList];
      console.log("categoryList after set in storage: ", categoryList);
      categoryInput = '';
    } catch (error) {
      console.log("Error setting new category in setCategory", error);
    }
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


  async function addEntryToCategory(categoryIndex: number) {
    let newEntry = await createNewEntry();
    console.log("categoryList in addEntryToCategory before doing anything: ", categoryList);
    console.log("newEntry created in addEntryToCategory: ", newEntry);

    if(newEntry === undefined || (Object.entries(newEntry).length === 0)) {
      console.log("categoryList in addEntryToCategory when newEntry is undefined: ", categoryList);
      return;
    }

    // let updatedListOfEntriesInCategory = await createListWithAddedEntry(newEntry);
    // console.log("updatedCategoryList in addEntryToCategory", updatedListOfEntriesInCategory);

    categoryList[categoryIndex].items = [...categoryList[categoryIndex].items, newEntry];
    console.log("category with new entry in addEntryToCategory", categoryList[categoryIndex]);
    console.log("full categoryList with new entry in addEntryToCategory", categoryList);

    try {
      // /* Test values here!! */
      // testResponse = {tasklist: updatedList};


      await chrome.storage.local.set({"tasklist": categoryList});
      categoryList = [...categoryList];
      console.log("categoryList after set in storage in addEntryToCategory: ", categoryList);
      textInput = '';
    } catch (error) {
      console.log("Error setting new category in addEntryToCategory", error);
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
      displayedList = [...updatedList];
      console.log("displayedList after set in storage: ", displayedList);
      textInput = '';
    } catch (error) {
      console.log("Error setting new entry in setEntry", error);
    }
  }

  // async function updateEntry(entryToUpdate: Entry, index: number) {
  async function updateEntry() {
    // console.log("index", index);
    // console.log("updated Entry", entryToUpdate);
    // console.log("displayedList in updateEntry", displayedList);
    // const testUpdatingList = [...displayedList];
    // testUpdatingList.splice(index, 1, entryToUpdate);
    // console.log("new updated list", testUpdatingList);

    // displayedList = testUpdatingList;

    console.log("displayedList in updateEntry before setting to local storage", displayedList);
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
    // displayedList = [];
    // console.log("updated displayedList once clearStorage is called: ", displayedList);

    categoryList = [];
    console.log("updated categoryList once clearStorage is called: ", categoryList);
  }

  async function displayStoredEntries() {
    // /* Test values here!! */
    // let response = testResponse;


    let response = await chrome.storage.local.get("tasklist");
    // displayedList = TASKLIST in response && Array.isArray(response.tasklist) && response.tasklist.length !== 0 ? response.tasklist : displayedList;
    // console.log("displayedList in displayStoredEntries", displayedList);
    categoryList = TASKLIST in response && Array.isArray(response.tasklist) && response.tasklist.length !== 0 ? response.tasklist : categoryList;
    console.log("categoryList in displayStoredEntries", categoryList);
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

  <!-- <form on:submit|preventDefault={setEntry}>
    <input bind:value={textInput}>
    <button type="submit">Add</button>
    <button on:click={clearStorage}>Clear All</button>
  </form>

  {#if displayedList.length > 0}
  <div id="checklist">
    {#await displayEntries}
    <p>Add a task</p>
    {:then}
      <ul>
      {#each displayedList as entry, index (entry.id)}
        <li class="item">
          <label>
            <input bind:checked={entry.checked} on:change={() => updateEntry()} type=checkbox name="selectedTasks" value={entry.userInput}>
            <span class:checked={entry.checked}>{entry.userInput}</span>
          </label>
          <span on:click={() => removeEntry(index)}>❌</span>
        </li>
      {/each}
      </ul>
    {/await}
  </div>
  {/if} -->

  <!-- <form>
    <input>
    <button>Create Category</button>
  </form> -->

  <form on:submit|preventDefault={setCategory}>
    <input bind:value={categoryInput}>
    <button type="submit">Create Category</button>
    <button on:click={clearStorage}>Clear All</button>
  </form>

  {#if categoryList.length > 0}
  <div id="categories">
    {#await displayEntries}
    <p>Add a category</p>
    {:then}
    {#each categoryList as category, categoryIndex (category.id)}
      <!-- <h2 class="category">{category.name}</h2> -->
      <input class="category" type="text" bind:value={category.name} />
        <ul>
          <!-- <input type="text" />
          <button on:submit={() => addEntryToCategory(categoryIndex)}>Create Entry</button> -->
          {#if category.items !== undefined && category.items.length > 0}
          {#each category.items as item, itemIndex (item.id)}
            <li>
              <label class="entry">
                <input type="checkbox" bind:checked={item.checked} />
                <input type="text" bind:value={item.userInput} />
                <!-- <input type="text" bind:value={item.input} on:change={() => changeInput(categoryIndex, itemIndex, item)} /> -->
                <!-- {item.input} -->
              </label>
            </li>
          {/each}
          {/if}
          <form on:submit|preventDefault={() => addEntryToCategory(categoryIndex)}>
            <input bind:value={textInput}>
            <button type="submit">Create Entry</button>
          </form>
      </ul>
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
  .category {
    /* padding: 20px 10px;  */
    line-height: 25px;
  }
</style>
