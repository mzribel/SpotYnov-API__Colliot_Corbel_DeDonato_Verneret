import axios, {AxiosResponse} from 'axios';
import log from '../../logger';
require('dotenv').config();

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const USER_SCOPE:string[] = [
    "user-read-playback-state",     // Connaître l'état du lecteur (musique et appareil en cours)
    "user-modify-playback-state",   // Modifier l'état du lecteur
    "user-library-read",            // Récupérer les titres likés
    "user-top-read",                // Récupérer les musiques les plus jouées
    "playlist-modify-public",       // Créer/modifier des playlists publiques
    "playlist-modify-private"       // Créer/modifier des playlists privées
]

/**
 * Génère une URL pour le flux Authorization Code Grant.
 * @returns {string} URL d'autorisation.
 */
export const getAuthorizationCodeUrl = ():string => {
    const params = new URLSearchParams({
        response_type: 'code', // Authorization Code Grant
        client_id: process.env.SPOTIFY_CLIENT_ID||"",
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI||"",
        scope: USER_SCOPE.join(" ")
    });
    return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

/**
 * Échange un code d'autorisation pour obtenir un token Spotify.
 * @param {string} code - Code d'autorisation reçu.
 * @returns {Promise<object>} Données du token.
 */
export const exchangeAuthorizationCode = async (code: string): Promise<object> => {
    const params =  new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI||"",
        client_id: process.env.SPOTIFY_CLIENT_ID||"",
        client_secret: process.env.SPOTIFY_CLIENT_SECRET||"",
    });

    log.info('Exchanging authorization code for token...');
    const response:AxiosResponse<any,any> = await axios.post(SPOTIFY_TOKEN_URL, params);
    return response.data;
};
