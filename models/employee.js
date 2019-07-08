var mongoose = require('mongoose');

// Manufacture Schema
var EmployeeSchema = mongoose.Schema({
	name: {
		type: String,
		index:true
	}, 
	email: {
		type: String,
			 
	},
	phone: {
		type: Number,
		required: true
	},
	pfnum : {
		type : String,
		required : true
	},
	relation:{
		type: String,
		required:true
	},
	relatedto:{
		type:String,
	},
	
	
	userid:{
		type:String,
		required: true
	}
});

var Employee = module.exports = mongoose.model('Employee', EmployeeSchema);

 

 
