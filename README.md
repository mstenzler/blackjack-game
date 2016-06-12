# blackjack-game
Blackjack game in Javascript. Play it at:
http://mstenzler.github.io/blackjack-game/

# User Stories

* As a user, I can start a game by clicking the 'New Game' button
* As a dealer, I will be dealt two cards, one face up and one face down
* As a user, once the game starts, I will will be dealt two cards and will have the option to 'hit' or 'Stand'
* As a user, I can click 'hit' and be delt another card until my total exceeds 21 at which point I will lose the game
* As a user, when I click 'stand', The dealer will be delt a hand and whoever is closest to 21 will be the winner. In the case of a tie, the dealer wins unless the user and dealer have 21 in which case it is a push (nobody wins)
* As a User or a Dealer, an Ace is counted as a 11 if the total count would be less then 22, otherwise as a 1
* As a Dealer, if the hand is lower than 17, the dealer will 'hit'. If the hand is 17 or higher, the dealer will 'stand', If the dealer's hand exceeds 21, the user wins

#Game Overview

This is a one player blackjack game. The user starts out with $100 and places a bet before each hand from $1 to $20 (the default is set to $10). The user then clicks 'start game' or 'new hand'.  Two cards are delt to the dealer and the user. The dealer has one card face down (the hole card). The user can cheat by clicking on the eye icon to peek at the hole card. The user can then click 'hit' to be delt another card or 'stand'. When the user clicks stand, the dealer then completes the dealer hand. The dealer must hit if the point value is under 17, otherwise stand.

Aces can be counted as a 1 or 11. The program determines the best point value when a user has one or more aces.


The winner is chosen by whomever gets closest to 21 without going over. A natural blackjack (an Ace and a 10 card) beats a 21 that is not a blackjack. In the case of a tie, the dealer wins.

#Libraries used

  * jQuery
  * Skeleton.css for layout and responsive design
  * Animate.css for animation effects

#Fonts used

  * blackjak_rollin.tff from http://www.1001fonts.com/blackjack-font.html#styles

#Images used

  * Card images from http://opengameart.org/content/playing-cards-vector-png
  * used picresize.com to resize the images
  * background image from http://www.casino-capers.org/wp/?attachment_id=932
  * You win graphic from google 
  * You lose graphic fro google

#Issues

  * sometims the eye icon does not hide at the end of a hand
  * If you click 'new hand' before the winner or loser animation ends, it does not bounce out next time.

