$(document).ready(function() {
  console.log("Ready!")

  var shoe = [];
  var deck = [];
  var cardValues = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'ace', 'jack', 'king', 'queen'];
  var cardSuits = ['clubs', 'diamonds', 'hearts', 'spades'];

  var Card = function(opts) {
    this.stringValue = opts.stringValue;
    this.suit = opts.suit; 
//    this.getUrl = () => {  `imgs/cards/${this.stringValue}_of_${this.suit}.png` }
  }

  Card.prototype.getUrl = function() {
    return `imgs/cards/${this.stringValue}_of_${this.suit}.png`;
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


 deck = buildCardDeck();
 card1 = deck[0];
 console.log("url = ", card1.getUrl());
// console.log("deckUrl = ", deck);
 //deck.forEach((card) => { console.log(card)});


})