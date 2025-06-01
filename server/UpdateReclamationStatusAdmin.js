const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.put("/:IdReclamation", methode.Admin);
module.exports=router; 