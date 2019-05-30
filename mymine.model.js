const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Account = new Schema({
  firstName: {
    type: String, 
  },
  lastName: {
    type: String, 
  },
  email: { 
    type: String, 
    lowercase: true, 
    unique: true, 
  },
  password: {
    type: String, 
  }
});

Account.pre('save', function(next) {
  if (this.isNew || this.isModified('password')) {
    const document = this;
    bcrypt.hash(this.password, saltRounds, function(err, hashedPassword) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

Account.methods.isCorrectPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
};


const Memory = new Schema({
  owner_account: {
    type: Schema.ObjectId,
    ref: 'Account',
  },
  date: {
    type: Date,
  },
  meesage: {
    type: String, 
  },
  is_delete: {
    type: Boolean,
    default: false
  } 
});

module.exports = {
  AccountModel : mongoose.model('Account', Account),
  MemoryModel : mongoose.model('Memory', Memory)
};