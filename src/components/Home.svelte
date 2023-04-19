<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";

  let startOfToday = new Date().setHours(0,0,0,0);
  let storageList = [];

  let textInput = '';

  // async function setToStorage() {
  //   let objectId = (+new Date * Math.random()).toString(36).substring(0,6);
  //   let object = 
  //     {
  //       [objectId] : 
  //         {
  //           id: objectId,
  //           userInput: textInput,
  //           dateCreated: new Date()
  //         }
  //     };
  //   let internalObject = {
  //     id: objectId,
  //     userInput: textInput,
  //     dateCreated: new Date()
  //   };
  //   let storageObject = {[objectId] : internalObject};
  //   // await chrome.storage.local.set(object);
  //   await chrome.storage.local.set(storageObject);
  //   storageList = [...storageList, internalObject];
  //   console.log("storageList", storageList);
  // }

  async function setToStorage() {
    let objectId = (+new Date * Math.random()).toString(36).substring(0,6);
    let internalObject = {
      id: objectId,
      userInput: textInput,
      dateCreated: new Date()
    };

    let response = await chrome.storage.local.get("tasklist");
    console.log("type of response in setToStorage", typeof(response));
    let unupdatedList = response.tasklist;
    console.log("response length", Object.keys(response).length);

    let updatedList = Object.keys(response).length === 0 ?
      [internalObject] : [...unupdatedList, internalObject];

    // let updatedList = [...unupdatedList, internalObject];
    let storageObject = {"tasklist" : updatedList};
    await chrome.storage.local.set(storageObject);
    console.log("storageObject", storageObject);
    

    // let storageObject = {"tasklist" : internalObject};
    // await chrome.storage.local.set(object);
    // await chrome.storage.local.set(storageObject);
    // storageList = [...storageList, internalObject];
    // console.log("storageList", storageList);
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

  async function getFromStoragePromise() {
    let response = await chrome.storage.local.get("tasklist");
    console.log("unaltered response", response);
    console.log("response.tasklist", response.tasklist);
    
    
    // console.log("Object.entries", Object.entries(response));

    // let newObj = {};
    // for(const innerObject in response) {
    //   console.log("type of response", typeof(response));
    //   console.log("innerObject", response[innerObject]);
    //   console.log("response", response);
    // }
    return response;
  }

  // async function getSortedEntries() {
  //   let response = await chrome.storage.local.get();

  //   let newObj = {};
  //   for(const innerObject in response) {
  //     console.log("type of response", typeof(response));
  //     console.log("innerObject", response[innerObject]);
  //     console.log("response", response);
  //   }
  //   return response;
  //   // 
  //   // show sorted entries from storageList
  // }

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
<button on:click={setToStorage}>Add</button>
<button on:click={clearStorage}>Clear All</button>

<!-- {#if storageList.length !== 0}
<div id="checklist">
  {#each storageList as entry}
  <label>
    <input type=checkbox name="selectedTasks" value={entry.userInput}>
    {entry.userInput}
  </label>
  {/each}

</div>
{/if} -->

<!-- {#if storageList.length !== 0} -->
<div id="checklist">
  {#await getFromStoragePromise()}
  <p>...waiting</p>
  {:then resultsObject}
  {#each resultsObject.tasklist as element, index (element)}
      <label>
        <input type=checkbox name="selectedTasks" value={element.userInput}>
        {element.userInput}
      </label>
      <!-- <span on:click={() => removeFromStorage(element[0])}>❌</span> -->
    {/each}
    <!-- {#each Object.entries(resultsObject) as element, index (element)}
      <label>
        <input type=checkbox name="selectedTasks" value={element[1].userInput}>
        {element[1].userInput}
      </label>
      <span on:click={() => removeFromStorage(element[0])}>❌</span>
    {/each} -->


    <!-- {#each Object.entries(resultsObject) as [key, value], index (key)}
      <label>
        <input type=checkbox name="selectedTasks" value={key[userInput]}>
        {key["userInput"]}
      </label>
    {/each} -->
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
