import type { PageServerLoad } from './$types';
import { OAuth2Client } from 'google-auth-library';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,TWITCH_CLIENT_ID,TWITCH_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { GitHub, generateState,Twitch } from "arctic";

export const load: PageServerLoad = async ({locals}) => {
    return {
        user: locals.user
    };
};

export const actions = {
    OAuth2Google: async () => {
        const redirecrUrl = 'http://localhost:5173/oauth';

        const oAuth2Client = new OAuth2Client({
            clientId: SECRET_CLIENT_ID,
            clientSecret: SECRET_CLIENT_SECRET,
            redirectUri: redirecrUrl,
        });

        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'openid'
            ],
            prompt: 'consent',
        });

        throw redirect(302, authUrl);
    },
    OAuthGithub: async ({cookies}) => {
        const github = new GitHub(
            GITHUB_CLIENT_ID,
            GITHUB_CLIENT_SECRET
        );
        const state = generateState();
        const url = await github.createAuthorizationURL(state);
        
        cookies.set(
            'github_oauth_state', 
            state, 
            { 
                path: '/', 
                maxAge: 60*10, 
                httpOnly: true,
                sameSite: 'lax',
            }
        );
        throw redirect(302, url.toString());


    },
    OAuthTwitch: async ({cookies}) => {
        const redirecrUrl = 'http://localhost:5173/oauthTwitch';

        const twitch = new Twitch(
            TWITCH_CLIENT_ID,
            TWITCH_CLIENT_SECRET,
            redirecrUrl
        );
        const state = generateState();

        const url = await twitch.createAuthorizationURL(state);

        cookies.set(
            'twitch_oauth_state', 
            state, 
            { 
                path: '/', 
                maxAge: 60*10, 
                httpOnly: true,
                sameSite: 'lax',
            }
        );
        throw redirect(302, url.toString());
        
    }
}