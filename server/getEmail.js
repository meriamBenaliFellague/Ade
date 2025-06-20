const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.get("/", methode.get_email);
module.exports=router;