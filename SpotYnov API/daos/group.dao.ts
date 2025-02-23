import path from "node:path";
import {readFileSync, writeFileSync} from "node:fs";
import {Group, GroupsData} from "../models/Group";

export class GroupDAO {
    private readonly filePath:string = path.resolve(__dirname, '../data/groups.json');
    public readFile():GroupsData {
        const data = readFileSync(this.filePath, 'utf-8');
        const groupsData:GroupsData = JSON.parse(data) as GroupsData;

        for (const key of Object.keys(groupsData.groups)) {
            groupsData.groups[key] = Group.fromObject(groupsData.groups[key]);
        }

        return groupsData;
    }
    public writeFile(data: GroupsData): void {
        writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    }
    public getAllGroups():Group[] {
        return Object.values(this.readFile().groups);
    }
    public createGroup(group:Group):Group {
        let data:GroupsData = this.readFile();

        group.Id = (data.auto_increment++).toString();
        data.groups[group.Id] = group;

        this.writeFile(data);
        return group;
    }

    public updateGroup(group: Group): Group | null {
        const data:GroupsData = this.readFile();
        if (!group.Id || !data.groups[group.Id]) return null;

        data.groups[group.Id] = group;
        this.writeFile(data);

        return group;
    }

    public updateGroups(groups: Array<Group>) {
        const data:GroupsData = this.readFile();
        groups.forEach((group:Group)=> {
            if (!group.Id || !data.groups[group.Id]) return;
            data.groups[group.Id] = group;
        })
        this.writeFile(data)
    }
    
    public deleteUser(groupID:string): boolean {
        const data = this.readFile();
        if (!data.groups[groupID]) return false;

        delete data.groups[groupID];
        this.writeFile(data);

        return true;
    }
}