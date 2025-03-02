import {SpotifyTrackDTO} from "./spotify.track.dto";

export class SpotifyPlaybackStateDTO {
    public device?: {
        id?:string;
        name:string;
        type:string;
    };
    public timestamp:number;
    public progress_ms:number;
    public is_playing:boolean;
    public track:SpotifyTrackDTO|null

    constructor(data:Partial<SpotifyPlaybackStateDTO>) {
        this.device = data.device;
        this.timestamp = data.timestamp ?? 0;
        this.progress_ms = data.progress_ms ?? 0;
        this.is_playing = data.is_playing ?? false;
        this.track = data.track ?? null;
    }

    public static fromSpotifyPlaybackStateObject(obj: any) {
        return new SpotifyPlaybackStateDTO({
            device: obj.device ? {
                id: obj.device.id,
                name: obj.device.name,
                type:obj.device.type,
            } : undefined,
            timestamp:obj.timestamp,
            progress_ms:obj.progress_ms,
            is_playing:obj.is_playing,
            track:obj.currently_playing_type == "track" ? SpotifyTrackDTO.fromSpotifyTrackObject(obj.item) : null,
        });
    }
}