const express = require("express");
const router = express.Router();
const methode = require("../controle/methode");
const multer = require('multer');
const storage = multer.memoryStorage(); // باش نخلي الصورة في الذاكرة
const upload = multer({ storage: storage });

router.post("/", upload.array('Photos', 5), methode.create_reclamation);
module.exports=router;