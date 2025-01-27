const http = require("http");
const fs = require("fs");
const fsR = require("fs-reverse");
const express = require("express");
const path = require("path");
const port = 8080;
const app = express();
const readline = require('readline');
const { Server } = require("socket.io");

const server = http.createServer(app);
server.listen(port, () => {
    console.log("Server is up and running")
})
let lastReadPosition = 0;
function fetchLastReadPosition(path) {
    return new Promise((resolve, reject) => {
        let totalBytes = 0;
        const stream = fs.createReadStream(path, { encoding: 'utf8' });
        const rl = readline.createInterface({
            input: stream,
            output: process.stdout,
            terminal: false,
        });
        rl.on('line', (line) => {
            totalBytes += Buffer.byteLength(line, 'utf8') + 1; // Account for the newline character
        });

        rl.on('close', () => {
            resolve(totalBytes); // Return the total number of bytes read
        });
    });
}
function fetchLastTenLines(filePath) {
    return new Promise((resolve, reject) => {
        let lines = [];
        const stream = fsR(filePath, { encoding: "utf8" });
        stream
            .on("data", (line) => {
                if (lines.length === 10) {
                    stream.destroy();
                    return;
                }
                lines.push(line);
            })
            .on("close", () => {
                // Reverse the lines array to maintain the correct order
                resolve(lines.reverse().join("\n"));
            })
            .on("error", (err) => {
                reject(err); // Handle errors during the file reading
            });
    });
}
function initialFileLoad(path, socket) {
    lastReadPosition = 0;
    fetchLastTenLines(path).then((lastTenLinesOffSet) => {
        socket.emit("logFile", lastTenLinesOffSet);
    });
    fetchLastReadPosition(path).then((lastReadLine) => {
        lastReadPosition = lastReadLine;
    })
}
function readNewLines(path) {
    let data = '';
    const stream = fs.createReadStream(path, {
        encoding: "utf8",
        start: lastReadPosition, // Start reading from the last position
    });
    stream.on('data', (line) => {
        data = data.concat("\n", line);
        lastReadPosition += Buffer.byteLength(line + '\n', 'utf8');
    })
    stream.on('end', () => {
        io.emit("logFile", data);
    })
}
const io = new Server(server);
io.on('connection', (socket) => {
    console.log("User connected");
    initialFileLoad("./log.txt", socket);
    socket.on('disconnect', () => {
        console.log("User disconnected")
    })
})
fs.watchFile("./log.txt", (eventType, fileName) => {
    readNewLines("./log.txt");
})

app.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, "index.html"));
});

module.exports = { fetchLastTenLines, initialFileLoad, readNewLines };
