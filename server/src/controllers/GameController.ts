import { ResultSetHeader } from "mysql2";
import { Db } from "../database/dbConnection.js";
import { Game } from "../game/Game.js";
import crypto from "crypto";

type SearchRoomResponse = {
  roomId: string;
  currentUsers: string[];
};

export const searchActiveRoom = async (
  db: Db,
  data: Api.SearchGameBody
): Promise<SearchRoomResponse | undefined> => {
  const isUserOnActiveRoom = (await db.query(
    `SELECT * FROM rooms WHERE isEnded=0 AND players LIKE '%${data.userId}%'`
  )) as Api.Room[];

  if (isUserOnActiveRoom.length > 0) {
    // if is active
    if (isUserOnActiveRoom[0].isActive === 1) {
      const doesGameShouldEnd = await Game.doesGameShouldEnd(
        isUserOnActiveRoom[0]
      );
      // check if game should end
      if (doesGameShouldEnd) {
        await db.query(
          `UPDATE rooms SET isActive=0,isEnded=1 WHERE id='${isUserOnActiveRoom[0].id}'`
        );
      } else {
        // active room
        const players = isUserOnActiveRoom[0].players.split(",");
        return {
          roomId: isUserOnActiveRoom[0].id.toString(),
          currentUsers: players,
        };
      }
    } else if (isUserOnActiveRoom[0].isActive === 0) {
      // if is not active
      const players = isUserOnActiveRoom[0].players.split(",");
      return {
        roomId: isUserOnActiveRoom[0].id.toString(),
        currentUsers: players,
      };
    }
  }

  return undefined;
};

export const searchRoom = async (
  db: Db,
  data: Api.SearchGameBody
): Promise<SearchRoomResponse | undefined> => {
  const activeRooms = (await db.query(
    `SELECT * FROM rooms WHERE isActive=0 AND isEnded=0 AND isPrivate=0`
  )) as Api.Room[];
  if (activeRooms.length > 0) {
    //TODO add like search algoritm to play with similar users level

    const players = activeRooms[0].players.split(",");
    if (!players.find((e) => e === data.userId)) {
      players.push(data.userId);
      await Db.getInstance().query(
        `UPDATE rooms SET players="${players.join(",")}",isActive=1 WHERE id='${
          activeRooms[0].id
        } AND isPrivate=0'`
      );
    }
    return {
      roomId: activeRooms[0].id.toString(),
      currentUsers: players,
    };
  }
  return undefined;
};

export const createRoom = async (
  db: Db,
  data: Api.SearchGameBody
): Promise<SearchRoomResponse> => {
  const hash = crypto.createHash("sha256");

  hash.update(data.userId.toString() + new Date().getTime());

  const roomId = hash.digest("base64url");
  const isPrivate = data.isPrivate ? "1" : "0";

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
  (await db.query(
    `INSERT INTO rooms (id,players,maxUsers,isActive,isEnded,isPrivate,createdAt) VALUES ("${roomId}","${data.userId}",2,0,0,${isPrivate},'${formattedDate}');`
  )) as ResultSetHeader;
  return {
    roomId: roomId,
    currentUsers: [data.userId],
  };
};
