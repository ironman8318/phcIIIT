const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback/',passport.authenticate('google', {
    failureRedirect: '/' }),(req, res) => {
    if(req.user.usertype=="Student" || req.user.usertype=="Faculty"){
        res.redirect("/usertype/");   
    }else{
        res.render('selectUsertype',{id : req.user._id});

    }
    }
    
);
router.get('/verify', (req, res) => {
    if(req.user){
        console.log(req.user);
    } else {
        console.log('Not Authenticated');
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;