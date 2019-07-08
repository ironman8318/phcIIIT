var express = require('express');
var router = express.Router();
var User = require('../models/user');
var faculty = require('../models/faculty');

router.post('/completeprofile/:id',ensureAuthenticated,(req,res,next)=>{
    var id = req.params.id;
    var name =  req.body.name;
    var phone = req.body.phone;
    var pfnum = req.body.pfnum;
    
    var department = req.body.department;
    var bloodg = req.body.bloodg;
    var userid = id;
    console.log("Blood group " + bloodg); 
    var email = req.user.email;
    
	var addfaculty = new faculty({
	        name : name,
            email : email,
            phone : phone,
            pfnum : pfnum,
            usertype: req.user.usertype,
            department : department,
            userid : userid,
            completed : true,

            bloodg : bloodg
	});
	addfaculty.save((err,faculty) => {
        if (err){
            return err;
        }
        else{
            User.findByIdAndUpdate(id, { $set: { name : name } }, { new: true }, function(err, user) {
                if (err) {
                    res.send(err);
                }
                res.json(faculty);
            });   
        }
    });
})


router.put('/editprofile/:id',ensureAuthenticated,(req,res,next)=>{
    var id = req.params.id;
    var name =  req.body.name;
    var phone = req.body.phone;
    var pfnum   = req.body.pfnum;
    
    var department = req.body.department;
    var bloodg = req.body.bloodg;
    console.log("Blood group : " + bloodg);
     var newvalues = {
        $set: {
            name : name,
            phone : phone,
            pfnum : pfnum,
           department : department,
            bloodg : bloodg
        }
    };
    faculty.findByIdAndUpdate(id, newvalues, { new: true }).lean().exec(function(err, faculty) {
        if (err) throw err;
        res.json(faculty);
    });
})

router.post('/getfaculty',(req,res)=>{
    var pfnum = req.body.pfnumber;
    faculty.findOne({pfnum : pfnum}).lean().exec((err,faculty)=>{
        if(err) return err;
        res.json(faculty);
    })
})

router.get('/getpfnumber',(req,res)=>{
    faculty.find({},'pfnum').lean().exec((err,faculty)=>{
        if(err) return err;
        res.json(faculty);
    })
})

router.post('/facultyinfo',ensureAuthenticated,(req,res,next)=>{
    var pfnum = req.body.pfnum;
    faculty.findOne({pfnum : pfnum}).lean().exec(function(err,faculty){
        if(err) return err;
        res.json(faculty);
    })
})

router.get('/allfacultys',ensureAuthenticated,(req,res,next)=>{
    faculty.find({}).lean().exec((err,facultys)=>{
        if(err) return err;
        res.json(facultys);
    });
})
//Check whether user is authenticted or not
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;
