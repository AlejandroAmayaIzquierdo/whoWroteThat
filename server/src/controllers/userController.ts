﻿import { Request, Response } from "express";
import { createSession, createUser, getUser } from "../services/userServices.js";
import { createKeyId } from "lucia";
import { AuthManager } from "../database/AuthManager.js";
import { OAuth2Client } from "google-auth-library";
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from "../index.js";
import { Db } from "../database/dbConnection.js";


export const signupController =  async (req: Request, res: Response): Promise<Lucia.Session> => {
    try {
        const { userName, password } = req.body as unknown as Api.RegisterUserBody;

        console.log(userName,password);
    
        if (typeof userName !== "string" || userName.length < 4 || userName.length > 31)
            throw { message: "Invalid username", code: 400 };
        if (typeof password !== "string" || password.length < 6 || password.length > 255)
            throw { message: "Invalid password", code: 400 };

        const user = await createUser('id',userName,password);
        console.log(user);
        const session = await createSession(user.userId);
        if(!session)
            throw { message: "Error while creating the session", code: 402 };
        return session;
    } catch (error) {
        console.log(error);
        throw { message: error, code: 500 };
    }

}

export const logInController = async (req: Request, res: Response) : Promise<Lucia.Session> => {
    try {
        const { userName, password } = req.body as Api.RegisterUserBody;

        const user = await getUser('id',userName,password);
        const session = await createSession(user.userId);

        if(!session)
            throw { message: "Error while LogIn the session", code: 402 };

        return session;
    } catch (error) {
        throw { message: error, code: 500 };
    }
}

export const oauthController = async (req: Request, res: Response) => {
    const auth = AuthManager.getInstance().getAuth();
    let oauthCredentials = req.body as Api.OAuth2Google;
    const redirecrUrl = 'http://localhost:5173/oauth';

    
    // const auth = AuthManager.getInstance().getAuth();
    

    const oAuth2Client = new OAuth2Client({
        clientId: SECRET_CLIENT_ID,
        clientSecret: SECRET_CLIENT_SECRET,
        redirectUri: redirecrUrl,
    });

    const expiredAt = oauthCredentials.refresh_token;

    if(expiredAt) {
        const now = new Date().getTime();
        const expired = new Date(expiredAt).getTime();
        if(now > expired) {
            const refresh = await oAuth2Client.refreshAccessToken();
            oauthCredentials = {...refresh.credentials as Api.OAuth2Google};
        }
    }

    oAuth2Client.setCredentials(oauthCredentials);

    const userInfo = await oAuth2Client.verifyIdToken({
        idToken: oauthCredentials.id_token,
        audience: SECRET_CLIENT_ID,
    });

    const email = userInfo.getPayload()?.email;

    console.log(email);

    if(!email) throw { message: "Error while getting the email", code: 402 };
    const userKey = createKeyId("google",email.toLowerCase());

    console.log(userKey);  

    const existingUser = await Db.getInstance().query(`
        SELECT user_key.id AS user_key_id, users.id AS user_id
        FROM user_key
        INNER JOIN users ON user_key.user_id = users.id
        WHERE user_key.id = '${userKey}'`
    ) as { user_key_id: string,user_id:string }[];

    if(existingUser && existingUser.length > 0) {
        //TODO should validate if the user is already have a session.
        const session = await createSession(existingUser[0].user_id);
        console.log(userInfo.getPayload()?.picture);
        console.log(session);
        return session;
    }

    const profilePic = userInfo.getPayload()?.picture;
    const profileName = userInfo.getPayload()?.name;

    console.log(profilePic,profileName);


    const user: Lucia.User = await auth?.createUser({
        key: {
            providerId: "google",
            providerUserId: email.toLowerCase(),
            password: "google" // hashed by Lucia
        
        },
        attributes: {
            userName: email,
            profilePic,
            profileName,
        }

    });
    await Db.getInstance().query(`UPDATE user_key SET google_auth = '${JSON.stringify(oauthCredentials)}' WHERE id = '${userKey}'`);

    const session = await createSession(user.userId);

    console.log(session);
    return session;
}