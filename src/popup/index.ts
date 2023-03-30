import '../app.css';
import Home from '../components/Home.svelte';

const target = document.getElementById('app');

function render() {
  new Home({target});
}

document.addEventListener('DOMContentLoaded', render);
