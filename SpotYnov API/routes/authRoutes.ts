import express, { Request, Response } from 'express';
const router = express.Router();
// TODO: Importer les fonctions de authController
// import { ... } from '../controllers/authController';

router.get("/", (req:Request, res:Response):void=> {
    res.send("Hello world")
})

// router.post("/register", ...);
// router.get("/login", ...);
// router.get("/logout", ...);

export default router;