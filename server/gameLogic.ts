import { GameState } from "./types.js";

export const createGameState = (): GameState => ({
    board: Array(9).fill(null),
    currentPlayer: "X",
    winner: null,
    isDraw: false,
    gameStarted: false,
});

export const checkWinner = (board: (string | null)[]): string | null => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // columns
        [0, 4, 8],
        [2, 4, 6], // diagonals
    ];

    for (const line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.every((cell) => cell !== null) ? "draw" : null;
};

export const generateRoomCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};
