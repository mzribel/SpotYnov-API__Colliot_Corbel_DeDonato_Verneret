import {Request, Response} from "express";
import log from '../logger';
import {getAuthorizationCodeUrl, exchangeAuthorizationCode} from '../services/spotify/spotifyAuthService';
import {getSuccessResponse, getErrorResponse} from "../services/api/responseService";

export const getAuthCodeUrl = (req:Request, res:Response):void => {
    getSuccessResponse(res, {url: getAuthorizationCodeUrl()})
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
        console.log(error)
        getErrorResponse(res, 500, error.message);
    }
};