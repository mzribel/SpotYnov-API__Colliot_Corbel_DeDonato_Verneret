import app from'./app';
import log from './logger';
import {UserDAO} from "./daos/user.dao";
import {UserService} from "./services/user.service";

const PORT:string|number = process.env.PORT || 3000;



// app.listen(PORT, async (): Promise<void> => {
//
//     console.log(`\nServer is running on port ${PORT} !`)
//     console.log("----")
//     console.log(`Link : http://localhost:${PORT}`)
//     console.log(`Documentation : http://localhost:${PORT}/documentation`)
//     console.log("----\n")
//
//     log.info(`Server is running on port ${PORT}`);
// });