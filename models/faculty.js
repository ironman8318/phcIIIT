var mongoose = require('mongoose');

// Manufacture Schema
var FacultySchema = mongoose.Schema({
	name: {
		type: String,
		index:true
	}, 
	email: {
		type: String,
		required: true,	 
	},
	phone: {
		type: Number,
		required: true
	},
	pfnum : {
		type : String,
		required : true
	},
	department : {
		type : String,
		required : true
	},
	completed : {
		type : Boolean,
		default : false
	},
	
	userid:{
		type:String,
		required: true
	},
	usertype:{
		type:String,
		required:true
	},
	
        bloodg : {
                type : String
       }
});

var Faculty = module.exports = mongoose.model('Faculty', FacultySchema);

 

 
