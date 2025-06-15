const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.delete("/:idrec",methode.delet_reclamation);
module.exports=router;