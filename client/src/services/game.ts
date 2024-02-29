import { VITE_APP_BASE_URL } from "$lib/Contants";
import { Cookies } from "$lib/util/Cookies";

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

export const joinGame = async (roomId: string): Promise<Api.StandardResp> => {
    const resp = await fetch(`${VITE_APP_BASE_URL}/${MODULE}/searchGame/${roomId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': Cookies.getCookie('auth') ?? ""
        }
    });

    return await resp.json() as Api.StandardResp;
}
