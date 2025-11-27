import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { setupSocketHandlers } from "./socketHandlers.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: true,
        methods: ["GET", "POST"],
    },
});

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory in production
const distPath = path.join(__dirname, "../");
app.use(express.static(distPath));

// API health check endpoint
app.get("/api/health", (_, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get("*", (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API endpoint not found" });
    }

    res.sendFile(path.join(distPath, "index.html"), (err) => {
        if (err) {
            console.error("Error serving index.html:", err);
            res.status(500).send("Server Error");
        }
    });
});

// Setup Socket.io handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
