const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const client = new Schema(
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
    hashCode: String,
    timeCode: Date,
    verifiedCode: Boolean,
    rec: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reclamation",
    }

  },
  {
    timestamps: true,
  }
);


const SchemaClient = mongoose.model("client", client);
module.exports = {SchemaClient};
