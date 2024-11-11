const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  createTime:{ type: Date, default: Date.now},
});

const User = mongoose.model('User', userSchema);

module.exports = User;