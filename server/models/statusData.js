//STATUS NUMBER DESCRIPTION

const mongoose = require('mongoose');
const _ = require('lodash');

var StationSchema = new mongoose.Schema({
	status:{
		type: Number,
		required: true,
		minlength: 1
	},
	statusDes: {
		type: String,
		required: true,
		minlength: 1
	}

})

var Station = mongoose.model('Station',StationSchema);

module.exports = {Station};