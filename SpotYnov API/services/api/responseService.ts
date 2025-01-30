import { Response } from "express";

export const getSuccessResponse = (res:Response, data:any, code=200) => {
    return res.status(code).json({data: data});
};

export const getErrorResponse = (res:Response, code:number, message:string) => {
    let responseObj = {
        error: {
            code: code,
            message: message
        }
    }
    return res.status(code).json(responseObj);
}
