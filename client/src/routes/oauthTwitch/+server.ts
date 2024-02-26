import type { RequestEvent } from '../$types';
import { User } from '../../services/user';
import { redirect } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  const storedState = event.cookies.get("twitch_oauth_state") ?? null;


  if (!code || !state || !storedState || state !== storedState) {
    throw redirect(302, '/game');
  }

  try {
    const resp = await User.postOauthTwitch(code, state);
    if (!resp) return new Response(null, { status: 500 });
    event.cookies.set('auth', resp.sessionId ?? '', { path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: false });
    throw redirect(302, '/game');
  } catch (error) {
    console.log(error);
    throw redirect(302, '/game');
  }
};