
$(document).ready(function() {
//=============================
//       some VARIABLES            
//=============================

$symbol = $('li.card i'); // a symbol/font-awesome for a given card
$card = $('li.card'); // a card: all of the 16 <li> elements
$restart = $('.score-panel .restart'); // a button to restart the game
$deck = $('.deck'); // the whole board of the 16 cards
$moves = $('.moves'); // the moves counter
$rating = $('.fa'); // the stars rating

let moves = 0;
$moves.text(moves); // initial value of the counter set to 0

// Scoring system from 1 to 3 stars
let stars2, stars1, stars0, score;

let seconds = 0;
let timing;
//let secondsCounter;
//===================================
//   a list of CARDS to play with    
//===================================

let cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'anchor', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube'];

// displays all the cards to be viewed
function displayCards() {
    $card.each(function() {
        $(this).addClass('selected');
    });
    setTimeout(function () {
        $('.selected').removeClass('selected');
        init();
    }, 1000);
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

timingClock();

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
        //console.log(idx);
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
// timing();

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
            console.log('MATCHED');
            setTimeout(function () {
                $('.selected').removeClass('selected unmatched');
            }, 500);
            $('.selected').addClass('match');
        } else {
            console.log('MISSED');
            setTimeout(function () {
                $('.selected').removeClass('selected');
            }, 500);
        }
        // after 2 clicks the number of moves goes up by 1
        movesCount();

        allMatchedCheck();

        starRating(moves);

        //finalScore(); // it's here just for testing

        console.log('match je: '+ $('.deck li.match').length)

        resetTimer(timing);
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
    stars0 = 20;
    let text;
  switch(true) {
    case moves>stars2 && moves<=stars1:
      // text = "star2: vic jak 12";
      $rating.eq(3).removeClass('fa-star');
      score = 2;
      break;
    case moves>stars1 && moves<=stars0:
      // text = "star1: vic jak 16";
      $rating.eq(2).removeClass('fa-star');
      score = 1;
      break;
    case moves>stars0:
      // text = "star0: vic jak 20";
      $rating.eq(1).removeClass('fa-star');
      $('#no-stars').text('No STARS!');
      score = 0;
      break;
  }
  return score;
}

//console.log(score);

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
                $deck.off("click");
            }, 500);
    }
}

// the modal pops up and disappears
function finalScore() {
    $('#ex1').fadeIn('slow');
    $('#ex1').on('click keyup', function() {
        $('#ex1').fadeOut();
    });
    // press ESC key
    $(document).keyup(function(e) {
        if (e.keyCode == 27) { // escape key maps to keycode `27`
        $('#ex1').fadeOut();
        }
    });

    // implementing some stars and text into the modal
    let $noStar = $('<span class="stars-modal">No stars now!</span>');
    let $oneStar = $('<span class="stars-modal"><i class="fa fa-star"></i></span>');
    let $twoStars = $('<span class="stars-modal"><i class="fa fa-star"></i><i class="fa fa-star"></i></span>');
    let $threeStars = $('<span class="stars-modal"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i></span>');
    let $statement = $('#completion');
    let $starsInMOdal = $('#stars-modal');
    let $congrats = $('#congrats');

    switch (score) {
        case 0:
            $starsInMOdal.append($noStar);
            $statement.text(`You made it in ${seconds} seconds with ${moves} moves and ${score} stars. Get some rest and come tomorrow!`);
            $congrats.text('NO PAIN, NO GAIN!');
            break;
        case 1:
            $starsInMOdal.append($oneStar);
            $statement.text(`You made it in ${seconds} seconds with ${moves} moves and the score of ONLY ${score} star. You can do much better!`);
            $congrats.text('GET CONCENTRATED!');
            break;
        case 2:
            $starsInMOdal.append($twoStars);
            $statement.text(`You made it in ${seconds} seconds with ${moves} moves and the score of ${score} stars. Quite good!`);
            $congrats.text('CONGRATULATIONS!');
            break;
        case 3:
            $starsInMOdal.append($threeStars);
            $statement.text(`You made it in ${seconds} seconds with ${moves} moves and the score of ${score} stars. Well done!`);
            $congrats.text('CONGRATULATIONS!');
            break;
    }
}


//========================
//     RESTART the game 
//========================
    $restart.on('click', function () {
    
        $rating.removeClass('fa-star-o').addClass('fa-star');
        $('.match').removeClass('match').addClass('unmatched');
        $('.selected').removeClass('selected');
        $('#no-stars').text('');
        $moves.text(0);
        moves = 0;

        $('#stars-modal').empty();

        init();
        matchCheck()

        console.log('HAS BEEN RESTARTED')

        addListener();

    });

//====================
//       TIMER
//====================
// called above, line 66

function timingClock() {
    $deck.one('click', 'li', function() {

        $(this).data('clicked', true);
        if($(this).data('clicked')) {
            secondsCounter();
            console.log('CLICKED TO START');
        }
        let timing = setInterval(secondsCounter, 1000);
        function secondsCounter() {
            $('.timer').text(`${seconds}`);
             seconds++;
        }
        //resetTimer(timing);
        console.log('wait is: ' + wait);
    });
}

// //// TODO !!!!!!!!!!
// function resetTimer(timer) {
//      // if (timer && ($('.deck li.match').length === 16) {
//         clearInterval(timer);
//         //console.log($('.deck li.match').length);
//      // }
// }
// resetTimer(timing);

let wait = $('.timer').text();
function resetTimer(timing) {
    if ($('.deck li.match').length === 16) {
        setTimeout(function() {
            clearInterval(timing);
            $('.timer').text(0);
            console.log('match is 16, stop the clock. UAAAA!');
        }, wait); // na tu hodnotu musi pockat az bude znama na konci!!!!! ted je tam 0
    }
}



// function resetTimer(timer) {
//     if (timing) {
//             clearInterval(timing);
//             $('.timer').text(0);
//             console.log('match is 16, stop the clock. UAAAA!');
//     }
// }






//////////// tohle funguje ////////////////

// let timing = setInterval(secondsCounter, 1000);
// function secondsCounter() {
//     $('.timer').text(`${seconds}`);
//     seconds++;
// }
// secondsCounter();

// function resetTimer(timer) {
//     if (timer) {
//         setTimeout(function() {
//         clearInterval(timer);
//         $('.timer').text(0);
//         }, 5000);
//     }
// }
// resetTimer(timing);

////////////////////////////////////////////


// function timing() {
//     $deck.one('click', 'li', function() {

//         $(this).data('clicked', true);
//         if($(this).data('clicked')) {
//             secondsCounter();
//             console.log('CLICKED TO START');
//         }
//         let timer = setInterval(secondsCounter, 1000);
//         function secondsCounter() {
//             $('.timer').text(`${seconds}`);
//              seconds++;
//         }
//     });
// }








});


