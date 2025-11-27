import { Copy, Crown, Home, Play, RotateCcw, Users } from "lucide-react";

interface GameHeaderProps {
    roomCode: string;
    playersCount: number;
    onLeaveRoom: () => void;
    onStartGame: () => void;
    onResetGame: () => void;
    canStartGame: boolean;
    isGameStarted: boolean;
    isGameOver: boolean;
    copied: boolean;
    onCopyRoomCode: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
    roomCode,
    playersCount,
    onLeaveRoom,
    onStartGame,
    onResetGame,
    canStartGame,
    isGameStarted,
    isGameOver,
    copied,
    onCopyRoomCode,
}) => {
    return (
        <header className="flex h-[70px] w-full items-center justify-between gap-4 overflow-x-auto border-b border-white/20 bg-white/10 px-4 shadow-2xl backdrop-blur-xl sm:px-10">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
                {/* Left side: Home & Room Info */}
                <div className="flex w-full items-center justify-between gap-6 md:w-auto">
                    <button
                        onClick={onLeaveRoom}
                        className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-2 font-semibold text-white shadow transition-all hover:border-white/30 hover:bg-white/20 hover:shadow-lg"
                    >
                        <Home className="size-4 transition-transform group-hover:scale-110 md:size-5" />
                        <span className="text-sm md:text-base">Home</span>
                    </button>
                    {playersCount < 2 ? (
                        <div className="flex items-center gap-3">
                            <Crown className="size-4 text-yellow-400 md:size-5" />
                            <span className="text-sm font-semibold text-white md:text-lg">
                                Room:
                            </span>
                            <button
                                onClick={onCopyRoomCode}
                                className="group flex items-center gap-2 rounded-lg border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 font-mono text-sm font-bold tracking-wide text-purple-200 transition-all hover:border-purple-400/50 hover:from-purple-500/30 hover:to-pink-500/30 md:text-base"
                            >
                                {roomCode}
                                <Copy className="size-4 transition-transform group-hover:scale-110 md:size-5" />
                            </button>

                            {copied && (
                                <span className="animate-fade-in rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300">
                                    ✓ Copied!
                                </span>
                            )}
                        </div>
                    ) : (
                        <>
                            {canStartGame && (
                                <button
                                    onClick={onStartGame}
                                    className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-2 text-sm font-bold text-white shadow transition-transform hover:scale-105 hover:from-green-600 hover:to-emerald-600 hover:shadow-xl md:text-base"
                                >
                                    <Play className="size-4 md:size-5" />
                                    Start Game
                                </button>
                            )}
                            {isGameStarted && isGameOver && (
                                <button
                                    onClick={onResetGame}
                                    className="group flex items-center gap-2 rounded-lg b px-5 py-2 text-sm font-bold text-white shadow transition-transform hover:scale-105 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl md:text-base"
                                >
                                    <RotateCcw className="size-4 transition-transform duration-500 group-hover:rotate-180 md:size-5" />
                                    New Game
                                </button>
                            )}
                        </>
                    )}
                </div>
                {/* Right side: Player count & buttons */}
                <div className="hidden flex-wrap items-center justify-center gap-4 sm:flex">
                    <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2">
                        <Users className="size-4 text-blue-400 md:size-5" />
                        <span className="text-sm font-semibold text-white md:text-base">
                            {playersCount}/2 Players
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};
export default GameHeader;
