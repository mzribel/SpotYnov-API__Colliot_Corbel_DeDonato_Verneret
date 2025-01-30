"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorResponse = exports.getSuccessResponse = void 0;
const getSuccessResponse = (res, data, code = 200) => {
    return res.status(code).json({ data: data });
};
exports.getSuccessResponse = getSuccessResponse;
const getErrorResponse = (res, code, message) => {
    let responseObj = {
        error: {
            code: code,
            message: message
        }
    };
    return res.status(code).json(responseObj);
};
exports.getErrorResponse = getErrorResponse;
