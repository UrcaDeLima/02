const express    = require('express');
const mongoose   = require('mongoose');
const todoRoutes = require('./routes/todos');
const path       = require('path');
const bodyParser = require('body-parser');

var Memcached = require('memcached');
var memcached = new Memcached();
memcached.connect( '127.0.0.1:11211', function( err, conn ){
  //console.log(conn);
if( err ) {
console.log( conn.server,'error while memcached connection!!');
}
});


const PORT       = process.env.PORT || 3000;
const app        = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(todoRoutes);

var user = {
'userId':'iuytredcvb12345sdfgh',
'userName':'testUser',
'emailId':'demo.jsonworld@gmail.com',
'phone' : 8287374553,
'availableFor' : '2 hours',
'createdOn':1543122402
}


// saving information to user key.
//console.log(11);

memcached.set('user', user, 10000, function (err) {
  if(err) throw new err;
});

// method to get saved data....
memcached.get('user', function (err, data) {
  console.log(11);
console.log(data);
});

async function start() {
  try {
    await mongoose.connect(
      'mongodb+srv://Oleg:1q2w3e4r@shortener-ssasr.mongodb.net/test',
      {
        useNewUrlParser: true,
        useFindAndModify: false
      }
      //mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
    )
    app.listen(PORT, () => {
      console.log('Server has been started...');
    });
  } catch (e) {
    console.log(e);
  }
}

start();
