import UiTest from '../components/UiTest.svelte';
import "carbon-components-svelte/css/g100.css";
// import '../app.css';
import Home from '../components/Home.svelte';

const target = document.getElementById('app');

function render() {
  // new Home({target});
  new Home({target: document.body});
  // new UiTest({target: document.body});
}

document.addEventListener('DOMContentLoaded', render);
