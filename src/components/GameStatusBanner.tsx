import { Trophy, Zap } from "lucide-react";

interface GameStatusBannerProps {
    message: string;
    isGameOver: boolean;
    isCurrentPlayerTurn: boolean;
}

const GameStatusBanner: React.FC<GameStatusBannerProps> = ({
    message,
    isGameOver,
    isCurrentPlayerTurn,
}) => {
    return (
        <div className="text-center">
            <div
                className={`inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold transition-all duration-500 ${
                    isGameOver
                        ? "border border-yellow-400/40 bg-yellow-500/20 text-yellow-200 shadow-2xl"
                        : isCurrentPlayerTurn
                          ? "animate-pulse border border-green-400/40 bg-green-500/20 text-green-200 shadow-2xl"
                          : "border border-white/20 bg-white/10 text-white"
                }`}
            >
                {isGameOver && <Trophy className="h-6 w-6" />}
                {isCurrentPlayerTurn && (
                    <Zap className="h-6 w-6 animate-pulse" />
                )}
                {message}
            </div>
        </div>
    );
};

export default GameStatusBanner;
