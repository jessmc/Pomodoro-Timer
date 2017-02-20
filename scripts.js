$(document).ready(function() {
	let sessionLength = 25, // starting session time
		breakLength = 5, // starting break time
		session = true, 
		paused = true,
		timeLeft = sessionLength * 60, 
		displayedTime = function() {
			let minutes = Math.floor(timeLeft / 60),
				seconds = (timeLeft - minutes * 60);
				return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
		}; 


let $fillAnimationSession = null,
	$fillAnimationBreak = null;
let intervalCounter = null;

const updateTimeValues = function() {
	$('.controls>.break-controls>.val-controls>.value').text(breakLength); // shows break time
	$('.controls>.session-controls>.val-controls>.value').text(sessionLength); // shows session time
	},

	pauseTimer = function() {
		if($fillAnimationSession !== null) // if the session is stopped , stop the fill animation
			$fillAnimationSession.stop();
		if($fillAnimationBreak !== null)  // if the break is stopped , stop the fill animation
			$fillAnimationBreak.stop();
		paused = true; // is paused
		clearInterval(intervalCounter); // clears the timer
		$('.status').text('Start');	 // changes the start/stop text to Start
	},

	next = function() {
		if(session) {
			timeLeft = breakLength * 60;
			$('.fill.session').animate({
				height: '100%'
			}, 500); // animate the fill for each half a second from top
			$('.fill.break').animate({
				height: '0%' // to bottom
			}, 500);
			$fillAnimationBreak = $('.fill.break').animate({
				height: '100%'
			}, (timeLeft * 1000)); // 1000 milliseconds is 1 second
			session = false;
		}
		else  {
			$('.fill.session').animate({
				height: '0%'
			}, 500);
			$('.fill.break').animate({
				height: '0%'
			}, 500);
			session = true;
			timeLeft = sessionLength * 60;
			$fillAnimationSession = $('.fill.session').animate({
				height: '100%'
			}, (timeLeft * 1000));
		}
	},

	startTimer = function() {
		intervalCounter = setInterval(function() {
			if (timeLeft > 0) {
				timeLeft--;
				$('.timer>.time-left').text(displayedTime());
			} else 
			 next();
		}, 1000);
		paused = false;
		session = !session;
		next();
		$('.status').text('Stop');
	};
$('.timer>.time-left').text(displayedTime());

$('.reset').on('click', function() {
	pauseTimer();
	session = !session;
	next();
	$('.timer>.time-left').text(displayedTime());
});

$('.next').on('click', function() {
	pauseTimer();
	session = !session;
	startTimer();
});

$('.timer').on('click', function() {
	if(paused) {
		startTimer();
	} else {
		pauseTimer();
	}
});

$('.clicks').on('click', function() {
	if ($(this).hasClass('plusSession') && sessionLength < 100)
		sessionLength++;
	else if ($(this).hasClass('minusSession') && sessionLength > 1)
		sessionLength--;
	else if ($(this).hasClass('plusBreak') && breakLength < 100)
		breakLength++;
	else if ($(this).hasClass('minusBreak') && breakLength > 1)
		breakLength--;
	else 
		return false;

	pauseTimer();
		if(session) {
			timeLeft = sessionLength * 60;
		} else {
			timeLeft = breakLength * 60;
		}
		$('.timer>.time-left').text(displayedTime());
		updateTimeValues();
	});
});