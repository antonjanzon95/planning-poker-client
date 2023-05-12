import { createRoomElements } from './createRoom';
import { socket } from './main';
import { addUserSockets } from './sockets';
import { v4 as uuidv4 } from 'uuid';

export interface Room {
  admin: Admin;
  users: User[];
  usersWhoLeft: User[];
  upcomingTopics: Topic[];
  currentTopic: CurrentTopic;
  previousTopics: Topic[];
}

export interface Admin {
  name: string;
  socketId: string;
}

export interface User {
  name: string;
  id: string;
  socketId?: string;
}
export interface Topic {
  title?: string;
  votes?: Vote[];
  score?: number;
}

interface CurrentTopic {
  title: string;
  votes: Vote[];
  score: number;
}
interface Vote {
  user: User;
  score: number;
}

export function getAllRooms() {
  fetch('http://localhost:3000/rooms')
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        console.log('No rooms found');
      }
      renderRooms(data);
    });
  monitorRooms();
}

export function renderRooms(rooms: Room[]) {
  const div = document.createElement('div');
  div.classList.add('room-select-container');
  const main = document.querySelector<HTMLDivElement>('.main-content');
  main!.innerHTML = '<h1>Öppna Rum</h1>';
  const adminText = document.createElement('p');
  adminText.innerText = 'Rum Admin:';

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    const roomDiv = document.createElement('div');
    roomDiv.classList.add('room');
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    const roomName = document.createElement('h2');
    roomName.innerText = room.admin.name;
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `input-${i}`;
    input.placeholder = 'Skriv in ditt namn';
    const button = document.createElement('button');
    button.id = `joinBtn-${i}`;
    button.innerText = 'Gå med';
    button.addEventListener('click', () => {
      socket.off('monitorRooms');
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        const user = {
          name: input.value,
          id: uuidv4(),
        };
        localStorage.setItem('user', JSON.stringify(user));
        addUserSockets();
        return socket.emit('joinRoom', { user: user, roomIndex: i });
      }

      const userFromStorage = JSON.parse(storedUser);
      addUserSockets();
      socket.emit('reJoinRoom', userFromStorage);
    });

    inputContainer.append(input, button);
    roomDiv.append(adminText, roomName, inputContainer);
    div.append(roomDiv);
  }

  main!.append(div);
  createRoomElements();
  reJoinCheck(rooms);
}

function reJoinCheck(rooms: Room[]) {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return;
  }

  const userFromStorage: User = JSON.parse(storedUser);

  const roomWithUser: Room | undefined = rooms.find((room) =>
    room.usersWhoLeft.find((user) => user.id == userFromStorage.id)
  );

  if (!roomWithUser) {
    return;
  }

  const roomIndex = rooms.indexOf(roomWithUser);

  const joinBtn = document.querySelector(
    `#joinBtn-${roomIndex}`
  ) as HTMLButtonElement;

  if (joinBtn) {
    const input = document.querySelector(
      `#input-${roomIndex}`
    ) as HTMLInputElement;
    input.style.display = 'none';
    joinBtn.innerHTML = 'Återanslut';
  }
}

export function monitorRooms() {
  socket.off('monitorRooms');
  socket.on('monitorRooms', () => {
    getAllRooms();
  });
}
