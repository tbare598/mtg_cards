var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var http = require('http');
var logger = require('morgan');
var path = require('path');
var pythonShell = require('python-shell');
var favicon = require('serve-favicon');
var socket_io = require('socket.io');
var sqlite3 = require('sqlite3');

var planechase = require('./web_services/planechase.js');

//TODO:REMOVE THESE TWO
var sqlite3Verbose = sqlite3.verbose();
var db = new sqlite3Verbose.Database('SQLite/MTG.sqlite');
var app = express();
var server = http.Server(app);
var io = socket_io(server);


function pl(msg) {
    console.log('DEBUG->'+msg);
}
//Print deck
function printDeck(deck) {
    a = [];
    for(i = 0; i < deck.length; i++) 
        a.push(deck[i].name);
    pl(a);
}

server.listen(12121, "0.0.0.0");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
app.get('/', function(req, res) {res.render('index')});
app.get('/planechase', function(req, res) {res.render('planechase')});
app.get('/planechase_push', function(req, res) {res.render('planechase')});

app.get('/planechase/cards', planechase.cardListRes);

//TODO:UPDATE THIS TO SAVE THE DECK TO THE DATABASE
app.post('/save/deck', function(req, res) {
    printDeck(req.body.deck);//TODO:REMOVE
});

//TODO:MOVE FUNCTIONALITY TO IT'S OWN FILE
//The auto-complete for the card search
app.get('/cardsearch/member', function(req, res){
    term = req.query["term"];
    query = "SELECT Name               Name, "
          + "       MAX(Multiverse_ID) Multiverse_ID "
          + "  FROM T_CARDS "
          + " WHERE Name LIKE '%" + term + "%'"
          + " GROUP BY Name"
          + " LIMIT 10";
          
    db.all(query, function(err, rows) {
        if(!err) {
            var rowsJSON = JSON.stringify(rows);
            res.send(rowsJSON, {
                'Content-Type': 'application/json'
            }, 200);
        } else {
            res.send(JSON.stringify(err), {
                'Content-Type': 'application/json'
            }, 404);
        }
    });
});

//When the search is submitted
app.get('/cardsearch', function(req, res){
    var newImgURL = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='
                  + req.query.search
                  + '&type=card';
    
    // pass the URL to the  client
    res.send(newImgURL);
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


game = planechase.startGame();

/* TODO: GET THIS TO WORK WHEN EVER I REQUEST AN UPDATE
pythonShell.run('LoadSets.py', function (err) {
  if (err) throw err;
  console.log('LoadSets.py has Finished');
});
*/

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {
    
  socket.on('Planechase.pageLoaded', function(){
      pl('Planechase.pageLoaded');
      //TODO:NEED SELECTED
      socket.emit('server.pageLoaded.receivedResponse', 
                  { "shownCard" : game.getShownCard(),
                    "revealed" : game.getRevealed() });
  });
  
  socket.on('Planechase.btnNewGame.click', function(res){
      pl('Planechase.btnNewGame.click');
      game = planechase.startGame();
      io.emit('server.btnNewGame.click.receivedResponse', game.getShownCard());
  });
  
  socket.on('Planechase.btnRoll.click', function(res){
      pl('Planechase.btnRoll.click');
      socket.broadcast.emit('server.btnRoll.click.receivedResponse', res);
  });
  
  socket.on('Planechase.btnPlanesWalk.click', function(){
      pl('Planechase.btnPlanesWalk.click');
      io.emit('server.btnPlanesWalk.click.receivedResponse', game.planesWalk());
  });
  
  socket.on('Planechase.tdRevealedCard.click', function(res){
      pl('Planechase.tdRevealedCard.click');
      io.emit('server.tdRevealedCard.click.receivedResponse', res);
  });
  
  socket.on('Planechase.btnRevealNextCard.click', function(){
      pl('Planechase.btnRevealNextCard.click');
      io.emit('server.btnRevealNextCard.click.receivedResponse', game.revealNextCard());
  });
  
  socket.on('Planechase.btnPutOnTop.click', function(res){
      pl('Planechase.btnPutOnTop.click');
      io.emit('server.btnPutOnTop.click.receivedResponse', 
              game.putCardsOnTop(res));
  });
  
  socket.on('Planechase.btnPutOnBottom.click', function(res){
      pl('Planechase.btnPutOnBottom.click');
      io.emit('server.btnPutOnBottom.click.receivedResponse', 
              game.putCardsOnBottom(res));
  });
  
  socket.on('Planechase.btnDiscard.click', function(res){
      pl('Planechase.btnDiscard.click');
      io.emit('server.btnDiscard.click.receivedResponse', 
              game.discardCards(res));
  });
  
});
