import express from 'express';
const router = express.Router();
import { getAuthCodeUrl, handleAuthCodeCallback, linkSpotifyAccount, unlinkSpotifyAccount } from "../controllers/spotifyAuthController";
import { authHandler} from "../middlewares/authHandler";

router.get("/auth", authHandler, getAuthCodeUrl);
router.get("/callback", handleAuthCodeCallback);
router.post("/link_account", authHandler, linkSpotifyAccount)
router.get("/unlink_account", authHandler, unlinkSpotifyAccount)
export default router;