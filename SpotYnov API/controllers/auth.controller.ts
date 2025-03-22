import { Request, Response } from "express";
import { ApiError } from "../utils/error.util";
import { ResponseService } from "../services/api/response.service";
import User from "../models/User";
import { generateAccessToken } from "../utils/auth.util";
import { UserService } from "../services/user.service";

export class AuthController {
    constructor(private userService: UserService) {}

    public registerUser = async (req:Request, res:Response) => {
        // Retrieve username and password
        const username = (req.body.username || "").trim();
        const password = (req.body.password || "");

        // User creation
        let newUser:User = await this.userService.createUser(username, password);

        let response = {
            "message": `User ${newUser.Username} has successfully been registered.`,
            "token": generateAccessToken(newUser.Username, newUser.Id)
        }
        ResponseService.handleSuccessResponse(res, response, 201)
    }

    public loginUser = async (req:Request, res:Response) => {
        // Retrieve username and password
        const username = (req.body.username || "").trim();
        const password = (req.body.password || "");
        if (!username || !password) {
            throw new ApiError(400, "Username and password are required.")
        }

        let user:User | undefined = await this.userService.getUserByUsername(username) as User;
        if (!user || !user.checkPassword(password)) {
            throw new ApiError(401, "Incorrect username or password.")
        }

        let response = {
            "message": `User ${user.Username} has successfully been logged in.`,
            "token": generateAccessToken(user.Username, user.Id)
        }

        ResponseService.handleSuccessResponse(res, response, 200)
    }
}

