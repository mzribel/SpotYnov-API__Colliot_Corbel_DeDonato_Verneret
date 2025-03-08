import { Request, Response, NextFunction } from "express";
import { ResponseService } from "../services/api/response.service";
import { ApiError } from "../utils/error.util"
import { AxiosError } from "axios";

export const handleErrors = (err:Error|ApiError, req:Request, res:Response, next:NextFunction): Response<any, Record<string, any>> => {
    if (err instanceof ApiError) {
        return ResponseService.handleErrorResponse(res, err.statusCode, err.message);
    } else if (err instanceof AxiosError) {
        let error_msg = "Spotify Error : "+err.message;
        error_msg += err.response?.data.error_description ? ` (${err.response.data.error_description})` : "";
        // console.log(err)
        return ResponseService.handleErrorResponse(res, err.status ?? 500, error_msg);
    }

    return ResponseService.handleErrorResponse(res, 500, "Internal Server Error.")
}