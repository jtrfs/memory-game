
$(document).ready(function() {
//=============================
//        VARIABLES            
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
// let score = 3; // 3 stars at the start

//===================================
//   a list of CARDS to play with    
//===================================

let cards = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'anchor', 'leaf', 'bicycle', 'diamond', 'bomb', 'leaf', 'bomb', 'bolt', 'bicycle', 'paper-plane-o', 'cube'];

// displays all the cards to be viewed
function displayCards() {
    $card.each(function() 
        {$(this).addClass('selected');
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
    addListener();
}

init();

// ========================================
//   AddEventListener/delegation - CLICK
// ========================================

//set up the event listener for a card. If a card is clicked
function addListener() {
    $deck.on('click', 'li', function() {
        // to display the clicked symbols in the console
        let classes = $(this).children().attr('class').split(' ');
        let secondClass = classes.slice(1)[0].slice(3);
        console.log(classes);
        console.log(secondClass);

        // to display the clicked symbol on the deck
        $(this).addClass('selected');

        // now I want to check if there are 2 cards with the same symbol
        matchCheck();
    });
}

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
                $('.selected').removeClass('selected');
            }, 500);
            $('.selected').addClass('match show');
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

        gameOverMessage(moves, score);
    }
}

// ======================
//     HOW MANY MOVES
// ======================
function movesCount() {
    moves++;
    $moves.html(moves);
}

//================
//     RATING
//================
// evaluates your memory through 3 stars
function starRating(moves) {
    score = 3;
    stars2 = 12;
    stars1 = 16;
    stars0 = 20;
    let text;
  switch(true) {
    case moves>=stars2 && moves<=stars1:
      text = "star2: vic jak 12";
      $rating.eq(3).removeClass('fa-star');
      score = 2;
      break;
    case moves>stars1 && moves<=stars0:
      text = "star1: vic jak 16";
      $rating.eq(2).removeClass('fa-star');
      score = 1;
      break;
    case moves>stars0:
      text = "star0: vic jak 20";
      $rating.eq(1).removeClass('fa-star');
      $('#no-stars').text('No STARS for you!');
      score = 0;
      break;
  }
  $('#demo').text(score);
  return score;
}

//===================
//       MODAL
//===================

// it pops up when ALL cards are matched
function allMatchedCheck() {
    matched = $('.match').length;
    NumberOfCards = $card.length;
    if (matched === NumberOfCards) {
        setTimeout(function () {
                finalScore();
            }, 300);
    }
}

// to pop up and dispose of the modal
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

    $deck.off("click"); // removes clicks from the cards at the end of the game
}

function gameOverMessage(moves, score) {
    $('#winnerText').text(`In (???) seconds, you did a total of ${moves} moves with a score of ${score} stars. Well done!`);
    // $('#winnerModal').modal('toggle');
    //console.log(score+'gameover');
}

//========================
//     RESTART the game
//========================
    $restart.on('click', function () {
	
		$rating.removeClass('fa-star-o').addClass('fa-star');
        $('.match').removeClass('match show');
        $rating.addClass('fa-star');
        $('#no-stars').text('');
        $moves.text(0);
        moves = 0;
		init();
    });



}); // the end of jQuery ready function