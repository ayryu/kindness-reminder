import '../app.css';
import Home from '../components/Home.svelte';

const target = document.getElementById('app');

function render() {
  // const {count} = await chrome.storage.sync.get({count: 0});

  new Home({target});
}

document.addEventListener('DOMContentLoaded', render);
