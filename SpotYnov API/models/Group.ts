// ---------------------------------------- //
// ---------- GROUPSDATA (model) ---------- //
// ---------------------------------------- //
import {UserDTO} from "./User";

export interface GroupsData {
    auto_increment: number,
    groups: {[key: string]: Group}
}

// ---------------------------------------- //
// ------------- GROUP (model) ------------ //
// ---------------------------------------- //
export class Group {
    private id:string;
    private name: string;
    public members : GroupMember[];

    // ------------- CONSTRUCTOR ------------ //
    public constructor(id:string="", name:string="", adminID:string="") {
        this.id = id;
        this.name = name;
        this.members = []
        if (adminID) { this.members.push(new GroupMember(adminID, true)) }
    }

    // --------- GETTERS & SETTERS --------- //
    get Id():string {
        return this.id;
    }
    set Id(id:string) {
        this.id = id;
    }
    get Name():string {
        return this.name;
    }
    set Name(name:string) {
        this.name = name;
    }

    // ------------- METHODS -------------- //
    public addMember(userID:string) {
        if (this.memberExists(userID)) { return ; }
        this.members.push(new GroupMember(userID));
    }

    public deleteMember(userID:string):boolean {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].Id == userID) {
                this.members.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    public get getAdminID ():string|null {
        return this.members.find((member:GroupMember):boolean => member.IsAdmin)?.Id ?? null;
    }

    public memberExists = (userID:string) => {
        return !(!this.members.find((member:GroupMember) => member.Id == userID));
    }

    public setAdmin(userID:string):string|null {
        if (this.memberExists(userID)) { return null; }

        for (let i = 0; i < this.members.length; i++) {
            this.members[i].IsAdmin = this.members[i].Id == userID;
        }
        return userID;
    }

    // ------------- CONVERSIONS -------------- //
    public static fromObject = (obj:Object) => {
        let group:Group = Object.assign(new Group(), obj);
        for (let i = 0; i < group.members.length; i++) {
            group.members[i] = Object.assign(new GroupMember(), group.members[i])
        }
        return group;
    }
}

// ---------------------------------------- //
// ------------- GROUP MEMBER ------------- //
// ---------------------------------------- //
export class GroupMember {
    private readonly id: string = "";
    private isAdmin: boolean = false;

    public constructor(id:string="", isAdmin:boolean=false) {
        this.id = id;
        this.isAdmin = isAdmin;
    }

    get Id() {
        return this.id;
    }
    get IsAdmin() {
        return this.isAdmin;
    }
    set IsAdmin(isAdmin:boolean) {
        this.isAdmin = isAdmin;
    }
}

// ---------------------------------------- //
// --------- GROUPDTO (... DTO) ----------- //
// ---------------------------------------- //
export class GroupDTO {
    // public id:string
    // public name:string
    // public admin_id?:string | null
    // public members?:UserDTO[]
    // public member_count?:number
    //
    // public constructor(group:Group) {
    //     this.id = group.Id;
    //     this.name = group.Name;
    //     this.admin_id = group.getAdminID ?? null;
    //     this.member_count = group.members.length;
    // }
}