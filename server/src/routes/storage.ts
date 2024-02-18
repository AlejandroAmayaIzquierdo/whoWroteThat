import express, { Response, Request } from "express";
// import { storageGetController } from "../controllers/StorageController";
import { Stream } from "stream";
import { getFile } from "../services/StorageServices";

const storageRoute = express.Router();

storageRoute.get('/:fileID', async (req: Request, res: Response) => {
    try {
        // Retrieve the tag from our URL path
        const fileID = req.params.fileID;

        const acceptHeader = req.headers.accept;

        const fileData = await getFile(fileID);
        const fileContents = Buffer.from(fileData, 'base64');
        const readStream = new Stream.PassThrough();
        readStream.end(fileContents);
        res.set('Content-disposition', 'attachment; filename=' + fileID);
        res.set('Content-Type', acceptHeader);
        readStream.pipe(res);
    } catch (err) {
        // console.log(err);
        const error = err as Api.Error;
        return res.status(error.code).send({ status: 0, error: error.message });
    }
});

export default storageRoute;