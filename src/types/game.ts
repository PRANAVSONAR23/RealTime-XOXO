export interface Player {
    id: string;
    name: string;
    symbol: "X" | "O";
}

export interface GameState {
    board: (string | null)[];
    currentPlayer: "X" | "O";
    winner: string | null;
    isDraw: boolean;
    gameStarted: boolean;
}

export interface Room {
    code: string;
    players: Player[];
    gameState: GameState;
}

export interface ChatMessage {
    id: number;
    playerName: string;
    message: string;
    timestamp: string;
    isRead: boolean;
}
