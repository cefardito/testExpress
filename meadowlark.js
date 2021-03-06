var fortune = require('./lib/fortune.js');
var express = require('express');
var formidable = require('formidable');
var credentials = require('./credentials.js');

var app = express();

//Habilitar el uso de cookies
app.use(require('cookie-parser')(credentials.cookieSecret));

//Habilitar el uso de sesiones
app.use(require('express-session')());

//set up handlebars view engine
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine','handlebars');

app.set('port', process.env.PORT || 3000);


//Declara el middleware del directorio publico, donde reside el contenido estático
app.use(express.static(__dirname + '/public'));

app.use(require('body-parser')());

app.use
(
		function(req, res, next)
		{
			res.locals.showTests = app.get('env') != 'production' && req.query.test == '1';
			next();
		}
);

app.get('/', function(req, res){
	res.render('home');
});

app.get('/about', function(req, res){
	res.cookie('monster', 'nom nom');
	res.cookie('signed_monster','nom nom',{ signed: true});
	res.render('about',{ fortune: fortune.getFortune(), pageTestScript: '/qa/tests-about.js' } );
});

app.get('/tours/hood-river', function(req, res){
	res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
	res.render('tours/request-group-rate');
});

app.get('/headers', function(req,res)
	{
		res.set('Content-Type','text/plain');
		var s = '';
		for (var name in req.headers) 
		{
			s += name + ': ' + req.headers[name] + '\n';
		}
		res.send(s);
	}
);

app.get('/newsletter', function(req,res)
	{
		//we will learn about CSRF later... for now, we just provide a dummy value
		res.render('newsletter', { csrf: 'CSRF token goes here' });
	}
);

app.post('/process', function(req, res)
	{
		if(req.xhr || req.accepts('json,html')==='json')
		{
			//if there were an error, we would send { error: 'error description'}
			res.send({ success: true });
		} else 
		{
			//if there were an error, we would redirect to an error page
			res.redirect(303, '/thank-you');
		}
	}
);

/*
app.post('/process', function(req,res)
	{
		console.log('Form (from querystring): ' + req.query.form);
		console.log('CSRF token (from hidden from field): ' + req.body._csrf);
		console.log('Name (from visible form field): ' + req.body.name);
		console.log('Email (from visible form field): ' + req.body.email);
		res.redirect(303, '/thank-you');
	}
);
*/

app.get('/contest/vacation-photo', function(req,res)
	{
		var now = new Date();
		res.render('contest/vacation-photo', {year: now.getFullYear(),month: now.getMonth()}
		);
	}
);

app.post('/contest/vacation-photo/:year/:month', function(req, res)
	{
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files)
			{
				if(err) return res.redirect(303, '/error');
				console.log('received fields:');
				console.log(fields);
				console.log('received files:');
				console.log(files);
				res.redirect(303, '/thank-you');
			}
		);
	}
);

// custom 404 page
app.use
(
	function(req, res, next)
	{
		res.status(404);
		res.render('404');
	}
);

//custom 500 page
app.use
(
	function(err, req, res, next)
	{
		console.error(err.stack);
		res.status(500);
		res.render('500');
	}
);

app.listen
(
	app.get('port'), function()
	{
		console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
	}
);
