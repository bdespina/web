const express = require('express');
const router = express.Router();
const services = require('../services');

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
  services.loginUser(req.body).then(done => {
    req.session.isAuthenticated = true;
    res.redirect('/dashboard');
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

router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Upload' });
});

module.exports = router;
