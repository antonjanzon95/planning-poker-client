import { printAdminView } from './adminView';
import { renderEndSessionPage } from './endSession';
import { app, socket } from './main';
import { addVote, renderRunningRoom, renderUserView } from './userView';
import { Room } from './roomSelection';

export function addAdminSockets() {
  socket.on('userLeftAdmin', (room) => {
    console.log(
      room.usersWhoLeft[room.usersWhoLeft.length - 1].name +
        ' has left the room'
    );
    printAdminView(room);
  });

  socket.on('renderRoomAdmin', (room) => {
    printAdminView(room);
  });

  socket.on('changeTopicOrderAdmin', (room) => {
    printAdminView(room);
  });

  socket.on('removeTopicAdmin', (room) => {
    printAdminView(room);
  });

  socket.on('addTopicAdmin', (room) => {
    printAdminView(room);
  });

  socket.on('nextTopicAdmin', (room: Room) => {
    printAdminView(room);
  });

  socket.on('endSession', (room) => {
    renderEndSessionPage(room);
  });

  socket.on('noTopics', () => {
    console.log('You need to add atleast 1 topic to start the game.');
  });

  socket.on('missingVotes', () => {
    console.log("Everyone hasn't finished voting yet.");
  });

  socket.on('vote', (room: Room) => {
    console.log(room);
    addVote(room, false);
  });

  socket.on('allVoted', (room: Room) => {
    addVote(room, true);
  });
}

export function addUserSockets() {
  socket.on('userLeft', (room) => {
    isRoomRunning(room);
  });

  socket.on('renderRoomUser', (room) => {
    isRoomRunning(room);
  });

  socket.on('changeTopicOrder', (room) => {
    isRoomRunning(room);
  });

  socket.on('removeTopic', (room) => {
    isRoomRunning(room);
  });

  socket.on('addTopic', (room) => {
    isRoomRunning(room);
  });

  socket.on('nextTopic', (room) => {
    isRoomRunning(room);
  });

  socket.on('userAlreadyInRoom', (data) => {
    console.log(data);
    const error = document.createElement('p');
    error.innerText = 'Namnet är upptaget, välj ett annat';
    app!.append(error);
  });

  socket.on('joinRoom', (room: Room) => {
    isRoomRunning(room);
  });

  socket.on('monitorRoom', (room: Room) => {
    isRoomRunning(room);
  });

  socket.on('vote', (room: Room) => {
    console.log(room);
    addVote(room, false);
  });

  socket.on('allVoted', (room: Room) => {
    addVote(room, true);
  });

  socket.on('endSession', (room) => {
    renderEndSessionPage(room);
  });
}

function isRoomRunning(room: Room) {
  if (room.currentTopic) {
    return renderRunningRoom(room);
  }
  renderUserView(room);
}
