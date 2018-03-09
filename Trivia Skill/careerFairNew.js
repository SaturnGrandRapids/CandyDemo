/**
 Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 http://aws.amazon.com/apache2.0/
 or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * This sample shows how to create a simple Trivia skill with a multiple choice format. The skill
 * supports 1 player at a time, and does not support games across sessions.
 */
 
 /* changed for a career fair Candy-Tron demo */

'use strict';

var AWS = require("aws-sdk");

var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
 var candyNumber = 'CandyBin' + (Math.floor(Math.random() * 3) +1);

var querystring = require('querystring')
var https = require('https')
var http = require('http')
var ready4Prize = 0;
//var jquery = require('jQuery')

/* function Game(session, data) {
    console.log('xxxxxxxxin game function, data: ' + data);
        if (data) {
            this.data = data;
        } else {
            this.data = {
                players: [],
                scores: {}
            };
        }
        this._session = session;
    }
    
    Game.prototype = {
        isEmptyScore: function () {
            //check if any one had non-zero score,
            //it can be used as an indication of whether the game has just started
            var allEmpty = true;
            var gameData = this.data;
            gameData.players.forEach(function (player) {
                if (gameData.scores[player] !== 0) {
                    allEmpty = false;
                }
            });
            return allEmpty;
        },
        myLog: function (stuff) {
		    console.log('we are in the myLog function vv ' +stuff);
		    
		},
        save: function (callback) {
            //save the game states in the session,
            //so next time we can save a read from dynamoDB
            this._session.attributes.currentGame = this.data;
            dynamodb.putItem({
                TableName: 'CareerFairUserData',
                Item: {
                    CustomerId: {
                        S: this._session.user.userId
                    },
                    Data: {
                        S: JSON.stringify(this.data)
                    }
                }
            }, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                if (callback) {
                    callback();
                }
            });
        }
    };
    
*/
/**
 * When editing your questions pay attention to your punctuation. Make sure you use question marks or periods.
 * Make sure the first answer is the correct one. Set at least 4 answers, any extras will be shuffled in.
 */
