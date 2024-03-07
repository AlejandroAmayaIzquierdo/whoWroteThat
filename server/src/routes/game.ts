import express from "express";
import { Db } from "../database/dbConnection.js";
// import { AuthManager } from "../database/AuthManager.js";
import { ResultSetHeader } from "mysql2";
import crypto from "crypto";
import { AuthManager } from "../database/AuthManager.js";
import { Game } from "../game/Game.js";
import {
  createRoom,
  searchActiveRoom,
  searchRoom,
} from "../controllers/GameController.js";

const gameRoute = express.Router();

gameRoute.post("/searchGame/:roomID", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res
        .status(500)
        .send({ status: 0, error: "Internal Server Error" });
    const session = (await AuthManager.getInstance()
      .getAuth()
      ?.validateSession(auth)) as Lucia.Session;
    if (!session)
      return res.status(500).send({ status: 0, error: "Unauthorized User" });

    const roomID = req.params.roomID;

    if (roomID) {
      const room = (await Db.getInstance().query(`
                SELECT * FROM rooms WHERE id='${roomID}' AND isPrivate = 1`)) as Api.Room[];
      if (room.length > 0) {
        const players = room[0].players.split(",");
        const response: Api.Response = {
          status: 1,
          result: {
            roomId: room[0].id,
            currentUsers: players,
          },
        };
        return res.status(202).send(response);
      }
    }
    return res.status(500).send({ status: 0, error: "Room not found" });
  } catch (err) {
    console.log(err);
    const response: Api.Response = {
      status: 0,
      error: err,
    };
    return res.status(500).send(response);
  }
});

gameRoute.post("/searchGame", async (req, res) => {
  try {
    const data = req.body as Api.SearchGameBody;
    // console.log(data);

    const db = Db.getInstance();

    if (!data.isPrivate) {
      //Search for active room.
      console.log("Searching for active room");

      const activeRoom = await searchActiveRoom(db, data);

      if (activeRoom) {
        const response: Api.Response = {
          status: 1,
          result: {
            roomId: activeRoom.roomId,
            currentUsers: activeRoom.currentUsers,
          },
        };
        return res.status(202).send(response);
      }

      console.log("Searching for room");

      //Search for room.
      const sRoom = await searchRoom(db, data);
      if (sRoom) {
        const response: Api.Response = {
          status: 1,
          result: {
            roomId: sRoom.roomId,
            currentUsers: sRoom.currentUsers,
          },
        };
        return res.status(202).send(response);
      }
    }
    //Create room.
    console.log("Creating room");
    const rCreated = await createRoom(db, data);
    if (!rCreated) throw new Error("Error creating room");
    const response: Api.Response = {
      status: 1,
      result: {
        roomId: rCreated.roomId,
        currentUsers: [data.userId],
      },
    };
    return res.status(202).send(response);
  } catch (error) {
    console.log(error);
    const response: Api.Response = {
      status: 0,
      error: error,
    };
    return res.status(500).send(response);
  }
});

export default gameRoute;
