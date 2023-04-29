<script lang="ts">
    import { Entry } from "src/classes/Entry";
    let textInput = '';

    let entry = new Entry(textInput);
    $: checkedValue = !entry.checked;

    $ : {

    }

    // Whenever the entry.checked changes, I want the changes to be stored via the storage API


</script>

<div class="entry">
    <label>
        <input bind:checked={checkedValue} type=checkbox name="selectedTasks" value={entry.userInput}>
        <span class:checked={entry.checked}>{entry.userInput}</span>
        <!-- <input bind:checked={entry.checked} type=checkbox name="selectedTasks" value={entry.userInput}>
        <span class:checked={entry.checked}>{entry.userInput}</span> -->
    </label>
    <!-- <span on:click={() => removeEntry(index)}>❌</span> -->
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
      background-color: greenyellow;
    }
  </style>