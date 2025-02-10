import User from "./User";

export interface UserData {
    auto_increment: number,
    users: {[key: string]: User}
}