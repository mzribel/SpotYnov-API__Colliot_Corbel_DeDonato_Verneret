import app from'./app';
import log from './logger';
import {refreshToken} from "./services/spotify/spotifyAuthService";

const PORT:string|number = process.env.PORT || 3000;

refreshToken("AQDwG_QcJPo7ToGS3HLtSAbAU_EfRnD30CMY9SqP94SXMApBHv6cmCtF10LS_wiuC1xmgkAt9QOu4z7BzaO4ALz8GA3p3JhpVnfr8kAWS8BfhN8J_5y9r6Avo6xuYDGeFJo").then(r =>
console.log(r));

app.listen(PORT, ():void => {
    console.log(`\nServer is running on port ${PORT} !`)
    console.log("----")
    console.log(`Link : http://localhost:${PORT}`)
    console.log(`Documentation : http://localhost:${PORT}/documentation`)
    console.log("----\n")

    log.info(`Server is running on port ${PORT}`);
});