import { init, socket } from './main';
import { Room, getAllRooms } from './roomSelection';
import { superadminLogin } from './superadminLogin';

export function endSession() {
  socket.emit('endSession');
}

export function renderEndSessionPage(room: Room) {
  if (localStorage.getItem('user')) {
    localStorage.removeItem('user');
  }
  const app = document.querySelector('#app');
  app!.innerHTML = `
    <div class="grid-container">
      <header class="header"></header>
      <aside class="upcoming-topics"></aside>
      <main class="main-content"><h2>Öppna Rum<h2></main>
      <section class="previous-topics"></section>
      <footer class="footer"></footer>
    </div>`;

  const main = document.querySelector<HTMLDivElement>('.main-content');
  main!.innerHTML = '';

  const heading = document.createElement('h1');
  heading.innerHTML = 'Planning Poker rundan är avslutad.';

  const backBtn = document.createElement('button');
  backBtn.innerHTML = 'Tillbaka till rum-val';
  backBtn.addEventListener('click', init);

  const topicsTable = document.createElement('table');
  const tableHead = document.createElement('thead');
  const tableHeadRow = document.createElement('tr');
  const tableHeadTopic = document.createElement('th');
  tableHeadTopic.innerHTML = 'Titel';
  const tableHeadScore = document.createElement('th');
  tableHeadScore.innerHTML = 'Poäng';

  tableHeadRow.append(tableHeadTopic, tableHeadScore);
  tableHead.appendChild(tableHeadRow);

  const tableBody = document.createElement('tbody');

  room.previousTopics.map((topic) => {
    const tableBodyRow = document.createElement('tr');
    const topicTitle = document.createElement('td');
    topicTitle.innerHTML = topic.title || '';
    const topicScore = document.createElement('td');
    topic.score
      ? (topicScore.innerHTML = topic.score.toString())
      : (topicScore.innerHTML = 'Ofullständig röstning');

    tableBodyRow.append(topicTitle, topicScore);
    tableBody.appendChild(tableBodyRow);
  });

  topicsTable.append(tableHead, tableBody);
  main?.append(heading, topicsTable, backBtn);
}
