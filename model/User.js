const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");
const useSchema = new Schema({
  id: {
    type: String,
    default: shortid.generate,
  },
  name: {
    type: String,
  },
  username: {
    type: String,
    index: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
}, { timestamps: true }
);
let collectionName = "user";

//Users [name, username, password, role]: [role can be either 'user' or 'admin']
mongoose.model("users", useSchema, collectionName);