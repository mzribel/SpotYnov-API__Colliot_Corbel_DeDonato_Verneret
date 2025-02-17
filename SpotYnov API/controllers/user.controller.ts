import log from '../logger';
import { Request, Response, NextFunction } from 'express';
import { getSuccessResponse} from "../services/api/response.service";
import {getSpotifyUserProfile} from "../services/spotify/spotify.service";
// TODO: Importer les fonctions de userService

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userID = req.user?.id;
    if (userID == undefined) {
        return;
    }
    const data = await getSpotifyUserProfile(userID);

    getSuccessResponse(res, data);
}