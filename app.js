var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(__dirname)); // redirect root
app.use('/views', express.static(__dirname + '/views/'));
app.use('/css', express.static(__dirname + '/resources/template1/startbootstrap-clean-blog-gh-pages/vendor/bootstrap/css/')); // redirect CSS bootstrap
app.use('/css', express.static(__dirname + '/resources/font-awesome-4.7.0/font-awesome-4.7.0/css/'));
app.use('/fonts', express.static(__dirname + '/resources/font-awesome-4.7.0/font-awesome-4.7.0/fonts/'));
app.use('/css', express.static(__dirname + '/resources/template1/startbootstrap-clean-blog-gh-pages/css/'));
app.use('/js', express.static(__dirname + '/resources/template1/startbootstrap-clean-blog-gh-pages/vendor/jquery/'));
app.use('/js', express.static(__dirname + '/resources/template1/startbootstrap-clean-blog-gh-pages/vendor/bootstrap/js/'));
app.use('/js', express.static(__dirname + '/resources/template1/startbootstrap-clean-blog-gh-pages/js/'));
app.use('/img', express.static(__dirname + '/resources/template1/startbootstrap-clean-blog-gh-pages/img/'));
app.use('/css', express.static(__dirname + '/resources/login/css/'));
app.use('/images', express.static(__dirname + '/resources/login/images/'));

app.set('views', './views');
app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

app.use(session({
	secret: '1234DSFs@adf1234!@#$asd',
	resave: false,
	saveUninitialized: true,
	store:new MySQLStore({
     host:'localhost',
     port:3306,
     user:'dbuser1',
     password:'dbuser1pwd',
     database:'testdb1'
   })
}));

var con = mysql.createConnection({
  host: "localhost",
  user: "dbuser1",
  password: "dbuser1pwd",
  database: "testdb1"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', function(req,res){
	if (req.session.displayName) {
		var displayName = req.session.displayName;
		var sql = 'SELECT * FROM memo WHERE memID = ?';
		con.query(sql, [displayName], function(err, result) {
			if(err) throw err;

			if(result.length>0) { // query result가 존재할 경우 
				var memoID = [];
				var memID = [];
				var radioID = [];
				var memoHTML = [];
				var resultLength = result.length;
				for(var i=0; i<result.length; i++) {
					memoID[i] = result[i].memoID;
					memID[i] = result[i].memID;
					radioID[i] = result[i].radioID;
					memoHTML[i] = result[i].memoHTML;
				}
				res.render('index', { displayName:displayName,
									  memID:memID,
									  radioID:radioID,
									  memoHTML:memoHTML,
									  resultLength:resultLength});
			}else { // query result가 존재하지 않을경우
				res.render('index', { displayName:displayName });			
			}
		});
	} else {
		res.render('index');
	}
});

app.get('/auth', function(req,res){
	res.render('auth');
});

app.post('/auth/register', function(req, res) { // ajax 사용했음
	var usernamesignup = req.body.usernamesignup;
	var passwordsignup = req.body.passwordsignup;
	console.log(usernamesignup + "," + passwordsignup);
	var sql = 'INSERT INTO member(memID,memPWD) VALUES(?)';
	var values = [usernamesignup, passwordsignup];
	con.query(sql, [values], function(err, result) {
		if (err) throw err;
		console.log(result.affectedRows);
		// console.log(result[0]);
		// console.log(result[1]);
		// res.redirect('/auth?result=' + result.affectedRows);
		// res.render('auth', { result : result.affectedRows });
		res.send(''+result.affectedRows);
	});
});

app.post('/auth/login', function(req, res) { // multiple query 하거나, 테이블을 나누거나, 앞단에서 한번 더 호출하거나...
	var username = req.body.username;
	var password = req.body.password;
	console.log(username + "," + password);
	var sql = 'SELECT * FROM member WHERE memID = ?';
	con.query(sql, [username], function(err, result, fields) {
		if(err) throw err;
		// if (err) throw err;
		// console.log(result); //문자열이랑 같이 쓰면 원하는 값 안 나옴
		// console.log(fields);
		// res.render('index');
		console.log(result);
		if(result.length>0) { // 아이디가 존재할 경우
			if(result[0].memPWD == password) { //비밀번호 맞으면
				req.session.displayName = username;
				// console.log("req.session.displayName : " + req.session.displayName);
				req.session.save(function(){
					res.redirect('/');
				});
			} else { //비밀번호 틀리면
				res.render('auth', { result : 0 });
			}
		} else { //아이디가 존재하지 않을경우
			res.render('auth', { result : 0 });
		}
		// console.log(result[0]);
		// console.log(result[1]);
	});
});

app.post('/auth/logout', function(req, res){
	var todolistArr = req.body.todolistArr;
	var values = [];

	if (todolistArr === undefined) // 메모를 하나도 저장하지 않은 경우
		todolistArr = 0;
	for(var i=0; i<todolistArr.length; i++) {
		var dataObj = {
			memID:todolistArr[i].memID,
			radioId:todolistArr[i].radioId,
			todolistInnerHTML:todolistArr[i].todolistInnerHTML
		};
		values.push(dataObj);
	}
	// console.log(todolistArr[0]);
	console.log(values);
	for(var j=0; j<values.length; j++) {
		console.log(values[j].memID);
		console.log(values[j].radioId);
		console.log(values[j].todolistInnerHTML);
		var sql = "INSERT INTO memo(memID,radioID,memoHTML) VALUES('"+values[j].memID+"',  '"+values[j].radioId+"', '"+values[j].todolistInnerHTML+"')";
		con.query(sql, function(err, result) {
			if (err) throw err;
			console.log(result.affectedRows);
			// console.log(result[0]);
			// console.log(result[1]);
			// res.redirect('/auth?result=' + result.affectedRows);
			// res.render('auth', { result : result.affectedRows });
		});
	}

	delete req.session.displayName;
	req.session.save(function(){
		res.redirect('/auth');
	});
});

app.get('/auth/logout', function(req, res){
	delete req.session.displayName;
	req.session.save(function(){
		res.redirect('/auth');
	});
});

app.listen(3001);


