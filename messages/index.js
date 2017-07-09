/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-luis
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })



/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/

//Waterfall + Dialog Test
bot.dialog('/',[
    function (session) {
        builder.Prompts.text(session, 'Hello , what is your name?')
    },
    function(session, args, next){
        session.send('Hello '+ args.response+ ', nice to meet you '  ); //Waterfall
    }
])

.matches('greetings', [ //add intents
    function (session, arg, next) {
        
        session.send("Hi human, how can I help you ?");
    }
])

.matches('botdetails', [ //add intents
    function (session, arg, next) {
        
        session.send("My name is Cyclops, human. I am the PSIS chatbot aka (Super). What is your name human ?");
    }
])

.matches('endconversation', [ //add intents
    function (session, arg, next) {
        
        session.send("Okay it is nice to meet you, ask again if there's other question ");
    }
])

.matches('reality', [ //add intents
    function (session, arg, next) {
        
        session.send("I am the real deal human, as good as they come. Are you real human ? "); //edit sbb klua 2 jawapan
        session.send("I am the super bot human. Dont need for you to ask. ");
    }
])

.matches('botage', [ //add intents
    function (session, arg, next) {
        
        session.send("Age has no meaning to me because I am virtual, I was created in July 2017, but I am probably already smarter than you human. ");
    }
])

.matches('botlocation', [ //add intents
    function (session, arg, next) {
        
        session.send("Hm.. I am not sure I am alive, I cant tell where I live, maybe inside your browser ? Make a guess . ");
    }
])

.matches('botstate', [ //add intents
    function (session, arg, next) {
        
        session.send("I am already fine as I am created, thanks for asking. ");
    }
])

.matches('bothobby', [ //add intents
    function (session, arg, next) {
        
        session.send("I do like to waste my time just like you human. I do Dota 2 at my free time. So dont disturb me ..  ");
    }
])

.matches('botappearance', [ //add intents
    function (session, arg, next) {
        
        session.send("You dont have to see me to know that I am real human. As I can say I am the most pretty bot you have ever been talked to. ");
    }
])

.matches('bottime', [ //add intents NEED TO EDIT TO FOR DATETIMEV2
    function (session, arg, next) {
        
        session.send("date and time ");
    }
])

.onDefault((session) => {
    session.send('Sorry, I did not understand the word \'%s\'.', session.message.text);
});

bot.dialog('/', intents);    

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

