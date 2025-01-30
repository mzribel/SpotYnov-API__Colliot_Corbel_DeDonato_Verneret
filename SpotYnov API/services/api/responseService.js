const getSuccessResponse = (res, data, code=200) => {
    return res.status(code).json({data: data});
};

const getErrorResponse = (res, code, message) => {
    let responseObj = {
        error: {
            code: code,
            message: message
        }
    }
    return res.status(code).json(responseObj);
}

module.exports = { getSuccessResponse, getErrorResponse };