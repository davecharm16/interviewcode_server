const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const { createServer } = require('http');
const app = express();
app.use(cors());

dotenv.config();

const server = createServer(app);
const io = new Server(server);



const prisma = new PrismaClient();


io.on('connection', async (socket) => {
    const counter = await prisma.counter.findFirst();

    socket.emit('updateCounter', counter.count);
    socket.on('increment', async () => {
        const updateCounter = await prisma.counter.update({
            where: { id: counter.id },
            data: { count: counter.count + 1 }
        });

        io.sockets.emit('updateCounter', updateCounter.count);
    })
});



server.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`);
})