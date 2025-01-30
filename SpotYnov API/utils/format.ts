import { createHash } from 'node:crypto';

export const isPasswordValid = (password: string):boolean => {
    // Entre 8 et 24 chars, majuscule, minuscule, nombre et caractère spécial
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,24}$/
    return passwordRegex.test(password)
}

export const hashPassword = (password: string, method:string="sha256"):string => {
    return createHash(method).update(password).digest("hex");
}