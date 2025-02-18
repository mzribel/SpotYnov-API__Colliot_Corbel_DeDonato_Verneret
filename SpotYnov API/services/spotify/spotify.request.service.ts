import axios from "axios";

export interface SpotifyRequestParams {
    method:"get"|"post"|"put"|"delete",
    isAuth?:boolean,
    endpoint:string,
    access_token?:string,
    headers?:object,
    params?:object,
    body?:object,
}

export class SpotifyRequestService {
    public static readonly API_URL=  "https://api.spotify.com/v1";
    public static readonly AUTH_URL = "https://accounts.spotify.com/api";

    async request(req_params:SpotifyRequestParams): Promise<any> {
        let params = {
            method: req_params.method,
            url: !req_params.isAuth ? SpotifyRequestService.API_URL + req_params.endpoint : SpotifyRequestService.AUTH_URL + req_params.endpoint,
            headers: {
                ...(req_params.access_token ? {Authorization: `Bearer ${req_params.access_token}`} : {}),
                ...req_params.headers
            },
            params: req_params.params,
            data: req_params.body,
        }

        console.log(params)
        return axios(params);
    }
}

// public makeUserRequest = async (access_token:string, refresh_token:string, endpoint:string, method:string="GET") => {
//     return await this.makeRequest(endpoint, access_token).catch(async (error: AxiosError) => {
//         if (error.response && error.response.status == 401) {
//             const newToken = await this.userService.refreshSpotifyToken(user.Id);
//             if (newToken) {
//                 return await this.makeRequest(endpoint, newToken);
//             }
//         }
//     })
// }