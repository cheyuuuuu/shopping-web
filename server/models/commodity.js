const mongoose = require('mongoose');

const commoditySchema = new mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  number: {type: Number, required: true},
  image: { contentType: String , url: String},
  createTime:{ type: Date, default: Date.now},
  
});

const Commodity = mongoose.model('Commodity', commoditySchema);

module.exports = Commodity;