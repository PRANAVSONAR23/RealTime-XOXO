import { Server, Socket } from "socket.io";
import { checkWinner, createGameState, generateRoomCode } from "./gameLogic.js";
import {
    ChatMessage,
    JoinRoomData,
    MakeMoveData,
    Room,
    SendMessageData,
} from "./types.js";

// Game state storage
const rooms = new Map<string, Room>();
const chatMessages = new Map<string, ChatMessage[]>();

export const setupSocketHandlers = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        socket.on("create-room", (playerName: string) => {
            const roomCode = generateRoomCode();
            const room: Room = {
                code: roomCode,
                players: [{ id: socket.id, name: playerName, symbol: "X" }],
                gameState: createGameState(),
            };

            rooms.set(roomCode, room);
            chatMessages.set(roomCode, []);

            socket.join(roomCode);
            socket.emit("room-created", { roomCode, room });
        });

        socket.on("join-room", (data: JoinRoomData) => {
            const { roomCode, playerName } = data;
            const room = rooms.get(roomCode);

            if (!room) {
                socket.emit("room-error", "Room not found");
                return;
            }

            if (room.players.length >= 2) {
                socket.emit("room-error", "Room is full");
                return;
            }

            const player = {
                id: socket.id,
                name: playerName,
                symbol: "O" as const,
            };
            room.players.push(player);

            socket.join(roomCode);

            // Notify all players in the room
            io.to(roomCode).emit("room-updated", { room });
        });

        socket.on("start-game", (roomCode: string) => {
            const room = rooms.get(roomCode);

            if (!room || room.players.length !== 2) {
                socket.emit("game-error", "Cannot start game: need 2 players");
                return;
            }

            room.gameState.gameStarted = true;
            room.gameState.board = Array(9).fill(null);
            room.gameState.currentPlayer = "X";
            room.gameState.winner = null;
            room.gameState.isDraw = false;

            io.to(roomCode).emit("game-started", room);
        });

        socket.on("make-move", (data: MakeMoveData) => {
            const { roomCode, position } = data;
            const room = rooms.get(roomCode);

            if (!room || !room.gameState.gameStarted) {
                socket.emit("game-error", "Game not started");
                return;
            }

            const player = room.players.find((p) => p.id === socket.id);
            if (!player || player.symbol !== room.gameState.currentPlayer) {
                socket.emit("game-error", "Not your turn");
                return;
            }

            if (room.gameState.board[position] !== null) {
                socket.emit("game-error", "Position already taken");
                return;
            }

            // Make the move
            room.gameState.board[position] = room.gameState.currentPlayer;

            // Check for winner
            const result = checkWinner(room.gameState.board);
            if (result === "draw") {
                room.gameState.isDraw = true;
            } else if (result) {
                room.gameState.winner = result;
            } else {
                // Switch player
                room.gameState.currentPlayer =
                    room.gameState.currentPlayer === "X" ? "O" : "X";
            }

            io.to(roomCode).emit("game-updated", room.gameState);
        });

        socket.on("send-message", (data: SendMessageData) => {
            const { roomCode, message, playerName } = data;
            const room = rooms.get(roomCode);

            if (!room) {
                socket.emit("chat-error", "Room not found");
                return;
            }

            const chatMessage: ChatMessage = {
                id: Date.now(),
                playerName,
                message,
                timestamp: new Date().toLocaleTimeString(),
            };

            const messages = chatMessages.get(roomCode) || [];
            messages.push(chatMessage);
            chatMessages.set(roomCode, messages);

            io.to(roomCode).emit("new-message", chatMessage);
        });

        socket.on("reset-game", (roomCode: string) => {
            const room = rooms.get(roomCode);

            if (!room) {
                socket.emit("game-error", "Room not found");
                return;
            }

            room.gameState = createGameState();
            room.gameState.gameStarted = true;

            io.to(roomCode).emit("game-reset", room.gameState);
        });

        socket.on("disconnect", () => {
            // Remove player from all rooms
            for (const [roomCode, room] of rooms.entries()) {
                const playerIndex = room.players.findIndex(
                    (p) => p.id === socket.id,
                );
                if (playerIndex !== -1) {
                    room.players.splice(playerIndex, 1);

                    if (room.players.length === 0) {
                        // Remove empty room
                        rooms.delete(roomCode);
                        chatMessages.delete(roomCode);
                    } else {
                        // Notify remaining players
                        io.to(roomCode).emit("room-updated", room);
                    }
                    break;
                }
            }
        });
    });
};
