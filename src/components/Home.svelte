<script lang="ts">
  import type { Entry } from "src/types/entry.type";
  import History from "./History.svelte";

  let displayedList = [];

  const TASKLIST = "tasklist";

  let categoryList = [];

  let textInput = '';
  let categoryInput = '';

  let newEntryPerCategory = [];

  let displayEntries = displayStoredEntries();

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

    newEntryPerCategory = newEntryPerCategory.length !== 0 ? [...newEntryPerCategory, ''] : [''];
    console.log("newEntryPerCategory in setCategory", newEntryPerCategory);

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

  async function createEntryFromCategoryIndex(categoryIndex: number) {
    if(newEntryPerCategory[categoryIndex].trim().length === 0) {
      console.log("input from createEntryFromCategoryIndex", newEntryPerCategory[categoryIndex]);
      console.log("current categoryList from createEntryFromCategoryIndex: ", categoryList);
      newEntryPerCategory[categoryIndex] = '';
      return;
    }

    let objectId = (+new Date * Math.random()).toString(36).substring(0,6);
    let savedInput = newEntryPerCategory[categoryIndex];

    newEntryPerCategory[categoryIndex] = '';

    console.log("current savedInput from createEntryFromCategoryIndex: ", savedInput);
    console.log("current newEntryPerCategory[categoryIndex] from createEntryFromCategoryIndex: ", newEntryPerCategory[categoryIndex]);

    return {
      id: objectId,
      userInput: savedInput,
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
    let newEntry = await createEntryFromCategoryIndex(categoryIndex);
    console.log("categoryList in addEntryToCategory before doing anything: ", categoryList);
    console.log("newEntry created in addEntryToCategory: ", newEntry);

    if(newEntry === undefined || (Object.entries(newEntry).length === 0)) {
      console.log("categoryList in addEntryToCategory when newEntry is undefined: ", categoryList);
      return;
    }

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

  async function updateEntry() {
    console.log("categoryList in updateEntry before setting to local storage", categoryList);
    await chrome.storage.local.set({"tasklist": categoryList});
  }

  async function removeEntry(categoryIndex: number, entryIndex: number) {
    try {
      // /* Test values here!! */
      // let response = testResponse;

      console.log("categoryList in removeEntry", categoryList);
      console.log("entry to remove in removeEntry", categoryList[categoryIndex].items[entryIndex]);

      let updatedCategoryList = structuredClone(categoryList);
      console.log("updatedEntryListInCategory in removeEntry", updatedCategoryList);
      updatedCategoryList[categoryIndex].items.splice(entryIndex, 1);

      console.log("updatedEntryListInCategory after removing entry in removeEntry", updatedCategoryList);
      console.log("categoryList after removing entry in removeEntry", categoryList);

      await chrome.storage.local.set({"tasklist": updatedCategoryList});
      categoryList = updatedCategoryList;

      console.log("latest categoryList after removing entry in removeEntry", categoryList);

      // // /* Test values here!! */
      // // testResponse = {tasklist: updatedList};
    } catch (error) {
      console.log("Error removing entry in removeEntry", error);
    }
  }

  async function clearStorage() {
    // /* Test values here!! */
    // testResponse = {tasklist: []};


    await chrome.storage.local.clear();
    categoryList = [];
    console.log("updated categoryList once clearStorage is called: ", categoryList);
  }

  async function displayStoredEntries() {
    // /* Test values here!! */
    // let response = testResponse;


    let response = await chrome.storage.local.get("tasklist");
    categoryList = TASKLIST in response && Array.isArray(response.tasklist) && response.tasklist.length !== 0 ? response.tasklist : categoryList;
    console.log("categoryList in displayStoredEntries", categoryList);
  }

</script>

<div>

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
  <div id="categories" on:change={() => updateEntry()}>
    {#await displayEntries}
    <p>Add a category</p>
    {:then}
    {#each categoryList as category, categoryIndex (category.id)}
      <input class="category" type="text" bind:value={category.name} />
        <ul>
          {#if category.items !== undefined && category.items.length > 0}
          {#each category.items as item, itemIndex (item.id)}
            <li>
              <label class="entry">
                <input type="checkbox" bind:checked={item.checked} />
                <input type="text" bind:value={item.userInput} />
              </label>
              <span on:click={() => removeEntry(categoryIndex, itemIndex)}>❌</span>
            </li>
          {/each}
          {/if}
          <form class="entry" on:submit|preventDefault={() => addEntryToCategory(categoryIndex)}>
            <input bind:value={newEntryPerCategory[categoryIndex]}>
            <button type="submit">Create Entry</button>
          </form>
      </ul>
    {/each}
    {/await}
  </div>
  {/if}

  <History />

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
