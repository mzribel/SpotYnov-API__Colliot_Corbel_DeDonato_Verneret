const express = require('express');
const router = express.Router();
// TODO: Importer les fonctions de authController
// const { ... } = require('../controllers/authController');

router.get("/", (req, res)=> {
    res.send("Hello world")
})
// router.post("/register", ...);
// router.get("/login", ...);
// router.get("/logout", ...);

module.exports = router;