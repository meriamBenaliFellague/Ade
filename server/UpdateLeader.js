const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.put("/", methode.Update_leader);
module.exports=router; 