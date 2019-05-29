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
  owner_account: {
    type: Schema.ObjectId,
    ref: 'Account'
  },
  date: {
    type: Date
  },
  meesage: String,
  is_delete: {
    type: Boolean,
    default: false
  } 
});

module.exports = {
  AccountModel : mongoose.model('Account', Account),
  MemoryModel : mongoose.model('Memory', Memory)
};