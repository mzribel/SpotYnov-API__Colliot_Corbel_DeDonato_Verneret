import express from 'express';
const router = express.Router();
import {getUserProfile} from '../controllers/user.controller';
import { authMiddleware } from "../middlewares/auth.middleware";

// router.post("/users", ...);

// router.post("/users/:userId", ...);
// router.put("/users/:userId", ...);
// router.delete("/users/:userId", ...);

// router.put("/users/:userId/personality", ...);

// router.post("/users/:userId/playlists/from-top-tracks", ...);

// Todo: Remove this route (placeholder for spotify data)
router.get("/me/latest", authMiddleware, getUserProfile)

export default router