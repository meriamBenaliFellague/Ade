const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");

router.get("/:IdLeader", methode.display_team_members);
module.exports=router;