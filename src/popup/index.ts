import '../app.css';
import Counter from '../components/Counter.svelte';

const target = document.getElementById('app');

function render() {
  // const {count} = await chrome.storage.sync.get({count: 0});

  new Counter({target});
}

document.addEventListener('DOMContentLoaded', render);
