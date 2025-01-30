import express from 'express';
const router = express.Router();
import {getAuthCodeUrl, handleAuthCodeCallback} from "../controllers/spotifyAuthController";

router.get("/auth", getAuthCodeUrl);
router.get("/callback", handleAuthCodeCallback);

export default router;