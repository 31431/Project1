require('./config/config.js');
require('./bot/bot.js'); //For Telegram Bot

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Status} = require('./models/status.js');
const {User} = require('./models/user.js');
const {Station} = require('./models/statusData.js');
const {mongoose} = require('./db/mongoose');

const app = new express();
const port = process.env.PORT;

app.use(bodyParser.json());	

app.get('/',(req,res)=>{
	res.status(200).send('Welcome! Please sign in');
})

//GET /:id => To get status by customers. No Auth required
app.get('/:orderNumber',(req,res)=>{
	var orderNumber = req.params.orderNumber;
	Status.findOne({orderNumber}).then((status)=>{
		console.log(status);
		if(!status){
			return res.status(404).send();
		}

		res.status(200).send(status);
	})
})


//GET /pcl/status => Get All status
app.get('/pcl/status',(req,res)=>{
	Status.find().then((status)=>{
		res.status(200).send(status);
	},(e)=>{
		res.status(400).send(e);
	})
})

//POST /pcl/create => Creating new status
app.post('/pcl/create',(req,res)=>{
	body = _.pick(req.body,['orderNumber','customer','saleIC','jobType']);
	var status = new Status(body);
	
	status.save().then((status)=>{
		console.log(status);
		res.send(status);
	},(e)=>{
		res.status(404).send(e);
	})
})

//PATCH /pcl/:id => Update status for a specific job
app.patch('/pcl/update/:orderNumber',(req,res)=>{
	var body = _.pick(req.body,['status']);
	var orderNumber = req.params.orderNumber;

	Status.findOneAndUpdate({
		orderNumber: orderNumber
	},{$set:body},{new:true}).then((status)=>{
		if(!status){
			return res.status(404).send();
		}

		res.send({status});
	}).catch((e)=>{
		return res.status(400).send();
	})
});

//GET /pcl/:station => Getting all jobs at that station
app.get('/pcl/:station',(req,res)=>{
	var station  = req.params.station;

	Status.find({status: station}).then((status)=>{
		if(status.length === 0){
			return res.status(404).send({text:'status not found'});
		}
		res.send(status);
	}).catch((e)=>{
		return res.status(400).send();
	})
})


app.listen(port,()=>{
	console.log('Connected successfully on', port);
})