module.exports = function(app, express,io) {
    let router = express.Router();
    let User = require('../models/userSchema');
    let jwt = require('jsonwebtoken');
    let constantObj = require('./../constants.js');

     var multer = require('multer');
     

    app.use(function(req, res, next) {
        req.isAuthenticated = function() {

            var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]);
            try {
                
                return jwt.verify(token, constantObj.messages.TOKEN_SECRET);
            } catch (err) {
                return false;
            }
        };
        next();
    });
    var storage = multer.diskStorage({
      destination: './public/uploads/',
      filename: function (req, file, cb) {
        cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
      }
    })

    var upload = multer({ storage: storage })
    let path = require('path');
    // Controllers
    let userController = require('./../controllers/user');
    
    //Users
     app.post('/api/v1/signup', userController.signup); //Signup
     app.post('/api/v1/login', userController.login); // Login
     app.post('/api/v1/rate',userController.ensureAuthenticated, userController.rate); // Rate
     app.get('/api/v1/getdata',userController.ensureAuthenticated, userController.getData); // GetData
     app.get('/api/v1/getone/:user_id',userController.ensureAuthenticated, userController.getOne); // GetData
   



}
