var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); //弃用
var flash = require('connect-flash');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');





//session  服务端 session 存储
app.use(session({
    secret:'userMsg531234',               //设置 session 签名
    name:'userMsg',
    cookie:{maxAge:60*1000*60*24}, // 储存的时间 24小时
    resave:false,             // 每次请求都重新设置session
    saveUninitialized:true
}));
app.use(flash());

//app.use(function(req,res,next){
//	console.log(req.session)
//	//后台请求
//  if(req.session.username){ //表示已经登录后台
//      next();
//  }else if( req.url.indexOf("login") >=0 || req.url.indexOf("logout") >= 0){
//      //登入，登出不需要登录
//      next();
//  }else{
//      //next(); //TODO:这里是调试的时候打开的，以后需要删掉
//      res.end('{"redirect":"true"}');
//      
//  };
//})




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
