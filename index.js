// index.js
require('dotenv').config();
/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejs= require('ejs');
const User = require('./model/mode.js');
// const mongoString = process.env.DATABASE_URL;

// mongoose.connect(mongoString);

mongoose.connect("mongodb://localhost:27017/chichi_db", {

  useNewUrlParser: "true",
  useUnifiedTopology: "true"

})
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
})

database.once('connected', () => {
  console.log('Database Connected');
})


/**
 * App Variables
 */
const app = express();


const port = process.env.PORT || "8080";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/css", express.static(path.join(__dirname, "css")));
/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

let isLoggedIn = false;
app.post('/signup', (req, res) => {
  const { loginStatus } = req.body;
  isLoggedIn = loginStatus === 'true';
  res.redirect('signin');
});


app.get("/contact", async (req, resp) => {
  resp.render("contact", { title: "Contact"});
});

app.get("/product", async (req, resp) => {
  resp.render("product", { title: "Product"});
});

app.get("/about", async (req, resp) => {
  resp.render("about", { title: "About"});
});

app.get("/profile", async (req, resp) => {
  resp.render("profile", { title: "Profile"});
});

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

app.get('/register', function(req, res){
  res.render('register', {
    title: 'Register',
    msg   : req.query.msg
  })
})
.post('/register', function(req, res){
  registerNewUser(req, res);
})
.post('/check_username_availability', function(req, res){
  checkUsernameAvailability(req.body.username, res);
})
// Login
app.get('/login', function(req, res){
  res.render('login', {
    title: "Login",
    msg: req.query.msg
  })
})
app.post('/login', function(req, res){
  loginUser(req, res);
})
// Logout
.get('/logout', function(req, res){
  logUserOut(req, res);
})
function loginUser(req, res){
  User.find({'username': req.body.username}, function(err, data){
if(data[0] !== undefined){
      var user = data[0];
      //Check Password
      if(req.body.password === user.password){
        //Login User
        var auth = Math.random().toString().replace('.', '');
        var session = {
          user_id   : user._id,
          username  : user.username,
          auth      : auth
        };
        user.auth = auth;
        User.save
        user.save(function(){
          console.log("User Logged In");
          res.cookie('session', session).redirect('/');
        });
      } else {
        //Bad Password
        res.redirect('/login?msg=Wrong Username or Password');
      }
    } else {
      //Bad Stuff
      res.redirect('/login?msg=Wrong Username or Password');
    }
  })
}
// Logout Function
function logUserOut(req, res){
  var session = req.cookies.session;
  User.find({auth: session.auth}, function(err, data){
    if(data[0] !== undefined){
      var user = data[0];
      user.auth = "";
      user.save(function(){
        console.log("User Logged Off");
        res.clearCookie('session').redirect('/');
      })
    } else {
      res.clearCookie('session').redirect('/');
    }
  })
}
// Register Functions
function registerNewUser(req, res){
  User.find({username: req.body.username}, function(err, data){
    if(data == ""){
      var newUser = new User({
        username    : req.body.username,
        password    : req.body.password,
        first_name  : req.body.first_name,
        last_name   : req.body.last_name,
        email       : req.body.email,
        address     : req.body.address,
        city        : req.body.city,
        zip         : req.body.zip
      });
      console.log("New User");
      newUser.save(function(){
        res.redirect('/login?msg=Account Created!');
      })
    } else {
      res.redirect('/register?msg=Username Univalable');
    }
  })
}
function checkUsernameAvailability(username, res){
  User.find({'username': username}, function(err, reply){
if(reply == ''){
      res.send({availability: 'available'});
    } else {
      res.send({availability: 'unavailable'});
    }
  })
}

