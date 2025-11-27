import { Play, Sparkles, Trophy, Users, Zap } from "lucide-react";
import { useState } from "react";

interface GameJoinFormProps {
    onCreateRoom: (playerName: string) => void;
    onJoinRoom: (roomCode: string, playerName: string) => void;
}

export default function GameJoinForm({
    onCreateRoom,
    onJoinRoom,
}: GameJoinFormProps) {
    const [playerName, setPlayerName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [isJoining, setIsJoining] = useState(false);

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (playerName.trim()) onCreateRoom(playerName.trim());
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (playerName.trim() && roomCode.trim()) {
            onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
        }
    };

    return (
        <div className=" relative mx-auto w-full max-w-md delay-500">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl transition-all duration-500 group-hover:blur-3xl"></div>

            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl">
                <div className="mb-8 space-y-2 text-center">
                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                        🎮 Ready to Play?
                    </h2>
                    <p className="text-sm text-white/70 md:text-base">
                        Create a room to challenge your friends or join an
                        existing one to prove who's the real champion.
                    </p>
                </div>
                {/* Player Name Input */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-base font-semibold text-white">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        Player Name
                    </label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="e.g., LegendKiller"
                        className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        maxLength={20}
                    />
                </div>

                {/* Conditional Join Room Section */}
                {isJoining && (
                    <div className="animate-fade-in space-y-2">
                        <label className="flex items-center gap-2 text-base font-semibold text-white">
                            <Sparkles className="h-5 w-5 text-blue-400" />
                            Room Code
                        </label>
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) =>
                                setRoomCode(e.target.value.toUpperCase())
                            }
                            placeholder="6-digit code"
                            maxLength={6}
                            className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-center font-mono text-base tracking-widest text-white placeholder-white/50 focus:border-transparent focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                )}

                {/* Buttons Section */}
                <div className="space-y-3 pt-2">
                    {isJoining ? (
                        <>
                            <form onSubmit={handleJoinRoom}>
                                <button
                                    type="submit"
                                    disabled={
                                        !playerName.trim() || !roomCode.trim()
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 cursor-pointer  py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600 disabled:opacity-40"
                                >
                                    <Zap className="h-5 w-5" />
                                    Join Room
                                </button>
                            </form>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsJoining(false);
                                    setRoomCode("");
                                }}
                                className="w-full text-sm text-white/80 underline hover:text-white"
                            >
                                ← Back to Create or Join
                            </button>
                        </>
                    ) : (
                        <>
                            <form
                                onSubmit={handleCreateRoom}
                                className="space-y-6"
                            >
                                <button
                                    type="submit"
                                    disabled={!playerName.trim()}
                                    className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-blue-800 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-pink-600 disabled:opacity-40"
                                >
                                    <Play className="h-5 w-5" />
                                    Create New Room
                                </button>
                            </form>

                            <button
                                type="button"
                                onClick={() => setIsJoining(true)}
                                className="flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/20"
                            >
                                <Users className="h-5 w-5" />
                                Join Existing Room
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
