import { GamepadIcon, MessageCircle, Sparkles, Users, Zap } from "lucide-react";
import React from "react";
import GameJoinForm from "./GameJoinForm";

interface HomePageProps {
    onCreateRoom: (playerName: string) => void;
    onJoinRoom: (roomCode: string, playerName: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCreateRoom, onJoinRoom }) => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
                <Header />
                <Features />
                <GameJoinForm
                    onCreateRoom={onCreateRoom}
                    onJoinRoom={onJoinRoom}
                />
            </div>
        </div>
    );
};

export default HomePage;

export const Header = () => (
    <div className="animate-fade-in-up mb-16 pt-12 text-center">
       
        <h1 className="mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-3xl leading-tight font-black tracking-tight text-transparent sm:text-6xl md:text-7xl">
            Tic-Tac-Toe
        </h1>
        <div className="relative">
            <h2 className="mb-6 text-xl font-light tracking-wide text-purple-200 sm:text-2xl md:text-3xl">
                Real-Time Multiplayer Experience
            </h2>
            <div className="absolute -bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            Challenge friends in an immersive real-time gaming experience with
            seamless chat integration and stunning visual effects
        </p>
    </div>
);

const features = [
    {
        icon: <Users className="h-8 w-8 text-white" />,
        title: "Room-Based Play",
        description:
            "Create private rooms and invite friends for exclusive matches.",
        bgGlow: "from-blue-500/20 to-purple-500/20",
        iconBg: "from-blue-400 to-blue-600",
    },
    {
        icon: <Zap className="h-8 w-8 text-white" />,
        title: "Lightning Fast",
        description:
            "Experience instant moves and real-time updates with zero lag.",
        bgGlow: "from-green-500/20 to-emerald-500/20",
        iconBg: "from-green-400 to-emerald-600",
    },
    {
        icon: <MessageCircle className="h-8 w-8 text-white" />,
        title: "Live Chat",
        description:
            "Communicate with opponents through chat with emoji support.",
        bgGlow: "from-pink-500/20 to-rose-500/20",
        iconBg: "from-pink-400 to-rose-600",
    },
];

export const Features = () => (
    <div className=" mb-16 grid max-w-5xl grid-cols-1 gap-8 delay-300 md:grid-cols-3">
        {features.map(({ icon, title, description, bgGlow, iconBg }, i) => (
            <div key={i} className="group relative">
                <div
                    className={`absolute inset-0 bg-gradient-to-r ${bgGlow} rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl`}
                />
                <div className="relative rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-white/30 hover:shadow-2xl">
                    <div
                        className={`bg-gradient-to-br ${iconBg} mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl shadow-lg`}
                    >
                        {icon}
                    </div>
                    <h3 className="mb-4 text-center text-xl font-bold text-white">
                        {title}
                    </h3>
                    <p className="text-center leading-relaxed text-white/70">
                        {description}
                    </p>
                </div>
            </div>
        ))}
    </div>
);
