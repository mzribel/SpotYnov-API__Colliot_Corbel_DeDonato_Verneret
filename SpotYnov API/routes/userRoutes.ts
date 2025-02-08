import express from 'express';
const router = express.Router();
import {getUserProfile} from '../controllers/userController';
import { authHandler } from "../middlewares/authHandler";

// router.post("/users", ...);

// router.post("/users/:userId", ...);
// router.put("/users/:userId", ...);
// router.delete("/users/:userId", ...);

// router.put("/users/:userId/personality", ...);

// router.post("/users/:userId/playlists/from-top-tracks", ...);

// Todo: Remove this route (placeholder for spotify data)
router.get("/me/latest", authHandler, getUserProfile)

export default router