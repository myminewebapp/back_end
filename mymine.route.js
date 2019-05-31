
const express = require('express');
const mymineRoutes = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
let mymineModels = require('./mymine.model');

let { AccountModel, MemoryModel } = mymineModels;

const CODE = require('./mymine.res.code');
const withAuth = require('./middleware');

let resJsonGen = (resMsg, code) => {
  return {
    res : resMsg,
    code : code
  }
};

//get timelines by account id
mymineRoutes.route('/timeline/:id').get(withAuth, function (req, res) {
  if(!ObjectId.isValid(req.params.id)){
    res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
  }
  else{
    let accountID = new ObjectId(req.params.id);
    let email = req.email;
    AccountModel.findOne({ email }, function(err, account) {
      if (!err) {
        if(account){
          if(accountID.toString() === account._id.toString()){
            MemoryModel.find({owner_account: accountID, is_delete: false}).sort('-date').limit(3).exec(function (err, result) {
              if (err) {
                res.json(resJsonGen(err,CODE.error.other));
              }else{
                res.status(200).json(result);
              }
            });
            // .populate('owner_account').exec((err, account) => {
            //   console.log(account);
            // });
          }else{
            res.status(401).send("Unauthorized: token doesn't access provided");
          }
        }else{
          res.status(401).send("Unauthorized: token doesn't access provided");
        }
      }else{
        res.json(resJsonGen(err,CODE.error.other));
      }     
    });
  }
});

//get all memories by account id
mymineRoutes.route('/memory/:id').get(withAuth, function (req, res) {
  if(!ObjectId.isValid(req.params.id)){
    res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
  }
  else{
    let accountID = new ObjectId(req.params.id);
    let email = req.email;
    AccountModel.findOne({ email }, function(err, account) {
      if (!err) {
        if(account){
          if(accountID.toString() === account._id.toString()){
            MemoryModel.find({owner_account: accountID, is_delete: false}).sort('-date').exec(function (err, result) {
              if (err) {
                res.json(resJsonGen(err,CODE.error.other));
              }else{
                res.status(200).json(result);
              }
            });
            // .populate('owner_account').exec((err, account) => {
            //   console.log(account);
            // });
          }else{
            res.status(401).send("Unauthorized: token doesn't access provided");
          }
        }else{
          res.status(401).send("Unauthorized: token doesn't access provided");
        }
      }else{
        res.json(resJsonGen(err,CODE.error.other));
      }     
    });   
  }
});

//get all delete memories by account id
mymineRoutes.route('/memory/delete/:id').get(withAuth, function (req, res) {
  if(!ObjectId.isValid(req.params.id)){
    res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
  }
  else{
    let accountID = new ObjectId(req.params.id);
    let email = req.email;
    AccountModel.findOne({ email }, function(err, account) {
      if (!err) {
        if(account){
          if(accountID.toString() === account._id.toString()){
            MemoryModel.find({owner_account: accountID,is_delete: true}).sort('-date').exec(function (err, result) {
              if (err) {
                res.json(resJsonGen(err,CODE.error.other));
              }else{
                res.status(200).json(result);
              }
            });
            // .populate('owner_account').exec((err, account) => {
            //   console.log(account);
            // });
          }else{
            res.status(401).send("Unauthorized: token doesn't access provided");
          }
        }else{
          res.status(401).send("Unauthorized: token doesn't access provided");
        }
      }else{
        res.json(resJsonGen(err,CODE.error.other));
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
        res.status(200).json(resJsonGen("Register complete!!",CODE.normal.regisComplete));
      }
    });
  }
});

//create memory
mymineRoutes.route('/memory/').post(withAuth, function (req, res) {
  let {owner_account, message_data, emojiValue} = req.body;
  if((owner_account === "" || owner_account === undefined) || 
     (message_data === "" || message_data === undefined) || 
     (emojiValue === "" || emojiValue === undefined)){
      res.json(resJsonGen('owner_account, message_data field required!!',CODE.error.fieldReq)); 
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
            message: message_data,
            date: Date.now(),
            emojiValue: emojiValue
          }
          MemoryModel.create(memory, function (err, result) {
            if (err) {
              res.json(resJsonGen(err,CODE.error.other));
            }else{
              // res.json(result);
              res.status(200).json(resJsonGen("Create memory success",CODE.normal.createMemorySuccess));
            }
          });
        }
      });
    }
  }
});

//delete memory (isDelete = true)
mymineRoutes.route('/memory/:id').delete(withAuth, function (req, res) {
  let id = req.params.id;
  if(!ObjectId.isValid(id)){
    res.json(resJsonGen('Invalid id pattern.',CODE.error.objectIdInvalid));
  }
  else{
    let memoryID = new ObjectId(id);
    let email = req.email;
    AccountModel.findOne({ email }, function(err, account) {
      if (!err) {
        if(account){
          MemoryModel.findOneAndUpdate({_id: memoryID , owner_account: account._id}, {is_delete : true}, function (err, result) {
            if (err) {
              res.json(resJsonGen(err,CODE.error.other));
            }else{
              if(result !== null){
                res.status(200).json(result);
              }else{
                res.status(404).send("Error: No match memory_id or you aren't owner this memory");
              }
            }
          });
        }else{
          res.status(401).send("Unauthorized: token doesn't access provided");
        }
      }else{
        res.json(resJsonGen(err,CODE.error.other));
      }     
    });
  }
});

module.exports = mymineRoutes;
