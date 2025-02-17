import { Request, Response, NextFunction } from "express";
import { getErrorResponse } from "../services/api/response.service";
import { ApiError } from "../errors/apiError"

export const errorMiddleware = (err:Error|ApiError, req:Request, res:Response, next:NextFunction): Response<any, Record<string, any>> => {
    // Todo : Log !
    if (err instanceof ApiError) {
        return getErrorResponse(res, err.statusCode, err.message);
    }
    return getErrorResponse(res, 500, "Internal Server Error.")
}