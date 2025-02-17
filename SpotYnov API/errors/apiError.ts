export class ApiError extends Error {
    statusCode: number;
    message:string;

    constructor(statusCode:number, message:string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;

        Object.setPrototypeOf(this, ApiError.prototype);
    }

    // Exemple :
    // public static badRequest(message:string) {
    //  return new ApiError(400, message)
    // }
}