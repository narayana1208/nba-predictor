
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	teams = require('./routes/teams'),
  games = require('./routes/games'),
  model = require('./routes/model'),
  players = require('./routes/players'),
	http = require('http'),
	path = require('path'),
  	db = require('./models');

var app = express();
app.enable('trust proxy')

app.set('env','development')

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());

	app.use('/b/',app.router);
	app.use('/b/',express.static(path.join(__dirname, 'public')));

}

app.get('/', teams.index);
app.get('/teams', teams.index);
app.get('/teams/:team_id', teams.single);
app.get('/games', games.index);
app.get('/games/:game_id', games.single);
app.get('/players',players.index);
app.get('/players/:player_id',players.single);
app.get('/model',model.index);

db
  .sequelize
  .sync()
  .complete(function(err) {
    if (err) {
      throw err
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))
      })
    }
  })