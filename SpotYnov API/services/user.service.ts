import User, {UserDTO} from "../models/User";
import { UsersData } from "../models/User";
import { isPasswordValid, isUsernameValid } from "../utils/validation.util";
import { hashPassword } from "../utils/auth.util";
import { ApiError } from "../utils/error.util";
import {UserDAO} from "../daos/user.dao";
import {GroupDAO} from "../daos/group.dao";
import {Group} from "../models/Group";

export class UserService {
    constructor(
        private userDAO: UserDAO,
        private groupDAO: GroupDAO,
    ) {}

    public userExists = async (username:string, userData?:UsersData):Promise<boolean> => {
        userData ??= this.userDAO.readFile();

        return Object.values(userData.users).some((user:User) =>
            user.Username.toLowerCase() === username.toLowerCase()
        );
    };

    public createUser = async (username:string, password:string):Promise<User> => {
        // Check if user exists
        if (await this.userExists(username)) throw new ApiError(409,"A user with this username already exists.");

        // Validate input
        if (!isUsernameValid(username)) throw new ApiError(400,"Invalid username format.")
        if (!isPasswordValid(password)) throw new ApiError(400, "Invalid password format.")

        // Creates new user
        const newUser = new User(username, hashPassword(password));
        this.userDAO.createUser(newUser);

        // Returns new user
        return newUser;
    }

    public getUserByUsername = async (username: string, userData?: UsersData): Promise<User | null> => {
        const users = this.userDAO.getAllUsers();
        const user = users.find(user =>
            user.Username.toLowerCase() === username.toLowerCase()
        );
        return user ?? null;
    }

    public getUserById = (userID:string, userData?:UsersData):User | null => {
        const users = this.userDAO.getAllUsers();

        const user = users.find((user) => { return user.Id == userID });
        return user ?? null;
    }
    public getUserDTOById = (userID:string, userData?:UsersData):UserDTO | null => {
        return this.getUserById(userID)?.toDTO() ?? null;
    }

    public getUsers = () => {
        return this.userDAO.getAllUsers();
    }
    public getUsersDTO = ():UserDTO[] => {
        return this.getUsers().map((user:User) => user.toDTO());
    }

    public getUserByIDOrExplode = (userID:string, userData?:UsersData, errorCode:number=400):User => {
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
        if (!user.getSpotifyUserData()) {
            throw new ApiError(400, "No Spotify account linked to this user.");
        }
        user.deleteSpotifyData();
        this.userDAO.updateUser(user);
    }

    public getGroupByUserID(userID:string, userData?:UsersData):Group|null {
        return this.groupDAO.getAllGroups().find(group => group.memberExists(userID)) ?? null;
    }
}

