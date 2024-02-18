import express from "express";
import userRoute from "./user.js";
import gameRoute from "./game.js";
import storageRoute from "./storage.js";


const Routes = express.Router();

Routes.use('/user',userRoute);
Routes.use('/game',gameRoute);
Routes.use('/storage',storageRoute);

export default Routes;