import log from '../logger';
import { Request, Response, NextFunction } from 'express';
import { ResponseService } from "../services/api/response.service";
import { UserService } from "../services/user.service";

export class UserController {
    // Dependancy Injection
    constructor(private userService:UserService) {}

    public getUserData = async (req: Request, res: Response, next: NextFunction) => {
        const userID = req.user?.id;
        if (userID == undefined) {
            return;
        }
        const user = this.userService.getUserById(userID);
        ResponseService.handleSuccessResponse(res, user);
    }
}