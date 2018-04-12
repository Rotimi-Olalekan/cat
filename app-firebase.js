let express = require('express'),
app = express(),
path = require('path'),
hexpress=require('hogan-express'),
cookieParser= require('cookie-parser'),
session = require('express-session'),
config = require('./config/config.js'),
firebase = require('firebase-admin'),
serviceAccount = require('./chatcat-e7f73-firebase-adminsdk-ikc3n-59a2221257.json');
let ref = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://chatcat-e7f73.firebaseio.com"
});

let FirebaseStore = require('connect-session-firebase')(session),

database = firebase.database();
// ConnectMongo = require('connect-mongo')(session)
// initializeApp();
//mongoose = require('mongoose').connect(config.dbURL)

app.set('views', path.join(__dirname, 'views'));  //assigns views to the dir that follows
app.engine('html', hexpress);   //use hogan-express for html files
app.set('view engine', 'html'); 
app.use(express.static(path.join(__dirname, 'public')));  //serves the static files i.e css and images

app.use(cookieParser());
// app.use(session({secret: 'catscanfly'}));

let env = process.env.NODE_ENV || 'development';
if (env==='development'){
// development specific settings
app.use(session({secret:'keyboard cat'}))
} else{
//production specific settings
app.use(session({
  store: new FirebaseStore({
    database: ref.database()
  }),
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
}

//sign-in with fb
new firebase.auth.FacebookAuthProvider();
var provider = new firebase.auth.FacebookAuthProvider();
//sign-in with a redirect
function facebookSigninRedirect(){
  firebase.auth().signInWithRedirect(provider);
}
//sign-in with a pop-up window
function facebookSigninPopup(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log(token)
    console.log(user)
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log(errorCode);
    console.log(errorMessage);
    // ...
  });
}

function facebookSignout() {
  firebase.auth().signOut()
  
  .then(function() {
     console.log('Signout successful!')
  }, function(error) {
     console.log('Signout failed')
  });
}

//define route
require('./routes/routes.js')(express, app);

                                                // app.route('/').get(function(req, res, next){  //returns a single route - this dir
                                                //     // res.send('<h1>i\'m serving using express</h1>')
                                                //     res.render('index', {title:'Welcome to ChatCAT'}); //returns html of index
                                                // });

app.listen(3001, function(){
console.log('ChatCAT working on port 3001');
console.log('Mode:' + env);
});
console.log(typeof firebaseApp.auth.GoogleAuthProvider)
// console.log(app);
/* <script src="https://www.gstatic.com/firebasejs/4.12.1/firebase.js"></script> */


//backup for mongodb dev&prod.json
//{
//   "dbURL" : "mongodb://chatcatuse:mychatcat@ds229609.mlab.com:29609/chatcat",
//   "sessionSecret" : "IMITORLEUMASIMITORLEUMASIMITORLEUMAS12341234"
// }

//fb auth
// https://chatcat-e7f73.firebaseapp.com/__/auth/handler