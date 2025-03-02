export class SpotifyUserDTO {
    public display_name:string;
    public id:string;
    public image_url:string;
    public uri:string;
    public follower_count:number;

    constructor(data: Partial<SpotifyUserDTO>) {
        this.display_name = data.display_name ?? "";
        this.id = data.id ?? "";
        this.image_url = data.image_url ?? "";
        this.uri = data.uri ?? "";
        this.follower_count = data.follower_count ?? 0;
    }

    public static fromSpotifyUserObject(userObject:any) {
        return new SpotifyUserDTO({
            display_name:userObject.display_name,
            id:userObject.id,
            image_url: userObject[0]?.url ?? "",
            uri:userObject.uri ?? "",
            follower_count:userObject.followers.total ?? 0,
        })
    }
}