/*jshint esversion: 6 */

$(document).ready(function() {
//=============================
//       some VARIABLES
//=============================

const $symbol = $('li.card i'); // a symbol/font-awesome for a given card
const $card = $('li.card'); // a card: all of the 16 <li> elements
const $deck = $('.deck'); // the whole board of the 16 cards
const $moves = $('.moves'); // the moves counter above the deck
const $rating = $('.fa'); // the stars rating above the deck
const $timer = $('.timer'); // the timer above the deck
const $modal = $('.modal'); // the modal

let moves = 0;
$moves.text(moves); // initial value of the counter set to 0

// Scoring system from 1 to 3 stars
let stars2, stars1, score;
let matched;
let NumberOfCards;
let seconds = 0;
let timing;

//===================================
//   a list of CARDS to play with
//===================================

const cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'anchor', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube'];

// displays all the cards to be viewed at the beginning
function displayCards() {
    $card.each(function() {
        $(this).addClass('selected');
    });
    setTimeout(function () {
        $('.selected').removeClass('selected');
        init();
    }, 2000);
}

displayCards();


//==================================
//       SHUFFLE THE CARDS
//==================================

function shuffle(array) {
    // I used Fisher-Yates shuffle algorithm
    let i = array.length,
        random,
        temp;
    while (--i > 0) {
        random = Math.floor(Math.random() * (i + 1));
        temp = array[random];
        array[random] = array[i];
        array[i] = temp;
    }
    console.log('Shuffled Cards Array: ' + array);
    return array;
}

// ============================
//     INITIALISE THE GAME
// ============================

startTimer(); // declared on line 315 in section TIMER

function init() {
    // removes the classes that are redundant after each restart/refresh
    $symbol.each(function(index) {
        $(this).removeClass().addClass('fa'); // fa is required for the font-awesome
    });
    // reshuffles the cards
    let shuffledCards = shuffle(cards);
    // LOOP through each card to assign the symbols/classes
    let idx = 0;
    $symbol.each(function(index) {
        $(this).addClass('fa-'+shuffledCards[idx]);
        //console.log(shuffledCards[idx]);
        if (idx < shuffledCards.length -1) {
            idx+=1;
            } else {
                idx = 0;
            }
    });
}

init();

// ========================================
//   AddEventListener/delegation - CLICK
// ========================================

//set up the event listener for a card. If the card is clicked.

function addListener() {
$deck.on('click', 'li', function() {
    // to display the clicked symbols in the console
    let classes = $(this).children().attr('class').split(' ');
    let secondClass = classes.slice(1)[0].slice(3);
    // console.log(classes);
    console.log(secondClass);
    // to display the clicked symbol on the deck
    $(this).addClass('selected');
    // now I want to check if there are 2 cards with the same symbol
    matchCheck();
    });
}

addListener();

// ===================
//     MATCH CHECK
// ===================

 function matchCheck() {
    // if there are 2 clicks(1 click = 1 .selected)
    if ($('.selected').length === 2) {
        let firstSelected = $('.selected').first().children().attr('class').split(' ');
        let secondSelected = $('.selected').last().children().attr('class').split(' ');
        if (firstSelected[1] === secondSelected[1]) {
            console.log('....... ~ MATCHED ~');
            setTimeout(function () {
                $('.selected').removeClass('selected unmatched');
            }, 500);
            $('.selected').addClass('match');
        } else {
            console.log('....... ~ MISSED ~');
            setTimeout(function () {
                $('.selected').removeClass('selected');
            }, 500);
        }
        // after 2 clicks the number of moves goes up by 1
        movesCount();
        allMatchedCheck();
        starRating(moves);
        //finalScore(); // it's here just for testing to see the modal pop up earlier
        resetTimerIf(timing);
    }
}

// ======================
//     HOW MANY MOVES
// ======================
function movesCount() {
    moves++;
    $moves.html(moves);
}

//===================
//       RATING
//===================
// evaluates the player's memory by 1 - 3 stars
function starRating(moves) {
    score = 3;
    stars2 = 12;
    stars1 = 16;
  switch(true) {
    case moves>stars2 && moves<=stars1:
      $rating.eq(3).removeClass('fa-star');
      score = 2;
      break;
    case moves>stars1:
      $rating.eq(2).removeClass('fa-star');
      score = 1;
      break;
  }
  return score;
}

//========================
//          MODAL
//========================

// it pops up when ALL cards are matched
function allMatchedCheck() {
    matched = $('.match').length;
    NumberOfCards = $card.length;
    if (matched === NumberOfCards) {
        setTimeout(function () {
                finalScore();
                $deck.off('click');
                console.log('....... ~ GAME OVER ~');
            }, 500);
    }
}

function refusePlay() {
    $modal.fadeOut();
    $('.match').removeClass('match').addClass('unmatched');
    $card.css('display', 'none');
    $('.score-panel').addClass('displayNone');
    $('.hidden-repeat').css('display', 'inline-block');
    console.log('....... ~ GAME REFUSED ~');
}

// the modal pops up and then disappears (ESC or click)
function finalScore() {
    $modal.fadeIn('slow');
    $('.stars, .restart').addClass('invisible');
    $('.fa-times-circle-o').on('click', function() {
        refusePlay();
    });
    // press ESC key
    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
        refusePlay();
        }
    });
    // the cards beneath the modal are unresponsive and the cursor is an arrow
    $deck.off('click');
    $card.css("cursor", "default");

    // implementing some stars and text into the modal
    let $oneStar = $('<span class="stars-modal"><i class="fa fa-star"></i></span>');
    let $twoStars = $('<span class="stars-modal"><i class="fa fa-star"></i><i class="fa fa-star"></i></span>');
    let $threeStars = $('<span class="stars-modal"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>');
    let $statement = $('#onCompletion');
    let $starsInModal = $('#stars-modal');
    let $congrats = $('#congrats');

    switch (score) {
        case 1:
            $starsInModal.append($oneStar);
            $statement.text(`You made it in ${seconds - 1} seconds with ${moves} moves and the score of ONLY ${score} star. You can do much better!`);
            $congrats.text('GET CONCENTRATED!');
            break;
        case 2:
            $starsInModal.append($twoStars);
            $statement.text(`You made it in ${seconds -1} seconds with ${moves} moves and the score of ${score} stars. Quite good!`);
            $congrats.text('CONGRATULATIONS!');
            break;
        case 3:
            $starsInModal.append($threeStars);
            $statement.text(`You made it in ${seconds -1} seconds with ${moves} moves and the score of ${score} stars. Well done!`);
            $congrats.text('CONGRATULATIONS!');
            break;
    }
}

