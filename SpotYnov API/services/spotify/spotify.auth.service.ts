import log from '../../logger';
import {SpotifyTokenData} from "../../models/SpotifyData";
import {SpotifyRequestService} from "./spotify.request.service";
require('dotenv').config();

export class SpotifyAuthService {
    private static SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
    private static USER_SCOPE:string[] = [
        "user-read-playback-state",     // Connaître l'état du lecteur (musique et appareil en cours)
        "user-modify-playback-state",   // Modifier l'état du lecteur
        "user-library-read",            // Récupérer les titres likés
        "user-top-read",                // Récupérer les musiques les plus jouées
        "playlist-modify-public",       // Créer/modifier des playlists publiques
        "playlist-modify-private"       // Créer/modifier des playlists privées
    ]

    private spotifyRequestService: SpotifyRequestService
    public constructor() {
        this.spotifyRequestService = new SpotifyRequestService()
    }

    public getAuthorizationCodeUrl = ():string => {
        const params = new URLSearchParams({
            response_type: 'code', // Authorization Code Grant
            client_id: process.env.SPOTIFY_CLIENT_ID||"",
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI||"",
            scope: SpotifyAuthService.USER_SCOPE.join(" ")
        });
        return `${SpotifyAuthService.SPOTIFY_AUTH_URL}?${params.toString()}`;
    };

    public exchangeAuthorizationCode = async (code: string): Promise<object> => {
        const params =  new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI||"",
            client_id: process.env.SPOTIFY_CLIENT_ID||"",
            client_secret: process.env.SPOTIFY_CLIENT_SECRET||"",
        });

        log.info('Exchanging authorization code for token...');
        return this.spotifyRequestService.request({method:"post", endpoint:"/token", isAuth:true, params})
    };


    // TODO : to spotifyRequestService.request
    public refreshToken = async (refresh_token: string): Promise<SpotifyTokenData|null> => {
        // Constants
        const client_id: string = process.env.SPOTIFY_CLIENT_ID || ""
        const client_secret: string = process.env.SPOTIFY_CLIENT_SECRET || ""

        // Request header
        const headers = {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
        // Request body
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token || "",
            client_id: process.env.SPOTIFY_CLIENT_ID || "",
        })

        // Spotify request
        const response = await this.spotifyRequestService.request({method:"post", endpoint:"/token", isAuth:true, params, headers})
        return SpotifyTokenData.fromObject(response.data) ?? null;
    }
}



