import express from 'express';
const router = express.Router();
import { getAuthCodeUrl, handleAuthCodeCallback, linkSpotifyAccount, unlinkSpotifyAccount } from "../controllers/spotify.auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

router.get("/auth", authMiddleware, getAuthCodeUrl);
router.get("/callback", handleAuthCodeCallback);
router.post("/link_account", authMiddleware, linkSpotifyAccount)
router.get("/unlink_account", authMiddleware, unlinkSpotifyAccount)
export default router;