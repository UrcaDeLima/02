const {Router} = require('express')
const Url      = require('../models/Url')
const router   = Router()
var Memcached = require('memcached');
var memcached = new Memcached('localhost:3000');
var  memcached  = new Memcached ( ' localhost: 3000 ' , { retries : 10 , retry : 10000 , remove : true , failOverServers : [ ' 192.168.0.103:3000 ' ] } ) ;

router.post('/new/contractor', async (req, res) => {
  const dbItem = await Url.findOne({name: req.body.name});
  if(dbItem){
    res.send("http://localhost:3000/" + dbItem.shortUrl);
  }else{
    const lastAddedEntry = await Url.find().sort({_id:-1}).limit(1);
    let id;
    if(lastAddedEntry.length){
      id = parseInt(++lastAddedEntry[0].id);
    }else{
      id = 1;
    }
    const url = new Url({
      id: id,
      name: req.body.name,
      url: req.body.url,
      counter: 0,
      shortUrl: encode(id)
    });
    let shortUrl = await url.save();
    res.send("http://localhost:3000/" + shortUrl.shortUrl);
    res.send(shortUrl.counter);
  }
  // await Url.findOne({name: req.body.name}, async (err, obj) => {
  //   if(obj){
  //     res.send("http://localhost:3000/" + obj.shortUrl);
  //   }else{
  //     const lastAddedEntry = await Url.find().sort({_id:-1}).limit(1);
  //     let id;
  //     if(lastAddedEntry.length){
  //       id = parseInt(++lastAddedEntry[0].id);
  //     }else{
  //       id = 1;
  //     }
  //     const url = new Url({
  //       id: id,
  //       name: req.body.name,
  //       url: req.body.url,
  //       counter: 0,
  //       shortUrl: encode(id)
  //     });
  //     let shortUrl = await url.save();
  //     res.send("http://localhost:3000/" + shortUrl.shortUrl);
  //     res.send(shortUrl.counter);
  //   }
  // });
});

router.get('/:shortUrl', async (req, res) => {
  memcached.set('foo', 'bar', 10, function (err) { /* stuff */ });
  console.log(localStorage['foo'] || 'defaultValue');

  memcached.get('foo', function (err, data) {
    console.log(11);
    console.log(data);
  });
  const dbItem = await Url.findOne({shortUrl: req.params.shortUrl});
  dbItem.counter = parseInt(++dbItem.counter);
  res.redirect(dbItem.url);
  dbItem.save();
});

router.get('/myUrl/:name', async (req, res) => {
  await Url.find({name: req.params.name}, function(err, obj){
    res.send(JSON.stringify(obj));
  });
});

router.get('/counter/:shortUrl', async (req, res) => {
  await Url.findOne({shortUrl: req.params.shortUrl}, function(err, obj){
    res.send(obj.counter);
  });
});

function encode(num){
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ0123456789';
  const base = alphabet.length;
  let encoded = [];
  while(Math.floor(num) > 0){
    encoded.push(alphabet.charAt( num % base ));
    num /= base;
  }
  return encoded.reverse().join("");
}

module.exports = router;
