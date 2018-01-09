var crypto = require('crypto'),
    User = require('./users.js'),
    Post = require('./post.js');
    
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    res.redirect('back');//返回之前的页面
  }
  next();
}

module.exports = function(app) {
	app.get('/', function (req, res) {
		if(req.session.user){
		  	var postname = req.session.user.name;
		}else{
			var postname = 'xx';
		}
		Post.get(postname, function (err, posts) {
		    if (err) {
		      	posts = [];
		    } 
		    res.render('index', {
		      	title: '主页',
		      	user: req.session.user,
		      	posts: posts,
		      	success: req.flash('success').toString(),
		      	error: req.flash('error').toString()
		    });
	  	});
	});
	app.get('/my', function(req,res) {
		res.render('index', {
			title: 'Express'
		});
	});
	
	app.get('/reg', checkNotLogin);
	app.get('/reg', function (req, res) {
	    res.render('reg',{
	    	title: '注册',
	    	user:req.session.user,
	    	success:req.flash('success').toString(),
    	  	error: req.flash('error').toString() 
	    })
  	});
  	
  	app.post('/reg', checkNotLogin);
  	app.post('/reg', function (req, res) {
  		var name = req.body.name,
  			password = req.body.password,
  			repassword = req.body['password-repeat'];
  		if (repassword != password) {
  			req.flash('error', '两次输入的密码不一致!');
//			res.end('{"err":"laing ci mi ma bu tong !"}');
  			return res.redirect('/reg');//返回注册页
  		}
  		//生成密码的 md5 值
  		var md5 = crypto.createHash('md5'),
      	password = md5.update(req.body.password).digest('hex');
  		var newUser = new User({
      		name: name,
      		password: password,
      		email: req.body.email
  		});
  		//检查用户名是否已经存在 
  		User.get(newUser.name, function (err, user) {
//			console.log(err,'index 里的err')
//			console.log(user,'index 里的user')
			if(err){
				req.flash('error', err);
//				res.end('{"err":err}');
				return res.redirect('/');//返回注册页
			}
			if(user){
//				console.log(user,'index 里的user')
				req.flash('error', '用户已经存在！');
//				res.end('{"err":"user has already exit hhhh!"}');
				return res.redirect('/');
			}
			newUser.save(function(err,user){
				if(err){
					req.flash('error', err);
//	  				res.end('{"err":err}');
	  				return res.redirect('/reg');//返回注册页
	  			}
				req.session.user = newUser;//用户信息存入 session
				req.flash('success','注册成功！');
//				res.end('{"err":"user save success!"}');
				return res.redirect('/');
			})
  		})
  		
  	});
  	
  	app.get('/login', checkNotLogin);
    app.get('/login', function (req, res) {
    	res.render('login', {
	        title: '登录',
	        user: req.session.user,
	        success: req.flash('success').toString(),
	        error: req.flash('error').toString()
	    });
	});
	
	app.post('/login', checkNotLogin);
  	app.post('/login', function (req, res) {
  		//生成密码的 md5 值
  		var md5 = crypto.createHash('md5'),
      	password = md5.update(req.body.password).digest('hex');
      	//检查用户名是否已经存在 
  		User.get(req.body.name, function (err, user) {
			if(!user){
				req.flash('error', '用户不存在！');
				return res.redirect('/login');
			}
			//检查密码是否一致
		    if (user.password != password) {
		      	req.flash('error', '密码错误!'); 
		      	return res.redirect('/login');//密码错误则跳转到登录页
		    }
		    //用户名密码都匹配后，将用户信息存入 session
		    req.session.user = user;
		    req.flash('success', '登陆成功!');
		    res.redirect('/');//登陆成功后跳转到主页
		})
  	});
  	
  	app.get('/logout', checkLogin);
  	app.get('/logout', function (req, res) {
  		req.session.user = null;
	  	req.flash('success', '登出成功!');
	  	res.redirect('/');//登出成功后跳转到主页
  	});
  	
  	app.get('/post', checkLogin);
  	app.get('/post', function (req, res) {
    	res.render('post', {
    			title: '发表',
		        user: req.session.user,
		        success: req.flash('success').toString(),
		        error: req.flash('error').toString()
    		}
    	);
  	});
  	
  	app.post('/post', checkLogin);
  	app.post('/post', function (req, res) {
  		var currentUser = req.session.user,
      	post = new Post(currentUser.name, req.body.title, req.body.post);
	  	post.save(function (err) {
		    if (err) {
		      req.flash('error', err); 
		      return res.redirect('/');
		    }
		    req.flash('success', '发布成功!');
		    res.redirect('/');//发表成功跳转到主页
	  	});
  	});
  	
  	app.get('/clear', checkLogin);
  	app.get('/clear',function(req,res){
  		console.log(req.query.title,'clear清除 名称')
  		var currentUser = req.session.user,
      	post = new Post(currentUser.name,req.query.title, '');
    	post.clear(function (err) {
		    if (err) {
		      	req.flash('error', err); 
		      	return res.redirect('/');
		    }
		    req.flash('success', '删除成功!');
		    res.redirect('/');//发表成功跳转到主页
	  	});
//		res.render('post', {
//  			title: '发表',
//		        user: req.session.user,
//		        success: req.flash('success').toString(),
//		        error: req.flash('error').toString()
//  		}
//  	);
  	});
  	
  	
  	
};

