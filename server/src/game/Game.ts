import { getRandomChat } from "../services/gameServices.js";

export class Game {

    private round:number = 0;
    private readonly MAX_ROUND_BY_GAME:number = 3; 
    private readonly TIME_BY_ROUND:number = 60; // 60 seconds
    private readonly TIME_BY_SHOWCASE:number = 30; // 30 seconds

    private timeLeft:number = this.TIME_BY_ROUND;

    private state: App.GameState = "create";

    private data: App.GameData = {}
    
    public players: Api.User[] = [];

    private done = false;
    private started = false;

    public constructor(players: Api.User[]){
        this.players = players;
    }

    public update = () => {
        if(this.timeLeft > 0)
            this.timeLeft--;
        else 
            this.endRound();
    }
    

    public startGame = async () => {
        this.started = true;
        await this.generatedChats();
    }

    public endRound = () => {

        if(this.state === "create" && this.round !== this.MAX_ROUND_BY_GAME) {
            this.state = "showcase";
            this.timeLeft = this.TIME_BY_SHOWCASE;
        }
        else if(this.state === "showcase" && this.round !== this.MAX_ROUND_BY_GAME) {
            this.round++;
            this.timeLeft = this.TIME_BY_ROUND;
        }
        else if(this.state === "showcase" && this.round === this.MAX_ROUND_BY_GAME) {
            this.state = "winners";
            this.done = true;
        }

    }

    public setAnswer = (userID: string,answer:string) => {
        this.data[userID][this.round].answer = answer;
        this.data[userID][this.round].vote = 0;
    }

    public generatedChats = async () => {
        console.log('Generating chats');
        console.log(this.players);
        for await (const player of this.players) {
            this.data[player.userId] = {};
            for (let i = 0; i < this.MAX_ROUND_BY_GAME; i++) {
                const messages = await getRandomChat();
                this.data[player.userId][i] = {
                    messages,
                    vote: 0
                }
            }
        }
    }

    public addVote = (userID:string,vote: number) => {
        if(this.state !== "showcase")
            return;
        this.data[userID][this.round].vote += vote;
    }

    public getGameData = (): Api.EmittedGameData => {
        return {
            round: this.round,
            state: this.state,
            data: this.data,
            started: this.started,
            done: this.done,
            timeLeft: this.timeLeft,
        }
    };
}