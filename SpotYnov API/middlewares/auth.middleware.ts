import { getErrorResponse } from "../services/api/response.service";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import {userExists} from "../services/user.service";
import { ApiError } from "../errors/apiError";

export function authMiddleware(req:Request, res:Response, next:NextFunction):void {
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