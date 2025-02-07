import { Request, Response } from "express";
import log from '../logger';
import { getAuthorizationCodeUrl, exchangeAuthorizationCode } from '../services/spotify/spotifyAuthService';
import { getSuccessResponse, getErrorResponse } from "../services/api/responseService";
import { ApiError } from "../middlewares/errorHandler";
import axios, { AxiosResponse } from "axios";
import {saveUserToFile} from "../utils/file";

export const getAuthCodeUrl = (req:Request, res:Response):void => {
    const auth_url:string = getAuthorizationCodeUrl()

    getSuccessResponse(res, {url: auth_url})
    log.info('Successfully generated Authorization Code Grant URL');
};

export const handleAuthCodeCallback = async (req:Request, res:Response) => {
    const code:string = String(req.query.code);

    try {
        const tokenData = await exchangeAuthorizationCode(code);
        log.info('Successfully exchanged token data');
        getSuccessResponse(res, tokenData);
    } catch (err) {
        const error = err as Error;     // Typescript...
        log.error('Error while exchanging authorization code for token', error.message || error);
        getErrorResponse(res, 500, error.message);
    }
};

export const linkSpotifyAccount =  async (req:Request, res:Response) => {
    const spotify_token = req.body.spotify_token
    if (!spotify_token || !spotify_token.access_token) {
        throw new ApiError(400, "Spotify token data missing or invalid.");
    }

    // Checks the validity of the token by requesting user data
    // Todo: Centralize spotify data fetching
    const config = {
        headers: {
            Authorization: `Bearer ${spotify_token.access_token}`,
        }
    }
    const response:AxiosResponse<any,any> = await axios.get("https://api.spotify.com/v1/me", config);
    if (!response.data) {
        throw new ApiError(400, "Spotify token data missing or invalid.");
    }

    // @ts-ignore
    const currentUser = req.userData;
    // Modifies and updates user data
    currentUser.setSpotifyData(response.data.id, spotify_token)
    saveUserToFile(currentUser)

    // HTTP Response :
    const spotifyUsername = response.data.display_name || "";
    getSuccessResponse(res, {message: `Successfully linked Spotify Account ${spotifyUsername} to user ${currentUser.Username}.`});
}

export const unlinkSpotifyAccount =  async (req:Request, res:Response) => {
    // @ts-ignore
    const currentUser = req.userData;
    // Modifies and updates user data
    currentUser.setSpotifyData(undefined, undefined)
    saveUserToFile(currentUser)

    getSuccessResponse(res, {message: `Successfully unlinked Spotify Account from user ${currentUser.Username}.`});
}