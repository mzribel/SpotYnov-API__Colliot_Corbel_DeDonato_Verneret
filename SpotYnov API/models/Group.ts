export interface GroupsData {
    auto_increment: number,
    groups: {[key: string]: Group}
}

export class Group {
    private readonly id:string;
    private name: string;
    public members : GroupMember[]

    private constructor(id:string="", name:string="", members:GroupMember[]=[]) {
        this.id = id;
        this.name = name;
        this.members = members;
    }

    get Id():string {
        return this.id;
    }
    get Name():string {
        return this.name;
    }
    set Name(name:string) {
        this.name = name;
    }
    public static create = (id:number, name:string, userID:string) => {
        if (!id || !userID) {
            throw new Error("Group ID and user ID are required.");
        }
        const admin:GroupMember = new GroupMember(userID, true)
        return new Group(id.toString(), name, [admin]);
    }

    public static fromObject = (obj:object) => {
        let group = Object.assign(new Group(), obj)
        for (let i = 0; i < group.members.length; i++) {
            group.members[i] = Object.assign(new GroupMember(), group.members[i])
        }
        return group;
    }

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

    public promoteRandomUserToAdmin = () => {
        if (!this.members.length) return null;

        const randomID:number = Math.floor(Math.random() * (this.members.length));

        for (let i = 0; i < this.members.length; i++) {
            this.members[i].IsAdmin = false;
        }
        this.members[randomID].IsAdmin = true;
        return this.members[randomID].Id;
    }

    public memberExists = (userID:string) => {
        return !(!this.members.find((member:GroupMember) => member.Id == userID));
    }

    public isMember = (userID:string) => {
        return !(!this.members.find((member:GroupMember) => userID == member.Id));
    }
}

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
