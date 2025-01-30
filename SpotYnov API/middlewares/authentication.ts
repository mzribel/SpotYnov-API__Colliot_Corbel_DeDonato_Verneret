import {getErrorResponse} from "../services/api/responseService";
import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export function authenticateToken(req:Request, res:Response, next:NextFunction):void {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        getErrorResponse(res, 401, "Unauthorized : User is not authenticated");
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            getErrorResponse(res, 401, "Unauthorized : Invalid token");
            return;
        }
        // @ts-ignore
        req.user = user;
        next()
    })
}