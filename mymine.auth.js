const express = require('express');
const mymineAuthRoutes = express.Router();
const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;
let { AccountModel } = require('./mymine.model');
const jwt = require('jsonwebtoken');
const withAuth = require('./middleware');

const secret = 'mysecretsshhh';

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
        .json({
        error: 'Incorrect email or password'
      });
    } else {
      account.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
            error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(401)
            .json({
            error: 'Incorrect email or password'
          });
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
  res.sendStatus(200);
});

module.exports = mymineAuthRoutes;