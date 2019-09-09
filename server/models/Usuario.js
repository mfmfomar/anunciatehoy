'use strict'
/*gravatar.com
https://www.youtube.com/watch?v=0YmjxiP0g6M&list=PLUdlARNXMVkk7E88zOrphPyGdS50Tadlr&index=12
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const userSchema = Schema({
	email:{type:String, unique: true,lowercase:true},
	nombre:String,
	apellido:String,
	telefono: String,
	password: {type:String},
	signupDate:{type:Date, default: Date.now()},
	lastLogin: Date,
	tipo: {type: String,enum : ['general','agente','hotelero','gold','silver','cristal','admin'],default:'general'},
    pais: String,
    estado: String,
    ciudad: String,
    countryCode: String,
	estatus:{type: String,enum :['activado','desactivado'], default:'desactivado'},
	nombreUsuario:{type: String,unique: true,lowercase:true}

});
//	password: {type:String, select:false},

userSchema.pre("save", function (next){
	let user = this;
	//if (!user.isModified("password")) return next();
	bcrypt.genSalt(10,function(err,salt){
		if(err) return next();
		bcrypt.hash(user.password,salt,null, function (err,hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.gravatar = function () {
  if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`

  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

module.exports = mongoose.model('usuario', userSchema);