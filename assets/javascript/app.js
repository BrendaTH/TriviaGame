//  Trivia Game by Brenda Thompson April 22, 2019
    
// VARIABLES
var clockRunning = false;
var intervalId = 0;
const questionTimerEndResponse = "out of time!";

var theQuestions = [
    {
		question: "What are style sheets?",
		answers: {
			a: 'ARRRGHHH! Do not ask me that! Ever!',
			b: 'They allow you to build style templates and make it (ahem..) easy to change the look and feel of a site ',
			c: 'There is no such thing as a style sheet. It is called CSS.'
		},
        correctAnswer: 'b',
        action: 'none',
    },
    {
		question: "What is a good HGTV metaphor for JavaScript?",
		answers: {
			a: 'P.I.T.A.',
			b: "It's a lot like HTML",
			c: 'JavaScript is like the electrical and plumbing in a house.'
		},
        correctAnswer: 'c',
        action: "change background",
        background: "plumbing.jpg",

    },
	{
		question: "Which is our favorite color name supported by all browsers",
		answers: {
			a: 'AliceBlue',
			b: 'PapayaWhip',
			c: 'LawnGreen'
		},
        correctAnswer: 'c',
        action: 'border and color',
        border: 'lawngreen',
    },
    {
		question: "What is a good HGTV metaphor for HTML?",
		answers: {
			a: 'P.I.T.A.',
			b: "It's a lot like CSS",
			c: 'HTML is the basic structure - walls, floors, etc..'
		},
        correctAnswer: 'c',
        action: "change background",
        background: "abstract-abstract-background-brick-wall-1693302.jpg"
    },
    {
		question: "How do you insert a copyright symbol on a browser page?",
		answers: {
			a: 'type &copy; or & #169; in an HTML file',
			b: 'you cannot do that',
			c: 'type copyright with quotes around it'
		},
        correctAnswer: 'a',
        action: "footer visibility",

    },
    {
		question: "Do all HTML tags come in pairs?",
		answers: {
			a: 'Yes. Unexpected results occur if you do not have both an open and closing tag',
			b: 'There is no such thing as an HTML tag. It is called an element',
			c: 'No, some HTML tags do not need a closing tag. Examples are <img> and <br>.'
		},
        correctAnswer: 'c',
        action: "none",
    },
    {
		question: "An HGTV metaphor for CSS is what?",
		answers: {
			a: 'P.I.T.A.',
			b: 'It is a lot like HTML',
			c: 'CSS is like the stylish furnishings in a house - curtains, flowers, colorful pillows, etc..'
		},
        correctAnswer: 'c',
        action: "change background",
        background: "background-coffee-contemporary-1305365.jpg",
    },
];
// ==========================================================================
// stopwatch OBJECT
// technically this is a timer not a stopwatch
// but i use the word 'timer' so often in this file that i had to call this object something else
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
            this.displayTime("Time Remaining: 00:" + this.time);
        }
        // Use setInterval to start the count here and set the clock to running.
        intervalId = setInterval(stopwatch.count, 1000);
        clockRunning = true;
    },
    displayTime: function(theText) {
        $("#time-remaining").text(theText);
    }, 
    removeTime: function() {
        $("#time-remaining").text("");

    },
    // the callback for the interval timer that's used to countdown the timer
    count: function() {
        var converted;
        // deccrement time by 1, remember we cant use "this" here.
        // because it's used in the interval callback
        stopwatch.time--;
        if (stopwatch.time <= 0) {
            stopwatch.stop();
            if (stopwatch.displayTimer) {
                stopwatch.displayTime("Time Remaining: 00:00")
            }
            stopwatch.cbForTimerEnd();
        } else if (stopwatch.displayTimer) {
            // update the watch counter
            // Get the current time, pass that into the stopwatch.timeConverter function,
            //       and save the result in a variable.
            var converted = stopwatch.timeConverter(stopwatch.time);
            // Use the variable we just created to show the converted time in the "display" div.
            stopwatch.displayTime("Time Remaining: " + converted);
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
    questionTimeout: 30,
    answerTimeout: 5,
    statsTimeout: 5,

    resetGame: function() {
        this.correctQCount = 0;
        this.incorrectQCount = 0;
        this.noQCount = 0;
        this.questionIndex = 0;
        this.returnPageToNormal();
    },

    returnPageToNormal: function() {
        $('body').css('background', 'url("assets/images/design-development-electronics-med.jpg")');
        $('.container').css('border', '15px solid rgb(146, 198, 171');
        $('.container').css('bottom', '0');
        $('#grade').css('text-decoration', 'none');
        $('#grade').css('font-weight', 'normal');
        $('#grade').css('color', 'green');
        if ($('footer').css('display') !== 'none') {
            // don't do the animation unless we have shown the footer
            $('footer').animate({left: '800px'}, "slow", function(){
                $('footer').fadeOut('fast', function() {
                    // fadeout essentially hid the footer, but we still have to
                    // reposition footer for next time we show it.
                    $('footer').css({'left': '25%'});
                });
            });
        }
    },

    statsPage: function() {
        if (this.correctQCount > this.incorrectQCount + this.noQCount) {
            $('body').css('background', 'url("assets/images/adult-background-casual-941693.jpg")');
            $("#grade").text("Great job! Here's how you did!");
        } else {
            $('body').css('background', 'url("assets/images/animals-aquatic-black-and-white-726478.jpg")');
            $("#grade").text("Hmmmm.. maybe you need to attend office hours, and try to have a positive interaction with a TA this week. Here's how you did!");
        }
        this.appendStatsToGradeClass("Correct Answers: " + this.correctQCount);
        this.appendStatsToGradeClass("Incorrect Answer: " + this.incorrectQCount);
        this.appendStatsToGradeClass("Unanswered: " + this.noQCount);
        this.displayRestartButton();
        // run a timer to return the background to normal
        var shouldTimerDisplay = false;
        stopwatch.start(triviaGame.cbForStatsPage, this.statsTimeout, shouldTimerDisplay);
    },
    displayRestartButton: function() {
            // display restart button
            var myButton = $('<button class="button" id="click-restart">').text("Start Over?");
            // 'appendTo' the content precedes the method and parent is passed in method
            // myButton.appendTo('#restart-parent');
            // 'append' the parent precedes the method and content is passed in method
            $("#restart-parent").append(myButton);
    },

    appendStatsToGradeClass: function(myText) {
        var myString = $('<div id="stat-results">').text(myText);
        $("#grade").append(myString);
    },

    displayAnswerPage: function(letter) {
        // correct, incorrect, or out of time are our choices here
        // so pick the display the answer, 
        // then setup timer, pass cb for next state, don't show timer

        var index = this.questionIndex;
        // then display the appropriate response
        if (theQuestions[index].correctAnswer === letter) {
            // correct guess
            this.displayAnswer("Correct!", index);
            this.correctQCount++;
        } else if ( letter === questionTimerEndResponse) {
            // timer ran out. 
            this.displayAnswer(questionTimerEndResponse, index);
            this.noQCount++;
        } else {
            // incorrect guess
            this.displayAnswer("Nope!", index);
            this.incorrectQCount++;
        }

        // set up timer, with cb, don't display countdown
        var shouldTimerDisplay = false;
        stopwatch.start(triviaGame.cbForDisplayAnswerPage, this.answerTimeout, shouldTimerDisplay);
    },

    displayAnswer: function(grade, index) {
        $("#grade").text(grade);
        var myString = "<br> The correct answer was: <br>";
        $("#grade").append(myString)

        var correctLetter = theQuestions[index].correctAnswer;
        var text = correctLetter + ":   " + theQuestions[index].answers[correctLetter];
        myString = $('<div id="correct-answer">').text(text);

        switch (theQuestions[index].action) {
            case "change background":
                // put up a new background pic
                var imagePath = "assets/images/" + theQuestions[index].background;
                $('body').css('background', 'url(' + imagePath + ')');
                break;
            case "border and color":
                // change the border and color of the container and font
                $('.container').css('border', '15px solid lawngreen');
                $('#grade').css('color', 'lawngreen');
                break;
            case "footer visibility":
                // put in a footer
                $('.container').css('bottom', '200px');
                $('footer').show();
                break;
            case "none":
                // no action; do nothing
                break;
        }
        $("#grade").append(myString)
        .hide()
        .fadeIn(1500);
    },

    // questionPage: this method displays the questions, the multiple choice
    // answers, and the count down timer
    questionPage: function() {
        // display the next question and it's answers
        this.showQuestion(this.questionIndex);
        var shouldTimerDisplay = true;
        stopwatch.start(triviaGame.cbForQuestionOutOfTime, this.questionTimeout, shouldTimerDisplay);
    },

    // qIndex is the index number into the list of question objects
    showQuestion: function(qIndex) {
        // recall that the question array is made up of object literals
        // each object literal has 3 properties - question, answers, and correct answer
        // display question
        $("#trivia-question").text(theQuestions[qIndex].question);
        // first reset the list of answers
        var myString = "";
    
        // for each available answer to this question...display it as a choice
        var i=0;
        for(letter in theQuestions[qIndex].answers){
            myString = $('<div class="click-me" id="question'+qIndex+'" data-letter="'+letter+'">').text(letter + ': ' + theQuestions[qIndex].answers[letter]);
            myString.appendTo("#choices-parent")
                .hide()
                .delay(1500 * i++)
                .fadeIn(700);
        }
    },

    // timer reached zero without anser
    // put up wrong answer page
    // don't use 'this' as its a cb
    cbForQuestionOutOfTime: function() {
        triviaGame.removeQuestionPage();
        // so from here we need the out of time page
        triviaGame.displayAnswerPage(questionTimerEndResponse);
    },

    // answer page has been displayed long enough
    // move on to next page -- either question page or stats page
    cbForDisplayAnswerPage: function() {
        triviaGame.returnPageToNormal();
        $('#the-container').attr('class', 'container');
        triviaGame.removeDisplayAnswerPage();
        if (++triviaGame.questionIndex < theQuestions.length) {
            // more questions
            triviaGame.questionPage();
        } else {
            // all done with this game display the stats
            triviaGame.statsPage();
        }
    },

    cbForStatsPage: function() {
        triviaGame.returnPageToNormal();
    },

    removeDisplayAnswerPage: function() {
        stopwatch.removeTime();
        $("#grade").text("");
        $("#correct-answer").remove();
    },

    removeQuestionPage: function() {
        stopwatch.stop();
        // remove trivia question
        $("#trivia-question").text("");
        // remove choices
        $('.click-me').each(function() {
            (this).remove();
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
            $(this).remove(); // remove start button
            triviaGame.questionPage();
        } );

        $("#choices-parent").on("click", ".click-me", function() {
            // remove info from the questions page
            triviaGame.removeQuestionPage();
            triviaGame.displayAnswerPage($(this).attr("data-letter"));
        });

        $("#restart-parent").on("click", "#click-restart", function() {
            $(this).remove(); // remove restart button
            triviaGame.removeStatsPage();
            triviaGame.resetGame();
            triviaGame.questionPage();
        } );
    });