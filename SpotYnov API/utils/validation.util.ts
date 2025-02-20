import { createHash } from 'node:crypto';

export const isPasswordValid = (password: string):boolean => {
    // Entre 8 et 24 chars, majuscule, minuscule, nombre et caractère spécial
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/
    return passwordRegex.test(password)
}

export const isUsernameValid = (username:string, min_length:number=1, max_length:number=16): boolean => {
    let usernameRegex = new RegExp(`^(?=[a-zA-Z0-9._]{${min_length},${max_length}}$)(?!.*[_.]{2})[^_.].*[^_.]$`, "i");
    return usernameRegex.test(username.trim())
};

