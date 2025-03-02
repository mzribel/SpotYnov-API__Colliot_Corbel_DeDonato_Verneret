import {GroupDAO} from "../daos/group.dao";
import {Group, GroupDTO, GroupMember, GroupsData} from "../models/Group";
import User from "../models/User";
import {ApiError} from "../utils/error.util";
import log from "../logger";
import {UserService} from "./user.service";

export class GroupService {
    constructor(
        private groupDAO:GroupDAO,
        private userService:UserService) {}

    public getGroupByID = (groupID:string):Group | null => {
        const groups = this.groupDAO.getAllGroups();
        return groups.find((group) => { return group.Id == groupID }) ?? null;
    }

    public getGroupDTOByID = (groupID:string, show_members:boolean=false):GroupDTO | null => {
        const groups = this.groupDAO.getAllGroups();

        const group = groups.find((group) => { return group.Id == groupID }) ?? null;
        if (!group) return null;

        return this.groupToDTO(group, show_members);
    }

    public groupToDTO = (group:Group, show_members:boolean=false):GroupDTO => {
        let groupDTO = group.toDTO();
        if (show_members) {
            groupDTO.Members = group.members.map((member:GroupMember) => {
                const userDTO = this.userService.getUserDTOById(member.Id);
                if (!userDTO) { return; }
                return { ...userDTO, isAdmin: member.IsAdmin }
            })
        }
        return groupDTO;
    }

    public getGroups = ():Group[] => {
        return this.groupDAO.getAllGroups();
    }

    public createGroup = (groupname:string, adminID:string, groupsData?:GroupsData, saveToFile:boolean=true) => {
        if (!groupsData) groupsData = this.groupDAO.readFile();
        let adminUser = this.userService.getUserById(adminID);
        if (!adminUser) throw new ApiError(400, "User doesn't exist.");

        groupname = groupname.trim();
        if (!groupname) groupname = `${adminUser.Username}'s group`;

        // Delete user from all other groups
        this.deleteUserFromAllGroups(adminUser.Id, null, groupsData, false)

        // Create group
        let newGroup:Group = new Group((groupsData.auto_increment++).toString(), groupname, adminUser.Id);
        groupsData.groups[newGroup.Id] = newGroup;

        // Save if needed
        if (saveToFile) { this.groupDAO.writeFile(groupsData) }

        return newGroup;
    }

    // TODO : Conditions
    public addMemberToGroup = (userID:string, groupID:string, groupsData?:GroupsData, saveToFile:boolean=true) => {
        if (!groupsData) groupsData = this.groupDAO.readFile();

        const group = this.getGroupByID(groupID);
        if (!group) throw new ApiError(400, "Group doesn't exist.");
        const user = this.userService.getUserById(userID);
        if (!user) throw new ApiError(400, "User doesn't exist.");

        // User is already member
        if (group.memberExists(user.Id)) {
            throw new ApiError(400, "User is already a member of this group.");
        }

        // Delete user from all other groups
        this.deleteUserFromAllGroups(user.Id, group.Id, groupsData, false)

        // Add member to group
        group.addMember(user.Id);
        groupsData.groups[group.Id] = group;

        if (saveToFile) { this.groupDAO.writeFile(groupsData) }
        return group;
    }


    public deleteUserFromAllGroups(userID:string, exceptGroupID:string|null=null, groupsData?:GroupsData, saveInFile:boolean=true):void {
        if (!groupsData) groupsData = this.groupDAO.readFile();
        Object.keys(groupsData.groups).forEach((groupId:string) => {
            if (exceptGroupID == groupId) { return; }
            this.deleteMemberFromGroup(userID, groupId, groupsData, false)
        })
        if (saveInFile) { this.groupDAO.writeFile(groupsData) }
    }

    public promoteRandomUserToAdmin = (group:Group, groupsData?:GroupsData, saveToFile:boolean=true):User => {
        if (!groupsData) groupsData = this.groupDAO.readFile();

        let newAdmin:User|null = null;
        while (!newAdmin) {
            if (!group.members.length) {
                log.warn(`No member found in group ${group.Id} (${group.Name}).`)
                this.deleteGroup(group.Id, groupsData, false);
            }
            const randomID:number = Math.floor(Math.random() * (group.members.length));
            newAdmin = this.userService.getUserById(group.members[randomID].Id);

            if (!newAdmin) delete group.members[randomID];
        }
        groupsData.groups[group.Id] = group;
        if (saveToFile) { this.groupDAO.writeFile(groupsData)}

        log.info(`User ${newAdmin.Id} (${newAdmin.Username}) has been promoted admin of group ${group.Id} (${group.Name}).`)
        return newAdmin;
    }

    public deleteGroup(groupID:string, groupsData?:GroupsData, saveInFile:boolean=true):void {
        if (!groupsData) groupsData = this.groupDAO.readFile();
        let group = groupsData.groups[groupID];
        if (!group) throw new ApiError(400, "Group doesn't exist.");

        delete groupsData.groups[groupID];
        if (saveInFile) { this.groupDAO.writeFile(groupsData) }
    }

    public deleteMemberFromGroup(userID:string, groupID:string, groupsData?:GroupsData, saveToFile:boolean=true):boolean {
        if (!groupsData) groupsData = this.groupDAO.readFile();
        let group = groupsData.groups[groupID];
        if (!group) throw new ApiError(404, "Group doesn't exist.");

        // Deletes member from group
        const hasBeenDeleted = group.deleteMember(userID);
        if (hasBeenDeleted) {
            log.info(`User ${userID} has been deleted from group ${group.Id}.).`);
        }

        // Group is empty
        if (!group.members.length) {
            delete groupsData.groups[group.Id];
        } else if (!group.getAdminID) {
            this.promoteRandomUserToAdmin(group, groupsData, false);
        }

        if (saveToFile) { this.groupDAO.writeFile(groupsData)}
        return hasBeenDeleted;
    }

}