import '../style.css';
import { io } from 'socket.io-client';
import { getAllRooms, monitorRooms } from './roomSelection';
import { superadminLogin } from './superadminLogin';

export const app = document.querySelector('#app');

app!.innerHTML = `
      <div class="grid-container">
        <header class="header"></header>
        <aside class="upcoming-topics"></aside>
        <main class="main-content"><h2>Öppna Rum<h2></main>
        <section class="previous-topics"></section>
        <footer class="footer"></footer>
      </div>`;

export const socket = io('http://localhost:3000');

export function init(): void {
  getAllRooms();
  superadminLogin();
  monitorRooms();
}

init();
