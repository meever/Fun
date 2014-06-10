// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var orderSchema = mongoose.Schema({
		security : String,
		share	 : Number,
		price    : Number,
		name	 : String,
		time	 : { type: Date, default : Date.now},
		status   : String
});

// methods ======================
//securitySchema.methods.ff = function(password) {
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//};

// create the model for orderbook and expose it to our app
module.exports = mongoose.model('orderBook', orderSchema);
