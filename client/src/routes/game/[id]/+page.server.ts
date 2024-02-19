import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals, params }) => {
    const { id } = params;

    return {
        id,
        user: locals.user
    };
};
