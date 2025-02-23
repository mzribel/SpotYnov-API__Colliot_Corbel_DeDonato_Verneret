import {NextFunction, Request, Response} from "express";
import {ApiError} from "../utils/error.util";
import {ResponseService} from "../services/api/response.service";
import {GroupSpotifyService} from "../services/group.spotify.service";
import {GroupService} from "../services/group.service";
import {UserService} from "../services/user.service";

export class GroupController {
    // Dependancy Injection
    constructor(
        private groupService:GroupService,
        // private userSpotifyService:UserSpotifyService
    ) {}

    public getGroupData = async (req: Request, res: Response, next: NextFunction) => {
        // Retrieve path parameters
        const groupID = req.params.groupID;
        // Get user
        const group = this.groupService.getGroupByID(groupID);
        if (!group) { throw new ApiError(404, "Grouup not found."); }
        ResponseService.handleSuccessResponse(res, group)
    }
    public getGroupsData = async (req: Request, res: Response, next: NextFunction) => {
        // Get users
        const users = this.groupService.getGroups();
        if (!users) { throw new ApiError(404, "No group registered."); }
        ResponseService.handleSuccessResponse(res, users)
    }
    public createGroup = async (req: Request, res: Response, next: NextFunction) => {
        const group = this.groupService.createGroup(req.body.groupname ?? "", req.user?.id ?? "");
        ResponseService.handleSuccessResponse(res, group)
    }
}