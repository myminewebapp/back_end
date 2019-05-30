const express = require('express');
const mymineAuthRoutes = express.Router();
const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
let { AccountModel } = require('./mymine.model');
const jwt = require('jsonwebtoken');
const withAuth = require('./middleware');

const secret = 'mysecretsshhh';

const CODE = require('./mymine.res.code');

let resJsonGen = (resMsg, code) => {
  return {
    res : resMsg,
    code : code
  }
};

mymineAuthRoutes.route('/').post(function(req, res) {
  const { email, password } = req.body;
  AccountModel.findOne({ email }, function(err, account) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!account) {
      res.status(401)
      .json(resJsonGen('Incorrect email or password',CODE.error.noMatchAccount));
    } else {
      account.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
            error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401).json(resJsonGen('Incorrect email or password',CODE.error.noMatchAccount));
        } else {
          // Issue token
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
      });
    }
  });
});

mymineAuthRoutes.route('/checkToken').get(withAuth, function(req, res) {
  console.log(req.email);
  res.sendStatus(200);
});

mymineAuthRoutes.route('/account').get(withAuth, function(req, res) {
  AccountModel.findOne({email : req.email}, function (err, account) {
    if (err) {
      res.json(resJsonGen(err,CODE.error.other));
    }else{
      res.json({account});
    }
  });
});

module.exports = mymineAuthRoutes;