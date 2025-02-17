// TODO : Exporter les méthodes utiles :
import axios, {AxiosError} from 'axios';

export class SpotifyService {
    public constructor() {}

    public makeRequest = async (endpoint:string, accessToken:string, method:string="GET", headers:object={}, params:object={}, body:object={}) => {
        if (accessToken) {
            headers = {
                "Authorization": `Bearer ${accessToken}`,
                ...headers,
            }
        }
        switch (method) {
            case "GET":
                const response= await axios.get(`https://api.spotify.com/v1${endpoint}`, {
                    headers,
                    params
                });
                return response.data;
        }
    }
    // TODO : heh bah non, j'aime pas trop
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
    //
    // public getSpotifyUserProfile = async (userID:number) => {
    //     return this.makeUserRequest(userID, "/me")
    // }

}



