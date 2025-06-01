const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.post("/", methode.verifyResetCode);
module.exports=router;