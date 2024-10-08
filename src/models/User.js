const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: function() { return !this.uid }, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return !this.uid } },
    uid: { type: String, unique: true },
    balance: { type: Number, default: 0.00 },
    business: { type: Number, default: 0.00 },
    shares: { type: Number, default: 0.00 },
    crypto: { type: Number, default: 0.00 },
    inflationRate: { type: String, default: '1.00%' },
});

module.exports = mongoose.model('User', UserSchema);

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const tradeHistorySchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
//   productName: String,
//   action: String, // 'buy' or 'sell'
//   quantity: Number,
//   price: Number,
//   date: { type: Date, default: Date.now },
// });

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   balance: { type: Number, default: 1000 }, // Стартовый баланс
//   tradeHistory: [tradeHistorySchema],
// });

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;
