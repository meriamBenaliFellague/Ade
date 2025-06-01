const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.put("/:iduser", methode.update_user);
module.exports=router;