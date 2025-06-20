const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const admin = new Schema(
  {
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
    hashCode: String,
    timeCode: Date,
    verifiedCode: Boolean,
  }, 
  {
    timestamps: true,
  }
);


const SchemaAdmin = mongoose.model("admin", admin);
module.exports = {SchemaAdmin};
