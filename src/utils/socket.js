const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequests");

const getSecretRoomId = (userId, targetUserId) => {
    // Sort the array of IDs before stringifying it
    const sortedData = [userId, targetUserId].sort().join("_");

    // Hash the sorted, joined string
    return crypto.createHash("sha256").update(sortedData).digest("hex");
};

const initializeSocket = (server) => {
    // we will use this server for initialzation of a server
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173", // cors issue handle from frontend
        },
    });

    io.on("connection", (socket) => {
        // handle events
        //different event handlers

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log(firstName + " JOINED THE ROOM : " + roomId);
            socket.join(roomId);
        });

        socket.on(
            "sendMessage",
            async ({ firstName, lastName, userId, targetUserId, text }) => {
                // save message to DB

                try {
                    const roomId = getSecretRoomId(userId, targetUserId);

                    // check if userId and targetId are freinds or not
                //    const validateConnection = await ConnectionRequest.findOne({
                //         $or: [
                //             {
                //                 fromUserId: userId,
                //                 toUserId: targetUserId,
                //                 status: "accepted"
                //             },
                //             {
                //                 fromUserId: targetUserId,
                //                 toUserId: userId,
                //                 status: "accepted"
                //             }
                //         ]

                //     });

                //     if (validateConnection) {
                //         return res
                //           .status(400)
                //           .json({ message: "Connection Request doesn't exist" });
                //       }


                    // if chat is already present fetch it and show on UI
                    let chat = await Chat.findOne({
                        participants: { $all: [userId, targetUserId] },
                    });

                    if (!chat) {
                        // if for the first time user is chating then we will create a new chat for them

                        chat = new Chat({
                            participants: [userId, targetUserId],
                            messages: [],
                        });
                    }

                    // we will push the messages
                    chat.messages.push({
                        senderId: userId,
                        text,
                    });

                    await chat.save();
                    console.log(firstName + " " + text);
                    io.to(roomId).emit("messageReceived", { firstName, lastName, text }); // server is emitting now
                } catch (error) {
                    console.error(error);
                }
            }
        );

        socket.on("disconnect", () => { });
    });
};

module.exports = initializeSocket;
