import User, {UserDTO} from "../models/User";
import { UserData } from "../models/User";
import { isPasswordValid, isUsernameValid } from "../utils/validation.util";
import { hashPassword } from "../utils/auth.util";
import { ApiError } from "../utils/error.util";
import {UserDAO} from "../daos/user.dao";

export class UserService {
    constructor(
        private userDAO: UserDAO
    ) {}

    public userExists = async (username:string, userData?:UserData):Promise<boolean> => {
        userData ??= this.userDAO.readFile();

        return Object.values(userData.users).some((user:User) =>
            user.Username.toLowerCase() === username.toLowerCase()
        );
    };

    public createUser = async (username:string, password:string):Promise<User> => {
        username = username.trim();

        // Validate input
        if (!isUsernameValid(username)) throw new ApiError(400,"Invalid username format")
        if (!isPasswordValid(password)) throw new ApiError(400, "Invalid password format")

        // Check if user exists
        if (await this.userExists(username)) throw new ApiError(409,"A user with this username already exists.");

        // Creates new user
        const newUser = new User(username, hashPassword(password));
        this.userDAO.createUser(newUser);

        // Returns new user
        return newUser;
    }

    public getUserByUsername = async (username: string, userData?: UserData): Promise<User | null> => {
        const users = this.userDAO.getAllUsers();
        const user = users.find(user =>
            user.Username.toLowerCase() === username.toLowerCase()
        );
        return user ?? null;
    }

    public getUserById = (userID:string, userData?:UserData):User | null => {
        const users = this.userDAO.getAllUsers();

        const user = users.find((user) => { return user.Id == userID });
        return user ?? null;
    }
    public getUserDTOById = (userID:string, userData?:UserData):UserDTO | null => {
        return this.getUserById(userID)?.toDTO() ?? null;
    }

    public getUsers = () => {
        return this.userDAO.getAllUsers();
    }
    public getUsersDTO = ():UserDTO[] => {
        return this.getUsers().map((user:User) => user.toDTO());
    }

    public getUserByIDOrExplode = (userID:string, userData?:UserData, errorCode:number=400):User => {
        const user = this.getUserById(userID, userData);
        if (!user) throw new ApiError(errorCode, "User not found");
        return user;
    }

    public setSpotifyUserData = (user:User, spotifyTokenDataObj:object, id?:string, display_name?:string)=> {
        let users_to_update: Array<User> = [];
        // A user aleady has this spotify id : we remove it
        this.userDAO.getAllUsers().forEach((u:User) => {
            if (u.spotify_data?.id == id) {
                u.deleteSpotifyData();
                users_to_update.push(u);
            }
        });

        if (!id || !display_name) user.setSpotifyToken(spotifyTokenDataObj);
        else user.setSpotifyData(spotifyTokenDataObj, id, display_name);
        this.userDAO.updateUsers([user, ...users_to_update])
    }

    public deleteSpotifyUserData = (user:User):void => {
        user.deleteSpotifyData();
        this.userDAO.updateUser(user);
    }


}

