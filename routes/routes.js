module.exports = function(express, app){
    let router = express.Router();

    router.get('/', function(req, res, next){
        res.render('index', {title: 'Welcome to ChatCAT'});
    });

    router.get('/chatrooms', function(req, res, next){
        res.render('chatrooms', {title: 'Chatrooms'});

    });

    router.get('/room', function(req, res, next){
        res.render('room', {title: 'Room'})
    });

    router.get('/setcolor', function(req, res, next){
        req.session.favColor = 'Red';
        res.send('setting favourite color!');
    });
    router.get('/getcolor', function(req, res, next){
        res.send('Favourite Color:'+ (req.session.favColor===undefined?'Not Found':req.session.favColor));
    })
    app.use('/', router);   //execute router function when its dir matches the preceeding dir
}