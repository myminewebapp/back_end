const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Account = new Schema({
  firstName: String,
  lastName: String,
  email: { 
    type: String, 
    lowercase: true, 
    unique: true },
  password: String 
});

let Memory = new Schema({
  owner_account: Schema.ObjectId,
  date: {
    type: Date, 
    default: Date.now
  },
  meesage: String,
  // delete: {
  //   is_delete: {
  //     type: Boolean,
  //     default: false
  //   },
  //   expires_recovery: {
  //     type: Date, 
  //     default: Date.now
  //   }
  // } 
});

module.exports = {
  AccountModel : mongoose.model('Account', Account),
  MemoryModel : mongoose.model('Memory', Memory)
};