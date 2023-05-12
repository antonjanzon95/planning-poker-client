import { Room } from './roomSelection';
//import { renderUserCards } from "./userView";
import { endSession } from './endSession';
import { socket, app } from './main';
import { startGame } from './voting';

// const adminContainer = document.querySelector('#adminView') as HTMLDivElement;
// adminContainer.classList.add('grid');
// const adminContainer = document.querySelector('.grid') as HTMLDivElement;

export function printAdminView(room: Room) {
  app!.innerHTML = `
  <div class="grid">
    <div class="admin-add-topic"></div>
    <div class="admin-start-vote"></div>
    <div class="admin-next-topic"></div>
    <aside class="admin-upcoming-topics"></aside>
    <main class="main-content"></main>
    <section class="admin-previous-topics"></section>
    <div class="admin-end"></div>
  </div>`;

  createAddNewTopic();
  createUpcomingTopicsAdmin(room);
  createStartVoting();
  createNextTopicBtn();
  createCurrentTopic(room);
  createPreviousTopics(room);
  createEndBtn();
  //renderUserCards(room.users);
}

// export default function getRoom(/*e*/) {

//     //let id = e.target.id;

//     fetch(`http://localhost:3000/rooms/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data)
//         if (data.length === 0) {
//           console.log("No rooms found");
//         }
//         printAdminView(/*data*/);
//       });
//   }

function createAddNewTopic() {
  const addNewTopicContainer = document.querySelector(
    '.admin-add-topic'
  ) as HTMLDivElement;
  addNewTopicContainer.innerHTML = '';
  const addTopicTitle = document.createElement('p') as HTMLParagraphElement;
  const addTopicInput = document.createElement('input') as HTMLInputElement;
  const addNewTopicBtn = document.createElement('button') as HTMLButtonElement;

  addTopicTitle.innerText = 'Lägg till topic';
  addTopicInput.placeholder = 'Ny topic';
  addNewTopicBtn.innerText = 'Lägg till';

  addNewTopicBtn.addEventListener('click', () => {
    const newTopicTitle = addTopicInput.value;

    socket.emit('addTopic', newTopicTitle);
  });

  // adminContainer.appendChild(addNewTopicContainer);
  addNewTopicContainer.appendChild(addTopicTitle);
  addNewTopicContainer.appendChild(addTopicInput);
  addNewTopicContainer.appendChild(addNewTopicBtn);
}

export function createUpcomingTopicsAdmin(room: Room) {
  const upcomingTopicsContainer = document.querySelector(
    '.admin-upcoming-topics'
  ) as HTMLDivElement;
  upcomingTopicsContainer.innerHTML = '';
  const upcomingTopicsTitle = document.createElement(
    'h3'
  ) as HTMLHeadingElement;
  upcomingTopicsContainer.innerHTML = '';
  upcomingTopicsTitle.innerText = 'Kommande topics';
  // adminContainer.appendChild(upcomingTopicsContainer);
  upcomingTopicsContainer.appendChild(upcomingTopicsTitle);

  for (let i = 0; i < room.upcomingTopics.length; i++) {
    const topicContainer = document.createElement('div') as HTMLDivElement;
    const removeUpcomingTopicBtn = document.createElement(
      'button'
    ) as HTMLButtonElement;
    const upcomingTopic = document.createElement('p') as HTMLParagraphElement;
    const moveTopicUpBtn = document.createElement(
      'button'
    ) as HTMLButtonElement;
    const moveTopicDownBtn = document.createElement(
      'button'
    ) as HTMLButtonElement;

    removeUpcomingTopicBtn.innerText = '-';
    removeUpcomingTopicBtn.classList.add('remove-upcoming-topic-btn')
    removeUpcomingTopicBtn.id = `${i}`;
    upcomingTopic.innerText = room.upcomingTopics[i].title || '';
    moveTopicDownBtn.innerText = 'Ner';
    moveTopicDownBtn.classList.add('move-topic-down-btn')
    moveTopicUpBtn.innerText = 'Upp';
    moveTopicUpBtn.classList.add('move-topic-up-btn')

    if (room.upcomingTopics.length == 1) {
      moveTopicUpBtn.disabled = true;
      moveTopicDownBtn.disabled = true;
    } else if (i == 0) {
      moveTopicUpBtn.disabled = true;
    } else if (i >= room.upcomingTopics.length - 1) {
      moveTopicDownBtn.disabled = true;
    }

    removeUpcomingTopicBtn.addEventListener('click', () => {
      const topicIndex = i;
      socket.emit('removeTopic', topicIndex);
    });

    moveTopicDownBtn.addEventListener('click', (e: MouseEvent) => {
      const direction = (
        e.currentTarget as HTMLElement
      ).innerHTML.toLowerCase();

      socket.emit('changeTopicOrder', { topicIndex: i, direction: direction });
    });

    moveTopicUpBtn.addEventListener('click', (e: MouseEvent) => {
      const direction = (
        e.currentTarget as HTMLElement
      ).innerText.toLowerCase();
      socket.emit('changeTopicOrder', { topicIndex: i, direction: direction });
    });

    upcomingTopicsContainer.appendChild(topicContainer);
    topicContainer.appendChild(removeUpcomingTopicBtn);
    topicContainer.appendChild(upcomingTopic);
    topicContainer.appendChild(moveTopicUpBtn);
    topicContainer.appendChild(moveTopicDownBtn);
  }
}

