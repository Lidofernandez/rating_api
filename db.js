/*
 * The file will take care of the database connectivity
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/image-viewer');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
