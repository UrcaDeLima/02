const express    = require('express');
const mongoose   = require('mongoose');
const todoRoutes = require('./routes/todos');
const path       = require('path');
const bodyParser = require('body-parser');

const PORT       = process.env.PORT || 3000;
const app        = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(todoRoutes);

async function start() {
  try {
    await mongoose.connect(
      'mongodb+srv://Oleg:1q2w3e4r@shortener-ssasr.mongodb.net/test',//mongodb+srv://Oleg:1q2w3e4r@cluster0-vka9u.mongodb.net/test
      {
        useNewUrlParser: true,
        useFindAndModify: false
      }
    )
    app.listen(PORT, () => {
      console.log('Server has been started...');
    });
  } catch (e) {
    console.log(e);
  }
}

start();
