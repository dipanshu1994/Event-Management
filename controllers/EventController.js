var mongoose = require('mongoose');
var Event = require('../models/Events');

module.exports ={
	createEvent : function (req, res) {
		var data = req.body;
		console.log(data);

		var event = new Event({
			title 			: data.title,
			location 		: data.location,
			organiser 		: req.user.name,
			description		: data.description,
			ticket_price 	: data.ticket_price,
			comments		: {},
			date			: new Date()
		});

		event.save(function(err) {
			if (err) throw err;
		});
		res.json({
			status:"success",
			message:"event add successfully.",
			data: event
		});
	}
}