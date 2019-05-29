const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 4000;
const cors = require('cors');
const mongoose = require('mongoose');
const db = require('./mymine.db.js');
const mymineRoute = require('./mymine.route');

mongoose.Promise = global.Promise;
mongoose.connect(db.endpoint, { useCreateIndex: true, useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/mymine/api', mymineRoute);

const logRequestStart = (req, res, next) => {
  console.info(`Client : ${req.header('x-forwarded-for') || req.connection.remoteAddress} ,Method : ${req.method} ,Url : ${req.originalUrl}`)
  next()
}
app.use(logRequestStart);

app.listen(PORT, function(){
  console.log('Server is running on Port:',PORT);
});