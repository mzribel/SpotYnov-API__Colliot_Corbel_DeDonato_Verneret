import log from '../logger';
import { Request, Response, NextFunction } from 'express';
import { UserService } from "../services/user.service";
import {ApiError} from "../utils/error.util";
import { ResponseService } from "../services/api/response.service";

export class UserController {
    // Dependancy Injection
    constructor(private userService:UserService) {}

    public getUserData = async (req: Request, res: Response, next: NextFunction) => {
        // Retrieve path parameters
        const userID = req.user?.id ?? "";

        // Get user
        const user = this.userService.getUserDTOById(userID);
        if (!user) { throw new ApiError(404, "User not found."); }
        ResponseService.handleSuccessResponse(res, user)
    }
    public getUsersData = async (req: Request, res: Response, next: NextFunction) => {
        // Get users
        const users = this.userService.getUsersDTO();
        if (!users) { throw new ApiError(404, "User not found."); }
        ResponseService.handleSuccessResponse(res, users)
    }

    public getPlayerState = async (req: Request, res: Response, next: NextFunction) => {

    }
}