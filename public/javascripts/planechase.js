function pl(msg) {
    console.log('DEBUG->'+msg);
};

$(function(){
    var currImgURL = "";
    var tblRevealedCardsID = "#tblPlanechaseRevealedCards";
    
    // creating a new websocket
    var socket = io.connect('http://thisguy.website:12121/');
    socket.emit('Planechase.pageLoaded');
    socket.on('server.pageLoaded.receivedResponse', function (data) {
        showCard(data.shownCard);
        //Loop through each revealed card
        data.revealed.forEach(function(card){
          addRevealedCard(card);
        });
    });
    
    $('#btnNewGame').click(function(e){
        socket.emit('Planechase.btnNewGame.click');
    });
    socket.on('server.btnNewGame.click.receivedResponse', function (data) {
        showCard(data);
        removeRevealedCards();
    });
    
    $('#btnPlanesWalk').click(function(e){
        socket.emit('Planechase.btnPlanesWalk.click');
    });
    socket.on('server.btnPlanesWalk.click.receivedResponse', function (data) {
        showCard(data);
        removeRevealedCards();
    });
    
    $('#btnRollPlanarDie').click(function(e){
        socket.emit('Planechase.btnRoll.click', rollPlanarDie());
    });
    socket.on('server.btnRoll.click.receivedResponse', function (data) {
        rollPlanarDie(data);
    });
    
    $('#btnRevealNextCard').click(function(e){
        socket.emit('Planechase.btnRevealNextCard.click');
    });
    socket.on('server.btnRevealNextCard.click.receivedResponse', function (data) {
        updateRevealedCards(data);
    });
    
    socket.on('server.tdRevealedCard.click.receivedResponse', function (data) {
        currTd = $('#tdRevealedCard' + data.card.mid);
        //If selected, then do the opposite
        toggleTdSelect(currTd, !data.selected);
    });
    
    $('#btnPutOnTop').click(function(e){
        socket.emit('Planechase.btnPutOnTop.click', getSelectedCards());
    });
    socket.on('server.btnPutOnTop.click.receivedResponse', function (data) {
        updateRevealedCards(data);
        $('#tblRevealedButtons').hide();
        $('#tblPlaneChaseButtons').show();
    });
    
    $('#btnPutOnBottom').click(function(e){
        socket.emit('Planechase.btnPutOnBottom.click', getSelectedCards());
    });
    socket.on('server.btnPutOnBottom.click.receivedResponse', function (data) {
        updateRevealedCards(data);
        $('#tblRevealedButtons').hide();
        $('#tblPlaneChaseButtons').show();
    });
    
    $('#btnDiscard').click(function(e){
        socket.emit('Planechase.btnDiscard.click', getSelectedCards());
    });
    socket.on('server.btnDiscard.click.receivedResponse', function (data) {
        updateRevealedCards(data);
        $('#tblRevealedButtons').hide();
        $('#tblPlaneChaseButtons').show();
    });
    
    
    
    function showCard(card) {
        //Hiding the old card so that it can slide down the new card
        $('#imgCard').hide();
        //Set the current image, so that we can put it back
        currImgURL = getCardURL(card);
        $('#imgCard').attr('src', currImgURL).load(function() {
            $('#imgCard').slideDown("slow");
        });
        //Add the card as an attribute of the image
        $('#imgCard').data('card', card);
    }
    
    function addRevealedCard(card){
      if(card){
        tblRevealedCards = $(tblRevealedCardsID);
        
        //No revealedCards yet. This counts the number of tr's
        if($(tblRevealedCardsID + ' tbody > tr').length === 0){
            tblRevealedCards.append('<tr>');
        //else if there are too many in the current row
        } else if ($(tblRevealedCardsID + ' tr:last-child > td').length >= 8){
            tblRevealedCards.append('<tr>');
        }
        
        //Add a new cell for the new revealed card.
        $(tblRevealedCardsID + ' tr:last-child').append('<td>')
        $(tblRevealedCardsID + ' tr:last-child td:last-child').append('<img>');
        //grab the new image and td tag
        var newImg = $(tblRevealedCardsID + ' tr:last-child td:last-child img:last-child');
        var newTd = $(tblRevealedCardsID + ' tr:last-child td:last-child');
        //Create URL for the new card
        var cardURL = getCardURL(card);
        
        //adding it to the src of the td to simplify code
        newImg.attr('src', cardURL);
        newTd.attr('src', cardURL);
        //.data() stringifies the card object
        newTd.data('card', card);
        newTd.attr('id', 'tdRevealedCard' + card.mid);
        
        //Adding Event Handlers for the new image/td
        newTd.hover(
            function(){
                $('#imgCard').attr('src', $(this).attr('src'));
            }, function(){
                $('#imgCard').attr('src', currImgURL);
            });
        newTd.click(function(){
            //Need to refresh the td to get it's current selection status
            currTd = $('#tdRevealedCard' + card.mid);
            selected = currTd.hasClass('selectedTd');
            socket.emit('Planechase.tdRevealedCard.click', {"card":card,
                                                            "selected":selected});
        });
      }
    }
    
    function rollPlanarDie(data) {
        //This is mainly for making sure that data is a number
        if(data <= 6) {
            var rollValue = data;
        } else {
            var rollValue = rollDie(6);
        }
            
        lblPlanarDieStatus.value = "";
        
        $( "#lblPlanarDieStatus" ).effect('shake', function(e){
            switch(rollValue) {
                case 1:
                    lblPlanarDieStatus.value = 'Planes Walk';
                    break;
                case 2:
                    lblPlanarDieStatus.value = 'Chaos';
                    break;
                default:
                    lblPlanarDieStatus.value = 'Blank';
                    break;
            }
        });
        return rollValue;
    }
    
    //This function will add new cards
    function updateRevealedCards(cards){
      //This adds all new revealed cards, and creates a list of card IDs
      var cardIDs = [];
      cards.forEach(function(card){
        cardIDs.push(card.mid);
        //If an td does not exist with this ID, then create it
        if(! $("#tdRevealedCard" + card.mid).length){
          addRevealedCard(card);
        }
      });
      
      //This next chunk of code removes all extra TDs
      var tdMIDs = [];
      //Loop through the TDs
      $(tblRevealedCardsID + ' td').each(function(i, td){
        var tdMID = getMidFromTD($(td));
        tdMIDs.push(tdMID);
        
        //Find if TD in cardIDs
        if(cardIDs.indexOf(tdMID) === -1){
          //Remove TD
          $(td).remove();
        }
      });
    }
    
    function toggleTdSelect(td, select){
        //If the card that has been clicked is already selected, then unselect
        //it by removing the css
        if(select){
            td.addClass('selectedTd');
        }else{
            td.removeClass('selectedTd');
        }
        
        //If there is something selected, then show Revealed Cards buttons,
        //and hide the normal planechase buttons
        if($(tblRevealedCardsID + ' td.selectedTd').length > 0){
            $('#tblRevealedButtons').show();
            $('#tblPlaneChaseButtons').hide();
        }else{
            $('#tblRevealedButtons').hide();
            $('#tblPlaneChaseButtons').show();
        }
    }
    
    function getSelectedCards(){
      selectedCards = [];
      //Loop through selected cards, to add them to the id list
      $(tblRevealedCardsID + ' td.selectedTd').each(function(i, td){
        var card = $(td).data('card');
        selectedCards.push(card);
      });
      return selectedCards;
    }
    
    function removeRevealedCards(){
      $(tblRevealedCardsID).empty();
      $('#tblRevealedButtons').hide();
      $('#tblPlaneChaseButtons').show();
    }
    
    function getMidFromTD(td){
      return td.data('card').mid;
    }
    
    function getCardURL(card) {
        var cardURL = ""
        if(card.mid){
            cardURL = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+card.mid+'&type=card';
        //SRC is for the card images that don't have an mid
        }else if(card.src) {
            cardURL = card.src;
        }
        return cardURL;
    };
});