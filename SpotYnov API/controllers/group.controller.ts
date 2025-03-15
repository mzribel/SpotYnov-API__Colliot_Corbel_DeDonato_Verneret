import {NextFunction, Request, Response} from "express";
import {ApiError} from "../utils/error.util";
import {ResponseService} from "../services/api/response.service";
import {GroupService} from "../services/group.service";
import {Group, GroupDTO} from "../models/Group";
import {GroupSpotifyService} from "../services/group.spotify.service";
import User from "../models/User";

export class GroupController {
    // Dependancy Injection
    constructor(
        private groupService:GroupService,
        private groupSpotifyService:GroupSpotifyService
    ) {}

    public getGroupData = async (req: Request, res: Response, next: NextFunction) => {
        // Get group
        let group;
        if (req.params.groupID == "me" || !req.params.groupID) { group = this.groupService.getGroupByMemberID(req.user?.id ?? "")}
        else { group = this.groupService.getGroupByID(req.params.groupID ?? "");}
        if (!group) { throw new ApiError(404, "Group not found.") }

        const show_members:boolean = group.memberExists(req.user?.id ?? "");
        const groupDTO = await this.groupSpotifyService.getGroupWithSpotifyData(group, show_members);
        ResponseService.handleSuccessResponse(res, groupDTO)
    }
    public getGroupsData = async (req: Request, res: Response, next: NextFunction) => {
        // Get groups
        const groups = this.groupService.getGroups();
        const groupsDTO:GroupDTO[] = await Promise.all(groups.map(async (group: Group) => {
            const show_members: boolean = group.memberExists(req.user?.id ?? "");
            return await this.groupSpotifyService.getGroupWithSpotifyData(group, show_members);
        }));
        ResponseService.handleSuccessResponse(res, groupsDTO)
    }
    public createOrJoinGroup = async (req: Request, res: Response, next: NextFunction) => {
        let group_name:string = req.body.groupname ?? "";
        const existingGroup:Group|null = this.groupService.getGroupByName(group_name);

        if (existingGroup) {
            const group:Group = this.groupService.addMemberToGroup(req.user?.id ?? "", existingGroup.Id);
            ResponseService.handleSuccessResponse(res, {
                message:`Successfully added user to group ${group.Id} (${group.Name}).`
            })
        } else {
            const group:Group = this.groupService.createGroup(req.body.groupname ?? "", req.user?.id ?? "");
            ResponseService.handleSuccessResponse(res, group)
        }
    }

    public deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
        // Get group
        let group;
        if (req.params.groupID == "me") { group = this.groupService.getGroupByMemberID(req.user?.id ?? "")}
        else { group = this.groupService.getGroupByID(req.params.groupID ?? "");}
        if (!group) { throw new ApiError(404, "Group not found.") }
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

        // Get group
        let group;
        if (req.params.groupID == "me") { group = this.groupService.getGroupByMemberID(req.user?.id ?? "")}
        else { group = this.groupService.getGroupByID(req.params.groupID ?? "");}
        if (!group) { throw new ApiError(404, "Group not found.") }

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
        // Get group
        let group;
        if (req.params.groupID == "me") { group = this.groupService.getGroupByMemberID(req.user?.id ?? "")}
        else { group = this.groupService.getGroupByID(req.params.groupID ?? "");}
        if (!group) { throw new ApiError(404, "Group not found.") }
        if (group.getAdminID != (req.user?.id ?? "")) { throw new ApiError(403, "Only a group admin can start synchronization.") }

        await this.groupSpotifyService.synchronizePlayers(group);

        ResponseService.handleSuccessResponse(res, null, 204)
    }

    public getMembersTopTracks = async (req: Request, res: Response, next: NextFunction) => {
        // Get group
        let group;
        if (req.params.groupID == "me") { group = this.groupService.getGroupByMemberID(req.user?.id ?? "")}
        else { group = this.groupService.getGroupByID(req.params.groupID ?? "");}
        if (!group) { throw new ApiError(404, "Group not found.") }

        if (!group.memberExists(req.user?.id ?? "")) {
            throw new ApiError(403, "User is not a member of the group.")
        }

        const topTracks = await this.groupSpotifyService.getMembersTopTracks(group);
        ResponseService.handleSuccessResponse(res, topTracks, 200)
    }

    public getGroupMembers = async (req: Request, res: Response, next: NextFunction) => {
        // Get group
        let group;
        if (req.params.groupID == "me") { group = this.groupService.getGroupByMemberID(req.user?.id ?? "")}
        else { group = this.groupService.getGroupByID(req.params.groupID ?? "");}
        if (!group) { throw new ApiError(404, "Group not found.") }

        if (!group.memberExists(req.user?.id ?? "")) {
            throw new ApiError(403, "User is not a member of the group.")
        }

        const members = await this.groupSpotifyService.getGroupMembersWithSpotifyData(group);
        ResponseService.handleSuccessResponse(res, members, 200)
    }
}