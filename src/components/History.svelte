<script lang="ts">
    import { Accordion, AccordionItem } from "carbon-components-svelte";

	let startOfToday = new Date().setHours(0,0,0,0);
    let historyResults = organizeHistoryPromise();

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
</script>

<!-- <p>
    Start of Today: <span>{new Date(startOfToday)}</span>
</p> -->

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