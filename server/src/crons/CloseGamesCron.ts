import { Db } from "../database/dbConnection";
import { Game } from "../game/Game";

export class CloseGamesCron implements App.CronTask {
  public handle = async () => {
    console.log("Closing games...");
    const db = Db.getInstance();
    const data = (await db.query(
      `SELECT * FROM rooms WHERE isActive = 1`
    )) as Api.Room[];
    for await (const room of data) {
      const doesGameShouldEnd = await Game.doesGameShouldEnd(room);
      if (doesGameShouldEnd) {
        await db.query(
          `UPDATE rooms SET isActive=0,isEnded=1 WHERE id='${room.id}'`
        );
        console.log(`Room ${room.id} closed`);
      }
    }
  };
}
