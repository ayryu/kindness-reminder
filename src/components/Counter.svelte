<!-- <script lang="ts">
  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<button on:click={increment}>
  count is {count}
</button> -->

<script lang="ts">
  export let count: number;
  let message: string = null;

  const increment = () => (count += 1);
  const decrement = () => (count -= 1);

  const handleSave = () => {
    chrome.storage.sync.set({count}).then(() => {
      message = 'Updated!';

      setTimeout(() => {
        message = null;
      }, 2000);
    });
  };
</script>

<div>
  <p>
    Current count: <span>{count}</span>
  </p>
  <div>
    <button on:click={decrement}>-</button>
    <button on:click={increment}>+</button>
    <button on:click={handleSave}>Save</button>
    {#if message}<span>{message}</span>{/if}
  </div>
</div>

<style scoped>
  button {
    color: blue;
    /* padding: theme('spacing.2') theme('spacing.4');
    font-size: theme('fontSize.base'); */
    border: 1px solid;
    /* box-shadow: theme('boxShadow.lg');
    background-color: theme('backgroundColor.blue.50'); */
  }

  button:hover,
  button:focus {
    background-color: theme('colors.blue.800');
    color: theme('colors.blue.50');
  }
</style>
