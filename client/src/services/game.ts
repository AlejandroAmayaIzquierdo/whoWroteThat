import { VITE_APP_BASE_URL } from "$lib/Contants";

const MODULE = 'game';

export const searchGame = async (userId: string,userName:string,isPrivate?: boolean): Promise<Api.StandardResp> => {
    const resp = await fetch(`${VITE_APP_BASE_URL}/${MODULE}/searchGame`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { 
                userId,
                "lang": 'es',
                isPrivate: isPrivate,
                userName
            }
        ),
    });

    return await resp.json() as Api.StandardResp;
}
