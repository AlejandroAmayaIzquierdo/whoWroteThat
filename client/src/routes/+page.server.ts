// import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
    return {
        user: locals.user,
        authToken: locals.authToken
    }
    // throw redirect(302,'/game');
}) satisfies PageServerLoad;