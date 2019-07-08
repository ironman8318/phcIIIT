var express = require('express');
var router = express.Router();
var multer = require('multer');
var xlsxtojson = require("xlsx-to-json");
var xlstojson = require("xls-to-json");
var mongoXlsx = require('mongo-xlsx');
var Medicine = require('../models/medicine');
// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
    res.redirect('/usertype/')
});

router.get('/home', function(req, res) {
    res.render('home');
});

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

router.post('/upload/:id', ensureAuthenticated, function(req, res) {
    console.log("File handling code is running");
    var exceltojson;
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        /** Check the extension of the incoming file and 
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        console.log(req.file.path);
        try {
            exceltojson({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true
            }, function(err, result) {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                for (var i = 0; i < result.length; i++) {
                    if (result[i].medicineName == "") {
                        break;
                    } else {
                        let pro = new Promise((resolve,reject) =>{
                            resolve({
                                 companyName : result[i].companyName,
                                 medicineName : result[i].medicineName,
                                 medicineQuantity : result[i].medicineQuantity,
                                 quantity : result[i].medicineQuantity,
                                 price : result[i].price,
                                 compounderid : req.params.id    ,
                            })
                        }).then(data => {
                            var medicineAdd = new Medicine({
                                companyName: data.companyName,
                                medicineName: data.medicineName,
                                medicineQuantity: data.medicineQuantity,
                                quantity: data.quantity,
                                price: data.price,
                                compounderid: data.compounderid
                            });
                            console.log("running");
                            var quan;
                            Medicine.findOne({companyName : data.companyName ,medicineName : data.medicineName}).then(medicine => {

                                if(medicine){
                                    console.log(medicine)
                                    console.log("medicine found");
                                    medicine.quantity += Number(data.medicineQuantity);
                                    return medicine.save();
                                }
                                console.log("nope");
                                return medicineAdd.save();
                            })
                        }).catch(err => {
                            eonsole.log(err);
                        })

                            // console.log("medicineName : " + result[i].medicineName);
                            // var companyName = result[i].companyName;
                            // var medicineName = result[i].medicineName;
                            // var medicineQuantity = result[i].medicineQuantity;
                            // var quantity = result[i].medicineQuantity;
                            // var price = result[i].price;
                            // var compounderid = req.params.id;
                            
                            // Medicine.findOne({ $and: [{ companyName: companyName }, { medicineName: medicineName }] }).lean().exec(function(err, medicines) {
                            //     if (medicines) {
                            //         console.log("found " + medicines.medicineName);

                            //         quan = Number(medicines.quantity) + Number(medicineQuantity);
                                    
                            //         updateMedicine(medicines._id, quan)
                            //     } else {
                            //         medicineAdd.save((err, medicine) => {
                            //             if (err) return err;
                            //             console.log("Added");
                            //         });

                            //     }

                            // })
                            // var count = 0;

                            // function updateMedicine(id, quan) {

                            //     console.log("Anuj" + id)
                            //     var newvalues = {
                            //         $set: {
                            //             quantity : quan,
                            //         }
                            //     };
                            //     Medicine.findByIdAndUpdate(id,newvalues, { new: true }, (err, med) => {
                            //         console.log("Anuj1")
                            //         console.log("name " + med.medicineName + "new quantity " + med.quantity);
                            //     })
                            // }

                        }

                }
                req.flash('success_msg', 'File has been uploaded');
                res.redirect('/usertype/');
            });
        } catch (e) {
            req.flash('error_msg', 'Some Internal Error');
            res.redirect('/usertype/');
        }
    })

});


const Excel = require("exceljs/modern.nodejs")
const path =  require("path");
const fs  = require("fs");

router.get("/med",(req,res,next) => {
    var workbook = new Excel.Workbook();
    var sheet  = workbook.addWorksheet("test");
    var worksheet = workbook.getWorksheet("test");
    worksheet.columns = [
        {header : "Company" , key : "company" ,width: 12},
        {header : "Medicine" , key : "medicine",width: 25.57 },
        {header : "Quantity" , key : "quantity",width: 10 },
        {header : "Price" , key : "price" ,width: 10},
        
    ];


    Medicine.find().then(medicine => {
        new Promise((resolve,reject) => { resolve( medicine.filter( med => {
            worksheet.addRow({id : 1 , company : med.companyName , medicine : med.medicineName , quantity : med.quantity , price : med.price});
        }))})
    }).then(() => {

         // return workbook.xlsx.writeFile("./uploads/error.xlsx").then(() => {
         //    console.log("yipeeeeeeeeeeeeeeee");
         //    const file = fs.createReadStream(path.join(__dirname,"..","uploads","error.xlsx"));
            res.setHeader("Content-Type" , "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition" , "attachment");
         //    file.pipe(res);
         workbook.xlsx.write(res).then(function(){
            console.log("it worked")
            res.redirect(back);
         })

    })
    
    

        
})



//Check whether user is authenticted or not

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.render('home');
    }
}



module.exports = router;
