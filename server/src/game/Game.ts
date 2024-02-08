
export class Game {

    private round:number = 0;
    private readonly MAX_ROUND_BY_GAME:number = 3; 

    private state: App.GameState = "create";

    private data: App.GameData = {}

    private done = false;
    private started = false;
    

    public startGame = () => {
        this.started = true;
    }

    public endRound = () => {
        
    }

    public setAnswer = (userID: string,question:App.Question,answer:string) => {
        this.data[userID][this.round].question = question;
        this.data[userID][this.round].answer = answer;
        this.data[userID][this.round].vote = 0;
    }

    public addVote = (userID:string,vote: number) => {
        if(this.state !== "showcase")
            return;
        this.data[userID][this.round].vote += vote;
    }

    public getGameData = () => {
        return {
            round: this.round,
            state: this.state,
            data: this.data,
            started: this.started,
            done: this.done
        }
    };
}