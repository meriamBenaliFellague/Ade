const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.post("/CreateUser", methode.create_user);
module.exports=router;