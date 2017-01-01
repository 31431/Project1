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
app.get('/:id',(req,res)=>{
	var id = req.params.id;

	Status.findOne({_id:id}).then((status)=>{
		if(!status){
			return res.status(404).send();
		}

		res.status(200).send(status);
	})
})
//GET /pcl/status => Get All status
//POST /pcl/create => Creating new status
//PATCH /pcl/:id => Update status for a specific job
//GET /pcl/:station => Getting all jobs at that station


app.listen(port,()=>{
	console.log('Connected successfully on', port);
})