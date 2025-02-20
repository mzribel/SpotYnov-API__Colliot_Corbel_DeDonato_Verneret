require('dotenv').config();
import {createHash} from "node:crypto";
import jwt from 'jsonwebtoken';

export const generateAccessToken = (username:string, id:string):string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret doesn't exist");
    }
    return jwt.sign({username:username, id:id}, String(process.env.JWT_SECRET), {expiresIn: "1d"});
}

export const hashPassword = (password: string, method:string="sha256"):string => {
    return createHash(method).update(password).digest("hex");
}