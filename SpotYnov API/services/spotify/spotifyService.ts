// TODO : Exporter les méthodes utiles :
import axios, {AxiosError} from 'axios';
import { request } from 'http';

export const requestSpotifyAPI = async (endpoint:string, access_token:string, useRefreshToken:boolean=false) => {
    try {
        const data = spotifyGet(endpoint, access_token)
        console.log("No need of a refresh token !")
        return data;
    } catch (error) {
        if (error instanceof AxiosError) {
            // @ts-ignore
            const axiosError = Object.assign(new AxiosError(), error).response.data.error;

            if (axiosError.status == 401 && useRefreshToken) {
                console.log("Trying to use refresh token...")
                return spotifyGet(endpoint, access_token)
            }
        }
        throw error;
    }
}

const spotifyGet = async (endpoint:string, accessToken:string, params = {}) => {
    const response = await axios.get(`https://api.spotify.com${endpoint}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params
    });
    return response.data;
};

module.exports = { spotifyGet, requestSpotifyAPI };