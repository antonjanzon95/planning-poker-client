import { User, Topic, Room, monitorRooms } from './roomSelection';
import { socket } from './main';

export function renderUserView(room: Room) {
  console.log(room);
  const main = document.querySelector('.main-content');
  const footer = document.querySelector('.footer');
  const header = document.querySelector('.header');
  const awaitStart = document.createElement('h2');
  awaitStart.innerHTML = 'Inväntar start...';
  const leaveBtn = document.createElement('button');
  leaveBtn.innerHTML = 'Lämna rum';
  leaveBtn.classList.add('leave-room-btn');
  leaveBtn.addEventListener('click', () => {
    monitorRooms();
    socket.emit('leaveRoom');
  });
  main!.innerHTML = '';
  header!.innerHTML = '';
  footer!.innerHTML = '';
  const h1 = document.createElement('h1');
  h1.innerHTML = 'Rum Admin: ' + room.admin.name;
  header!.append(h1);
  const h2 = document.createElement('h2');
  h2.innerHTML = 'Användare i rummet: ';
  main!.append(h2);

  renderUserCards(room.users);
  footer?.append(awaitStart, leaveBtn);
}

export const renderUserCards = (users: User[]) => {
  console.log('renderUserCards', users);
  const main = document.querySelector('.main-content');
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('user-card-container');
  users.forEach((user: User) => {
    const userCard = document.createElement('div');
    cardContainer.classList.add('user-card');
    const userName = document.createElement('h3');
    userName.innerHTML = user.name;

    userCard.appendChild(userName);
    cardContainer?.appendChild(userCard);
  });
  main?.appendChild(cardContainer);
};

export function renderRunningRoom(room: Room) {
  renderComingTopics(room.upcomingTopics);
  renderPreviousTopics(room.previousTopics);
  renderMainTopic(room.currentTopic);
  renderVotingCards();
}

export function renderComingTopics(topics: Topic[]) {
  const upcomingTopics = document.querySelector('.upcoming-topics');
  upcomingTopics!.innerHTML = '';
  const container = document.createElement('div');
  const upcomingTopicsHeader = document.createElement('h2');
  upcomingTopicsHeader.innerHTML = 'Kommande ämnen';
  const ulContainer = document.createElement('ul');

  topics.forEach((topic) => {
    const li = document.createElement('li');
    li.innerHTML = topic.title || '';
    ulContainer.appendChild(li);
  });
  container.append(upcomingTopicsHeader, ulContainer);
  upcomingTopics?.appendChild(container);
}

export function renderPreviousTopics(topics: Topic[]) {
  const previousTopics = document.querySelector('.previous-topics');
  previousTopics!.innerHTML = '';
  const container = document.createElement('div');
  const previousTopicsHeader = document.createElement('h2');
  previousTopicsHeader.innerHTML = 'Tidigare ämnen';
  const ulContainer = document.createElement('ul');

  topics.forEach((topic: Topic) => {
    const li = document.createElement('li');
    li.innerHTML = topic.title + ' - Poäng: ' + topic.score;
    ulContainer.appendChild(li);
  });
  container.append(previousTopicsHeader, ulContainer);
  previousTopics?.appendChild(container);
}

export function renderMainTopic(topic: Topic) {
  const main = document.querySelector('.main-content');
  main!.innerHTML = '';
  const mainTopic = document.createElement('div');
  mainTopic.classList.add('main-topic');
  const mainTopicHeader = document.createElement('h3');
  mainTopicHeader.innerHTML = 'Nuvarande ämne';
  const mainTopicTitle = document.createElement('h2');
  mainTopicTitle.innerHTML = topic.title || '';
  mainTopic.append(mainTopicHeader, mainTopicTitle);
  main?.appendChild(mainTopic);
}

export function renderVotingCards() {
  const footer = document.querySelector('.footer');
  footer!.innerHTML = '';

  const leaveBtn = document.createElement('button');
  leaveBtn.innerHTML = 'Lämna rum';
  leaveBtn.classList.add('leave-room-btn');
  leaveBtn.addEventListener('click', () => {
    monitorRooms();
    socket.emit('leaveRoom');
  });

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('voting-card-container');
  for (let i = 0; i < 6; i++) {
    const votingCard = document.createElement('div');
    votingCard.classList.add('voting-card');
    const votingCardValue = document.createElement('h3');
    switch (i) {
      case 0:
        votingCardValue.innerHTML = '?';
        votingCard.addEventListener('click', () => {
          castVote(0);
        });
        break;
      case 1:
        votingCardValue.innerHTML = '1';
        votingCard.addEventListener('click', () => {
          castVote(1);
        });
        break;
      case 2:
        votingCardValue.innerHTML = '3';
        votingCard.addEventListener('click', () => {
          castVote(3);
        });

        break;
      case 3:
        votingCardValue.innerHTML = '5';
        votingCard.addEventListener('click', () => {
          castVote(5);
        });

        break;
      case 4:
        votingCardValue.innerHTML = '8';
        votingCard.addEventListener('click', () => {
          castVote(8);
        });
        break;
      case 5:
        votingCardValue.innerHTML = '13';
        votingCard.addEventListener('click', () => {
          castVote(13);
        });
        break;
    }
    votingCard.appendChild(votingCardValue);
    cardContainer?.appendChild(votingCard);
  }
  footer?.append(cardContainer, leaveBtn);
}

function castVote(value: number) {
  socket.emit('vote', value);
}

export function addVote(room: Room, revealScore: boolean) {
  const main = document.querySelector('.main-content');

  const findVoteCardContainer = document.querySelector('.vote-card-container');
  if (findVoteCardContainer) {
    main!.removeChild(findVoteCardContainer);
  }
  const voteCardContainer = document.createElement('div');
  voteCardContainer.classList.add('vote-card-container');
  room.currentTopic.votes!.forEach((vote) => {
    const voteCard = document.createElement('div');
    voteCard.classList.add('vote-card');
    if (revealScore) {
      const voteCardTitle = document.createElement('h3');
      voteCardTitle.innerHTML = vote.user.name;
      const voteCardValue = document.createElement('h2');
      voteCardValue.innerHTML = vote.score.toString();
      voteCard.append(voteCardTitle, voteCardValue);
    }
    console.log('voteCard', voteCard);
    // Card background?
    voteCardContainer.appendChild(voteCard);
  });
  if (revealScore) {
    const findAvgScore = document.querySelector('.avg-score');
    if (findAvgScore) {
      main!.removeChild(findAvgScore);
    }
    const avgScore = document.createElement('h2');
    avgScore.classList.add('avg-score');
    avgScore.innerHTML = 'SnittPoäng: ' + room.currentTopic.score;
    main!.append(avgScore);
  }
  main!.append(voteCardContainer);
}
