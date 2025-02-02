import { Request, Response, NextFunction } from "express";
import {getErrorResponse} from "../services/api/responseService";

export class ApiError extends Error {
    statusCode: number;
    constructor(statusCode:number, message:string) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const apiErrorHandler = (err:Error|ApiError, req:Request, res:Response, next:NextFunction): Response<any, Record<string, any>> => {
    // Todo : Log !
    if (err instanceof ApiError) {
        return getErrorResponse(res, err.statusCode, err.message);
    }
    console.log(err);
    return getErrorResponse(res, 500, "Internal Server Error.")
}