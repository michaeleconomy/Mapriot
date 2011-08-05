
/**
 * Module dependencies.
 */

require("./js_extensions")
var express = require('express');
var auth = require('connect-auth');
var users = require('./users');

// var mongoose = require('mongoose');
// 
// 
// mongoose.connect('mongodb://localhost/mapriot');

var app = module.exports = express.createServer();

// Configuration

var fbId = "149505815126076";
var fbSecret = "e7aeda9fa41a93443925d7c0a29fabea";
var fbCallbackAddress = "http://localhost:3000/signin";
var sign_in_url = "/signin?method=facebook&redirectUrl=" + escape(fbCallbackAddress);
var cookieSecret = "oimcniuwnauc";


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  // app.use(express.methodOverride());
  // app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  
  app.use(express.cookieParser());
  app.use(express.session({secret: cookieSecret}));
  app.use(auth( [
    // auth.Facebook({appId: fbId, appSecret: fbSecret, scope: "email", callback: fbCallbackAddress})
    auth.Facebook({appId: fbId, appSecret: fbSecret, callback: fbCallbackAddress})
  ]));
});


app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// Routes


function auth_required(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  }
  else {
    if (req.is('json')){
      res.send(401)
    }
    else {
      res.redirect(sign_in_url)
    }
  }
}

// Method to handle a sign-in with a specified method type, and a url to go back to ...
app.get('/signin', function(req, res) {
  req.authenticate(['facebook'], function(error, authenticated) {
    if (authenticated) {
      var details = req.getAuthDetails()['user'];
      console.log(details);
      users.add(details['name'], details['id'])
      req.session['uid'] = details['id']
      res.redirect("/");
    }
    else {
      res.end("<html><h1>Facebook authentication failed :( - " + error + " </h1></html>")
    }
   });
});


app.post('/move', auth_required, function(req, res) {
  var x = parseInt(req.param('x'))
  var y = parseInt(req.param('y'))
  users.move(req.session['uid'], x, y)
  res.send()
});


app.get('/home', auth_required, function(req, res) {
  var version = parseInt(req.param('version'))
  if (version != users.version) {
    res.send({event: "start", data:users.list, version:users.version});
  }
  else {
    users.watch(function(evt, data, version) {
      res.send({event: evt, data: data, version:version});
    })
  }
});

app.post('/chat', auth_required, function(req, res) {
  users.chat(req.session['uid'], req.param('message'))
  res.send()
});

app.get('/', function(req, res){
  res.render('index', {authenticated: req.isAuthenticated(), sign_in_url: sign_in_url})
});


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
