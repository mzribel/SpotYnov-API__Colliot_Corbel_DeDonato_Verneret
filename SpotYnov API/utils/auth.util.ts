require('dotenv').config();
import {createHash} from "node:crypto";
import jwt from 'jsonwebtoken';

export const generateAccessToken = (username:string, id:string):object => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret doesn't exist");
    }
    return {
            "access_token": jwt.sign({username:username, id:id}, String(process.env.JWT_SECRET), {expiresIn: "3600s"}),
            "token_type": "Bearer",
            "expires_in": 3600,
            "issued_at": Math.floor(new Date().getTime() / 1000),
    };
}

export const hashPassword = (password: string, method:string="sha256"):string => {
    return createHash(method).update(password).digest("hex");
}