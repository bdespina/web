const express = require('express');
const session = require('express-session');
const router = express.Router();
const services = require('../services');
const user = require ('../services');
var sqlite3 = require('sqlite3').verbose();
var file = "./database/db.sqlite";
var db = new sqlite3.Database(file);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});


router.post('/register', function(req, res, next) {
  services.registerUser(req.body).then(done => {
    res.redirect('/login');
  }).catch(error => {
    res.json(error);
  });
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

  
router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  db.all("SELECT role FROM users where username = ? and password=?",[username,password] ,function(err, rows) {
    rows.forEach(function (row) {
        session.role = row.role;
    })
  });	
  db.close();
  services.loginUser(req.body).then(done => {
    req.session.isAuthenticated = true;
    console.log (session.role);
    if ( !session.role) {
      res.redirect('/dashboard')}
      else {
        res.redirect('/adminpage')
      };
    }).catch(error => {
    res.json(error);
    });
});


router.get('/logout', function(req, res, next) {
  req.session.isAuthenticated = false;
  res.redirect('/login');
});


router.get('/dashboard', function(req, res, next) {
  if (!req.session.isAuthenticated) {
    res.redirect('/login');
    return;
  }
  res.render('dashboard', { title: 'Dashboard' });
});


router.get('/adminpage', function(req, res, next) {
  if (!req.session.isAuthenticated) {
    res.redirect('/login');
    return;
  }
  res.render('adminpage', { title: 'Admin Page' });
});


router.get('/upload', function(req, res, next) {
  if (!req.session.isAuthenticated) {
    res.redirect('/login');
    return;
  }
  res.render('upload', { title: 'Upload HAR File' });
});

 
module.exports = router;
