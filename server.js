const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 4000;
// const cors = require('cors');
const morgan = require('morgan')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const db = require('./mymine.db.js');
const mymineRoute = require('./mymine.route');
const mymineAuthRoute = require('./mymine.auth');

mongoose.Promise = global.Promise;
mongoose.connect(db.endpoint, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('combined'));

app.use('/mymine/api', mymineRoute);
app.use('/mymine/api/auth', mymineAuthRoute);

app.listen(PORT, function(){
  console.log('Server is running on Port:',PORT);
});