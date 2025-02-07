import {readUsersDataFromFile, saveUserToFile, writeUserDataToFile} from "../utils/file";
import User from "../models/User";
import { UserData } from "../models/UserData";
import { hashPassword, isPasswordValid, isUsernameValid } from "../utils/format";
import { ApiError } from "../middlewares/errorHandler";
import { refreshToken } from "./spotify/spotifyAuthService";
import {SpotifyToken} from "../models/SpotifyToken";

export const userExists = (username:string, userData:UserData|null=null):boolean => {
    if (!userData) {
        userData = readUsersDataFromFile();
    }

    for (const key of Object.keys(userData.users)) {
        const user = User.fromObject(userData.users[key]);
        if (user.Username.toLowerCase() == username.toLowerCase()) return true;
    }
    return false;
};

export const createUser = (username:string, password:string):User => {
    const userData:UserData = readUsersDataFromFile();
    username = username.trim();
    let hashedPassword = hashPassword(password);

    if (userExists(username, userData)) throw new ApiError(409,"A user with this username already exists.");
    if (!isUsernameValid(username)) throw new ApiError(400,"Invalid username format")
    if (!isPasswordValid(password)) throw new ApiError(400, "Invalid password format")

    // Creates new user and adds to users
    const newUser = User.create(username, hashedPassword, userData.auto_increment++);
    userData.users[newUser.Id] = newUser;
    // Writes in file
    writeUserDataToFile(userData);

    // Returns new user
    return newUser;
}

export const getUserByUsername = (username:string):User | null => {
    const userData:UserData = readUsersDataFromFile();
    username = username.trim();

    const user:User|undefined =  Object.values(userData.users).find((user: User) => {
        return (user.Username).toLowerCase() == username.toLowerCase();
    });

    return user ?? null;
}

export const getUserById = (userID:number):User | null => {
    const userData:UserData = readUsersDataFromFile();

    const user:User|undefined =  Object.values(userData.users).find((user: User) => {
        return (user.Id) == userID;
    });

    return user ?? null;
}

export const refreshSpotifyToken = async (userId:number)=> {
    const user:User|null = getUserById(userId);
    if (!user) {
        throw new ApiError(401,"Unauthorized : User doesn't exist.");
    }
    if (!user.SpotifyToken || !user.SpotifyToken) {
        throw new ApiError(401, "Unauthorized : No Spotify account linked to this user.")
    }

    // @ts-ignore
    const newTokenData = await refreshToken(user.SpotifyToken.refresh_token);
    if (!newTokenData) {
        console.error("Refresh token failed.");
        return;
    }
   user.refreshSpotifyToken(newTokenData);
    saveUserToFile(user);
}