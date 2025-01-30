require('dotenv').config();
import jwt from 'jsonwebtoken';

export const generateAccessToken = (username:string):string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret doesn't exist");
    }
    return jwt.sign({username:username}, String(process.env.JWT_SECRET), {expiresIn: "3600s"});
}