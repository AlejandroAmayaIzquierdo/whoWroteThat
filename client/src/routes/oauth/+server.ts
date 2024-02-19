import { SECRET_CLIENT_ID, SECRET_CLIENT_SECRET,VITE_APP_BASE_URL } from '$env/static/private';
import { OAuth2Client } from 'google-auth-library';
import { redirect } from '@sveltejs/kit';


export const GET = async ({url,cookies}) => {
    const redirecrUrl = 'http://localhost:5173/oauth';
    const code = await url.searchParams.get('code');

    if(!code) throw new Error("Code not found");
    console.log("Return code",code);

    try {
        const oAuth2Client = new OAuth2Client({
            clientId: SECRET_CLIENT_ID,
            clientSecret: SECRET_CLIENT_SECRET,
            redirectUri: redirecrUrl,
        });

        const r = await oAuth2Client.getToken(code);

        oAuth2Client.setCredentials(r.tokens);
        console.log("Auth Tokens recived");
        const user = oAuth2Client.credentials;
        console.log(user);

        const resp = await fetch(`${VITE_APP_BASE_URL}/user/oauth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(r.tokens)
        });
        const data = await resp.json() as Api.StandardResp;
        console.log(data);

        if(data.status === 0) throw redirect(302, '/game');

        const result = data.result as Api.SessionResult;

        cookies.set('auth', result.sessionId ?? '',{path: '/', maxAge: 60*60*24*7, httpOnly: false});
    }catch(e) {
        console.error(e);
    }
    throw redirect(302, '/game');
};