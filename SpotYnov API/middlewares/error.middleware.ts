import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../services/api/response.service";
import { ApiError } from "../utils/error.util"
import { AxiosError } from "axios";

export const errorMiddleware = (err:Error|ApiError, req:Request, res:Response, next:NextFunction): Response<any, Record<string, any>> => {
    // Todo : Log !
    if (err instanceof ApiError) {
        return ResponseService.handleErrorResponse(res, err.statusCode, err.message);
    } else if (err instanceof AxiosError) {
        return ResponseService.handleErrorResponse(res, 500, "Spotify Error : "+err.message);
    }
    console.log(err.message)
    return ResponseService.handleErrorResponse(res, 500, "Internal Server Error.")
}