var questions = [
    {
        "Which famous folk musician from Minnesota had the nickname Zimmy in high school?:": [
            "Bob Dylan",
            "Tim Sax haug",
            "Bob Mould",
            "Morris Day"
        ]
    },
    {
        "Where in Minnesota is a giant Jolly Green Giant statue:": [
            "Blue Earth",
            "Rochester",
            "luVern",
            "Northfield"
        ]
    },
    {
        "In the 1930's Gangsters such as John Dillinger, Ma Barker and Babyface Nelson were known to hide out in which Twin City Location?:": [
            "Wabbashaw Caves",
            "The Gay 90's Bar",
            "Dillman's Bay Resort",
            "Murray's Steakhouse"
        ]
    },
    {
        "This southern Minnesota town is known partially for the 1876 failed First National Bank robbery attempt by the Jesse James Gang. Is it?:": [
            "North Field",
            "Saint Peter",
            "Owatonna",
            "Farmington"
        ]
    },
    {
        "What is the  full given name of the singer-songwriter known as Prince?:": [
            "Prince Rogers Nelson",
            "Morris Day",
            "Fred Nelson",
            "Gerome Nelson"
        ]
    },
    {
        "What year did the Mall of America open in Bloomington?": [
            "1992",
            "1991",
            "1990",
            "1993"
        ]
    },
    {
        "Which player hit the longest home run in Minnesotas Metropolitan STadium:": [
            "Harlan Killebrew",
            "Kirby Pucket",
            "Rod Carew",
            "Kent Hrbek"
        ]
    },
    {
        "Founded in 1860, this Minnesota Brewery is the second oldest family-owned brewery in America. Is it?:": [
            "August Schell Brewing.",
            "Theodore Hamm's Brewing.",
            "Schuster Brewing Co.",
            "Park Brewing."
        ]
    },
     {
        "The Los Angeles Lakers were previously known as the NBA Champion Minneapolis Lakers. In which year did the Lakers move to California?:": [
            "1961",
            "1951",
            "1971",
            "1958"
        ]
    },
    {
        "In which years did the Twins win the world series?:": [
            "1924, 1987 and 1991",
            "1916, 1984 and 1997",
            "1916, 1984 and 1996"
        ]
    },
    {
        "Which of the following is not true about the Boundary Waters?:": [
            "the 32nd National Park",
            "maintained by the US Forest Service",
            "is known as a canoeists paradise offering 1200 miles of canoe routes",
            "most areas are paddle only, but some areas allow motorboats"
        ]
    },
    {
        "Who is a fictional icon created by Minnesota Company General Mills?:": [
            "Betty Crocker",
            "Captain Crunch",
            "Powderpuff Girls",
            "Ronald Mac Donald"
        ]
    },
    {
        "Born in St Paul, who wrote The Great Gatsby?:": [
            "F Scott Fitzgerald",
            "Burl Ives",
            "Charles Schulz",
            "Hubert Humphrey"
        ]
    },
    {
        "Who played hockey into his sixties and created the comic strip Peanuts?:": [
            "Charles Schulz",
            "Jim Davis",
            "Mort Walker",
            "Bill Watterson"
        ]
    },
    {
        "Born in Grand Rapids Minnesota and starred in Wizard of Oz?": [
            "Judy Garland",
            "Liza Minelli",
            "Sheila Escovedo",
            "Jack Haley"
        ]
    },
    {
        "Which of these states does not border Minnesota?": [
            "Nebraska",
            "Wisconsin",
            "North Dakota",
            "Iowa"
        ]
    },
    {
        "In which of these cities did the cartoon character Bullwinkle live?": [
            "Frostbite Falls",
            "International Falls",
            "Fergus Falls",
            "Little Falls"
        ]
    },
    {
        "Which Pro Wrestler became Govenor of Minnesota": [
            "Jesse the body Ventura",
            "Arnold Swartzeneger",
            "Verne Gagne",
            "John The Prototype Cena"
        ]
    },
    {
        "What is the capital of Minnesota?": [
            "Saint Paul",
            "Minneapolis",
            "Sauk Center",
            "Duluth"
        ]
    },
    {
        "Where in Minnesota were the first practical water skis invented?:": [
            "Lake City",
            "Lake Calhoun",
            "Duluth",
            "Lake Minnetonka"
        ]
    },
    {
        "Where in Minnesota did Polaris develop the first practical Snowmobile?:": [
            "Roseau",
            "Warroad",
            "Bloomington",
            "Aitkin"
        ]
    },
    {
        "Where in Minnesota did Torro develop the first snowblower for home use?:": [
            "Bloomington",
            "Crookston",
            "Marble",
            "Bemidji"
        ]
    },
    {
        "Which Minnesota Viking is a member of the Pro Football Hall of Fame and the Minnesota Supreme Court?:": [
            "Alan Page",
            "Chuck Foreman",
            "Fran Tarkenton",
            "Daunte Culpepper"
        ]
    },
    {
        "Where in Minnesota is the largest Open Pit Iron Mine?:": [
            "Hibbing",
            "Mountain Iron",
            "Taconite",
            "Orr"
        ]
    },
    {
        "When did Minnesotans Scott and Brennan Olson invent the first inline skates, named Rollerblades?:": [
            "1980",
            "1976",
            "1982",
            "1978"
        ]
    },
    {
        "Where in Minnesota is the United States Hockey Hall of Fame?:": [
            "Eveleth",
            "Edina",
            "Eden Prairie",
            "Eagan"
        ]
    },
    {
        "What was this Minnesotan, Charles Lindbergh,  famous for?": [
            "First solo flight across the atlantic",
            "First solo flight across the Pacific",
            "First solo flight across the USA",
            "All of the above"
        ]
    },
    {
        "Which company is not from Minnesota?": [
            "IBM",
            "3M",
            "General Mills",
            "Polaris"
        ]
    },
    {
        "In what year was the Miracle on Ice?": [
            "1980",
            "1984",
            "1976",
            "1988"
        ]
    },
    {
        "Where does Hor mel create popular processed meats including Spam ?": [
            "Austin",
            "Owatonna",
            "Rochester",
            "Spring Valley"
        ]
    },
    {
        "Which Minnesota Company creates Super Bowl Rings?:": [
            "Jostens",
            "Samelas",
            "Stadheims",
            "Fishers"
        ]
    },
    {
        "Where in Minnesota was the film Grumpy Old Men based?": [
            "Wabbashaw",
            "Red Wing",
            "Lake City",
            "Winona"
        ]
    },
    {
        "What ficticious school was the TV Show Coach based around?": [
            "Minnesota State",
            "University of Mancato",
            "Moorehead Moose",
            "University of Minnesota Itasca"
        ]
    },
    {
        "Which ALpine Ski Hill was never in the Grand Rapids Area?": [
            "Mount Pokegama",
            "Mount Itasca",
            "Sugar Hills",
            "Quadna Mountain"
        ]
    },
    {
        "Which national department store chain is headed in Minnesota?": [
            "Target",
            "Walmart",
            "Walgreens",
            "Shopko"
        ]
    },
    {
        "Rochester Minnesota, features all of these except:": [
            "A Natural Lake",
            "The Mayo Clinic",
            "An Ear of Corn shaped watertower",
            "Is the county seat"
        ]
    },
    {
        "This portion of Minnesota is the only portion of the US (besides Alaska) that is north of the 49th Parallel?": [
            "Northwest Angle",
            "Northern Edge",
            "Baudette",
            "Lake of the Woods"
        ]
    },
    {
        "Minnesota is the land of 10000 lakes, but how many lakes Are there?": [
            "11842",
            "9988",
            "10142",
            "12002"
        ]
    },
    {
        "Duluth's Landmark Aerial Lift bridge can be raised to a maximum height of ?": [
            "135 feet",
            "30 feet",
            "200 feet",
            "60 feet"
        ]
    },
    {
        "Which great lake can be seen from Duluth?": [
            "Lake Superior",
            "Lake Huron",
            "Lake Michigan",
            "Lake Erie"
        ]
    },
    {
        "Duluth is adjacent to a Wisconsin city and the two are often named together, is it?:": [
            "Superior",
            "Lacross",
            "Milwaukee",
            "Menomonie"
        ]
    },
    {
        "The Lost Forty is 40 acres of unlogged forest. It was missed from harvest due to surveyor error. How old are the oldest Red and White Pine found here?:": [
            "300 years",
            "1000 years",
            "500 years",
            "2000 years"
        ]
    },
    {
        "DigiKey is one of the top distributors of electronic components in the world. Where is it located?:": [
            "Thief River Falls",
            "Bloomington",
            "Rochester",
            "Saint Paul"
        ]
    }
];

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context, callback) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */

