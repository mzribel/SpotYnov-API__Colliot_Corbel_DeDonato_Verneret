import log from '../logger';
import { Request, Response, NextFunction } from 'express';
import { getSuccessResponse} from "../services/api/responseService";
import { ApiError } from "../middlewares/errorHandler";
import axios, {AxiosError, AxiosResponse} from "axios";
// TODO: Importer les fonctions de userService
// import { ... } from '../services/userService';

export const getUserTopTracks = async (req:Request, res:Response, next:NextFunction) => {
    const userId:string = req.params.userId;

    //@ts-ignore
    if (userId != req.userData.Id){
        throw new ApiError(401, "Unauthorized.");
    }
    //@ts-ignore
    const spotify_token = req.userData.spotifyToken
    if (!spotify_token || !spotify_token.access_token) {
        throw new ApiError(401, "Account must be linked to Spotify.");
    }

    // Checks the validity of the token by requesting user data
    // Todo: Centralize spotify data fetching
    const config = {
        headers: {
            Authorization: `Bearer ${spotify_token.access_token}`,
        }
    }
    try {
        const result = await axios.get("https://api.spotify.com/v1/me/top/tracks", config)
        getSuccessResponse(res, result.data);
    } catch (error) {
        if (error instanceof AxiosError) {
            // @ts-ignore
            const axiosError = error.response.data.error;
            // @ts-ignore
            throw new ApiError(axiosError.status, "Spotify error : " +axiosError.message);
        }
        throw error;
    }
}