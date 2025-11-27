import { Circle, Sparkles, X } from "lucide-react";
import React from "react";
import { GameState } from "../types/game";

interface GameBoardProps {
    gameState: GameState;
    onMove: (position: number) => void;
    disabled: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
    gameState,
    onMove,
    disabled,
}) => {
    const renderSymbol = (symbol: string | null) => {
        if (symbol === "X") {
            return (
                <X
                    className="h-14 w-14 text-blue-400 drop-shadow-lg md:h-16 md:w-16"
                    strokeWidth={4}
                />
            );
        }
        if (symbol === "O") {
            return (
                <Circle
                    className="h-14 w-14 text-red-400 drop-shadow-lg md:h-16 md:w-16"
                    strokeWidth={4}
                />
            );
        }
        return null;
    };

    const getWinningLine = () => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const line of lines) {
            const [a, b, c] = line;
            if (
                gameState.board[a] &&
                gameState.board[a] === gameState.board[b] &&
                gameState.board[a] === gameState.board[c]
            ) {
                return line;
            }
        }
        return [];
    };

    const winningLine = getWinningLine();

    return (
        <div className="group relative w-full sm:w-2/3 md:w-[400px]">
            {/* Glow background */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-2xl transition-all duration-500 group-hover:blur-3xl" />
            {/* Game Board */}
            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
                {/* Header */}
                <div className="mb-4 text-center md:mb-6">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-white/70">
                        <Sparkles className="h-4 w-4" />
                        <span>Game Board</span>
                        <Sparkles className="h-4 w-4" />
                    </div>
                </div>

                {/* Grid */}
                <div className="mx-auto grid max-w-lg grid-cols-3 gap-3 md:gap-4">
                    {gameState.board.map((cell, index) => (
                        <button
                            key={index}
                            onClick={() => !disabled && !cell && onMove(index)}
                            disabled={disabled || !!cell}
                            className={`group/cell relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 transition-all duration-300 ${
                                !disabled && !cell
                                    ? "cursor-pointer hover:scale-105 hover:border-white/40 hover:bg-white/20"
                                    : "cursor-not-allowed"
                            } ${
                                winningLine.includes(index)
                                    ? "animate-pulse border-green-400/60 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-green-500/30"
                                    : ""
                            } `}
                        >
                            {/* Hover effect */}
                            {!disabled && !cell && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover/cell:opacity-100" />
                            )}

                            {/* Symbol */}
                            <div className="relative z-10 transition-transform duration-300 group-hover/cell:scale-110">
                                {renderSymbol(cell)}
                            </div>

                            {/* Winning sparkle */}
                            {winningLine.includes(index) && (
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <Sparkles className="h-6 w-6 animate-spin text-yellow-300 opacity-50" />
                                </div>
                            )}

                            {/* Cell index */}
                            {!cell && !disabled && (
                                <div className="absolute top-1 left-1 font-mono text-[10px] text-white/20">
                                    {index + 1}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-5 text-center md:mt-6">
                    <div className="flex items-center justify-center gap-4 text-xs text-white/50">
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-blue-400" />
                            <span>Player X</span>
                        </div>
                        <div className="h-4 w-px bg-white/20" />
                        <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <span>Player O</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
