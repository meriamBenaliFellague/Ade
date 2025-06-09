const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.get("/:IdReclamation", methode.display_information);
module.exports=router; 