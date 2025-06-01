const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.post("/", methode.login_account);
module.exports=router;