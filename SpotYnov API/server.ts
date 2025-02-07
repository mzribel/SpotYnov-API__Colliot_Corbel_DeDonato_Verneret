import app from'./app';
import log from './logger';
import {refreshToken} from "./services/spotify/spotifyAuthService";
import {refreshSpotifyToken} from "./services/userService";

const PORT:string|number = process.env.PORT || 3000;

refreshSpotifyToken(1).then();

app.listen(PORT, ():void => {
    console.log(`\nServer is running on port ${PORT} !`)
    console.log("----")
    console.log(`Link : http://localhost:${PORT}`)
    console.log(`Documentation : http://localhost:${PORT}/documentation`)
    console.log("----\n")

    log.info(`Server is running on port ${PORT}`);
});