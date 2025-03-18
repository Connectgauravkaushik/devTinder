const socket = require('socket.io');
const crypto = require('crypto');


const getSecretRoomId = (userId, targetUserId) => {
    // Sort the array of IDs before stringifying it
    const sortedData = [userId, targetUserId].sort().join("_");

    // Hash the sorted, joined string
    return crypto.createHash("sha256")
                 .update(sortedData)
                 .digest("hex");
}


const initializeSocket = (server) => {

    // we will use this server for initialzation of a server 
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",  // cors issue handle from frontend 
        }
    });

    io.on('connection', (socket) => {
        // handle events
        //different event handlers

        socket.on('joinChat', ({ firstName,userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName + " JOINED THE ROOM : " + roomId);
            socket.join(roomId)
        });

        socket.on('sendMessage', ({firstName,userId,targetUserId,text}) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName + " " +  text);
             io.to(roomId).emit('messageReceived' , {firstName , text})   // server is emitting now
        });

        socket.on('disconnect', () => {

        });

    });
}

module.exports = initializeSocket;