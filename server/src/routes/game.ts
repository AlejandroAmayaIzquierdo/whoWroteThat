import express from "express";
import { Db } from "../database/dbConnection.js";
// import { AuthManager } from "../database/AuthManager.js";
import { ResultSetHeader } from "mysql2";
import crypto from "crypto";
import { AuthManager } from "../database/AuthManager.js";

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
      console.log("Searching for active room");

      const isUserOnActiveRoom = (await db.query(
        `SELECT * FROM rooms WHERE isEnded=0 AND players LIKE '%${data.userId}%'`
      )) as Api.Room[];

      if (isUserOnActiveRoom.length > 0) {
        const players = isUserOnActiveRoom[0].players.split(",");
        const response: Api.Response = {
          status: 1,
          result: {
            roomId: isUserOnActiveRoom[0].id,
            currentUsers: players,
          },
        };
        return res.status(202).send(response);
      }

      console.log("Searching for room");

      //Search for room.
      const activeRooms = (await db.query(
        `SELECT * FROM rooms WHERE isActive=0 AND isEnded=0 AND isPrivate=0`
      )) as Api.Room[];
      console.log("Searching for room");
      if (activeRooms.length > 0) {
        //TODO add like search algoritm to play with similar users level

        const players = activeRooms[0].players.split(",");
        if (!players.find((e) => e === data.userId)) {
          players.push(data.userId);
          await Db.getInstance().query(
            `UPDATE rooms SET players="${players.join(
              ","
            )}",isActive=1 WHERE id='${activeRooms[0].id} AND isPrivate=0'`
          );
        }
        const response: Api.Response = {
          status: 1,
          result: {
            roomId: activeRooms[0].id,
            currentUsers: players,
          },
        };
        return res.status(202).send(response);
      }
    }

    console.log("Creating room");

    //Create room.
    const hash = crypto.createHash("sha256");

    hash.update(data.userId.toString() + new Date().getTime());

    const roomId = hash.digest("base64url");
    const isPrivate = data.isPrivate ? "1" : "0";

    (await db.query(
      `INSERT INTO rooms (id,players,maxUsers,isActive,isEnded,isPrivate) VALUES ("${roomId}","${data.userId}",2,0,0,${isPrivate});`
    )) as ResultSetHeader;
    const response: Api.Response = {
      status: 1,
      result: {
        roomId: roomId,
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
