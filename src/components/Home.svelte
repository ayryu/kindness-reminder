<script lang="ts">
  import { Accordion, AccordionItem } from "carbon-components-svelte";

  let startOfToday = new Date().setHours(0,0,0,0);

  let flavours = ['Mint choc chip'];

	let menu = [
		{ id: 1, name: 'Cookies and cream'},
		{id: 2, name: 'Mint choc chip'},
    {id: 3, name: 'Cookies and cream'},
		{id: 4, name: 'Mint choc chip'},
    {id: 5, name: 'Cookies and cream'},
		{id: 6, name: 'Mint choc chip'},
		{id: 7, name: 'Raspberry ripple'}
	];

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

  {#await organizeHistoryPromise()}
    <p>...waiting</p>
  {:then organizedHistoryObject}
  <Accordion size="xl" align="start">
      {#each Object.entries(organizedHistoryObject) as [hostname, HistoryItems]}
        <AccordionItem title="{hostname}">
          <ul>
            {#each Object.values(HistoryItems) as historyItem}
              {#if historyItem.title.trim().length !== 0}
              <li><a href="{historyItem.url}" rel="noopener" target="_blank">
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

<div id="checklist">
  {#if menu.length !== 0}
    {#each menu as flavour (flavour.id)}
      <label>
        <input type=checkbox bind:group={flavours} name="flavours" value={flavour.id}>
        {flavour.name}
      </label>
    {/each}
  {/if}
</div>

<style scoped>
  #checklist {
    display: flex;
    flex-direction: column;
  }
</style>