function createStartVoting() {
  const startVotingContainer = document.querySelector(
    '.admin-start-vote'
  ) as HTMLDivElement;
  startVotingContainer.innerHTML = '';
  const startVotingBtn = document.createElement('button') as HTMLButtonElement;

  startVotingBtn.innerText = 'Starta röstningen';
  startVotingBtn.addEventListener('click', startGame);

  // adminContainer.appendChild(startVotingContainer);
  startVotingContainer.appendChild(startVotingBtn);
}

function createNextTopicBtn() {
  const nextTopicContainer = document.querySelector(
    '.admin-next-topic'
  ) as HTMLDivElement;
  nextTopicContainer.innerHTML = '';
  const nextTopicBtn = document.createElement('button') as HTMLButtonElement;

  nextTopicBtn.innerText = 'Nästa topic';
  nextTopicBtn.addEventListener('click', () => {
    socket.emit('nextTopic');
  });

  // adminContainer.appendChild(nextTopicContainer);
  nextTopicContainer.appendChild(nextTopicBtn);
}

function createCurrentTopic(room: Room) {
  const currentTopicContainer = document.querySelector('.main-content') as HTMLDivElement;
  currentTopicContainer.innerHTML = '';
  const currentTopicTitleContainer = document.createElement('div') as HTMLDivElement;
  currentTopicTitleContainer.classList.add('current-topic-title-container')
  const currentTopicTitle = document.createElement('p') as HTMLParagraphElement;

  currentTopicTitle.innerText = room.currentTopic
    ? room.currentTopic.title
    : 'Väntar på nästa fråga';

  // if (room.currentTopic.votes.length >= room.users.length) {
  //   averageValueTitle.innerText = 'Medelvärde';
  //   averageValue.innerText = `${room.currentTopic.score}`;
  // }
  // adminContainer.appendChild(currentTopicContainer);
  currentTopicContainer.appendChild(currentTopicTitleContainer);
  currentTopicTitleContainer.appendChild(currentTopicTitle);
}

function createPreviousTopics(room: Room) {
  const previousTopicContainer = document.querySelector(
    '.admin-previous-topics'
  ) as HTMLDivElement;
  previousTopicContainer.innerHTML = '';
  const previousTopicsTitle = document.createElement(
    'h3'
  ) as HTMLHeadingElement;

  previousTopicsTitle.innerText = 'Tidigare topics';
  previousTopicContainer.appendChild(previousTopicsTitle);

  for (let i = 0; i < room.previousTopics.length; i++) {
    const topicContainer = document.createElement('div') as HTMLDivElement;
    const previousTopic = document.createElement('p') as HTMLParagraphElement;
    previousTopic.innerText = room.previousTopics[i].title || '';
    previousTopicContainer.appendChild(topicContainer);
    topicContainer.appendChild(previousTopic);
  }

  // adminContainer.appendChild(previousTopicContainer);
}

function createEndBtn() {
  const endContainer = document.querySelector('.admin-end') as HTMLDivElement;
  endContainer.innerHTML = '';
  const endBtn = document.createElement('button') as HTMLButtonElement;

  endBtn.innerText = 'Avsluta';
  endBtn.addEventListener('click', endSession);

  // adminContainer.appendChild(endContainer);
  endContainer.appendChild(endBtn);
}
