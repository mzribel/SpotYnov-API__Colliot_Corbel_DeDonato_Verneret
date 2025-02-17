import { UserData } from "../models/User";
import { User } from "../models/User";
import path from "node:path";
import {readFileSync, writeFileSync} from "node:fs";

export class UserDAO {
    private readonly filePath:string = path.resolve(__dirname, '../data/users.json');

    public readFile():UserData {
        const data = readFileSync(this.filePath, 'utf-8');
        const userData:UserData = JSON.parse(data) as UserData;

        for (const key of Object.keys(userData.users)) {
            userData.users[key] = User.fromObject(userData.users[key]);
        }

        return userData;
    }

    public writeFile(data: UserData): void {
        writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    public getAllUsers():User[] {
        return Object.values(this.readFile().users);
    }

    public createUser(user:User):User {
        let data:UserData = this.readFile();

        user.Id = (data.auto_increment++).toString();
        data.users[user.Id] = user;

        this.writeFile(data);
        return user;
    }

    public updateUser(user: User): User | null {
        const data:UserData = this.readFile();
        if (!user.Id || !data.users[user.Id]) return null;

        data.users[user.Id] = user;
        this.writeFile(data);

        return user;
    }

    public updateUsers(users: Array<User>) {
        const data:UserData = this.readFile();
        users.forEach((user:User)=> {
            if (!user.Id || !data.users[user.Id]) return;
            data.users[user.Id] = user;
        })
        this.writeFile(data)
    }

    public deleteUser(userID:string): boolean {
        const data = this.readFile();
        if (!data.users[userID]) return false;

        delete data.users[userID];
        this.writeFile(data);

        return true;
    }
}