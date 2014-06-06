// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var securitySchema = mongoose.Schema({
		security : String,
		order	 : Number,
		OI 		 : Number,
		bid		 : Number,
		ask		 : Number,
		trades 	 : [{name: String, price: Number,
			share: Number, time : { type: Date, default : Date.now}}]
});

// methods ======================
//securitySchema.methods.ff = function(password) {
//    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//};

// create the model for users and expose it to our app
module.exports = mongoose.model('security', securitySchema);
