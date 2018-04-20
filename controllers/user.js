var UserObj = require('./../models/userSchema.js');
let jwt = require('jsonwebtoken');
let moment = require('moment');
let constantObj = require('./../constants.js');
let io = require('../server').io;
let mongoose = require('mongoose');


/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({
      msg: 'Unauthorized'
    });
  }
};


exports.signup=function(req,res,next){


    req.assert('name', 'First name cannot be blank.').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Email cannot be blank').notEmpty();

   let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      msg: constantObj.messages.requiredParams,
      err: errors
    });
  }
    console.log('Uploade Successful ', req.file, req.body);
    var obj=req.body;

    if(req.file!=undefined && req.file.filename!=""){
         obj['profile_img']=req.file.filename;
    }
    
    UserObj.findOne({
        email: req.body.email
      }, function(error, user) {

        if(error){
              return res.status(400).send({
                        msg: constantObj.messages.errorRetreivingData,
                        err: error
                      });
            }

             if(user==null){
                UserObj(obj).save(obj,function(err,responce){
            if(err){
              return res.status(400).send({
                        msg: constantObj.messages.errorInSave,
                        err: err
                      });
            }
            return res.status(200).send({
                        msg: constantObj.messages.userSuccess,
                        data: responce
                      });
          })
             }else{
              return res.status(400).send({
                        msg:  constantObj.messages.emailAlreadyExist
                        
                      });
             }
      })

  

}

exports.login=function(req,res,next){
 
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();

   let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      msg: constantObj.messages.requiredParams,
      err: errors
    });
  }
 
  UserObj.findOne({
    email: req.body.email,
    is_deleted: false,
    enable: true
  }).exec(function(err, user) {
    console.log(user);
    if (!user) {
      return res.status(401).send({
        msg: 'The email address ' + req.body.email + ' is not associated with any account. ' 
      });
    }
    /*-- this condition is for check that this account is active or not---- */
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({
          msg: constantObj.messages.invalidEmailPassword,
        });
      } else {       
        
        res.status(200).send({
          "token": generateToken(user),
          "data": user.toJSON(),
          "imagesPath": "http://" + req.headers.host + "/" + "uploadeds/"
        });
      }
    });
  });
}


exports.getOne=function(req,res,next){
    
    UserObj.findOne({_id:req.params.user_id}).exec(function(err,responce){
      if(err){
        return res.status(400).send({
                  msg: constantObj.messages.errorRetreivingData,
                  err: err
                });
      }
      return res.status(200).send({
                  msg: constantObj.messages.successRetreivingData,
                  data: responce,
                  imagesPath: "http://" + req.headers.host + "/" + "uploadeds/"
                });
    })

}


exports.getData=function(req,res,next){
    
    UserObj.find({}).exec(function(err,responce){
    	if(err){
    		return res.status(400).send({
                  msg: constantObj.messages.errorRetreivingData,
                  err: err
                });
    	}
    	return res.status(200).send({
                  msg: constantObj.messages.successRetreivingData,
                  data: responce,
                  imagesPath: "http://" + req.headers.host + "/" + "uploadeds/"
                });
    })

}

exports.rate=function(req,res,next){

   req.assert('from', 'from cannot be blank').notEmpty();
    req.assert('to', 'to cannot be blank').notEmpty();
    req.assert('rate', 'rate cannot be blank').notEmpty();

   let errors = req.validationErrors();
  if (errors) {
    return res.status(400).send({
      msg: constantObj.messages.requiredParams,
      err: errors
    });
  }

    let obj={user_id:req.body.from,value:req.body.rate};

   
    UserObj.update({_id:req.body.to},{$push:{rate:obj}},function(err,responce){
      if(err){
        return res.status(400).send({
                  msg: constantObj.messages.errorInSave,
                  err: err
                });
      }else{
        io.emit('this', { to: req.body.to,value:req.body.rate});
        return res.status(200).send({
                  msg: "data save successfully",
                  data: responce,
                  imagesPath: "http://" + req.headers.host + "/" + "uploadeds/"
                });
      }
      
    })

}


function generateToken(user) {
  let payload = {
    iss: 'my.domain.com',
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.sign(payload, constantObj.messages.TOKEN_SECRET);
}