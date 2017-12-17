var mongoose = require('mongoose');
var crypto = require('crypto');
var User = require('../models/Users');

module.exports = {
	signUp : function(req,res){
		var data = req.body;
		console.log(data);
		User.findOne({email:data.email},function(err, users) {
			if (users) {
				res.json({
					status:"unsuccess",
					message:"Email already exit."
				});
			} else {
				
				var user = new User({
					email		: data.email,
					name 		: data.name,
					password	: data.password,
					role 		: data.role,
					token 		: []
				});

				user.save(function(err) {
					if (err) throw err;
				});
				res.json({
					status:"success",
					message:"user add successfully.",
					data: user
				});
			}
		});
	},

	login : function(req,res) {
		User.findOne({email:req.body.email, password:req.body.password},function(err,user){
			if(!user){
				res.json({
					status: 'unsuccess',
					message: 'User not found'
				});
			}else{
				var token = crypto.randomBytes(20).toString('hex')
				var now = Math.floor(new Date(new Date().getTime()))
				var expireDate = parseInt(now+(1*24*60*60*1000))
				if(!user.token || !user.token.length){
					var access_token = {
						'access_token':token,
						expire:expireDate
					}
	
					user.token.push(access_token)
					//user.markModified('token');
					user.save(function(err){
						if (err) console.log(err);
						res.json({
							status:"success",
							message:"user access_token generate.",
							data: {access_token:token}
						});
					});
				} else{
					user.token.forEach(function(t,i){
						if(t.expire < now){
							user.token.splice(i,1);
						}
					})
					
					var access_token = {'access_token':token,expire:expireDate}
					user.token.push(access_token)
					//user.markModified('token');
					user.save(function(err){
						if (err) {
							console.log(err);
						}
						res.json({
							status:"success",
							message:"user access_token generate.",
							data: {access_token:token}
						});
					});
				}
			}
		})
	}
}