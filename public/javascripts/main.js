function pl(msg) {
    console.log('DEBUG->'+msg);
};
//Print deck
function printDeck(deck) {
    a = [];
    for(i = 0; i < deck.length; i++) 
        a.push(deck[i].name);
    pl(a);
};
    

$(function(){
    
    var deck = [];
    function pd() {
        printDeck(deck);
    };

    
    function CardContr() {
        this.deck = []
    }

    //move this to a card search script
    $('#cardSearch').autocomplete({
        source: function (req, res) {
            $.ajax({
                url: '/cardsearch/member',
                type: 'GET',
                data: req,
                success: function (data) {
                    data = JSON.parse(data);
                    
                    res($.map(data, function (el) {
                        return {
                            label: el.Name,
                            value: el.Multiverse_ID
                        };
                    }));
                }
            });
        },
        
        //Minimum number of characters before the search is performed
        minLength: 1,
            
        // set an onFocus event to show the result on input field when result is focused
        focus: function (event, ui) {
            this.value = ui.item.label;
            //Use the multiverseid to display the image
            showSearchCard(ui.item.value);
            // Prevent other event from not being execute
            event.preventDefault();
        },
            
        // set a close event for when the autocomplete box goes away
        close: function (event, ui) {
            hideSearchCard();
            // Prevent other event from not being execute
            event.preventDefault();
        },
        
        select: function (event, ui) {
            //Empty the search box, and add the card to deck
            this.value = '';
            hideSearchCard();
            //Prevent other event from not being executed
            event.preventDefault();
            //Add the multiverseid to the deck
            addCardToDeck({mid: ui.item.value,
                          name: ui.item.label});
        }
        
    });
    
    $('#cardSearch').on('keyup', function(e){
        if(e.keyCode === 13) {
            //TODO: ADD CARD
            saveDeck();
        };
    });
    
    function saveDeck() {
        $.ajax({
                url: '/save/deck',
                type: 'POST',
                data: JSON.stringify({deck}),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            });
    }
    
    function addCardToDeck(card) {
        deck.push(card);
        pd(deck);
        $('#tblDeck tr:last').after('<tr><td>' + card.name + '</td></tr>');
        
        //TODO: SAVE DECK TO DATABASE EVERY TIME A CARD IS ADDED
        /*var parameters = { mid: mid };
        $.get('/cardsearch',parameters, function(data) {
            jQuery('#imgCard').attr('src', data);
        });*/
    };
    
    function hideSearchCard() {
        $('#imgCard').hide();
    };
    
    function showSearchCard(mid) {
        var cardURL = getCardURL(mid);
        $('#imgCard').attr('src', cardURL);
        $('#imgCard').show();
    };
    
    function getCardURL(mid) {
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+mid+'&type=card';
    };
    
});