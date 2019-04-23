//  Trivia Game by Brenda Thompson April 22, 2019
    
// VARIABLES
var clockRunning = false;
var intervalId = 0;
const questionTimerEndResponse = "out of time!";

var theQuestions = [
	{
		question: "What is 10/2?",
		answers: {
			a: '3',
			b: '5',
			c: '115'
		},
		correctAnswer: 'b'
	},
	{
		question: "What is 30/3?",
		answers: {
			a: '3',
			b: '5',
			c: '10'
		},
		correctAnswer: 'c'
    },
];
// ==========================================================================
// stopwatch OBJECTS 
var stopwatch = {
    time: 0,
    cbForTimerEnd: null,
    displayTimer: false,

    isClockRunning: function() {
        if (clockRunning) {
            return true;
        } else {
            return false;
        }
    },

    reset: function() {
        //console.log("reset stopwatch called. Stopping watch");
        this.stop();
    },

    stop: function() {

        // Use clearInterval to stop the count here and set the clock to not be running.
        clearInterval(intervalId);
        clockRunning = false;
    },

    start: function(cb, secs, shouldTimerDisplay) {
        // hit reset first so we start from a known point
        this.reset();
        this.displayTimer = shouldTimerDisplay;
        this.cbForTimerEnd = cb;
        this.time = secs;
        if (this.displayTimer) {
            $("#time-remaining").text("Time Remaining: 00:" + this.time);
        }
        // Use setInterval to start the count here and set the clock to running.
        intervalId = setInterval(stopwatch.count, 1000);
        clockRunning = true;
    },
    
    // the callback for the interval timer that's used to countdown the timer
    count: function() {
        var converted;
        // deccrement time by 1, remember we cant use "this" here.
        // because it's used in the interval callback
        stopwatch.time--;
        if (stopwatch.time <= 0) {
            console.log("calling stop now");
            stopwatch.stop();
            if (stopwatch.displayTimer) {
                $("#time-remaining").text("Time Remaining: 00:00");
            }
            stopwatch.cbForTimerEnd();
        } else if (stopwatch.displayTimer) {
            // update the watch counter
            // Get the current time, pass that into the stopwatch.timeConverter function,
            //       and save the result in a variable.
            var converted = stopwatch.timeConverter(stopwatch.time);
            // Use the variable we just created to show the converted time in the "display" div.
            $("#time-remaining").text("Time Remaining: " + converted);
        }
    },

    timeConverter: function(t) {
        var minutes = Math.floor(t / 60);
        var seconds = t - (minutes * 60);

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        if (minutes === 0) {
            minutes = "00";
        } else if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return minutes + ":" + seconds;
    },
};   // end stopwatch object

