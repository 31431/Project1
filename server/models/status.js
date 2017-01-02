//FOR STATUS OF EACH ORDER

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var StatusSchema = new mongoose.Schema({
	//Order number of the work
	orderNumber: {
		type: Number,
		require: true,
		trim: true,
		unique: true,
		minlength: 1
	},
	//When the process has been updated
	updated: {
		type: mongoose.Schema.Types.ObjectId,
		default: null
	},
	//Status of the work
	status: {
		type: Number,
		default: 1,
		minlength: 1
	},
	customer:{
		type: String,
		require: true,
		minlength: 1
	},
	saleIC:{
		type: String,
		require: true,
		minlength:5
	},
	jobType:{
		type: Number, // 1 - coating, 2-laser job, 3- both
		require: true
	}
});

var Status = mongoose.model('Status', StatusSchema);

StatusSchema.methods.toJSON = function(){
	var status = this;
	var statusObject = status.toObject();

	return _.pick(statusObject,['orderNumber','updated','status','customer','saleIC','jobType']);
};

module.exports = {Status};