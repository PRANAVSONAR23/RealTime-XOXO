import { useEffect, useState } from "react";
import GameRoom from "./components/GameRoom";
import HomePage from "./components/HomePage";
import { useSocket } from "./hooks/useSocket";
import { Room } from "./types/game";

function App() {
    const { socket, isConnected } = useSocket();
    const [error, setError] = useState<string>("");
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

    const handleRoomCreated = ({ room }: { room: Room }) => {
        setCurrentRoom(room);
        setError("");
    };

    const handleRoomUpdated = ({ room }: { room: Room }) => {
        setCurrentRoom(room);
        setError("");
    };

    const handleRoomError = (message: string) => {
        setError(message);
        setTimeout(() => setError(""), 5000);
    };

    const handleGameError = (message: string) => {
        setError(message);
        setTimeout(() => setError(""), 5000);
    };

    useEffect(() => {
        if (!socket) return;
        socket.on("room-created", handleRoomCreated);
        socket.on("room-updated", handleRoomUpdated);

        socket.on("room-error", handleRoomError);
        socket.on("game-error", handleGameError);

        return () => {
            socket.off("room-created", handleRoomCreated);
            socket.off("room-updated", handleRoomUpdated);
            socket.off("room-error", handleRoomError);
            socket.off("game-error", handleGameError);
        };
    }, [socket]);

    const handleCreateRoom = (playerName: string) => {
        if (socket && isConnected) {
            socket.emit("create-room", playerName);
        } else {
            setError("Not connected to server");
        }
    };

    const handleJoinRoom = (roomCode: string, playerName: string) => {
        if (socket && isConnected) {
            socket.emit("join-room", { roomCode, playerName });
        } else {
            setError("Not connected to server");
        }
    };

    const handleLeaveRoom = () => {
        setCurrentRoom(null);
        setError("");
    };

    return (
        <div className="min-h-screen">
            {/* Error Message */}
            {error && (
                <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 transform animate-pulse rounded-lg bg-red-500 px-6 py-3 text-white shadow-lg">
                    {error}
                </div>
            )}
            {/* Connection Status */}
            {!isConnected && (
                <div className="fixed top-4 right-4 z-50 rounded-lg bg-yellow-500 px-4 py-2 text-white shadow-lg">
                    Reconnecting...
                </div>
            )}
            {/* Main Content */}
            {currentRoom ? (
                <GameRoom
                    room={currentRoom}
                    socket={socket}
                    currentPlayerId={socket?.id || ""}
                    onLeaveRoom={handleLeaveRoom}
                />
            ) : (
                <HomePage
                    onCreateRoom={handleCreateRoom}
                    onJoinRoom={handleJoinRoom}
                />
            )}
        </div>
    );
}

export default App;
