const {Schema, model} = require('mongoose');

const schema = new Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  counter: {
    type: String
  },
  shortUrl: {
    type: String
  }
});

module.exports = model('Url', schema);
