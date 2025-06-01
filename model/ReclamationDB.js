const mongoose = require("mongoose");
const { SchemaClient } = require("../model/database"); 
const Schema = mongoose.Schema;

const reclamation = new Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SchemaClient",
      required: true,
    },
    id: {
      type: String,
      unique: true,
      required: true,
    },
    Type: {//تقنية ولا تجارية
      type: String,
      enum: ["تقنية", "تجارية"],
      default: "تقنية",
      required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Surname: {
        type: String,
        required: true,
    },
    Phone: {
        type: String,
        required: true,
    },
    Municipality: {
        type: String,
        required: true,
    },
    Subscriber_ID: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Complaint: {
        type: String,
        required: true,
    },
    Photos: [{
      data: Buffer,
      contentType: String,
    }],
    Status: {//pending ...
      type: String,
      default: "Pending",
      required: true,
    },
    Note: {//خاص ب responsable de group
      type: String,
    },
    Group: {//خاص ب admin
      type: String,
    }
  },
  {
    timestamps: true,
  }
)

const SchemaReclamation = mongoose.model("reclamation", reclamation);
module.exports = {SchemaReclamation};