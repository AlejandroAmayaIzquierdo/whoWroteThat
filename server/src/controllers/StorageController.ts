import fs from 'fs';
import { Response,Request } from "express";
import { getFile } from "../services/StorageServices";



export const storageGetController = async (req: Request, res: Response): Promise<fs.ReadStream> => {
    try {
        const { id } = req.body as unknown as Api.GetFileBody;
        console.log("ID: ", id);
        const file = await getFile(id);
        return file;
    } catch (error) {
        // console.log(error);
        throw { message: error, code: 500 };
    }
}