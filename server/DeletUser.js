const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.delete("/:iduser",methode.delet_user);
module.exports=router;