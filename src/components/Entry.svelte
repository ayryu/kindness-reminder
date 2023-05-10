<!-- <script lang="ts">
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
        <input bind:checked={checkedValue} type=checkbox name="selectedTasks" value={entry.input}>
        <span class:checked={entry.checked}>{entry.input}</span>
    </label>
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
  </style> -->