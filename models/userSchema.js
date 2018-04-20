var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({	
  	name:{type:String},
  	email:{type:String}, 
  	password:{type:String},
  	avg_rate:{type:Number},
    rate:[{
        user_id: {
            type: Schema.Types.ObjectId
        },
        value: {
            type: Number
        }
    }],
  	profile_img:{type:String},
	is_deleted : {type : Boolean, default : false},
	enable : {type : Boolean, default : true},
	created_date : {type : Date, default : Date.now}
});


userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        cb(err, isMatch);
    });
};
var userObj = mongoose.model('users' , userSchema);
module.exports = userObj;