//     if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.05aecccb3-1461-48fb-a008-822ddrt6b516") {
//         context.fail("Invalid Application ID");
//      }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                                console.log('Success is this the end of the game0? ');

                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                                console.log('Success is this the end of the game1?');
                                        //added begin
    console.log('is this the end of the game?');
    console.log("Helloxx?" + ready4Prize);
if (ready4Prize==1)
    console.log('should be giving prize');
else
    console.log('should not give prize');
    var querystring = require('querystring');    
    const https = require('https');
    // var candyNumber = 'CandyBin' + (Math.floor(Math.random() * 3) +1);
    var data2 = JSON.stringify({
    //      'candyType': 'MM1'
      'candyType': candyNumber
    });

    var options = {
        hostname: 'qqv7kisnze.execute-api.us-west-2.amazonaws.com',
        port: 443,
        path: '/test/openCandy',
        json: true,
        method: 'POST',
        headers: {
            'Content-Type': ' text/html; charset=utf-8',
            'Content-Length': Buffer.byteLength(data2)
        }
    };
if (ready4Prize=== 0) 
    context.succeed(buildResponse(sessionAttributes, speechletResponse));
else { 
    var req = https.request(options, (res) => {
        res.on('data', (d) => {
        process.stdout.write(d);
        context.succeed(buildResponse(sessionAttributes, speechletResponse));
    });
    });
//}

//req.on('error', (e) => {
//  console.error(e);
//});

//if (ready4Prize==1) {
console.log('afterreqon');
var output = req.write(data2);
console.log('afterreqon1');

req.end();
}

console.log('afterreqon2');
//added end 
//context.succeed();
//                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            console.log('Success is this the end of the game?');
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
    

    
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
        + ", sessionId=" + session.sessionId);
    getWelcomeResponse(callback);
}
/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
        + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // handle yes/no intent after the user has been prompted
    if (session.attributes && session.attributes.userPromptedToContinue) {
        delete session.attributes.userPromptedToContinue;
        if ("AMAZON.NoIntent" === intentName) {
            handleFinishSessionRequest(intent, session, callback);
        } else if ("AMAZON.YesIntent" === intentName) {
            handleRepeatRequest(intent, session, callback);
        }
    }

    // dispatch custom intents to handlers here
    if ("AnswerIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AnswerOnlyIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("DontKnowIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.YesIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.NoIntent" === intentName) {
        handleAnswerRequest(intent, session, callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        throw "Invalid intent";
    }
}



/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
        + ", sessionId=" + session.sessionId);

    // Add any cleanup logic here
}

// ------- Skill specific business logic -------

var ANSWER_COUNT = 4;
var GAME_LENGTH = 2;
var CARD_TITLE = "Trivia"; // Be sure to change this for your skill.