// ==========================================================================
// triviaGame Object
var triviaGame = {
    correctQCount: 0,
    incorrectQCount: 0,
    noQCount: 0,
    questionIndex: 0,
    questionTimeout: 15,
    answerTimeout: 5,
    statsTimeout: 5,

    resetGame: function() {
        this.correctQCount = 0;
        this.incorrectQCount = 0;
        this.noQCount = 0;
        this.questionIndex = 0;
    },

    statsPage: function() {
        console.log("in statsPage");
        $("#grade").text("All done, here's how you did!");
        this.appendStatsToGradeClass("Correct Answers: " + this.correctQCount);
        this.appendStatsToGradeClass("Incorrect Answer: " + this.incorrectQCount);
        this.appendStatsToGradeClass("Unanswered: " + this.noQCount);
        this.displayRestartButton();
    },
    displayRestartButton: function() {
            // display restart button
            var myButton = $('<button id="click-restart">Start Over?</button>');
            // appendTo the content precedes the method and parent is passed in method
            // myJQ.appendTo('#button-parent');
            // append the parent precedes the method and content is passed in method
            $("#restart-parent").append(myButton);
            // html will replace all the other stuff (if any) in parent id
            // $("#restart-parent").html(myJQ);
    },

    appendStatsToGradeClass: function(myText) {
        var myString = '<div id="stat-results">' + myText + '</div>';
        var aC = $(myString);
        $("#grade").append(aC);
    },

    displayAnswerPage: function(letter) {
        // display yes for correct
        // or no for incorrect answer
        // display oot for timeout on answer
        // display correct answer
        // setup timer for 5 or 10 seconds
        // pass timer a cb for next state
        console.log("in display answer results page " + letter);

        var index = this.questionIndex;
        // determine how we got here
        // then display the appropriate response
        if (theQuestions[index].correctAnswer === letter) {
            // correct guess
            $("#grade").text("correct!");
            var myText = "the correct answer was: " + letter + ":" + theQuestions[index].answers[letter];
            var myString = '<div id="correct-answer">' + myText + '</div>';
            var aC = $(myString);
            $("#grade").append(aC);
            this.correctQCount++;
        } else if ( letter === questionTimerEndResponse) {
            // no guess timer ran out. 
            $("#grade").text(questionTimerEndResponse);
            var correctLetter = theQuestions[index].correctAnswer;
            var myText = "the correct answer was: " + correctLetter + ":" + theQuestions[index].answers[correctLetter];
            var myString = '<div id="correct-answer">' + myText + '</div>';
            var aC = $(myString);
            $("#grade").append(aC);
            this.noQCount++;
        } else {
            // incorrect guess
            $("#grade").text("Nope!");
            var correctLetter = theQuestions[index].correctAnswer;
            var myText = "the correct answer was: " + correctLetter + ":" + theQuestions[index].answers[correctLetter];
            var myString = '<div id="correct-answer">' + myText + '</div>';
            var aC = $(myString);
            $("#grade").append(aC);
            this.incorrectQCount++;
        }

        // wait for timer to fire before erasing page
        var shouldTimerDisplay = false;
        stopwatch.start(triviaGame.cbForDisplayAnswerPage, this.answerTimeout, shouldTimerDisplay);
    },
    // questionPage: this method displays the questions, the multiple choice
    // answers, and the count down timer
    questionPage: function() {

            // display the next question and it's answers
            this.showQuestion(this.questionIndex);
            var shouldTimerDisplay = true;
            stopwatch.start(triviaGame.cbForQuestionOutOfTime, this.questionTimeout, shouldTimerDisplay);
    },

    showQuestion: function(index) {
        // recall that the question array is made up of object literals
        // each object literal has 3 properties - question, answers, and correct answer
    
        // display question
        $("#trivia-question").text(theQuestions[index].question);
        // first reset the list of answers
        var myString = "";
    
        // for each available answer to this question...display it as a choice
        for(letter in theQuestions[index].answers){
            myString = '<div class="click-me" id="question'+index+'" value="'+letter+'">'
                       + letter + ': ' + theQuestions[index].answers[letter] + '</div>';
            var aC = $(myString);
            aC.appendTo('#choices-parent');
        }

    },

    // timer reached zero without anser
    // put up wrong answer page
    // don't use this as its a cb
    cbForQuestionOutOfTime: function() {
        console.log("in question timer ended call back now");
        triviaGame.removeQuestionPage();
        // so from here we need the out of time page
        triviaGame.displayAnswerPage(questionTimerEndResponse);
    },

    // answer page has been displayed long enough
    // move on to next page -- either question page or stats page
    cbForDisplayAnswerPage: function() {
        console.log("in cbForDisplayAnswerPage");
        triviaGame.removeDisplayAnswerPage();
        if (++triviaGame.questionIndex < theQuestions.length) {
            // more questions
            triviaGame.questionPage();
        } else {
            // all done with this game display the stats
            triviaGame.statsPage();
        }
    },

    removeDisplayAnswerPage: function() {
        $("#time-remaining").text("");
        $("#grade").text("");
        $("#correct-answer").remove();
    },

    removeQuestionPage: function() {
        // remove info from the question
        stopwatch.stop();
        // remove trivia question
        $("#trivia-question").text("");
        // remove choices
        $('.click-me').each(function() {
            $(this).remove();
        });
    },

    removeStatsPage: function() {
        $("#grade").text("");
        $("#stat-results").each(function() {
            $(this).remove();
        });
    },
};  // end triviaGame

// ==========================================================================
// events
    // run this code when we load the page
    $(document).ready(function() {

        //***************** */
        // start button has been clicked 
        // remove the button
        // start the first question
        //***************** */
        $("#start").on("click", function() {
            console.log("at start button click");
            $(this).remove(); // remove start button
            triviaGame.questionPage();
        } );

        $("#choices-parent").on("click", ".click-me", function() {
            alert("choice has been clicked!");
            // remove info from the questions page
            triviaGame.removeQuestionPage();
            triviaGame.displayAnswerPage($(this).attr("value"));
        });

        $("#restart-parent").on("click", "#click-restart", function() {
            console.log("at restart click");
            $(this).remove(); // remove restart button
            triviaGame.removeStatsPage();
            triviaGame.resetGame();
            triviaGame.questionPage();
        } );
    });