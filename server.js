const express = require('express');
const app = express();
const http = require('http');
const maxFileSize = process.env.MAXFILESIZE || 1e+9;
const port = process.env.PORT || 3000;

let clients = [];
let unserved = [];
let listFriends=[];

const byteCount = (s) => encodeURI(s).split(/%..|./).length - 1;

app.use('/assets',express.static('assets'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// const server = https.createServer(options, app);
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    maxHttpBufferSize: maxFileSize,
});

io.on('connection', (socket) => {

    clients.push(socket.id);
    console.log('a user connected, clients:', clients);

    if (socket.id !== clients[0]) {
        console.log("requesting messages...");
        io.sockets.sockets.get(clients[0]).emit("give messages");
        unserved.push(socket.id);
        unserved.forEach((clientId) => io.sockets.sockets.get(clientId) ? io.sockets.sockets.get(clientId).emit('loading') : null);
    }
    socket.on('disconnect', () => {
        io.emit("user disconnect", "someone disconnected");
        clients = clients.filter((id) => id !== socket.id)
        console.log('user disconnected, clients:', clients);
    });

    

    socket.on('sending', () => {
        socket.broadcast.emit('loading');
    });

    socket.on('finished sending', () => {
        socket.broadcast.emit('stop loading');
    });
    socket.emit("init", "welcome");

    //receive message from client, send to other clients
    socket.on('sendMessage',(data,user,room)=>
    {
        if(room==='') socket.broadcast.emit('receiveMessage',data,user);  
        else socket.to(room).emit('receiveMessage',data,user);
    });

    // recall message
    socket.on('recall',(mess,data,room)=>
    {
        if(room==='') socket.broadcast.emit('recallMess',mess,data);  
        else socket.to(room).emit('recallMess',mess,data);
    })


    //receive file from client, send to other clients
    socket.on('sendFile',(msg,user,room)=>
    {
        if (byteCount(msg) > maxFileSize) {
            clients.forEach((clientId) => {
            io.sockets.sockets.get(clientId).emit("will disconnect all");
            io.sockets.sockets.get(clientId).disconnect();
            });
            clients = [];
            unserved = [];
            messages = [];
        }

        if(room==='') socket.broadcast.emit('receiveFile', msg,user);
        else
        {
            socket.to(room).emit('receiveFile', msg,user);
        };
        
    });

    // join room
    socket.on('joinRoom',room=>
    {
        socket.join(room);
    });

    // server receive ID from client
    socket.on('sendIdToServer',(ID)=>
    {
        console.log('server nhận được id', ID);
        socket.emit('sendIdToClient',ID); 
    });

    // server receive name from client
    socket.on('addName',name=>
    {
        let ob={
            name:name,
            id:socket.id
        }
        listFriends.push(ob);
        console.log(listFriends);
    });

    
    // server send list friends to client
    socket.emit('getListFriend',listFriends);
    
});

// server listening port  
server.listen(port, () => {
    console.log(`Port: ${port}`);
});