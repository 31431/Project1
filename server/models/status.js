const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var StatusSchema = new mongoose.Schema({
	//Order number of the work
	orderNumber: {
		type: Number,
		require: true,
		trim: true,
		minlength: 1,
		unique: true
	},
	//When the process has been updated
	updated: {
		type: Object,
		default: null
	},
	//Status of the work
	status: {
		type: Number,
		default: 0,
		minlength: 1
	},
	customer:{
		type: String,
		require: true,
		minlength: 1
	},
	HP:{
		type: String,
		require: true,
		minlength:5
	}
});

var Status = mongoose.model('Status', StatusSchema);

StatusSchema.methods.toJSON = function(){
	var status = this;
	var statusObject = status.toObject();

	return _.pick(statusObject,['orderNumber','updated','status','customer','HP']);
};

module.exports = {Status};