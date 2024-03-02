import { Db } from "../database/dbConnection.js";
import { getRandomChat } from "../services/gameServices.js";

export class Game {
  private round: number = 1;
  public static readonly MAX_ROUND_BY_GAME: number = 3;
  public static readonly TIME_BY_ROUND: number = 10; // 60 seconds
  public static readonly TIME_SHOWCASE_BY_USER: number = 5; // 30 seconds
  private showCasingUser: string = "";
  private showCasingUserIndex: number = 0;
  private winner: string = "";

  private timeLeft: number = Game.TIME_BY_ROUND;

  private state: App.GameState = "create";

  private data: App.GameData = {};

  public players: Api.User[] = [];

  private done = false;
  private started = false;

  public constructor(players: Api.User[]) {
    this.players = players;
  }

  public update = () => {
    if (this.timeLeft > 0) this.timeLeft--;
    else this.endRound();
  };

  public startGame = async () => {
    await this.generatedChats();

    setTimeout(() => {
      this.started = true;
    }, 3000);
  };

  public endRound = () => {
    if (this.state === "create") {
      this.state = "showcase";
      this.timeLeft = Game.TIME_SHOWCASE_BY_USER;

      this.showCasingUserIndex = 0;
      this.showCasingUser = this.players[this.showCasingUserIndex].userId;
    } else if (this.state === "showcase" && this.showCasingUser === "general") {
      this.round++;
      this.timeLeft = Game.TIME_BY_ROUND;
      this.state = "create";
      this.showCasingUserIndex = 0;
      this.showCasingUser = this.players[this.showCasingUserIndex].userId;
    } else if (
      this.state === "showcase" &&
      this.round < Game.MAX_ROUND_BY_GAME
    ) {
      if (this.showCasingUserIndex >= this.players.length - 1) {
        this.showCasingUser = "general";
        this.timeLeft = Game.TIME_SHOWCASE_BY_USER;
        return;
      }

      this.showCasingUserIndex++;
      this.showCasingUser = this.players[this.showCasingUserIndex].userId;
      this.timeLeft = Game.TIME_SHOWCASE_BY_USER;
    } else if (
      this.state === "showcase" &&
      this.round === Game.MAX_ROUND_BY_GAME
    ) {
      this.state = "winners";
      this.showCasingUser = "general";
      this.findWinner();
      this.done = true;
    }
  };

  public generatedChats = async () => {
    console.log("Generating chats");
    console.log(this.players);
    for await (const player of this.players) {
      this.data[player.userId] = {};
      for (let i = 1; i <= Game.MAX_ROUND_BY_GAME; i++) {
        const messages = await getRandomChat();
        this.data[player.userId][i] = {
          messages,
          vote: 0,
        };
      }
    }
  };

  public findWinner = () => {
    let max = 0;
    let winner = "";
    for (const player of this.players) {
      let score = 0;
      for (let i = 1; i <= Game.MAX_ROUND_BY_GAME; i++) {
        score += this.data[player.userId][i].vote;
      }
      if (score > max) {
        max = score;
        winner = player.userId;
      }
    }
    this.winner = winner;
  };

  public static doesGameShouldEndByID = async (
    roomID: string
  ): Promise<boolean> => {
    const db = Db.getInstance();
    const room = (await db.query(
      `SELECT * FROM rooms WHERE id='${roomID}' AND isActive=1`
    )) as Api.Room[];
    console.log(room);
    if (room.length === 0) return true;
    const { startedAt, maxUsers } = room[0];

    const now = new Date();
    const startDate = new Date(startedAt);
    const diff = now.getTime() - startDate.getTime();
    const seconds = diff / 1000;
    const alTimeByRound = this.TIME_BY_ROUND * Game.MAX_ROUND_BY_GAME;
    const allTimeByShowcase =
      this.TIME_SHOWCASE_BY_USER * maxUsers + this.TIME_SHOWCASE_BY_USER;
    const maxSecondsOfGame = alTimeByRound + allTimeByShowcase + 30;
    return seconds > maxSecondsOfGame;
  };

  public static doesGameShouldEnd = async (
    room: Api.Room
  ): Promise<boolean> => {
    const { startedAt, maxUsers } = room;

    const now = new Date();
    const startDate = new Date(startedAt);
    const diff = now.getTime() - startDate.getTime();
    const seconds = diff / 1000;
    const alTimeByRound = this.TIME_BY_ROUND * Game.MAX_ROUND_BY_GAME;
    const allTimeByShowcase =
      this.TIME_SHOWCASE_BY_USER * maxUsers + this.TIME_SHOWCASE_BY_USER;
    const maxSecondsOfGame = alTimeByRound + allTimeByShowcase + 30;
    return seconds > maxSecondsOfGame;
  };

  public setAnswer = (userID: string, answer: string) => {
    this.data[userID][this.round].answer = answer;
    this.data[userID][this.round].vote = 0;
  };

  public addVote = (userID: string, vote: number) => {
    if (this.state !== "showcase" || this.showCasingUser === userID) return;
    this.data[userID][this.round].vote += vote;
  };

  public getGameData = (): Api.EmittedGameData => {
    return {
      round: this.round,
      state: this.state,
      data: this.data,
      started: this.started,
      done: this.done,
      timeLeft: this.timeLeft,
      showCasingUser: this.showCasingUser,
      winner: this.winner,
    };
  };
}
