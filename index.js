var Botkit = require('botkit');
var fs = require("fs");
var params = {};

var API_KEY = fs.readFileSync("api_key", "utf8");

var controller = Botkit.slackbot({
  debug: true
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: API_KEY,
}).startRTM()

// give the bot something to listen for.
controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,'Hello yourself.');
});