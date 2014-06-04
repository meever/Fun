// config/trade.js

	
// load up the user model
	var User       		= require('../app/models/user');
	var security       	= require('../app/models/security');

	exports.show = function(req,res) {
		security.find(function(err, secs){
			if (err)
				res.send(err)
			res.json(secs)
		})
	}
		
	exports.add = function(req,res) {		
		// create a security, information comes from AJAX request from Angular
		console.log(req.body )
		var newSec= new security({	'security'		 : req.body.name,
									'OI'			 : req.body.OI,
									'bid'			 : req.body.bid,
									'ask'			 : req.body.ask,
									'trades' 		 : []
		});
		
		newSec.save(function (err, newSec) {
							if (err)
								return console.log('err adding')
							security.find(function(err, secs){	
									res.json(secs)		
							}
		)})};
	
	exports.delete = function(req,res) {
		security.remove({_id : req.params.sec_id}, function(err) {
			if (err)
				console.log('err')
			else
				security.find(function(err, secs){	
					res.json(secs)		
				})				
		})
	}