var User = require('../models/user');

//signup
exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '注册页面'
	});
}

//signin
exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '登录页面'
	});
}

exports.signup = function(req, res) {
	//'/user/signup/:userid' var _userid = req.params.userid
	//'/user/signup/1111?userid=1112' var -userid = req.query.userid
	//'/user/signup/1111?userid=1112' {userid: 1113} params先找路由中的1111，再找body里的1113，最后是query的1112
	var _user = req.body.user;
	console.log(_user);
	User.findOne({'name': _user.name}, function(err, user) {
		if (err) {
			console.log(err);
		}

		if (user) {
			//console.log(user);
			res.redirect('/signin');
		} else {
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				res.redirect('/');
			});
		}
	});
}
//signin
exports.signin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (!user) {
			console.log('user is not exist!');
			return res.redirect('/signup');
		}
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err);
			}
			if (isMatch) {
				console.log('Password is matched!');
				req.session.user = user;
				return res.redirect('/');
			} else {
				console.log('Password is not matched!');
				res.redirect('/signin');
			}
		});
	});
}
//logout
exports.logout = function(req, res) {
	delete req.session.user;
	//delete app.locals.user;
	res.redirect('/');
}
//用户列表页
exports.list = function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}
		res.render('userlist', {
			title: 'imooc 用户列表页',
			users: users
		});
	});	
}

//midware for user
exports.signinRequired = function(req, res, next) {
	var user = req.session.user;

	if (!user) {
		return res.redirect('/signin');
	}

	next();
}

//midware for user
exports.adminRequired = function(req, res, next) {
	var user = req.session.user;
	console.log(user.role);

	if (user.role <= 10) {
		return res.redirect('/signin');
	}

	next();
}