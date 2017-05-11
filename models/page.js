var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Page', new Schema({ 
    	id: String, 
    	name: String,
    	time_limit:String,
    	last_update:String
}));