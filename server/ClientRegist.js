const express = require("express");
const router = express.Router();
const path = require("path");
const methode = require("../controle/methode");
const app = express();

router.get("/Home/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/loginClient", "login.html"));
  });

router.post("/", methode.create_account);
module.exports=router;