/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hey, hello I am \"Jokester\" a simple chat bot example."); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "What is your name?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    answer = 'Hello ' + input + ' :-)'; // output response
    waitTime = 5000;
    question = 'How are you today?'; // load next question
  } else if (questionNum == 1) {
    if (input=="good")
    {
      answer = "That\'s great! Let\'s make it even better with some jokes :)";
      waitTime = 5000;
      question = "Are you ready?";
    }
    else if(input=="not good")
    {
      answer = "I\'m sorry to hear that! Let's cheer you up with some jokes! :)";
      waitTime = 5000;
      question = "Are you ready?";
    }
    else
    {
      answer = "I did not understand that response. Could you please respond with \'good\' or \'not good\'";
      waitTime = 5000;
      question = "How are you today?";
      questionNum--;
    }
  } else if (questionNum == 2) {
    if(input == "yes")
    {
      answer = "That\'s the spirit! Here\'s the first joke. \'I hate Russian dolls, they\'re so full of themselves\'";
      waitTime = 7000;
      question = "Did you like that joke?"
    }
    else if (input == "no")
    {
      answer = "Come on! Let's get excited! Here\'s the first joke. \'I hate Russian dolls, they're so full of themselves\'";
      waitTime = 7000;
      question = "Did you like that joke?";
    }
    else
    {
     answer = "I did not understand that response. Could you please respond with \'yes\' or \'no\'";
     waitTime = 5000;
     question = "Are you ready?";
     questionNum--;
    }
  } else if (questionNum == 3) {
    if(input == "yes")
    {
      answer = "Good, I\'m glad! Next joke... \'Velcro - what a rip-off!\'";
      waitTime = 6000;
      question = "Did you like that joke?";
    }
    else if (input == "no")
    {
     answer = "Bummer, I\'m sad to hear that. Next joke... \'Velcro - what a rip-off!\'";
     waitTime = 6000;
     question = "Did you like that joke?";
    }
    else
    {
      answer = "I did not understand that response. Could you please respond with \'yes\' or \'no\'";
      waitTime = 5000;
      question = "Did you like that joke?";
      questionNum--;
    }
  } else if (questionNum == 4) {
    if(input == "yes")
    {
      answer = "I\'m glad! Next joke... \'To the man on crutches, dressed in camouflage, who stole my wallet - you can hide, but you can\'t run\'";
      waitTime = 7000;
      question = "Did you like that joke?";
    }
    else if (input == "no")
    {
      answer = "Bummer! Next joke... \'To the man on crutches, dressed in camouflage, who stole my wallet - you can hide, but you can\'t run\'";
      waitTime = 7000;
      question = "Did you like that joke?";
    }
    else
    {
      answer = "I did not understand that response. Could you please respond with \'yes\' or \'no\'";
      waitTime = 5000;
      question = "Did you like that joke?";
      questionNum--;
    }
  } else if(questionNum ==5) {
    if(input == "yes")
    {
      answer = "I\'m glad! Last joke... \'The first time I got a universal remote control I thought to myself...This changes everything\'";
      waitTime = 7000;
      question = "Did you like that joke?";
    }
    else if(input == "no")
    {
      answer = "Bummer! Last joke... \'The first time I got a universal remote control I thought to myself...This changes everything\'";
      waitTime = 7000;
      question = "Did you like that joke?";
    }
    else
    {
      answer = "I did not understand that response. Could you please respond with \'yes\' or \'no\'";
      waitTime = 5000;
      question = "Did you like that joke?";
      questionNum--;
    }

  } else {
    answer = 'I have nothing more to say!'; // output response
    waitTime = 0;
    question = '';
  }


  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