function getWelcomeResponse(callback) {

    
    var sessionAttributes = {},
//	    speechOutput = "Welcome",
  	    speechOutput = "Welcome to the saturn systems Minnesota trivia game!"
          + "I will ask you "
         + " questions related to Minnesota, and award correct answers. Wait to hear all the answers and Just say the number of the answer. Let's go! ",
        shouldEndSession = false,
   
        gameQuestions = populateGameQuestions(),
        correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT)), // Generate a random index for the correct answer, from 0 to 3
        roundAnswers = populateRoundAnswers(gameQuestions, 0, correctAnswerIndex),

        currentQuestionIndex = 0,
        spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0],
        repromptText = "Question 1. " + spokenQuestion + " ",

        i, j;
        var session;
//    var currentGame = new Game(session);
//    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
//    var docClient = new AWS.DynamoDB.DocumentClient();
    var postData = {   //the POST request's body data
        "candyType": "MM"
    };
    
    var http = require('http');

    
    for (i = 0; i < ANSWER_COUNT; i++) {
        repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
    }
    speechOutput += repromptText;
//    currentGame.myLog("abc" + currentGame);
    sessionAttributes = {
        "speechOutput": repromptText,
        "repromptText": repromptText,
        "currentQuestionIndex": currentQuestionIndex,
        "correctAnswerIndex": correctAnswerIndex + 1,
        "questions": gameQuestions,
        "score": 0,
        "correctAnswerText":
            questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
    };
    callback(sessionAttributes,
        buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, shouldEndSession));
}



function populateGameQuestions() {
    var gameQuestions = [];
    var indexList = [];
    var index = questions.length;

    if (GAME_LENGTH > index){
        throw "Invalid Game Length.";
    }

    for (var i = 0; i < questions.length; i++){
        indexList.push(i);
    }

    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (var j = 0; j < GAME_LENGTH; j++){
        var rand = Math.floor(Math.random() * index);
        index -= 1;

        var temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        gameQuestions.push(indexList[index]);
    }

    return gameQuestions;
}

function populateRoundAnswers(gameQuestionIndexes, correctAnswerIndex, correctAnswerTargetLocation) {
    // Get the answers for a given question, and place the correct answer at the spot marked by the
    // correctAnswerTargetLocation variable. Note that you can have as many answers as you want but
    // only ANSWER_COUNT will be selected.
    var answers = [],
        answersCopy = questions[gameQuestionIndexes[correctAnswerIndex]][Object.keys(questions[gameQuestionIndexes[correctAnswerIndex]])[0]],
        temp, i;

    var index = answersCopy.length;

    if (index < ANSWER_COUNT){
        throw "Not enough answers for question.";
    }

    // Shuffle the answers, excluding the first element.
    for (var j = 1; j < answersCopy.length; j++){
        var rand = Math.floor(Math.random() * (index - 1)) + 1;
        index -= 1;

         temp = answersCopy[index];
        answersCopy[index] = answersCopy[rand];
        answersCopy[rand] = temp;
    }

    // Swap the correct answer into the target location
    for (i = 0; i < ANSWER_COUNT; i++) {
        answers[i] = answersCopy[i];
    }
    temp = answers[0];
    answers[0] = answers[correctAnswerTargetLocation];
    answers[correctAnswerTargetLocation] = temp;
    return answers;
}

