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
        action: "underline bold",
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
			c: 'CSS is like the stylish furnishings in a house - curtains, carpets, colorful pillows, etc..'
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
            console.log("calling stop now");
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
    questionTimeout: 15,
    answerTimeout: 5,
    statsTimeout: 5,

    resetGame: function() {
        this.correctQCount = 0;
        this.incorrectQCount = 0;
        this.noQCount = 0;
        this.questionIndex = 0;
    },

    returnPageToNormal: function() {
        $('body').css('background', 'url("assets/images/design-development-electronics-med.jpg")');
        $('.container').css('border', '15px solid rgb(146, 198, 171');
        $('.container').css('bottom', '0');
        $('#grade').css('text-decoration', 'none');
        $('#grade').css('font-weight', 'normal');
        $('#grade').css('color', 'green');
        $('footer').css('visibility', 'hidden');
    },

    statsPage: function() {
        console.log("in statsPage");
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
        console.log("in display answer results page " + letter);

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
        var correctLetter = theQuestions[index].correctAnswer;
        var text = "the correct answer was: " + correctLetter + ": " + theQuestions[index].answers[correctLetter];
        $("#grade").text(grade);
        var myString = $('<div id="correct-answer">').text(text);
        $("#grade").append(myString);
        switch (theQuestions[index].action) {
            case "change background":
                var imagePath = "assets/images/" + theQuestions[index].background;
                $('body').css('background', 'url(' + imagePath + ')');
                break;
            case "border and color":
                $('.container').css('border', '15px solid lawngreen');
                $('#grade').css('color', 'lawngreen');
                break;
            case "footer visibility":
                $('.container').css('bottom', '200px');
                $('footer').css('visibility', 'visible');
                break;
            case "underline bold":
                $('#grade').css('text-decoration', 'underline');
                $('#grade').css('font-weight', 'bold');
                break;
            case "none":
                // no action; do nothing
                break;
        }
        //  bjt $(theQuestions[index].iD).attr('class', theQuestions[index].classToUse);
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
            myString = $('<div class="click-me" id="question'+index+'" value="'+letter+'">').text(letter + ': ' + theQuestions[index].answers[letter]);
            myString.appendTo("#choices-parent");
        }
    },

    // timer reached zero without anser
    // put up wrong answer page
    // don't use 'this' as its a cb
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
        triviaGame.returnPageToNormal();
        // bjt 
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