// in the modal: the player wants to play again and clicks the icon
function wantPlayAgain() {
    $('.fa-play-circle').on('click', function() {
        $modal.fadeOut();
        $('.restart').removeClass('invisible');
        playingGameAgain();
        console.log('....... ~ PLAY AGAIN! ~');
    });
}
wantPlayAgain();

//========================
//     RESTART the game
//========================

// 1. Restart from the score panel
$('.score-panel .restart').on('click', function() {
    afterRestart();
    playingGameAgain();
    // console.log('Restart from the score panel');

});
// 2. Restart after closing the modal
$('.container .hidden-repeat').on('click', function() {
    afterRestart();
    playingGameAgain();
    $('.score-panel').removeClass('displayNone');
    $('.restart').removeClass('invisible');
    // console.log('Restart after closing the modal');
});

function afterRestart() {
    $('.stars').addClass('invisible');
    $card.css('display', 'flex');
    $('.hidden-repeat').css('display', 'none');
}

// playing the game after restart
function playingGameAgain() {
    $moves.text(0);
    moves = 0;
    $timer.text(0);
    $rating.removeClass('fa-star-o').addClass('fa-star');
    $('.match').removeClass('match').addClass('unmatched');
    $('.selected').removeClass('selected'); // when player wants to start again after one card has been clicked
    $('#stars-modal').empty(); // in order not to multiply the stars
    $modal.fadeOut(); // if the modal is still on
    startTimer();
    init();
    matchCheck();
    console.log('....... ~ GAME RESTARTED ~');
    addListener(); // problems with multiplying clicks solved by .off(), line 315
}

//====================
//       TIMER
//====================

function startTimerOnOneClick() {
    $('.stars').removeClass('invisible');
    $(this).data('clicked', true);
    if($(this).data('clicked')) {
        timing = setInterval(secondsCounter, 1000);
        resetTimerIf(timing);
    }
}

// called above, line 66
function startTimer() {
    if (timing) {
        // time is running, the game is under way
        clearInterval(timing); // stops the time
        $deck.off('click');
        seconds = 0; // resets the counter
        $deck.one('click', 'li', function() {
            startTimerOnOneClick();
            console.log('....... ~ BEING TIMED AFTER RESTART ~');
        });

    } else {
        // when the game is just started with a click
        $deck.one('click', 'li', function() {
            startTimerOnOneClick();
            console.log('....... ~ STARTED BY CLICK AND BEING TIMED ~');
        });
    }
}

function secondsCounter() {
    $('.timer').text(`${seconds}`);
     seconds++;
}

function resetTimerIf(timing) {
    if ($('.deck li.match').length === 16) {
            clearInterval(timing);
    }
}
// just to apply some CSS to see what's what
// $('.score-panel').children().css({'border': '1px solid red', 'font-size': '1.4em'});
});


