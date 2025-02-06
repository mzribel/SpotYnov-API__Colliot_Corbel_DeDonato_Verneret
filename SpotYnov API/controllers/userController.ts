import log from '../logger';
import { Request, Response, NextFunction } from 'express';
import { getSuccessResponse} from "../services/api/responseService";
import { ApiError } from "../middlewares/errorHandler";
import axios, {AxiosError, AxiosResponse} from "axios";
import { requestSpotifyAPI } from  "../services/spotify/spotifyService";
// TODO: Importer les fonctions de userService
// import { ... } from '../services/userService';

export const getUserTopTracks = async (req:Request, res:Response, next:NextFunction) => {
    const userId:string = req.params.userId;

    //@ts-ignore
    if (userId != req.userData.Id){
        throw new ApiError(401, "Unauthorized.");
    }
    //@ts-ignore
    const spotify_token = req.userData.spotify_token
    // @ts-ignore
    if (!spotify_token || !spotify_token.access_token) {
        throw new ApiError(401, "Account must be linked to Spotify.");
    }

    try {
        const data = await requestSpotifyAPI("/v1/me/top/tracks", spotify_token.access_token)
        getSuccessResponse(res, data);
    } catch (error) {
        if (error instanceof AxiosError) {
            // @ts-ignore
            console.log(error)
            throw new ApiError(500, "Spotify error.");
        }
        throw error;
    }
}