var express = require('express');
var router = express.Router();
var Patient = require('../models/patient');

router.get('/studentInformation/', ensureAuthenticated, (req, res, next) => {
    Patient.find({ patientType: "Student" }).lean().exec((err, patients) => {
        if (err) return err;
        res.json(patients);
    });

});

router.get('/employeeInformation/', ensureAuthenticated, (req, res, next) => {
    Patient.find({ patientType: "Employee" }).lean().exec((err, patients) => {
        if (err) return err;
        res.json(patients);
    });

});

router.get('/facultyInformation/', ensureAuthenticated, (req, res, next) => {
    Patient.find({ patientType: "Faculty" }).lean().exec((err, patients) => {
        if (err) return err;
        res.json(patients);
    });

});


router.get('/researchInformation/', ensureAuthenticated, (req, res, next) => {
    Patient.find({ patientType: "ResearchStaff" }).lean().exec((err, patients) => {
        if (err) return err;
        res.json(patients);
    });

});



router.get('/officeInformation/', ensureAuthenticated, (req, res, next) => {
    Patient.find({ patientType: "OfficeStaff" }).lean().exec((err, patients) => {
        if (err) return err;
        res.json(patients);
    });

});


router.get('/projectInformation/', ensureAuthenticated, (req, res, next) => {
    Patient.find({ patientType: "ProjectStaff" }).lean().exec((err, patients) => {
        if (err) return err;
        res.json(patients);
    });

});


router.get('/otherInformation/', ensureAuthenticated, (req, res, next) => {
    Patient.find({ patientType: "Staff" }).lean().exec((err, patients) => {
        if (err) return err;
        res.json(patients);
    });

});

router.post('/getactivity',ensureAuthenticated,(req,res,next)=>{
    var idnumber = req.body.idnumber;
    Patient.find({idnumber : idnumber}).lean().exec((err,record)=>{
        if(err) return err;
        res.json(record);
    })
}) 

router.get("/edit/:id",(req,res,next) => {
    var id = req.params.id;
    Patient.findById(id).then(patient => {
        res.render("edit.html",{patient : patient});
    })
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