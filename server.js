const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Make io accessible globally for API routes
    global.io = io;

    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);

        socket.on("join", (data) => {
            const { userId, userType } = data;

            if (userId) {
                socket.join(userId);
                console.log(`User ${userId} joined as ${userType}`);
            }

            if (userType === 'captain') {
                socket.join('active-captains');
            }
        });

        socket.on('update-location-captain', (data) => {
            const { userId, location } = data;
            if (!location || !location.ltd || !location.lng) {
                return;
            }
            // Broadcast to everyone for real-time tracking on maps
            io.emit('update-location-captain', data);
        });

        socket.on('message', (data) => {
            const { receiver, content } = data;
            if (receiver) {
                // Relay message to receiver
                io.to(receiver).emit('new-message', data);
            }
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
        });
    });

    httpServer.once("error", (err) => {
        console.error(err);
        process.exit(1);
    }).listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
