
const express = require('express');
const mymineRoutes = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
let mymineModels = require('./mymine.model');

let { AccountModel, MemoryModel } = mymineModels;

const CODE = require('./mymine.res.code');

let resJsonGen = (resMsg, code) => {
  return {
    res : resMsg,
    code : code
  }
};

//get timelines by account id
mymineRoutes.route('/timeline/:id').get(function (req, res) {
  if(!ObjectId.isValid(req.params.id)){
    res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
  }
  else{
    let accountID = new ObjectId(req.params.id);
    MemoryModel.find({owner_account: accountID}, function (err, result) {
      if (err) {
        res.json(resJsonGen(err,CODE.error.other));
      }else{
        res.json(result);
      }
    });
    // .populate('owner_account').exec((err, account) => {
    //   console.log(account);
    // });
  }
});

//get all memories by account id
mymineRoutes.route('/memory/:id').get(function (req, res) {
  if(!ObjectId.isValid(req.params.id)){
    res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
  }
  else{
    let accountID = new ObjectId(req.params.id);
    MemoryModel.find({owner_account: accountID}, function (err, result) {
      if (err) {
        res.json(resJsonGen(err,CODE.error.other));
      }else{
        res.json(result);
      }
    });
    // .populate('owner_account').exec((err, account) => {
    //   console.log(account);
    // });
  }
});

//get profile data by account id
mymineRoutes.route('/profile/:id').get(function (req, res) {
  if(!ObjectId.isValid(req.params.id)){
    res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
  }
  else{
    let accountID = new ObjectId(req.params.id);
    AccountModel.findById(accountID, function (err, result) {
      if (err) {
        res.json(resJsonGen(err,CODE.error.other));
      }else{
        res.json(result);
      }
    });
  }
});

//create Accout
mymineRoutes.route('/register').post(function (req, res) {
  let {firstName, lastName, email, password} = req.body;
  if((firstName == "" || firstName === undefined) && 
     (lastName == "" || lastName === undefined) && 
     (email == "" || email === undefined) && 
     (password == "" || password === undefined)){
    res.json(resJsonGen('firstName, lastName, email, password field required!!',CODE.error.fieldReq)); 
  }else{
    AccountModel.create({firstName, lastName, email, password}, function (err, result) {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          // Duplicate email
          res.json(resJsonGen('Email already exist!', CODE.error.emailDup));
        }else{
          res.json(resJsonGen(err,CODE.error.other));
        }
      }else{
        // res.json(result);
        res.json(resJsonGen("Register complete!!",CODE.normal.regisComplete));
      }
    });
  }
});

//create memory
mymineRoutes.route('/memory/').post(function (req, res) {
  let {owner_account, meesage_data} = req.body;
  if((owner_account == "" || owner_account === undefined) && 
     (meesage_data == "" || meesage_data === undefined)){
      res.json(resJsonGen('owner_account, meesage_data field required!!',CODE.error.fieldReq)); 
  }else{
    if(!ObjectId.isValid(owner_account)){
      res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
    }
    else{
      AccountModel.findById(new ObjectId(owner_account), function (err, account_result) {
        if (err) {
          res.json(resJsonGen(err,CODE.error.other));
        }else{
          let memory = {
            owner_account: account_result._id,
            meesage: meesage_data,
            date: Date.now()
          }
          MemoryModel.create(memory, function (err, result) {
            if (err) {
              res.json(resJsonGen(err,CODE.error.other));
            }else{
              res.json(result);
            }
          });
        }
      });
    }
  }
});

//delete memory (isDelete = true)
mymineRoutes.route('/memory/:id').delete(function (req, res) {
  let id = req.params.id;
  if(!ObjectId.isValid(id)){
    res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
  }
  else{
    MemoryModel.findByIdAndUpdate(id, {is_delete : true}, function (err, result) {
      if (err) {
        res.json(resJsonGen(err,CODE.error.other));
      }else{
        res.json(result);
      }
    });
  }
});

module.exports = mymineRoutes;
