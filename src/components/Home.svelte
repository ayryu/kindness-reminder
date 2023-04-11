<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";

  let startOfToday = new Date().setHours(0,0,0,0);

	let checklist = [
		{ id: (+new Date * Math.random()).toString(36).substring(0,6), task: 'Have food to eat'},
		{id: (+new Date * Math.random()).toString(36).substring(0,6), task: 'stand up'},
    {id: (+new Date * Math.random()).toString(36).substring(0,6), task: 'Check your body'},
	];

  let selectedTasks = [checklist[0]];

  let textInput = '';

  function addToChecklist() {
    if(textInput.length !== 0) {
      let id = (+new Date * Math.random()).toString(36).substring(0,6);
      checklist = [...checklist, {id: id, task: textInput}];
      textInput = '';
    }
  }

  function removeFromChecklist(index) {
		checklist.splice(index, 1);
		checklist = checklist;
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
  <p>
    Start of Today: <span>{new Date(startOfToday)}</span>
  </p>

<input bind:value={textInput}>
<button on:click={addToChecklist}>Add</button>

<div id="checklist">
  {#if checklist.length !== 0}
    {#each checklist as element, index (element.id)}
      <label>
        <input type=checkbox bind:group={selectedTasks} name="selectedTasks" value={element.id}>
        {element.task}
      </label>
      <span on:click={() => removeFromChecklist(index)}>❌</span>
    {/each}
  {/if}
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
