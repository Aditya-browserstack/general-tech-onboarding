const http = require("http");
const fs = require("fs");
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

function fetchLastTenLinesOffSet(path) {
    return new Promise((resolve) => {
        const file = readline.createInterface({
            input: fs.createReadStream(path),
            crlfDelay: Infinity
        });
        let numberOfLines = 0;
        file.on('line', (line) => {
            numberOfLines++;
        });
        file.on('close', () => {
            resolve(numberOfLines < 10 ? 0 : (numberOfLines - 10));
        })
    })
}
let lastReadPosition = 0;
function initialFileLoad(path, socket) {
    let data = '';
    lastReadPosition = 0;
    fetchLastTenLinesOffSet(path).then((lastTenLinesOffSet) => {
        const file = readline.createInterface({
            input: fs.createReadStream(path),
            crlfDelay: Infinity
        });
        file.on('line', (line) => {
            if (lastReadPosition >= lastTenLinesOffSet) {
                data = data.concat("\n", line);
            }
            lastReadPosition += 1;
        })
        file.on('close', () => {
            socket.emit("logFile", data);
        })
    });
}
function readNewLines(path) {
    let currentLine = 0;
    let data = '';
    const file = readline.createInterface({
        input: fs.createReadStream(path),
        crlfDelay: Infinity
    });
    file.on('line', (line) => {
        if (currentLine >= lastReadPosition) {
            data = data.concat("\n", line);
            lastReadPosition += 1;
        }
        currentLine++;
    })
    file.on('close', () => {
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

module.exports = { fetchLastTenLinesOffSet, initialFileLoad, readNewLines };
