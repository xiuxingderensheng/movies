var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function(app) {

	//prehandle user
	app.use(function(req, res, next) {
		var _user = req.session.user;

		app.locals.user = _user;

		next();
	});

	//首页
	app.get('/', Index.index);


	//signup
	app.post('/user/signup', User.signup);
	//signin
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);
	//logout
	app.get('/logout', User.logout);
	//用户列表页
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);


	//电影详情页
	app.get('/movie/:id', Movie.detail);
	//后台录入页
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
	//admin update movie
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
	//admin post movie
	app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);
	//列表页
	app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
	//list delete movie
	app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

	//Comment
	app.post('/user/comment', User.signinRequired, Comment.save);

	//catetory
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
	app.get('/results', Index.search);
}
