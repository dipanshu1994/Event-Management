var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name 		: { type: String },
	email 		: { type: String },
	password 	: { type: String },
	role 		: { type: String },
	token 		: { type: Array, usePushEach: true }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
