const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.get("/", methode.display_reclamationResponsable);
module.exports=router;