﻿import { Db } from "../database/dbConnection.js";
import { Game } from "../game/Game.js";
import { Application } from "../index.js";
import { RoomManager } from "./RoomManager.js";

export class Room {
  private id: string;

  private playersInfo: Api.User[] = [];

  private maxPlayers: number = 2;

  private game: Game;

  private interval: NodeJS.Timeout | undefined;

  private isPrivate: boolean = false;

  private createdAt: Date;

  public static readonly MAX_TIME_BY_GAME: number = 1800; // 30 minutes

  public static readonly MAX_TIME_BEFORE_START: number = 120;

  private isClosingGame: boolean = false;

  public constructor(
    roomID: string,
    maxUsers?: number,
    players?: Api.User[],
    isPrivate?: boolean
  ) {
    this.id = `${roomID}`;
    if (maxUsers) this.maxPlayers = maxUsers;

    if (players) this.playersInfo = [...this.playersInfo, ...players];
    this.game = new Game(this.playersInfo);
    this.isPrivate = isPrivate || false;

    this.createdAt = new Date();
  }

  public join = async (user: Api.User) => {
    let userInfo = user;
    let query = (await Db.getInstance().query(`
            SELECT id as userId,userName,profilePic,profileName 
            FROM users WHERE id='${user.userId}'`)) as Api.User[];
    if (query.length > 0) userInfo = query[0];
    const isUserOnRoom = this.playersInfo.find((e) => e.userId === user.userId);
    if (this.playersInfo.length < this.maxPlayers && !isUserOnRoom)
      this.playersInfo.push(userInfo);
    Application.io.to(this.id).emit("joinedRoom", this.playersInfo);

    this.game.players = this.playersInfo;

    console.log("User joined", user.userId);

    if (!this.interval) this.handle();

    if (this.playersInfo.length === this.maxPlayers) {
      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
      await Db.getInstance().query(
        `UPDATE rooms SET players="${this.playersInfo
          .map((e) => e.userId)
          .join(",")}",isActive=1,startedAt="${formattedDate}" WHERE id='${
          this.id
        }'`
      );
      this.game.startGame();
    }
  };

  public leave = async (user: Api.User) => {
    console.log("User left", user.userId);
    this.playersInfo = this.playersInfo.filter((e) => e.userId !== user.userId);
    Application.io.to(this.id).emit("leavedRoom", user);
    console.log("User length", this.playersInfo.length);
    if (this.playersInfo.length <= 1) this.done();
  };

  public handle = () => {
    this.interval = setInterval(async () => {
      if (this.game.getGameData().started) this.game.update();

      if (this.game.getGameData().done || this.doesRoomShouldClose()) {
        setTimeout(() => {
          this.done();
        }, 10000);
      }

      Application.io.to(this.id).emit("updateRoom", {
        gameData: this.game.getGameData(),
        players: this.playersInfo,
        isPrivate: this.isPrivate,
      });
    }, 1000);
  };

  public shouldCloseRoom = () => {};

  public done = async () => {
    if (this.isClosingGame) return;

    this.isClosingGame = true;
    if (this.interval) clearInterval(this.interval);
    Application.io
      .to(this.id)
      .emit("toast", "Game Ended. How you have fun. 😃");
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
    await Db.getInstance().query(
      `UPDATE rooms SET players="${this.playersInfo
        .map((e) => e.userId)
        .join(
          ","
        )}",isActive=0,isEnded=1,endedAt="${formattedDate}" WHERE id="${
        this.id
      }"`
    );
    RoomManager.removeRoom(this.id);
  };

  public static doesRoomShouldEnd = async (
    room: Api.Room
  ): Promise<boolean> => {
    try {
      const { createdAt } = room;

      const now = new Date();
      const startDate = new Date(createdAt);
      const diff = now.getTime() - startDate.getTime();
      const seconds = diff / 1000;
      return seconds > Room.MAX_TIME_BY_GAME;
    } catch (err) {
      return true;
    }
  };

  public doesRoomShouldClose = (): boolean => {
    try {
      if (this.getGame().getGameData().started) return false;

      const now = new Date();
      const startDate = new Date(this.createdAt);
      const diff = now.getTime() - startDate.getTime();
      const seconds = diff / 1000;

      return seconds > Room.MAX_TIME_BEFORE_START;
    } catch (err) {
      return true;
    }
  };

  public getID = () => this.id;
  public getGame = () => this.game;
  public getPlayers = () => this.playersInfo;
}
