// config/trade.js

	
// load up the user model
	var User       		= require('../app/models/user');
	var security       	= require('../app/models/security');

	var showAll = function(req,res) {
		//console.log(req.params.user)
		security.aggregate([
		                    { $unwind :  '$trades' },
		                    { $group : { _id	 : '$_id',
		                    			 security 	: {$first : '$security'},
		                    			 OI		 	: {$first : '$OI'},
		                    			 bid 		: {$first : '$bid'},
		                    			 ask		: {$first : '$ask'},
		                    			 own 	  	: {$sum : '$trades.share'}}},
		                    ],	function(err, secs){
					                  if (err) {
					                         console.log(err);
					                  }
					                  console.log(secs);
					                  res.json(secs)
							})
	}
	
	exports.show=showAll
		
	exports.add = function(req,res) {		
		// create a security, information comes from AJAX request from Angular
		//console.log(req.body )
		var newSec= new security({	'security'		 : req.body.name,
									'OI'			 : req.body.OI,
									'bid'			 : req.body.bid,
									'ask'			 : req.body.ask,
									'trades' 		 : []
		});
		
		newSec.save(function (err, newSec) {
							if (err)
								return console.log('err adding')
							showAll(req,res)
		})};
	
	exports.delete = function(req,res) {
		security.remove({_id : req.params.sec_id}, function(err) {
			if (err)
				console.log('err')
			else
				showAll(req,res)
		})
	}
	
	
	exports.oneTrade = function(req,res) {		
		// create a security, information comes from AJAX request from Angular
		var data=req.body
		var price=req.body.sec.bid
		if (data.num > 0) price=req.body.sec.ask
		security.findById(data.sec._id).exec(function(err, sec){
			sec.trades.push({name: data.user, price: price , share: data.num})
			sec.save(function(err){
				if (err)
					return console.log('err trading')
				showAll(req,res)
			})
		})
	}
	