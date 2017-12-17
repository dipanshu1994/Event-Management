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
	},

	getEventList : function(req, res){
		var find={};

		if(req.query.eventId){
			find={
				_id : req.query.eventId
			};			
		}

		Event.find(find,function(err, events){
			if(err){
				throw err;
			}else{
				res.json({
					status:"success",
					data: events
				});
			}
		});
	},

	updateEvent : function(req, res){
		var find={};

		if(req.body.eventId){
			find={
				_id : req.body.eventId
			};			
			Event.findOne(find,function(err, event){
				if(err){
					throw err;
				}else if(event){
					event.title = req.body.title;
					event.location = req.body.location;
					event.description = req.body.description;
					event.ticket_price = req.body.ticket_price;

					event.save(function(err){
						if(err){
							throw err;
						}else{
							res.json({
								status:"success",
								data: event
							});
						}
					});
				}else{
					return res.json({
						status:"fail",
						message:"invalid event id"
					});
				}
			});
		}else{
			return res.json({
				status:"fail",
				message:"event id required"
			});
		}		
	},

	deleteEvent : function(req, res){
		if(req.body.eventId){
			find={
				_id : req.body.eventId
			};			
			Event.deleteOne(find,function(err, event){
				if(err){
					throw err;
				}else if(event){
					res.json({
						status : "success",
						mesage : "successfully deleted"
					});
				}else{
					return res.json({
						status:"fail",
						message:"invalid event id"
					});
				}
			});
		}else{
			return res.json({
				status:"fail",
				message:"event id required"
			});
		}
	},
}