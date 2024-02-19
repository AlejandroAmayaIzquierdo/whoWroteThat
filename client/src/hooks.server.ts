import { authenticateUser } from "$lib/auth";
import { type Handle } from "@sveltejs/kit";


export const handle: Handle = async ({ event, resolve }) => {
    //TODO the app will have free access but if you have and account will get extra features.
    const auth = await authenticateUser(event);
    if (auth) {
        event.locals.user = auth?.user;
        event.locals.authToken = auth?.userToken;
    }else {
        event.locals.user = null;
        event.locals.authToken = null;
    }


    if (event.url.pathname.startsWith('/game/') || event.url.pathname === '/game') {
        // Accessing /game or /game/[id]
        if (!event.locals.user) {
            // throw redirect(303, '/');
        }
    } else if (event.url.pathname !== '/') {
        // Redirect to home for any other path (except '/')
        // throw redirect(303, '/');
    }


    const response = await resolve(event);

    return response;
}