$(document).ready(function() {
  console.log("Ready!")

  var NUM_DECKS_IN_SHOE = 1;
  var PLAYER_ID = 'player';
  var DEALER_ID = 'dealer';
  var PLAYER_SCORE_ID = 'player-score';
  var DEALER_SCORE_ID = 'dealer-score';

  var shoe = [];
  var dealerHand;
  var playerHand;
  var current_player = PLAYER_ID;

  //var deck = [];
  var cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'ace', 'jack', 'king', 'queen'];
  var cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'];

  var Card = function(opts) {
    this.stringValue = opts.stringValue;
    this.suit = opts.suit; 
//    this.getUrl = () => {  `imgs/cards/${this.stringValue}_of_${this.suit}.png` }
  }

  Card.prototype.getUrl = function() {
    return `imgs/cards/${this.stringValue}_of_${this.suit}.png`;
  }

  Card.prototype.getPoints = function() {
    if (['jack', 'king', 'queen'].includes(this.stringValue)) {
      return 10;
    } else if (this.stringValue === 'ace') {
      return 'ace';
    } else {
      return parseInt(this.stringValue);
    }
  }

  var Hand = function(player) {
    this.player = player;
    this.cards = [];
    this.score_id = (player === DEALER_ID ? DEALER_SCORE_ID : PLAYER_SCORE_ID);
    console.log("cards = ", this.cards);
  }

  Hand.prototype.addCard = function(card) {
    this.cards.push(card);
  }

  Hand.prototype.totalPoints = function() {
    var totalPoints = 0;
    //var doubles = [];
    var numAces = 0;
    var currPoints;
      console.log("in Totalpoints. this = ", this);
      //console.log("in Totalpoints. cards = ", cards);
    console.log("in Totalpoints. this.cards = ", this.cards);
    for (let i=0; i<this.cards.length; i++) {
      currPoints = this.cards[i].getPoints();
      if (typeof currPoints === 'number') {
        totalPoints += currPoints;
      } else {
        //Otherwise it's an ace represented by an array of possible values
        //doubles.push(currPoints);
        numAces++;
      }
    }

    /** Aces can be 1 or 11. Since 11*2 = 22, there can only be one ace
    worth 11 points. If the hand has one ace set the point value to
    11 if the combined points is <= 21, else set it to 1. If the hand 
    has more than one Ace, check to see if using 11 points for an ace 
    would still be <= 21. If so use the higher value, otherwise, 
    use the lower value 
    */
    if (numAces === 1) {
      totalPoints += (totalPoints <= 10 ? 11 : 1);
    } else if (numAces > 1) {
      var highNum = totalPoints + 11 + numAces -1; //one ace is 11 all others are 1
      var lowNum = totalPoints + numAces; //all aces are 1
      totalPoints += (highNum <= 21 ? highNum : lowNum);
    }
    return totalPoints;
  }

  Hand.prototype.displayPoints = function() {
    //var points = this.totalPoints()
    $(`#${this.score_id}`).html(this.totalPoints());
  }

  //Fisher–Yates shuffle
  var shuffle = function(arr) {
    for (var i=arr.length-1; i>0; i--) {
      var j = Math.floor(Math.random()*i);
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  } 

  var buildCardDeck = function() {
    var cardDeck = [];
    for (let i=0; i<cardValues.length; i++) {
      for (let j=0; j<cardSuits.length; j++) {
        //console.log("Building card deck", cardValues[i], cardSuits[j]);
        cardDeck.push(new Card({ stringValue: cardValues[i], suit: cardSuits[j] }));
      }
    }
    return cardDeck;
  }

  var populateShoe = function(numDecks) {
    var deck;
    shoe = [];
    for (let i=numDecks; i>0; i--) {
      deck = buildCardDeck();
      shoe = shoe.concat(deck); 
    }
    console.log("shoe length = ", shoe.length);
    shuffle(shoe);
  }

/*
  var getRandomCardFromShoe = function() {
    var rand = Math.floor(Math.random()*shoe.length);
    var card = shoe[rand];
    console.log('in getRandom. crad = ', card);
    //remove the card from the shoe
    shoe.splice(rand, 1);
    return card;
  }
*/
  var dealCard = function(player) {
    if (!shoe.length) {
      populateShoe(NUM_DECKS_IN_SHOE);
    }
    var card = shoe.pop();
    var $cardImage = $('<img>').attr('src', card.getUrl());
    console.log("imge = ", $cardImage);
    $(`#${player} .cards`).append($cardImage);

    if (player === PLAYER_ID) {
      playerHand.addCard(card);
      playerHand.displayPoints();
    } else {
      dealerHand.addCard(card);
      dealerHand.displayPoints();
    }
  }

  var startHand = function() {
    dealCard(PLAYER_ID);
    dealCard(DEALER_ID);
    dealCard(PLAYER_ID);
    dealCard(DEALER_ID);
    currPlayer = PLAYER_ID;
  }

  dealerHand = new Hand(DEALER_ID);
  playerHand = new Hand(PLAYER_ID);

  console.log("playerHand = ", playerHand);

  populateShoe(NUM_DECKS_IN_SHOE);

  $('#hit').on('click', function(event) {
    //var currPlayer = 'player';
    dealCard(PLAYER_ID);
  });

  $('#new-game').on('click', startHand);

 //shoe = buildCardDeck();
// card1 = deck[0];
// console.log("url = ", card1.getUrl());
// console.log("deckUrl = ", deck);
 //deck.forEach((card) => { console.log(card)});


})