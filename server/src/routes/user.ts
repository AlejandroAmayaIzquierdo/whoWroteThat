﻿import express from "express";
import { AuthManager } from "../database/AuthManager.js";
import {
  logInController,
  oauthController,
  oauthGitController,
  oauthTwitchController,
  signupController,
} from "../controllers/userController.js";
import { Db } from "../database/dbConnection.js";

const userRoute = express.Router();

userRoute.post("/signup", async (req, res) => {
  try {
    const session = await signupController(req, res);
    const response: Api.Response = {
      status: 1,
      result: session,
    };
    return res.status(202).send(response);
  } catch (e) {
    const error = e as Api.Error;
    return res.status(error.code).send({ status: 0, error: error.message });
  }
});

userRoute.post("/oauth", async (req, res) => {
  try {
    const session = await oauthController(req, res);
    const response: Api.Response = {
      status: 1,
      result: session,
    };
    return res.status(202).send(response);
  } catch (err) {
    // const error = err as Api.Error;
    return res.status(500).send({ status: 0, error: `${err}` });
  }
});

userRoute.post("/oauthGit", async (req, res) => {
  try {
    const session = await oauthGitController(req, res);
    const response: Api.Response = {
      status: 1,
      result: session,
    };
    return res.status(202).send(response);
  } catch (err) {
    console.log(err);
    // const error = err as Api.Error;
    return res.status(500).send({ status: 0, error: `${err}` });
  }
});

userRoute.post("/oauthTwitch", async (req, res) => {
  try {
    const session = await oauthTwitchController(req, res);
    const response: Api.Response = {
      status: 1,
      result: session,
    };
    return res.status(202).send(response);
  } catch (err) {
    // const error = err as Api.Error;
    return res.status(500).send({ status: 0, error: `${err}` });
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const session = await logInController(req, res);
    const response: Api.Response = {
      status: 1,
      result: session,
    };
    return res.status(202).send(response);
  } catch (e) {
    const error = e as Api.Error;
    return res.status(error.code).send({ status: 0, error: error.message });
  }
});

userRoute.put("/logout", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth)
      return res.status(500).send({ status: 0, error: "No auth to close" });

    await Db.getInstance().query(
      `DELETE FROM user_session WHERE id = '${auth}'`
    );

    return res.status(200).send({ status: 1, result: "Logged Out" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 0, error: err });
  }
});

userRoute.get("/currentUser", async (req, res) => {
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
    const u = (await AuthManager.getInstance()
      .getAuth()
      ?.getAllUserKeys(session.user.userId)) as Lucia.User[];
    if (!u || u.length === 0)
      return res
        .status(500)
        .send({ status: 0, error: "Internal Server Error" });
    // if(u[0].providerId === 'google') {
    // 	const oauth2CredentialsString = await Db.getInstance().query(`SELECT google_auth FROM user_key WHERE id = '${u[0].providerId}:${u[0].providerUserId}'`) as {google_auth: string }[];
    // 	if(!oauth2CredentialsString || oauth2CredentialsString.length === 0)
    // 		return res.status(500).send({ status: 0, error: "Internal Server Error" });

    // 	const oauth2CredentialsData = JSON.parse(oauth2CredentialsString[0].google_auth) as Api.OAuth2Google;

    // 	// console.log(JSON.stringify(oauth2CredentialsData));

    // 	const redirecrUrl = 'http://localhost:5173/oauth';
    // 	const oAuth2Client = new OAuth2Client({
    // 		clientId: SECRET_CLIENT_ID,
    // 		clientSecret: SECRET_CLIENT_SECRET,
    // 		redirectUri: redirecrUrl,
    // 	});

    // 	oAuth2Client.setCredentials({access_token: oauth2CredentialsData.access_token, refresh_token: oauth2CredentialsData.refresh_token});

    // 	const userInfo = await oAuth2Client.verifyIdToken({
    // 		idToken: oauth2CredentialsData.id_token,
    // 		audience: SECRET_CLIENT_ID,
    // 	});

    // 	// console.log(userInfo.getPayload()?.picture, userInfo.getPayload()?.name);

    // 	const profilePic = userInfo.getPayload()?.picture;
    // 	const profileName = userInfo.getPayload()?.name;

    // 	// console.log(profilePic, profileName);

    // 	await Db.getInstance().query(`UPDATE users SET profilePic = '${profilePic}', profileName = '${profileName}' WHERE id = '${session.user.userId}'`) as Api.User[];
    // }

    const userData = (await Db.getInstance().query(
      `SELECT id as userId,userName,profilePic,profileName FROM users WHERE id = '${session.user.userId}'`
    )) as Api.User[];
    const user = userData.length > 0 ? userData[0] : session.user;
    return res.status(200).send({ status: 1, result: user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: 0, error: err });
  }
});

export default userRoute;
