import { socket } from './main';

export function startGame() {
  socket.emit('startGame');
}

export function nextTopic() {
  socket.emit('nextTopic');
}
