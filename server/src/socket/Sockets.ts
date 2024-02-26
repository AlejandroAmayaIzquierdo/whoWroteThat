import { Server as ServerIO,Socket as socketIO } from "socket.io";
// import { AuthManager } from "../database/AuthManager.js";
import { RoomManager } from "./RoomManager.js";


export class SocketHandler {

    public static handleConnections = (io: ServerIO) => {
        io.on('connection', async (socket) => {
            // await this.handleAuth(socket);

            socket.on('joinRoom', async (data: Api.JoinRoomData) => {
                console.log("RoomID: " + data.roomId);
                if(RoomManager.isUserOnAnyRoom(data.userId))
                    return;
                RoomManager.joinRoom(socket,data.roomId,{userId: data.userId,userName: data.userName, SocketId: socket.id});
            });

            socket.on('onSendMessage', async (data: Api.messageData) => {
                const room = RoomManager.isUserOnAnyRoom(data.userId);

                room?.getGame().setAnswer(data.userId,data.answer);
            });

            socket.on('onSendVote', async (data: Api.voteData) => {
                const room = RoomManager.isUserOnAnyRoom(data.userId);

                room?.getGame().addVote(data.userId,data.vote);
            });

            socket.on('disconnect',async(reason,desc) => {
                // const token = socket.request.headers.authorization;
                // if(!token)  return;
                // const session = await AuthManager.getInstance().getAuth()?.validateSession(token) as Lucia.Session;
                // console.log("User Disconnected",reason,desc);
                
                const room = RoomManager.isSocketOnAnyRoom(socket.id);

                if(!room) 
                    return;

                

                const user = room.getPlayers().find(e => e.SocketId === socket.id);

                if(!user)
                    return;

                
                room.leave(user);
                
                // const isUserOnRoom = RoomManager.isUserOnAnyRoom(session.user.userId);

                // if(isUserOnRoom){
                //     Application.io.to(isUserOnRoom.getID()).emit('disconnectedUser', null);
                //     isUserOnRoom.done();
                // }
            });
        });
    }

    // private static handleAuth = async (socket: socketIO) =>  {
    //     const token = socket.request.headers.authorization;
    //     if(!token) { this.disconnectUser(socket); return;}


    //     const isValid = await AuthManager.getInstance().getAuth()?.validateSession(token);
    //     if(!isValid)
    //         this.disconnectUser(socket);
    // }

    public static disconnectUser = (socket: socketIO) => {
        console.log("Unauthorize user!");
        socket.emit('error', {status: 0, message: "Unauthorize user!"});
        socket.disconnect(true);
    }
}