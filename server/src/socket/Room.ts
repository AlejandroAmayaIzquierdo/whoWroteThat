import { Db } from "../database/dbConnection.js";
import { Game } from "../game/Game.js";
import { Application } from "../index.js";
import { RoomManager } from "./RoomManager.js";


export class Room {
    private id: string;

    private playersInfo: Api.User[] = [];

    private maxPlayers: number = 2;

    private game: Game;

    private interval: NodeJS.Timeout | undefined;

    public constructor(roomID: number,maxUsers?: number,players?: Api.User[]){
        this.id = `${roomID}`;
        if(maxUsers)
            this.maxPlayers = maxUsers;

        if(players)
            this.playersInfo = [...this.playersInfo, ...players];
        this.game = new Game(this.playersInfo);
    }

    public join = async (user: Api.User) => {
        if(this.playersInfo.length < this.maxPlayers && !this.playersInfo.find(e => e.userId === user.userId))
            this.playersInfo.push(user);
        Application.io.to(this.id).emit('joinedRoom',this.playersInfo);

        
        this.game.players = this.playersInfo;
        

        if(!this.interval)
            this.handle();

        if(this.playersInfo.length === this.maxPlayers){
            await Db.getInstance().query(`UPDATE rooms SET players="${this.playersInfo.map(e => e.userId).join(',')}",isActive=1 WHERE id='${this.id}'`);
            this.game.startGame();
            
        }
    }

    public leave = async (user: Api.User) =>  {
        console.log('User left',user.userId);
        this.playersInfo = this.playersInfo.filter(e => e.userId !== user.userId);
        Application.io.to(this.id).emit('leavedRoom',user);
        if(this.playersInfo.length <= 1)
            this.done();
    }

    public handle = () => {
        this.interval = setInterval(async () => {
            if(this.game.getGameData().started)
                this.game.update();

            if(this.game.getGameData().done) {
                setTimeout(() => {
                    this.done();
                }, 10000);
            }
                

            Application.io.to(this.id).emit('updateRoom', {gameData: this.game.getGameData(),players: this.playersInfo});
        },1000);
    }

    public done = async () => {
        if(this.interval)
            clearInterval(this.interval);
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
        await Db.getInstance().query(`UPDATE rooms SET players="${this.playersInfo.map(e => e.userId).join(',')}",isActive=0,isEnded=1,endedAt="${formattedDate}" WHERE id="${this.id}"`);
        RoomManager.removeRoom(this.id);
        
    }

    public getID = () => this.id;
    public getGame = () => this.game;
    public getPlayers = () => this.playersInfo;
}