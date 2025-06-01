const express = require("express");
const router = express.Router();
const path = require("path");
const methode = require("../controle/methode");
const app = express();

router.post("/", methode.login_accountAdmin);
module.exports=router;