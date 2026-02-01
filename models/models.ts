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

type GameMode = "Year & Location Guess" | "Location Only";

export interface GameSettings {
  mode: GameMode;
  rounds: number;
  timer: boolean;
  roomId: string;
  id: string;
}

export interface GameResults {
  userId: string;
  roomId: string;
  playerName: string;
  round: number;
  yearGuess?: number;
  lat: number;
  lng: number;
  marks: number;
  totalMarks: number;
}

export interface RoundImages {
  round: number;
  imageUrl: string;
  year: number;
  lng: number;
  lat: number;
  roomId: string;
}
