$(document).ready(function() {
  console.log("Ready!")

  const NUM_DECKS_IN_SHOE = 1;
  const PLAYER_ID = 'player';
  const DEALER_ID = 'dealer';
  const PLAYER_SCORE_ID = 'player-score';
  const DEALER_SCORE_ID = 'dealer-score';
  const WINNER_RESULT_ID = 'winner-result';
  const HOLE_CARD_ID = 'hole-card'
  const CARD_BACK_PIC = "imgs/cards/back.jpg";
  const HIDDEN_SCORE = "??";
  const HIDE = 1;
  const SHOW = 2;

  var shoe = [];
  var dealerHand;
  var playerHand;
//  var currentPlayer = PLAYER_ID;
  var currentHoleCard;

  //var deck = [];
  var cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'ace', 'jack', 'king', 'queen'];
  var cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'];

  var Card = function(opts) {
    this.stringValue = opts.stringValue;
    this.suit = opts.suit; 
    this.facedown = (opts.hasOwnProperty('facedown') ? opts.facedown : false);
    this.cssId = `${opts.stringValue}${opts.suit}_${randomNumber(9000)}` 
//    this.getUrl = () => {  `imgs/cards/${this.stringValue}_of_${this.suit}.png` }
  }

  Card.prototype.getUrl = function(forceFaceUp) {
    return ((!this.facedown || forceFaceUp) ? `imgs/cards/${this.stringValue}_of_${this.suit}.png` : CARD_BACK_PIC);
  }

  Card.prototype.showCard = function() {
    $(`#${this.cssId}`).attr('src', this.getUrl(true));
  }

/*
  Card.prototype.hideCard = function() {
    $(`#${this.css_id}`).src = CARD_BACK_GIF;
  }
*/

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
    this.scoreId = (player === DEALER_ID ? DEALER_SCORE_ID : PLAYER_SCORE_ID);
    this.scoreDisplayState = (player === DEALER_ID ? HIDE : SHOW);
    console.log("cards = ", this.cards);
  }

  Hand.prototype.addCard = function(card) {
    this.cards.push(card);
  }

  Hand.prototype.setDisplayState = function(state) {
    this.scoreDisplayState = state;
  }

  Hand.prototype.hasBlackJack = function() {
    var ace;
    var tenCard;
    if (this.cards.length == 2) {
      this.cards.forEach(function(card) {
        var currVal = card.getPoints();
        if (currVal === 'ace') {
          ace = 1;
        } else if (currVal === 10) {
          tenCard = 1;
        }
      });
    }
    return (ace && tenCard);
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
      totalPoints = (highNum <= 21 ? highNum : lowNum);
    }
    return totalPoints;
  }

  Hand.prototype.busted = function() {
    return (this.totalPoints() > 21);
  }

  Hand.prototype.displayPoints = function() {
    //var points = this.totalPoints()
    //debugger;
    var score;
    if (this.scoreDisplayState === HIDE) {
      console.log("displayState is hidden!");
      score = HIDDEN_SCORE;
    } else {  
      console.log("displayState is NOT hidden");
      score = this.totalPoints(); 
    }
    $(`#${this.scoreId}`).html(this.scoreDisplayState === HIDE ? HIDDEN_SCORE : this.totalPoints());
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

  var randomNumber = function(length) {
    return Math.floor(Math.random()*length);
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
  var dealCard = function(player, isHoleCard) {
    if (!shoe.length) {
      populateShoe(NUM_DECKS_IN_SHOE);
    }
    var card = shoe.pop();
    if (isHoleCard !== undefined) {
      card.facedown = isHoleCard;
    }
    var $cardImage = $('<img>').attr('src', card.getUrl());
    $cardImage.attr('id', card.cssId);
    if (isHoleCard) {
      currentHoleCard = card;
    }
    //console.log("imge = ", $cardImage);
    $(`#${player} .cards`).append($cardImage);

    if (player === PLAYER_ID) {
      playerHand.addCard(card);
      playerHand.displayPoints();
    } else {
      dealerHand.addCard(card);
      dealerHand.displayPoints();
    }
  }

  var dealPlayerCard = function() {
    dealCard(PLAYER_ID);
    if (playerHand.busted()) {
      endPlayerTurn();
      endGame();
    }
  }

  var hideHoleCard = function() {
    console.log("in hideHoleCard. cssId =", currentHoleCard.cssId);
    $(`#${currentHoleCard.cssId}`).attr('src', CARD_BACK_PIC);
  }

  var peekAtHoleCard = function() {
    var cardUrl= currentHoleCard.getUrl(true);
    var cardCssId = currentHoleCard.cssId;
    var $img = $(`#${currentHoleCard.cssId}`).attr('src', cardUrl);
    setTimeout(hideHoleCard, 2000);
  }

  var resetHands = function() {
    dealerHand = new Hand(DEALER_ID);
    playerHand = new Hand(PLAYER_ID);
  }

  var clearBoard = function() {
    $('.cards img').remove();
    $(`#${PLAYER_SCORE_ID}`).text('0');
    $(`#${DEALER_SCORE_ID}`).text('0');
    $(`#${WINNER_RESULT_ID}`).text('');
  }

  var newGame = function() {
    resetHands();
    clearBoard();
    removePlayerButtonEvents();
    setPlayerButtonEvents();
    dealCard(PLAYER_ID);
    dealCard(DEALER_ID, true);
    dealCard(PLAYER_ID);
    dealCard(DEALER_ID);

    if (dealerHand.hasBlackJack()) {
      endPlayerTurn();
      endGame();
    }
    //check for blackjack!!
//    currentPlayer = PLAYER_ID;
  }

  var completeDealerHand = function() {
    var dealerScore = dealerHand.totalPoints();
    while (dealerScore < 17) {
      dealCard(DEALER_ID);
      dealerScore = dealerHand.totalPoints();
    }
  }

  var pickWinner = function() {
    var dealerScore = dealerHand.totalPoints();
    var playerScore = playerHand.totalPoints();
    if (playerScore > 21) {
      return DEALER_ID;
    }
    if (dealerScore > 21) {
      return PLAYER_ID;
    } 

    var dealerHasBlackJack = dealerHand.hasBlackJack();
    var playerHasBlackJack = playerHand.hasBlackJack();
    var winner;

    if (dealerHasBlackJack || playerHasBlackJack)  {
      if (dealerHasBlackJack && !playerHasBlackJack) {
        winner = DEALER_ID;
      } else if (!dealerHasBlackJack && playerHasBlackJack) {
        winner = PLAYER_ID;
      }
    }

    if (!winner) {

      winner = ( (dealerScore >= playerScore) ? DEALER_ID : PLAYER_ID );
    }

    return winner;
  }

  var endPlayerTurn = function() {
    console.log("END PLAYER TURN")
    currentHoleCard.showCard();
    removePlayerButtonEvents();
  }

  var endGame = function() {
    var winner = pickWinner();
    $(`#${DEALER_SCORE_ID}`).text(dealerHand.totalPoints());
    $(`#${WINNER_RESULT_ID}`).text(winner);
  }

  var playDealer = function() {
    endPlayerTurn();
//    currentPlayer = DEALER_ID;
    completeDealerHand();
    endGame();
  }

  var removePlayerButtonEvents = function() {
    $('#hit').off('click', dealPlayerCard);
    $('#stand').off('click', playDealer);
    $('#peek').off('click', peekAtHoleCard);
  }

  var setPlayerButtonEvents = function() {
    $('#hit').on('click', dealPlayerCard);
    $('#stand').on('click', playDealer);
    $('#peek').on('click', peekAtHoleCard);
  }

  var initGame = function() {
    resetHands();
    //console.log("playerHand = ", playerHand);
    populateShoe(NUM_DECKS_IN_SHOE);
  }

  initGame();

  $('#new-game').on('click', newGame);

 //shoe = buildCardDeck();
// card1 = deck[0];
// console.log("url = ", card1.getUrl());
// console.log("deckUrl = ", deck);
 //deck.forEach((card) => { console.log(card)});

})