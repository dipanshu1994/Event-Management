var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
	title 			: { type: String, required: true },
	location 		: { type: String },
	organiser 		: { type: String },
	description		: { type: String },
	ticket_price 	: { type: String },
	comments		: { type: Object },
	date			: Date
});

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;
