$(document).ready(function() {
  console.log("Ready!")

  //To Do
  //Check if user is has 21 after dealing a hand
  //put delay so that so that user can see the dealer's hand before winner or loser disaplays
  //betting
  //keep track of number of player/dealer wins

  const NUM_DECKS_IN_SHOE = 1;
  const PLAYER_ID = 'player';
  const DEALER_ID = 'dealer';
  const PLAYER_SCORE_ID = 'player-score';
  const DEALER_SCORE_ID = 'dealer-score';
  const WINNER_RESULT_ID = 'winner-result';
  const HOLE_CARD_ID = 'hole-card'
  const CARD_BACK_PIC = "imgs/cards/back.jpg";
  const HIDDEN_SCORE = "?";
  const WINNER_PIC_ID = 'winner-pic';
  const LOSER_PIC_ID = 'loser-pic';
  const STAND_BUTTON_ID = "stand";
  const HIT_BUTTON_ID = "hit";
  const PEEK_BUTTON_ID = "peek";
  const NEW_HAND_BUTTON_ID = "new-hand";
  const NEW_GAME_BUTTON_ID = "new-game";
  const CURRENT_BET_ID = "current-bet";
  const PLAYER_NUM_WINS_ID = "player-num-wins";
  const DEALER_NUM_WINS_ID = "dealer-num-wins";
  const PLAYER_CASH_ID     = "player-cash";
  const HELP_BUTTON_ID     = "help-button";
  const HELP_TEXT_ID       = "help-text";
  const CLOSE_HELP_ID      = "close-help";
  const ERROR_DIV_ID       = "error-div";
  const ERROR_TEXT_ID      = "error-text";
  const CLOSE_ERROR_ID     = "close-error";

  const ANIMATION_END = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
  const HIDE = 1;
  const SHOW = 2;
  const END_ANIMATION_TIME = 2000;
  const MAX_BET = 20;
  const DEFAULT_BET = 10;
  const STARTING_CASH = 100;

  //JQuery objects
  var $hitButton =  $(`#${HIT_BUTTON_ID}`);
  var $standButton = $(`#${STAND_BUTTON_ID}`);
  var $peekButton = $(`#${PEEK_BUTTON_ID}`);
  var $newHandButton = $(`#${NEW_HAND_BUTTON_ID}`);
 
  var $playerScore = $(`#${PLAYER_SCORE_ID}`);
  var $dealerScore = $(`#${DEALER_SCORE_ID}`);
  var $playerNumWins = $(`#${PLAYER_NUM_WINS_ID}`);
  var $dealerNumWins = $(`#${DEALER_NUM_WINS_ID}`);
  var $playerCash = $(`#${PLAYER_CASH_ID}`);
  var $winnerResult = $(`#${WINNER_RESULT_ID}`);
  var $winnerPic = $(`#${WINNER_PIC_ID}`);
  var $loserPic = $(`#${LOSER_PIC_ID}`);
  var $currentBet = $(`#${CURRENT_BET_ID}`);
  var $helpButton = $(`#${HELP_BUTTON_ID}`);
  var $helpText = $(`#${HELP_TEXT_ID}`);
  var $closeHelp = $(`#${CLOSE_HELP_ID}`);
  var $errorDiv = $(`#${ERROR_DIV_ID}`);
  var $errorText = $(`#${ERROR_TEXT_ID}`);
  var $closeError = $(`#${CLOSE_ERROR_ID}`);

  var shoe = [];
  var dealerHand;
  var playerHand;
  var currentHoleCard;
  var playerCash = STARTING_CASH;
  var dealerNumWins = 0;
  var playerNumWins = 0;
  var currentBet;

  var cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'ace', 'jack', 'king', 'queen'];
  var cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'];

  //function taken directly from animate.css documentation
  $.fn.extend({
      animateCss: function (animationName) {
          //var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          $(this).addClass('animated ' + animationName).one(ANIMATION_END, function() {
              $(this).removeClass('animated ' + animationName);
          });
      },
      animateAndRemoveCss: function (animationName, imageId) {
          //var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          $(this).addClass('animated ' + animationName).one(ANIMATION_END, function() {
              $(this).removeClass('animated ' + animationName);
              $(this).hide();
          });
      }
  });

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
      //console.log("in Totalpoints. this = ", this);
      //console.log("in Totalpoints. cards = ", cards);
    //console.log("in Totalpoints. this.cards = ", this.cards);
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
      score = HIDDEN_SCORE;
      console.log("SHOWING PEEK BUTTON for player: ", this.player);
      $peekButton.show();
    } else {  
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
    var $cardImage = $('<img>').attr('src', card.getUrl()).attr('id', card.cssId).addClass('animated rollIn');
   // $cardImage.attr('id', card.cssId);
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
    //console.log("in hideHoleCard. cssId =", currentHoleCard.cssId);
    $(`#${currentHoleCard.cssId}`).attr('src', CARD_BACK_PIC).addClass('animated flipInY');
  }

  var peekAtHoleCard = function() {
    var cardUrl= currentHoleCard.getUrl(true);
    var cardCssId = currentHoleCard.cssId;
    var $img = $(`#${currentHoleCard.cssId}`).attr('src', cardUrl).addClass('animated flipInY');
    setTimeout(hideHoleCard, 2000);
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
      } else {
        //push. TODO implement push
      }
    }

    if (!winner) {

      winner = ( (dealerScore >= playerScore) ? DEALER_ID : PLAYER_ID );
    }

    return winner;
  }


  var removeDealerWins = function() {
    $loserPic.animateAndRemoveCss('bounceOut');
  //  $(`#${LOSER_PIC_ID}`).hide();
  }

  var removePlayerWins = function() {
    $winnerPic.animateAndRemoveCss('bounceOut');
   // $(`#${WINNER_PIC_ID}`).hide();
  }

  var displayDealerWins = function() {
    $winnerResult.text("Dealer wins!");
    $loserPic.show().animateCss('zoomIn');
    window.setTimeout(removeDealerWins, END_ANIMATION_TIME);
  }

  var displayPlayerWins = function() {
    $winnerResult.text("Player wins!");
    $winnerPic.show().animateCss('zoomIn');
    window.setTimeout(removePlayerWins, END_ANIMATION_TIME);

  }

  var displayDealerStats = function() {
    $numDealerWins.html(numDealerWins);
  }

  var displayStats = function() {
    console.log("player Cash = ", playerCash);
    $playerCash.html(playerCash);
    $playerNumWins.html(playerNumWins);
    $dealerNumWins.html(dealerNumWins);
  }

  var endPlayerTurn = function() {
    console.log("END PLAYER TURN")
    currentHoleCard.showCard();
    $peekButton.hide();
    removePlayerButtonEvents();
  }

  var endGame = function() {
    var winner = pickWinner();
    console.log("In endGame!. winner = ", winner);
    console.log("currentBet = ", currentBet);
    $dealerScore.text(dealerHand.totalPoints());
    $winnerResult.text(winner);
    if (winner === DEALER_ID) {
      dealerNumWins++;
      playerCash -= currentBet;
      displayDealerWins();
    }
    else {
      playerNumWins++;
      playerCash += currentBet;
      displayPlayerWins();
    }
    displayStats();
    enableNewHandButton();
  }

  var playDealer = function() {
    endPlayerTurn();
//    currentPlayer = DEALER_ID;
    completeDealerHand();
    endGame();
  }

  var removePlayerButtonEvents = function() {
    $hitButton.off('click', dealPlayerCard);
    $standButton.off('click', playDealer);
    $peekButton.off('click', peekAtHoleCard);
//    $newHandButton.off('click', newHand);
  }

  var setPlayerButtonEvents = function() {
    $hitButton.on('click', dealPlayerCard);
    $standButton.on('click', playDealer);
    $peekButton.on('click', peekAtHoleCard);
//    $newHandButton.on('click', newHand);
  }

  var resetPlayerButtenEvents = function() {
    removePlayerButtonEvents();
    setPlayerButtonEvents();
  }

  var disableNewHandButton = function() {
    console.log("DISABLING NewHandButton!!");
    $newHandButton.off('click', newHand);
    $newHandButton.removeClass('play-hand').addClass('disabled');
  }

  var enableNewHandButton = function() {
    console.log("ENABLING NewHandButton!!")
    $newHandButton.on('click', newHand);
    $newHandButton.removeClass('disabled').addClass('play-hand');
  }

  var resetNewHandButton = function() {
    disableNewHandButton();
    enableNewHandButton();
  }


  var resetHands = function() {
    dealerHand = new Hand(DEALER_ID);
    playerHand = new Hand(PLAYER_ID);
  }

  var clearBoard = function() {
    $('.cards img').remove();
    $playerScore.text('0');
    $dealerScore.text('0');
    $winnerResult.text('');
    $winnerPic.hide();
    $loserPic.hide();
  }

  var showPlayerCash = function() {
    $playerCash.html(playerCash);
  }

  var showPlayerWins = function() {
    $playerNumWins.html(playerNumWins);
  }

  var showErrorMessage = function(error) {
    $errorText.html(error);
    $errorDiv.show();
  }

  var hideErrorMessage = function(error) {
    $errorText.html("");
    $errorDiv.hide();
  }

  var betValid = function(bet) {
    var betValue = parseInt(bet);
    var error;
    if (typeof betValue !== "number") {
      error = "Bet must be a number";
    } else if (betValue >  MAX_BET) {
      error = `Bet cannot be greater than ${MAX_BET}`;
    } else if (betValue > playerCash) {
      error = "You don't have that much cash to bet!";
    } else if (betValue === 0) {
      error = "You must bet more than 0!";
    }

    console.log("in betValid. error = ", error);
    return (error ? error : true);
  }

  var newHand = function() {
    console.log("In New Hand!!");
    var bet = $currentBet.val();
    console.log("current bet = ", bet);
    var betStatus;
    var betInt;
    if (bet) {
      betInt =  parseInt(bet);
      betStatus = betValid(betInt);
    } else {
      console.log("Did not place a bet");
      showErrorMessage("You must place a bet!");
      return;
    }

    console.log("betStatus = ", betStatus);

    if (betStatus === true) {
      console.log("Dealing hands");
      disableNewHandButton();
      currentBet = betInt;
      resetHands();
      clearBoard();
      removePlayerButtonEvents();
      setPlayerButtonEvents();
      dealCard(PLAYER_ID);
      dealCard(DEALER_ID, true);
      dealCard(PLAYER_ID);
      dealCard(DEALER_ID);

      if (dealerHand.hasBlackJack() || playerHand.hasBlackJack()) {
        endPlayerTurn();
        endGame();
      }
    }
    else {
      console.log("BAD BET: ", betStatus);
      showErrorMessage(betStatus);
    }
    //check for blackjack!!
//    currentPlayer = PLAYER_ID;
  }

  var startFirstHand = function() {
    console.log("IN startFirstHand!!")
    $newHandButton.html("New Hand");
//    $newHandButton.off('click', newHand);
//    $newHandButton.on('click', newHand);
    $newHandButton.off('click', startFirstHand);
    resetNewHandButton();
    newHand();
  }

  var initStartGameButton = function() {
    $newHandButton.html("Start Game!");
    $currentBet.val(DEFAULT_BET);
    $newHandButton.animateCss('bounceIn');
    $newHandButton.off('click', startFirstHand);
    $newHandButton.on('click', startFirstHand);
    showPlayerCash();
    showPlayerWins();
  }

  var newGame = function() {
    playerCash = STARTING_CASH;
    dealerNumWins = 0;
    playerNumWins = 0;
    resetHands();
    clearBoard();
    populateShoe(NUM_DECKS_IN_SHOE);
    initStartGameButton();
  }

  var showHelp = function() {
   // console.log("Clicked help button")
    $helpText.show();
  }
  var hideHelp = function() {
    $helpText.hide();
  }
  var hideError = function() {
    $errorButton.hide();
  }

  // var initGame = function() {
  //   resetHands();
  //   //console.log("playerHand = ", playerHand);
  //   populateShoe(NUM_DECKS_IN_SHOE);
  // }

  newGame();

  $helpButton.on('click', showHelp);
  $closeHelp.on('click',  hideHelp);
  $closeError.on('click',  hideErrorMessage);

  $(`#${NEW_GAME_BUTTON_ID}`).on('click', newGame);

 //shoe = buildCardDeck();
// card1 = deck[0];
// console.log("url = ", card1.getUrl());
// console.log("deckUrl = ", deck);
 //deck.forEach((card) => { console.log(card)});

})