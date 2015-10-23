function pl(msg) {
    console.log('DEBUG->'+msg);
}

var db_mgmt = require('./db_mgmt.js');
var qrys = require('./queries.js');

    
var faceDownCard = {
		src: '/images/planechase/Planechase_Back.jpg'
};


var user_actions_queue;//TODO:IMPLEMENT
var revealed = [];
var currCard = faceDownCard;
var shownCard;

exports.cardListRes = db_mgmt.getQryResFunc(qrys.planechaseQuery);

//TODO:GIVE SEPARATE GAME IDs
exports.startGame = function(/*GAME_ID*/){
    this.deck = [];
    this.currCard = faceDownCard;
    this.discard = [];
    this.revealed = [];
    this.shownCard = currCard;
    
    this.getRevealed         = getRevealed;
    this.putCardsOnTop       = putCardsOnTop;
    this.putCardsOnBottom    = putCardsOnBottom;
    this.discardCards        = discardCards;
    this.getShownCard        = getShownCard;
    this.showCard            = showCard;
    this.resetCard           = resetCard;
    this.checkDeck           = checkDeck;
    this.planesWalk          = planesWalk;
    this.loadDeck            = loadDeck;
    this.revealNextCard      = revealNextCard;
    this.drawAndShowNextCard = drawAndShowNextCard;
    
    this.loadDeck();
    
    return this;
}

//Returns all the revealed cards so that they can be updated on all screens
function revealNextCard() {
    var thisObj = this;
    //Check the deck if there is anything in it
    this.checkDeck(function(){
      var nextCard = thisObj.deck.pop();
      thisObj.revealed.push(nextCard);
    });
    
    return this.getRevealed();
};

function putCardsOnTop(cards){
  var thisObj = this;
  cards.forEach(function(card){
    //pushing puts the card on the top
    thisObj.deck.push(card);
    removeCardFromArr(thisObj.revealed, card.mid)
  });
  return this.getRevealed();
}

function putCardsOnBottom(cards){
  var thisObj = this;
  cards.forEach(function(card){
    //unshifting puts the card on the bottom
    thisObj.deck.unshift(card);
    removeCardFromArr(thisObj.revealed, card.mid)
  });
  return this.getRevealed();
}

function discardCards(cards){
  var thisObj = this;
  cards.forEach(function(card){
    thisObj.discard.push(card);
    removeCardFromArr(thisObj.revealed, card.mid)
  });
  return this.getRevealed();
}

function removeCardFromArr(set, mid){
    var i = indexOfCardMid(set, mid);
    if(i > -1){
        set.splice(i,1);
    }
}

function showCard(card) {
  this.shownCard = card;
  return this.shownCard;
};

function resetCard() {
  return this.showCard(this.currCard);
};

function planesWalk() {
  //Put revealed cards on the bottom of the deck
  this.deck = this.revealed.concat(this.deck);
  this.revealed = [];
  
  this.drawAndShowNextCard();
  return this.shownCard;
};

function getShownCard(){
	return this.shownCard;
}

function getRevealed(){
  return this.revealed;
}

function drawAndShowNextCard() {
    var thisObj = this;
    //Check the deck to make sure it is set up, then when it
    //is done, run the callback function
    this.checkDeck(function() {
        var nextCard = thisObj.deck.pop();
        //Check if there is a currCard
        if(thisObj.currCard != faceDownCard)
            thisObj.discard.push(thisObj.currCard);
        
        thisObj.currCard = nextCard;
        
        thisObj.showCard(nextCard);
    });
};

//This function makes sure that there are still cards left
//in the deck, then executes the callback
function checkDeck(callback) {
    if(this.deck.length < 1) {
        if(this.discard.length > 0) {
            //TODO:MAKE THIS MORE OBVIOUS
            console.log('Shuffling discard back into deck');
            this.deck = shuffle(this.discard);
            this.discard = [];
            if(callback)
                callback();
        } else if(this.revealed.length > 0) {
            //TODO:MAKE THIS MORE OBVIOUS
            console.log('All Cards Are Currently Revealed');
        } else {
            //Else means that the deck is empty and there is nothing in
            //the discard pile, and nothing is revealed. Meaning:
            //No cards anywhere
            this.loadDeck(callback);
        }
    } else {
        if(callback)
            callback();
    }
};

//TODO:MAKE MORE GENERIC
function loadDeck(callback) {
    thisObj = this;
    db_mgmt.queryDB(qrys.planechaseQuery, function(data) {
            if(data) {
                data = JSON.parse(data);
                
                thisObj.deck = 
                     data.map(function (el) {
                                return {
                                    name: el.Name,
                                     mid: el.Multiverse_ID
                                       };
                             });
                thisObj.deck = shuffle(thisObj.deck);
                if(callback)
                    callback();
            }
        });
}

/////////////////////////////////////////////////////////
//TODO:PUT THESE NEXT FUNCTIONS INTO THEIR OWN LIBRARY
/////////////////////////////////////////////////////////

function indexOfCardMid(cards, mid){
    index = -1;
    currIndex = 0;
    cards.forEach(function(card){
        if(card.mid === mid){
            index = currIndex;
        }
        currIndex++;
    });
    return index;
}

//TODO:PUT THIS INTO ITS OWN LIBRARY
function rollDie(sides) {
    return getRandInt(1, sides);
};

function getRandInt(min, max) {
    return Math.floor(min + (Math.random() * max));
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};