import { Crown, Zap } from "lucide-react";
import { GameState, Room } from "../types/game";

interface PlayersInfoProps {
    room: Room;
    currentPlayerId: string;
    gameState: GameState;
}

const PlayersInfo: React.FC<PlayersInfoProps> = ({
    room,
    currentPlayerId,
    gameState,
}) => {
    return (
        <div className="rounded-xl border border-white/10 bg-white/10 p-3 shadow-xl backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-4">
                {room.players.map((player, index) => {
                    const isCurrentTurn =
                        gameState.currentPlayer === player.symbol;
                    return (
                        <div
                            key={player.id}
                            className={`group relative text-xs transition-all duration-300 ${
                                isCurrentTurn ? "scale-[1.03] transform" : ""
                            }`}
                        >
                            {/* Glowing blur */}
                            <div
                                className={`absolute inset-0 rounded-lg blur-sm ${
                                    isCurrentTurn
                                        ? "bg-green-400/20"
                                        : "bg-white/5"
                                }`}
                            />

                            {/* Player card */}
                            <div
                                className={`relative flex items-center space-x-2 rounded-lg p-3 ${
                                    isCurrentTurn
                                        ? "border border-green-400/30 bg-green-500/10 shadow-md"
                                        : "border border-white/10 bg-white/5"
                                }`}
                            >
                                {/* Symbol */}
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white shadow ${
                                        player.symbol === "X"
                                            ? "bg-blue-600"
                                            : "bg-red-600"
                                    } relative`}
                                >
                                    {player.symbol}
                                    {isCurrentTurn && (
                                        <div className="absolute -top-1 -right-1">
                                            <Zap className="h-3 w-3 animate-pulse text-yellow-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Player Info */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1 truncate font-medium text-white">
                                        <span className="truncate text-base">
                                            {player.name}
                                        </span>

                                        {player.id === currentPlayerId && (
                                            <span className="rounded-full border border-purple-400/20 bg-purple-500/20 px-2 py-[2px] text-[10px] font-normal text-purple-300">
                                                You
                                            </span>
                                        )}

                                        {index === 0 && (
                                            <Crown className="h-3 w-3 text-yellow-400" />
                                        )}
                                    </div>
                                    {isCurrentTurn && (
                                        <div className="mt-0.5 animate-pulse text-[10px] font-medium text-green-300">
                                            ⚡ Your turn
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayersInfo;
