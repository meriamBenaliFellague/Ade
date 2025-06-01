const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const team = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    Fullname: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Team: {
        type: String,
        required: true,
    },
    Role: {
        type: String,
        required: true, 
    },
  }
)  
const SchemaTeam = mongoose.model("team", team);
module.exports = {SchemaTeam};