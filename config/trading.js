// config/trade.js

	
// load up the user model
	var User       		= require('../app/models/user');
	var security       	= require('../app/models/security');


	var showOnly = function(req,res) {
		security.find({}).sort('-bid').exec(function(err,data){
			if (err)
				return console.log('database is empty!')
//			data["my-messages"] =[
//			          			{"messagetext":"this is a server message", "severity-level": "warn"},
//			        			{"messagetext":"this is another server message", "severity-level": "info"},
//			        			{"messagetext":"and another", "severity-level": "error"}
//			        		]
			res.json(data)
		})	
	}
		
	
	var showAll = function(req,res) {
		var search={}
		search.scope={name: req.params.user }
		search.map=function(){
			var own=0
			var balance=0
			if (this.trades != undefined) {
				for (var i=0; i< this.trades.length; i++){
					if(this.trades[i].name == name) {
						own=own+this.trades[i].share
						balance=balance - this.trades[i].share* this.trades[i].price
					}
				}
			}
			emit(this._id, {_id	:this._id,
							security: this.security, 
							OI	: this.OI, 
							bid : this.bid.toFixed(2), 
							ask : this.ask.toFixed(2), 
							own : own,
							bal : balance.toFixed(2)})
		}
		
//		search.reduce= function(key, values){			
//			return (values[0].value)
//		}
		
		security.mapReduce(search, function(err,results){
			if (err)
				return console.log('database is empty!')
			console.log('mapReduce : '+ JSON.stringify(results))
			secs=[]
			for (var i=0; i< results.length; i++) {
				secs.push(results[i].value)
			}
			res.json(secs)
		})
		
	}
	
	exports.show=showAll

	exports.showOnly=showOnly
		
	exports.add = function(req,res) {		
		// create a security, information comes from AJAX request from Angular
		console.log(req.body )
		security.findOne( {security: req.body.name}).exec(function(err, sec){
			if (err || sec==undefined) {
				var newSec= new security({	'security'		 : req.body.name,
					'OI'			 : req.body.OI,
					'bid'			 : req.body.bid,
					'ask'			 : req.body.ask,
					'trades' 		 : [{name: 'Market', price: 0,  share: req.body.OI}]
					});
				newSec.save(function (err, newSec) {
					if (err)
						return console.log('err adding')
					console.log(JSON.stringify(newSec))
					showAll(req,res)
					})
				return;
			}
			sec.OI= req.body.OI;
			sec.bid=req.body.bid;
			sec.ask=req.body.ask;
			sec.save(function (err, sec) {
					if (err)
						return console.log('err updating')
					showAll(req,res)
					})
		})
		
	};
	
	exports.delete = function(req,res) {
		console.log(req.params)
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
		//console.log(req.body.sec)
		if (Math.abs(data.num)>5 || Math.abs(data.sec.own) >20)
			return 'Error! Breached your trading limit! take a rest!'
			

	    security.findByIdAndUpdate(req.body.sec._id,
	    	{$pushAll : { trades : [{name: data.user, price: price , share: data.num},
				                    {name: 'Market', price: price , share: -1 * data.num}]}},
		    {safe: true, upsert:true},
		    function(err,sec){
//		    		if (data.num>0) {sec.bid=sec.bid+0.05
//										sec.ask=sec.ask+0.05						
//					} else {  sec.bid=Math.max(sec.bid-0.05,0)
//						  	sec.ask=Math.max(sec.ask-0.05,0)				
//					}

					sec.OI=sec.OI - data.num
		    		sec.save(function(err){
		    			if (err)
							console.log('err')
						else						
						//	console.log(JSON.stringify(sec.own))
							showAll(req,res)
		    		})
		    })    
	}
	