import express, { Request, Response } from 'express';
import { authenticateToken } from '../middlewares/authentication'
import { generateAccessToken } from "../utils/authentication";

const router = express.Router();
// TODO: Importer les fonctions de authController
// import { ... } from '../controllers/authController';

router.get("/get_token", (req:Request, res:Response):void=> {
    res.send(generateAccessToken("RathGate"))
})
router.get("/check_token", authenticateToken, (req:Request, res:Response):void=> {
    // @ts-ignore
    console.log(req.user)
    res.send("Hello world")
})

// router.post("/register", ...);
// router.get("/login", ...);
// router.get("/logout", ...);

export default router;