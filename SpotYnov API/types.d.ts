import { Request } from 'express';

// Define the shape of your user object
interface UserToken {
    id: number;
    username: string,
    iat: number;
    exp: number;
}

// Extend the Express Request type to include the user property
declare module 'express' {
    interface Request {
        user?: UserToken;
    }
}
