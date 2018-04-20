var express = require('express');
let cors = require('cors')
var app = express();
let bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
let expressValidator = require('express-validator');
var db = require('./db.js')
var multer  = require('multer');
var userObj = require('./models/userSchema.js');
let jwt = require('jsonwebtoken');
let moment = require('moment');
let constantObj = require('./constants.js');

let server = http.createServer(app);
let io = require('socket.io').listen(server);
module.exports.io = io;
var storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb',extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
// Add headers

//app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 3000);


require('./routes/routes')(app, express,io);

// app.post('/signup', upload.single('file'), function(req,res,next){


//     req.assert('name', 'First name cannot be blank.').notEmpty();
//     req.assert('email', 'Email is not valid').isEmail();
//     req.assert('email', 'Email cannot be blank').notEmpty();
//     req.assert('password', 'Email cannot be blank').notEmpty();

//    let errors = req.validationErrors();
//   if (errors) {
//     return res.status(400).send({
//       msg: constantObj.messages.requiredParams,
//       err: errors
//     });
//   }
//     console.log('Uploade Successful ', req.file, req.body);
//     var obj=req.body;

//     if(req.file!=undefined && req.file.filename!=""){
//          obj['profile_img']=req.file.filename;
//     }
    
//     userObj.findOne({
//         email: req.body.email
//       }, function(error, user) {

//         if(error){
//               return res.status(400).send({
//                         msg: constantObj.messages.errorRetreivingData,
//                         err: error
//                       });
//             }

//              if(user==null){
//                 userObj(obj).save(obj,function(err,responce){
//             if(err){
//               return res.status(400).send({
//                         msg: constantObj.messages.errorInSave,
//                         err: err
//                       });
//             }
//             return res.status(200).send({
//                         msg: constantObj.messages.userSuccess,
//                         data: responce
//                       });
//           })
//              }else{
//               return res.status(400).send({
//                         msg:  constantObj.messages.emailAlreadyExist
                        
//                       });
//              }
//       })

  

// });


// app.post('/login', function(req,res,next){
 
//     req.assert('email', 'Email is not valid').isEmail();
//     req.assert('email', 'Email cannot be blank').notEmpty();
//     req.assert('password', 'Password cannot be blank').notEmpty();

//    let errors = req.validationErrors();
//   if (errors) {
//     return res.status(400).send({
//       msg: constantObj.messages.requiredParams,
//       err: errors
//     });
//   }
 
//   userObj.findOne({
//     email: req.body.email,
//     is_deleted: false,
//     enable: true
//   }).exec(function(err, user) {
//     console.log(user);
//     if (!user) {
//       return res.status(401).send({
//         msg: 'The email address ' + req.body.email + ' is not associated with any account. ' 
//       });
//     }
//     /*-- this condition is for check that this account is active or not---- */
//     user.comparePassword(req.body.password, function(err, isMatch) {
//       if (!isMatch) {
//         return res.status(401).send({
//           msg: constantObj.messages.invalidEmailPassword,
//         });
//       } else {       
        
//         res.status(200).send({
//           "token": generateToken(user),
//           "data": user.toJSON(),
//           "imagesPath": "http://" + req.headers.host + "/" + "uploadeds/"
//         });
//       }
//     });
//   });
// })

// function generateToken(user) {
//   let payload = {
//     iss: 'my.domain.com',
//     sub: user._id,
//     iat: moment().unix(),
//     exp: moment().add(7, 'days').unix()
//   };
//   return jwt.sign(payload, constantObj.messages.TOKEN_SECRET);
// }
// app.get('/getData', function(req,res,next){
    
//     userObj.find({},function(err,responce){
//     	if(err){
//     		return res.status(400).send({
//                   msg: constantObj.messages.errorRetreivingData,
//                   err: err
//                 });
//     	}
//     	return res.status(200).send({
//                   msg: constantObj.messages.successRetreivingData,
//                   data: responce,
//                   imagesPath: "http://" + req.headers.host + "/" + "uploadeds/"
//                 });
//     })

// });

// server.listen(app.get('port'), function () {
//     console.log('Express server listening on port ' + app.get('port'));
// });



server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
