
const express = require('express');
const mymineRoutes = express.Router();

let mymineModels = require('./mymine.model');

let { Account, Memory } = mymineModels;

mymineRoutes.route('/').get(function (req, res) {
  Memory.find(function(err, memories){
    if(err){
      console.log(err);
    }
    else {
      res.json(memories);
    }
  });
});

mymineRoutes.route('/add').post(function (req, res) {
  let memory = new Memory(req.body);
  memory.save()
    .then(memory => {
      res.status(200).json({'memory': 'memory in added successfully'});
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

module.exports = mymineRoutes;
