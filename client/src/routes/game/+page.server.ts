import type { PageServerLoad } from './$types';
import { OAuth2Client } from 'google-auth-library';
import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

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
    }
}