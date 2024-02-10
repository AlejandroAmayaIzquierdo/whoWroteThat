import { VITE_APP_BASE_URL } from "$lib/Contants";
import { Cookies } from "$lib/util/Cookies";


const MODULE = "user";


export class User {
    public static getCurrentUser = async (token?: string): Promise<App.User | null> => {
        let authToken = token;
        if(!token){
            authToken = Cookies.getCookie('auth');
            if(!authToken) return null;
        }
        const resp = await fetch(`${VITE_APP_BASE_URL}/${MODULE}/currentUser`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": authToken ?? ""
            }
        });

        const data = await resp.json() as Api.StandardResp;
        
        if(data.status === 0){
            return null;
        }

        return data.result as App.User;
    }
}