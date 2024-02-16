import { Db } from "../database/dbConnection.js";


export const getRandomChat = async (): Promise<App.Message[]> => {

    const resp = await Db.getInstance().query(`
        SELECT 
            messages.message,messages.isMine 
        FROM chats 
        INNER JOIN messages ON chats.id = messages.chatID 
        WHERE chats.id = ${Math.floor(Math.random() * 4) + 1}`
    );
    
    if(resp)
        return resp as App.Message[];
    
    return [];
}