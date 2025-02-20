import { Response } from "express";

export class ResponseService {
    public static handleSuccessResponse = (res:Response, data:any, code=200) => {
        return res.status(code).json({data: data});
    };

    public static handleErrorResponse = (res:Response, code:number, message:string) => {
        let responseObj = {
            error: {
                code: code,
                message: message
            }
        }
        return res.status(code).json(responseObj);
    }
}


