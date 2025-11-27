import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { GameState, Room } from "../types/game";
import Chat from "./Chat";
import GameBoard from "./GameBoard";
import GameHeader from "./GameHeader";
import GameStatusBanner from "./GameStatusBanner";
import PlayersInfo from "./PlayersInfo";

interface GameRoomProps {
    room: Room;
    socket: Socket | null;
    currentPlayerId: string;
    onLeaveRoom: () => void;
}

const GameRoom: React.FC<GameRoomProps> = ({
    room,
    socket,
    currentPlayerId,
    onLeaveRoom,
}) => {
    const [gameState, setGameState] = useState<GameState>(room.gameState);
    const [copied, setCopied] = useState(false);

    const currentPlayer = room.players.find((p) => p.id === currentPlayerId);
    // const opponent = room.players.find((p) => p.id !== currentPlayerId);

    const handleGameStarted = (updatedRoom: Room) => {
        setGameState(updatedRoom.gameState);
    };

    const handleGameUpdated = (updatedGameState: GameState) => {
        setGameState(updatedGameState);
    };

    const handleGameReset = (updatedGameState: GameState) => {
        setGameState(updatedGameState);
    };

    useEffect(() => {
        if (!socket) return;
        socket.on("game-started", handleGameStarted);

        socket.on("game-updated", handleGameUpdated);

        socket.on("game-reset", handleGameReset);

        return () => {
            socket.off("game-started", handleGameStarted);
            socket.off("game-updated", handleGameUpdated);
            socket.off("game-reset", handleGameReset);
        };
    }, [socket]);

    const handleStartGame = () => {
        socket?.emit("start-game", room.code);
    };

    const handleResetGame = () => {
        socket?.emit("reset-game", room.code);
    };

    const handleCopyRoomCode = async () => {
        try {
            await navigator.clipboard.writeText(room.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy room code:", err);
        }
    };

    const canStartGame = room.players.length === 2 && !gameState.gameStarted;
    const isGameOver = gameState.winner || gameState.isDraw;
    const isCurrentPlayerTurn =
        gameState.gameStarted &&
        gameState.currentPlayer === currentPlayer?.symbol;

    const getGameStatusMessage = () => {
        if (!gameState.gameStarted) {
            return room.players.length < 2
                ? "Waiting for another player..."
                : "Ready to start!";
        }

        if (gameState.isDraw) {
            return "It's a draw! 🤝";
        }

        if (gameState.winner) {
            const winnerPlayer = room.players.find(
                (p) => p.symbol === gameState.winner,
            );
            return `${winnerPlayer?.name?.split(" ")?.[0]} wins! 🎉`;
        }

        const currentTurnPlayer = room.players.find(
            (p) => p.symbol === gameState.currentPlayer,
        );
        return `${currentTurnPlayer?.name}'s turn`;
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-black ">
            <GameHeader
                canStartGame={canStartGame}
                copied={copied}
                isGameOver={!!isGameOver}
                isGameStarted={gameState.gameStarted}
                onCopyRoomCode={handleCopyRoomCode}
                onLeaveRoom={onLeaveRoom}
                onStartGame={handleStartGame}
                onResetGame={handleResetGame}
                playersCount={room.players.length}
                roomCode={room.code}
            />
            {/* Main Content */}
            <div className="z-10 flex h-[calc(100dvh-70px)] flex-1">
                <div className="flex w-full flex-1 flex-col overflow-y-auto lg:flex-row">
                    <div className="flex w-full flex-col-reverse justify-center gap-4 self-center p-4 md:w-[350px] lg:flex-col">
                        <GameStatusBanner
                            isCurrentPlayerTurn={isCurrentPlayerTurn}
                            isGameOver={!!isGameOver}
                            message={getGameStatusMessage()}
                        />
                        <PlayersInfo
                            currentPlayerId={currentPlayer?.id || ""}
                            gameState={gameState}
                            room={room}
                        />
                        {/* Game Board */}
                    </div>
                    <div className="flex h-full flex-1 flex-col p-4 pt-0 pb-16 md:p-8 md:pb-4">
                        <div className="flex flex-1 items-center justify-center">
                            <GameBoard
                                gameState={gameState}
                                onMove={(position) =>
                                    socket?.emit("make-move", {
                                        roomCode: room.code,
                                        position,
                                    })
                                }
                                disabled={
                                    !gameState.gameStarted ||
                                    !!isGameOver ||
                                    !isCurrentPlayerTurn
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col">
                    {/* Enhanced Chat Area - 30% */}
                    <Chat
                        roomCode={room.code}
                        currentPlayerName={currentPlayer?.name || ""}
                        socket={socket}
                    />
                </div>
            </div>
        </div>
    );
};

export default GameRoom;
