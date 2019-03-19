'use sytrict';
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/routes')(app);
app.listen(3000, ()=> console.log('server running at port 3000'));