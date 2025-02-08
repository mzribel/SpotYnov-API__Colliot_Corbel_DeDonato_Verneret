import { Request, Response } from "express";
import { ApiError } from "../middlewares/errorHandler";
import { createUser, getUserByUsername } from "../services/userService";
import { getSuccessResponse } from "../services/api/responseService";
import User from "../models/User";
import { generateAccessToken } from "../utils/authentication";

export const registerUser = (req:Request, res:Response) => {
    // Retrieve username and password
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "");
    if (!username || !password) {
        throw new ApiError(400, "Username and password are required.")
    }

    // User creation
    let newUser:User = createUser(username, password);

    let response = {
        "message": `User ${newUser.Username} has successfully been registered.`,
        "access_token": generateAccessToken(newUser.Username, newUser.Id)
    }
    getSuccessResponse(res, response, 201)
}

export const loginUser = (req:Request, res:Response) => {
    // Retrieve username and password
    const username = (req.body.username || "").trim();
    const password = (req.body.password || "");
    if (!username || !password) {
        throw new ApiError(400, "Username and password are required.")
    }

    let user:User | undefined = getUserByUsername(username) as User;
    if (!user || !user.checkPassword(password)) {
        throw new ApiError(401, "Wrong username or password.")
    }

    let response = {
        "message": `User ${user.Username} has successfully been logged in.`,
        "access_token": generateAccessToken(user.Username, user.Id)
    }

    getSuccessResponse(res, response, 201)
}