function handleAnswerRequest(intent, session, callback) {
    var speechOutput = "";
    var sessionAttributes = {};
    var gameInProgress = session.attributes && session.attributes.questions;
    var answerSlotValid = isAnswerSlotValid(intent);
    var userGaveUp = intent.name === "DontKnowIntent";

    if (!gameInProgress) {
        // If the user responded with an answer but there is no game in progress, ask the user
        // if they want to start a new game. Set a flag to track that we've prompted the user.
        sessionAttributes.userPromptedToContinue = true;
        speechOutput = "There is no game in progress. Do you want to start a new game? ";
        callback(sessionAttributes,
            buildSpeechletResponse(CARD_TITLE, speechOutput, speechOutput, false));
    } else if (!answerSlotValid && !userGaveUp) {
        // If the user provided answer isn't a number > 0 and < ANSWER_COUNT,
        // return an error message to the user. Remember to guide the user into providing correct values.
        var reprompt = session.attributes.speechOutput;
        speechOutput = "Your answer must be a number between 1 and " + ANSWER_COUNT + ". " + reprompt;
        callback(session.attributes,
            buildSpeechletResponse(CARD_TITLE, speechOutput, reprompt, false));
    } else {
        var gameQuestions = session.attributes.questions,
            correctAnswerIndex = parseInt(session.attributes.correctAnswerIndex),
            currentScore = parseInt(session.attributes.score),
            currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex),
            correctAnswerText = session.attributes.correctAnswerText;

        var speechOutputAnalysis = "";

        if (answerSlotValid && parseInt(intent.slots.Answer.value) == correctAnswerIndex) {
            currentScore++;
            speechOutputAnalysis = "correct. ";
        } else {
            if (!userGaveUp) {
                speechOutputAnalysis = "wrong. "
            }
            speechOutputAnalysis += "The correct answer is " + correctAnswerIndex + ": " + correctAnswerText + ". ";
        }
        // if currentQuestionIndex is 4, we've reached 5 questions (zero-indexed) and can exit the game session
//        callback(session.attributes,
//        buildSpeechletResponse(CARD_TITLE, "current question" + currentQuestionIndex.toString() , "", true));
		if (speechOutputAnalysis == "correct. "  || currentQuestionIndex == GAME_LENGTH-1) {
  //      if (currentQuestionIndex == GAME_LENGTH - 1) {
            speechOutput = userGaveUp ? "" : "That answer is ";
            speechOutput += speechOutputAnalysis + "You got " + currentScore.toString() + " out of "
                + (currentQuestionIndex + 1).toString() + " questions correct. Thank you for playing!";
                if (speechOutputAnalysis == "correct. ") speechOutput += "Enjoy Your Prize from" + candyNumber;
			else speechOutput += "Try Again Next Time.";
			ready4Prize = 1;
        callback(session.attributes,
             buildSpeechletResponse(CARD_TITLE, speechOutput, "", true));
                
        } else {
            currentQuestionIndex += 1;
            ready4Prize = 0;

            var spokenQuestion = Object.keys(questions[gameQuestions[currentQuestionIndex]])[0];
            // Generate a random index for the correct answer, from 0 to 3
            correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
            var roundAnswers = populateRoundAnswers(gameQuestions, currentQuestionIndex, correctAnswerIndex),

                questionIndexForSpeech = currentQuestionIndex + 1,
                repromptText = "Question " + questionIndexForSpeech.toString() + ". " + spokenQuestion + " ";
            for (var i = 0; i < ANSWER_COUNT; i++) {
                repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
            }
            speechOutput += userGaveUp ? "" : "That answer is ";
            speechOutput += speechOutputAnalysis + "Your score is " + currentScore.toString() + ". " + repromptText;

            sessionAttributes = {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "currentQuestionIndex": currentQuestionIndex,
                "correctAnswerIndex": correctAnswerIndex + 1,
                "questions": gameQuestions,
                "score": currentScore,
                "correctAnswerText":
                    questions[gameQuestions[currentQuestionIndex]][Object.keys(questions[gameQuestions[currentQuestionIndex]])[0]][0]
            };
            callback(sessionAttributes,
                buildSpeechletResponse(CARD_TITLE, speechOutput, repromptText, false));
        }
    }
}


function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

function handleGetHelpRequest(intent, session, callback) {
    // Provide a help prompt for the user, explaining how the game is played. Then, continue the game
    // if there is one in progress, or provide the option to start another one.
    
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }

    // Set a flag to track that we're in the Help state.
    session.attributes.userPromptedToContinue = true;

    // Do not edit the help dialogue. This has been created by the Alexa team to demonstrate best practices.

    var speechOutput = "I will ask you " + GAME_LENGTH + " multiple choice questions. Respond with the number of the answer. "
        + "For example, say one, two, three, or four. To start a new game at any time, say, start game. "
        + "To repeat the last question, say, repeat. "
        + "Would you like to keep playing?",
        repromptText = "To give an answer to a question, respond with the number of the answer . "
        + "Would you like to keep playing?";
        var shouldEndSession = false;
    callback(session.attributes,
        buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession));
}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Thanks for playing, Good bye!", "", true));
}

function isAnswerSlotValid(intent) {
    var answerSlotFilled = intent.slots && intent.slots.Answer && intent.slots.Answer.value;
    var answerSlotIsInt = answerSlotFilled && !isNaN(parseInt(intent.slots.Answer.value));
    return answerSlotIsInt && parseInt(intent.slots.Answer.value) < (ANSWER_COUNT + 1) && parseInt(intent.slots.Answer.value) > 0;
}

// ------- Helper functions to build responses -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
