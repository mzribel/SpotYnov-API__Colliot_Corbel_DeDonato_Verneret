import { getErrorResponse } from "../services/api/responseService";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import {getUserByUsername, userExists} from "../services/userService";
import { ApiError } from "./errorHandler";
import User from "../models/User";

export function authHandler(req:Request, res:Response, next:NextFunction):void {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        getErrorResponse(res, 401, "User is not authenticated");
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            getErrorResponse(res, 401, "Invalid token");
            return;
        }

        if (!userExists(user.username)) {
            throw new ApiError(401, "User doesn't exist.");
        }

        req.user = user;
        next();
    })
}