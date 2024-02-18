import { getRandomChat } from "../services/gameServices.js";

export class Game {

    private round:number = 1;
    private readonly MAX_ROUND_BY_GAME:number = 3; 
    private readonly TIME_BY_ROUND:number = 10; // 60 seconds
    private readonly TIME_SHOWCASE_BY_USER:number = 5; // 30 seconds
    private showCasingUser:string = "";
    private showCasingUserIndex:number = 0;


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
        await this.generatedChats();

        setTimeout(() => {
            this.started = true;
        }, 3000);

    }

    public endRound = () => {

        if(this.state === "create") {
            this.state = "showcase";
            this.timeLeft = this.TIME_SHOWCASE_BY_USER;

            this.showCasingUserIndex = 0;
            this.showCasingUser = this.players[this.showCasingUserIndex].userId;
        }
        else if(this.state === "showcase" && this.round < this.MAX_ROUND_BY_GAME) {
            if(this.showCasingUserIndex >= this.players.length - 1) {
                this.round++;
                this.timeLeft = this.TIME_BY_ROUND;
                this.state = "create";
                this.showCasingUserIndex = 0;
                this.showCasingUser = this.players[this.showCasingUserIndex].userId;
                return;
            }

            this.showCasingUserIndex++;
            this.showCasingUser = this.players[this.showCasingUserIndex].userId;
            this.timeLeft = this.TIME_SHOWCASE_BY_USER;
        }
        else if(this.state === "showcase" && this.round === this.MAX_ROUND_BY_GAME) {
            this.state = "winners";
            this.done = true;
        }
    }

    public generatedChats = async () => {
        console.log('Generating chats');
        console.log(this.players);
        for await (const player of this.players) {
            this.data[player.userId] = {};
            for (let i = 1; i <= this.MAX_ROUND_BY_GAME; i++) {
                const messages = await getRandomChat();
                this.data[player.userId][i] = {
                    messages,
                    vote: 0
                }
            }
        }
    }

    public setAnswer = (userID: string,answer:string) => {
        this.data[userID][this.round].answer = answer;
        this.data[userID][this.round].vote = 0;
    }

    public addVote = (userID:string,vote: number) => {
        if(this.state !== "showcase" || this.showCasingUser === userID)
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
            showCasingUser: this.showCasingUser,
        }
    };
}