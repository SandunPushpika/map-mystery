export interface User{
    id: string;
    nickname: string;
    joinedAt: Date;
}

export interface Room{
    id: string;
    roomCode: string;
    creatorId: string;
    createdAt: Date;
}