// TODO : Exporter les méthodes utiles :
import axios, {AxiosError} from 'axios';
import {getUserById, refreshSpotifyToken} from "../userService";
import User from "../../models/User";
import {ApiError} from "../../middlewares/errorHandler";


export const makeRequest = async (endpoint:string, accessToken:string, method:string="GET", headers:object={}, params:object={}, body:object={}) => {
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

export const makeUserRequest = async (userID:number, endpoint:string, method:string="GET", useRefreshToken:boolean=true) => {
    const user:User|null = getUserById(userID);
    if (!user || !user.hasSpotifyTokenData) {
        throw new ApiError(401, `User doesn't exist or hasn't linked a Spotify Account.`);
    }

    return await makeRequest(endpoint, user.SpotifyAccessToken).catch(async (error: AxiosError) => {
        if (error.response && error.response.status == 401) {
            const newToken = await refreshSpotifyToken(user.Id);
            if (newToken) {
                return await makeRequest(endpoint, newToken);
            }
        }
    })
}

export const getSpotifyUserProfile = async (userID:number) => {
    return makeUserRequest(userID, "/me")
}


