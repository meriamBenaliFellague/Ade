const mongoose = require("mongoose");
const { SchemaTeam } = require("../model/TeamDB"); 
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  leaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SchemaTeam",
        required: true,
      },
  sender: Boolean,
  message: String,
  createdAt: { type: Date, default: Date.now }
  });

  const SchemaMessage = mongoose.model("message", messageSchema);
  module.exports = {SchemaMessage};