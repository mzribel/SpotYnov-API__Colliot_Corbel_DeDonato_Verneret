import {NextFunction, Request, Response} from "express";
import {ApiError} from "../utils/error.util";
import {ResponseService} from "../services/api/response.service";
import {GroupService} from "../services/group.service";
import {Group, GroupDTO} from "../models/Group";
import {GroupSpotifyService} from "../services/group.spotify.service";

export class GroupController {
    // Dependancy Injection
    constructor(
        private groupService:GroupService,
        private groupSpotifyService:GroupSpotifyService
    ) {}

    public getGroupData = async (req: Request, res: Response, next: NextFunction) => {
        // God mod
        const isAdmin = false;
        // Get group
        const group = this.groupService.getGroupByID(req.params.groupID ?? "");
        if (!group) { throw new ApiError(404, "Group not found.") }

        const show_members:boolean = group.memberExists(req.user?.id ?? "") || isAdmin;
        const groupDTO = this.groupService.groupToDTO(group, show_members);
        ResponseService.handleSuccessResponse(res, groupDTO)
    }
    public getGroupsData = async (req: Request, res: Response, next: NextFunction) => {
        // God mod
        const isAdmin = false;
        // Get groups
        const groups = this.groupService.getGroups();
        const groupsDTO:GroupDTO[] = groups.map((group:Group)=> {
            const show_members:boolean = group.memberExists(req.user?.id ?? "") || isAdmin;
            return this.groupService.groupToDTO(group, show_members);
        })
        ResponseService.handleSuccessResponse(res, groupsDTO)
    }
    public createGroup = async (req: Request, res: Response, next: NextFunction) => {
        const group = this.groupService.createGroup(req.body.groupname ?? "", req.user?.id ?? "");
        ResponseService.handleSuccessResponse(res, group)
    }

    public deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
        const group = this.groupService.getGroupByID(req.params.groupID);

        if (!group) { throw new ApiError(400, "Group doesn't exist.") }
        if (group.getAdminID != (req.user?.id ?? "")) { throw new ApiError(403, "Only a group admin can delete a group.") }

        this.groupService.deleteGroup(req.params.groupID)
        ResponseService.handleSuccessResponse(res, {message:`Successfully deleted group ${group.Id} (${group.Name}).`})
    }

    public addGroupMember = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = req.body.user_id ?? "";
        if (!user_id) { throw new ApiError(400, "A User ID to be added to the group is required.") }
        if (user_id != req.user?.id) { throw new ApiError(403, "A user can only add themselves to a group.") }

        const group = this.groupService.addMemberToGroup(user_id, req.params.groupID);
        ResponseService.handleSuccessResponse(res, {
            message:`Successfully added user to group ${group.Id} (${group.Name}).`
        })
    }

    public deleteGroupMember = async (req: Request, res: Response, next: NextFunction) => {
        const user_id = req.params.userID;
        const group_id = req.params.groupID;

        const group = this.groupService.getGroupByID(group_id);
        if (!group) { throw new ApiError(404, "Group doesn't exist.") }

        if (!group.memberExists(user_id)) {
            throw new ApiError(400, "User is not a member of the group.")
        }

        if (user_id != req.user?.id && group.getAdminID != req.user?.id) {
            throw new ApiError(403, "Only a group admin can delete a member, or the member themselves.")
        }

        this.groupService.deleteMemberFromGroup(user_id, group_id);
        ResponseService.handleSuccessResponse(res, {
            message:`Successfully deleted user from group ${group.Id} (${group.Name}).`
        })
    }

    public synchronizePlayers = async (req: Request, res: Response, next: NextFunction) => {
        const group = this.groupService.getGroupByID(req.params.groupID);

        if (!group) { throw new ApiError(400, "Group doesn't exist.") }
        if (group.getAdminID != (req.user?.id ?? "")) { throw new ApiError(403, "Only a group admin can start synchronization.") }

        await this.groupSpotifyService.synchronizePlayers(group);

        ResponseService.handleSuccessResponse(res, null, 204)
    }

    public createPlaylistFromMembersTopTracks = async (req: Request, res: Response, next: NextFunction) => {

    }
}