
let express = require('express'),
app = express(),
path = require('path'),
hexpress=require('hogan-express'),
cookieParser= require('cookie-parser'),
session = require('express-session'),
config = require('./config/config.js'),
ConnectMongo = require('connect-mongo')(session),
mongoose = require('mongoose').connect(config.dbURL)
;
 

app.set('views', path.join(__dirname, 'views'));  //assigns views to the dir that follows
app.engine('html', hexpress);   //use hogan-express for html files
app.set('view engine', 'html'); 
app.use(express.static(path.join(__dirname, 'public')));  //serves the static files i.e css and images

app.use(cookieParser());

//create a session
// app.use(session({secret: 'catscanfly'}));
let env = process.env.NODE_ENV || 'development';
if (env==='development'){
// development specific settings
app.use(session({secret:config.sessionSecret}))
} else{
//production specific settings
    app.use(session({
        secret:config.sessionSecret,
        store: new ConnectMongo({
            url:config.dbURL,
            stringify:true
    })
}))
}

let userSchema = mongoose.Schema({
    username: String,
    password: String,
    fullname: String
})
let person = mongoose.model('users', userSchema);

let John = new person({
    username: 'johndoe',
    password: 'john_wants_to_login',
    fullname:'John Doe'
})
John.save(function(err){
    console.log('Done!');
})

//define route
require('./routes/routes.js')(express, app);

                                                // app.route('/').get(function(req, res, next){  //returns a single route - this dir
                                                //     // res.send('<h1>i\'m serving using express</h1>')
                                                //     res.render('index', {title:'Welcome to ChatCAT'}); //returns html of index
                                                // });

app.listen(3000, function(){
console.log('ChatCAT working on port 3000');
console.log('Mode:' + env);
});
// console.log(app);