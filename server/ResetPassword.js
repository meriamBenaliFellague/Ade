const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.post("/", methode.reset_password);
module.exports=router;