import { WebSocketServer, WebSocket } from 'ws';
const wss = new WebSocketServer({ port: 8080 });
//Every Socket that are connected to the  webserver is the type of User.
let allSockets = [];
wss.on("connection", (socket) => {
    //after conneecting to the server.
    //we need to check the message coming from the client.Here in websocket message is either string or binary.
    //"Message" is want to join the Room
    socket.on("message", (message) => {
        let parsedMessage = JSON.parse(message); //convert the message from "string" -> "Binary"
        console.log("joined the room");
        if (parsedMessage.type === "join") { //message type is join push the socket or user into to respective Room
            allSockets.push({
                socket,
                RoomId: parsedMessage.payload.RoomId
            });
        }
        //Here, finding the room and sending the message
        if (parsedMessage.type === "chat") {
            console.log("want to chat");
            let currentUserRoom = null; // finding the room of the current user the allSockets[] 
            const currentUser = allSockets.find((x) => x.socket == socket);
            if (currentUser) {
                currentUserRoom = currentUser.RoomId;
            }
            //Sending the message to the persons,who are in the same Room.
            allSockets.forEach((x) => {
                if (x.RoomId == currentUserRoom) {
                    x.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
});
//# sourceMappingURL=index.js.map