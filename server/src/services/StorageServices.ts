import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_PATH = path.join(__dirname, '..', '..', 'storage');

export const getFile = async (id: string): Promise<string> => {
    try {
        const file_path = path.join(STORAGE_PATH, id);
        console.log(file_path);
        const fileData = fs.readFileSync(file_path,{encoding: 'base64'});
        return fileData;
    } catch (err) {
        console.log(err);
        throw new Error('Error while fetching the file');
    }
}