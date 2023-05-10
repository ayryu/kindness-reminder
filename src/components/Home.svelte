<script lang="ts">
  import type { Entry } from "src/types/entry.type";
  import History from "./History.svelte";

  const TASKLIST = "tasklist";

  let input_list = [];

  let new_entry_per_category = [];
  let category_input = '';

  let display_entries = display_stored_entries();

  async function create_category() {
    if(category_input.trim().length === 0) {
      console.log("category_input from create_category", category_input);
      console.log("current input_list: ", input_list);
      category_input = '';
      return;
    }
    let object_id = (+new Date * Math.random()).toString(36).substring(0,6);
    return {
      id: object_id,
      name: category_input,
      date_created: new Date(),
      checked: false,
      items: [],
    };
  }

  async function set_category() {
    let new_category = await create_category();
    console.log("input_list in set_category before doing anything: ", input_list);
    console.log("new_category created in set_category: ", new_category);

    if(new_category === undefined || (Object.entries(new_category).length === 0)) {
      console.log("input_list in set_category when new_category is undefined: ", input_list);
      return;
    }

    let updated_input_list = [...input_list, new_category];
    console.log("updated_input_list in set_category", updated_input_list);

    new_entry_per_category = [...new_entry_per_category, ''];
    console.log("new_entry_per_category in set_category", new_entry_per_category);

    try {
      // /* Test values here!! */
      // test_response = {tasklist: input_list};


      await chrome.storage.local.set({"tasklist": updated_input_list});
      input_list = [...updated_input_list];
      console.log("input_list after set in storage: ", input_list);
      category_input = '';
    } catch (error) {
      console.log("Error setting new category in set_category", error);
    }
  }

  async function create_entry_from_category_index(category_index: number) {
    if(new_entry_per_category[category_index].trim().length === 0) {
      console.log("input from create_entry_from_category_index", new_entry_per_category[category_index]);
      console.log("current input_list from create_entry_from_category_index: ", input_list);
      new_entry_per_category[category_index] = '';
      return;
    }

    let object_id = (+new Date * Math.random()).toString(36).substring(0,6);
    let saved_input = new_entry_per_category[category_index];

    new_entry_per_category[category_index] = '';

    console.log("current saved_input from create_entry_from_category_index: ", saved_input);
    console.log("current new_entry_per_category[category_index] from create_entry_from_category_index: ", new_entry_per_category[category_index]);

    return {
      id: object_id,
      input: saved_input,
      date_created: new Date(),
      checked: false,
    };
  }

  async function add_entry_to_category(category_index: number) {
    let new_entry = await create_entry_from_category_index(category_index);
    console.log("input_list in add_entry_to_category before doing anything: ", input_list);
    console.log("new_entry created in add_entry_to_category: ", new_entry);

    if(new_entry === undefined || (Object.entries(new_entry).length === 0)) {
      console.log("input_list in add_entry_to_category when new_entry is undefined: ", input_list);
      return;
    }

    input_list[category_index].items = [...input_list[category_index].items, new_entry];
    console.log("category with new entry in add_entry_to_category", input_list[category_index]);
    console.log("full input_list with new entry in add_entry_to_category", input_list);

    try {
      // /* Test values here!! */
      // test_response = {tasklist: input_list};


      await chrome.storage.local.set({"tasklist": input_list});
      input_list = [...input_list];
      console.log("input_list after set in storage in add_entry_to_category: ", input_list);
      new_entry_per_category[category_index] = '';
    } catch (error) {
      console.log("Error setting new category in add_entry_to_category", error);
    }
  }

  async function update_all() {
    console.log("input_list in update_all before setting to local storage", input_list);
    await chrome.storage.local.set({"tasklist": input_list});
  }

  async function remove_entry(category_index: number, entryIndex: number) {
    try {
      // /* Test values here!! */
      // let response = test_response;

      console.log("input_list in remove_entry", input_list);
      console.log("entry to remove in remove_entry", input_list[category_index].items[entryIndex]);

      let updated_input_list = structuredClone(input_list);
      console.log("updatedEntryListInCategory in remove_entry", updated_input_list);
      updated_input_list[category_index].items.splice(entryIndex, 1);

      console.log("updatedEntryListInCategory after removing entry in remove_entry", updated_input_list);
      console.log("input_list after removing entry in remove_entry", input_list);

      await chrome.storage.local.set({"tasklist": updated_input_list});
      input_list = updated_input_list;

      console.log("latest input_list after removing entry in remove_entry", input_list);

      // // /* Test values here!! */
      // // test_response = {tasklist: input_list};
    } catch (error) {
      console.log("Error removing entry in remove_entry", error);
    }
  }

  async function clear_storage() {
    // /* Test values here!! */
    // test_response = {tasklist: []};


    await chrome.storage.local.clear();
    input_list = [];
    console.log("updated input_list once clear_storage is called: ", input_list);
  }

  async function display_stored_entries() {
    // /* Test values here!! */
    // let response = test_response;


    let response = await chrome.storage.local.get("tasklist");
    input_list = TASKLIST in response && Array.isArray(response.tasklist) && response.tasklist.length !== 0 ? response.tasklist : input_list;
    console.log("input_list in display_stored_entries", input_list);
  }

</script>

<div>
  <form on:submit|preventDefault={set_category}>
    <input bind:value={category_input}>
    <button type="submit">Create Category</button>
    <button on:click={clear_storage}>Clear All</button>
  </form>

  {#if input_list.length > 0}
  <div id="categories" on:change={() => update_all()}>
    {#await display_entries}
    <p>Add a category</p>
    {:then}
    {#each input_list as category, category_index (category.id)}
      <input class="category" type="text" bind:value={category.name} />
        <ul>
          {#if category.items !== undefined && category.items.length > 0}
          {#each category.items as item, itemIndex (item.id)}
            <li>
              <label class="entry">
                <input type="checkbox" bind:checked={item.checked} />
                <input type="text" bind:value={item.input} />
              </label>
              <span on:click={() => remove_entry(category_index, itemIndex)}>❌</span>
            </li>
          {/each}
          {/if}
          <form class="entry" on:submit|preventDefault={() => add_entry_to_category(category_index)}>
            <input bind:value={new_entry_per_category[category_index]}>
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
