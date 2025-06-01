const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const user = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
   password: {
      type: String,
      required: true,
    },
  //role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  {
    timestamps: true,
  }
);

const SchemaUser = mongoose.model("user", user);
module.exports = {SchemaUser};