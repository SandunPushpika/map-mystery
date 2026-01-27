export interface User {
  id: string;
  nickname: string;
  joinedAt: Date;
}

export interface Room {
  id: string;
  roomCode: string;
  creatorId: string;
  createdAt: Date;
}

export interface GameStatus {
  isStarted: boolean;
  startedAt?: Date;
  endedAt?: Date;
  roomId: string;
}

export interface GameSettings {
  mode: string;
  rounds: number;
  timer: boolean;
  roomId: string;
  id: string;
}
