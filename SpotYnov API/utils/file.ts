import fs from 'fs'
import { UserData } from "../models/UserData";
import User from "../models/User";

export const readUsersDataFromFile = ():UserData => {
    const jsonData = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
    const userData:UserData = jsonData as UserData;

    for (const key of Object.keys(userData.users)) {
        userData.users[key] = User.fromObject(userData.users[key]);
    }

    if (!userData || !userData.users || !userData.auto_increment) {
        throw new Error("User file malformed.");
    }
    return userData;
}

export const writeUserDataToFile = (userData:UserData) => {
    fs.writeFile('./data/users.json', JSON.stringify(userData, null, 2), 'utf8', (err) => {
        if (err) throw err;
    })
}