// FOR USERS

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
		unique: true,
		minlength: 1,
	},
	password:{
		type: String,
		minlength: 8
	},
	tokens:[{
		access:{
			type: String,
			required: true,
		},
		token:{
			type: String,
			required: true
		}
	}]
})

UserSchema.pre('save',function(next){
	var user = this;
	if(user.isModified('password')){
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(user.password,salt,(err,hash)=>{
				user.password = hash;
				next();
			})
		})
	} else{
		next();
	}
})

UserSchema.methods.toJSON = function(){
	var user = this;
	var userObject = user.toObject();
	return _.pick(userObject,['_id',username]);
};

UserSchema.methods.generateToken = function(){
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(),access},process.env.JWT_SECRET).toString();
	user.tokens.push({access,token});
	return user.save().then(()=>{
		return token;
	})
};

UserSchema.methods.removeToken = function(token){
	var user = this;
	return user.update({
		$pull:{
			tokes:{
				token: token
			}
		}
	})
};

UserSchema.statics.findByToken = function(token){
	var User = this;
	var decoded;

	try{
		decoded = jwt.verify(token,process.env.JWT_SECRET);
	} catch(e){
		return Promise.reject();
	}
	return User.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access' : 'auth'
	})
}

UserSchema.statics.findByCredentials = function(username,password){
	var User = this;

	return User.findOne({username}).then((user)=>{
		if(!user){
			return Promise.reject();
		}

		return new Promise((resolve,reject)=>{
			bcrypt.compare(password, user.password,(err,res)=>{
				if(res === true){
					return resolve(user);
				}
				return reject();
			})
		})
	})
}

var User = mongoose.model('User',UserSchema);

module.exports = {User};