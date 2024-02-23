import { Response, Request } from "express";
import { UploadedFile } from 'express-fileupload';
import { registerFile, saveFile } from "../services/StorageServices.js";


export const storagePostController = async (req: Request, res: Response) => {
    try {
        const file = req.files?.file as UploadedFile;


        const saveFileData = await saveFile(file);

        if (!saveFileData)
            throw new Error('Error while saving the file');

        const isFileRegistered = await registerFile(
            saveFileData.name,
            saveFileData.type,
            saveFileData.path,
            saveFileData.hash
        );

        if (!isFileRegistered)
            throw new Error('Error while registering the file');
        return saveFileData;
    } catch (err) {
        throw { message: err, code: 500 };
    }
}