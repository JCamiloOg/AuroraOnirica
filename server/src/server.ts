import { HOSTNAME, PORT } from "@/config/env";
import app from "./app";
import { createServer } from "http";
import normalizePort from "./utils/normalizePort";

const port = normalizePort(PORT);
const server = createServer(app);

server.listen(port, HOSTNAME);
server.on("listening", onListening);
server.on("error", onError);


function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? `${addr}` : `${addr?.port}`;
    console.log(`Listening on http://localhost:${bind}`);
}

function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}