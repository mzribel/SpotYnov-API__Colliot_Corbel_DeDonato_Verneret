import { ResponseService } from "../services/api/response.service";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/error.util";

export function authMiddleware(req:Request, res:Response, next:NextFunction):void {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        ResponseService.handleErrorResponse(res, 401, "User is not authenticated");
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            ResponseService.handleErrorResponse(res, 401, "Invalid token");
            return;
        }

        req.user = user;
        next();
    })
}