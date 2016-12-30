require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Status} = require('./models/status.js');
const {mongoose} = require('./db/mongoose');

const app = new express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/',(req,res)=>{
	res.send('Welcome to the Status Tracker App API');
});

app.post('/create',(req,res)=>{
	
	var body = _.pick(req.body,['orderNumber','HP','customer']);
	body.updated = new ObjectID();

	var work = new Status(body);

	work.save().then((doc)=>{
		console.log('Save successfully\n');
		console.log(JSON.stringify(doc,undefined,2));
		res.status(200).send(doc);
	}, (e)=>{
		console.log('Error ',e);
		res.status(400).send(e);
	})
})

app.get('/status/:orderNumber',(req,res)=>{
	var orderNumber = req.params.orderNumber;

	Status.findOne({orderNumber}).then((workStatus)=>{
		if(!workStatus){
			return res.status(400).send({text:'No status found!'});
		};
		res.status(200).send(workStatus);
	},(e)=>{
		res.status(400).send(e);
	})
})

app.patch('/update/:orderNumber',(req,res)=>{
	var orderNumber = req.params.orderNumber;
	var status = req.body.status;
	var updated = new ObjectID();

	Status.findOneAndUpdate({orderNumber},{$set:{status,updated}},{new: true}).then((workStatus)=>{
		if(!workStatus){
			return res.status(404).send({text:'Status not found!'});
		}
		res.status(200).send({workStatus});
	},(e)=>{
		res.status(400).send(e);
	})	
})	


app.listen(port,()=>{
	console.log('Connected successfully on', port);
})