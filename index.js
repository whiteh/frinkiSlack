var Botkit = require('botkit');
var fs = require("fs");
var params = {};
var http = require("https");
var loud = true;

var API_KEY = fs.readFileSync("api_key", "utf8");

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  token: API_KEY,
}).startRTM()

callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function (test) {
    console.log("test: "+test);
    bot.reply(message,'Hello yourself.')

  });
}

function frinkiac(term, callback) {
  if (term.length > 20) {
    return;
  }
  term = encodeURIComponent(term);
  //console.log(term)
  http.get({
      host: 'frinkiac.com',
      path: '/api/search?q='+term},
           function(response){
              var body = "";
              response.on("data", function(d) {
                body += d;
              });

              response.on("end", function(){
                var json = JSON.parse(body);
                //console.log(body);
                callback(json);
              })
              }).end();
}

// give the bot something to listen for.
/*controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {*/
controller.on('direct_message', function(bot, message) {
  console.log(message);
  if (message.text === "shut up") {
    loud = false;
    //bot.reply("Okay... :()");
    return;
  }
  if (message.text === "go nuts") {
    loud = true;
    //bot.reply("Yeah!")
    return;
  }
  if (!loud) {
    return;
  }
  frinkiac(message.text, function(json){
    var rand;
    rand = Math.pow(Math.random(), 2);
    rand = Math.round(rand*(json.length));//>10 ? 10 : json.length));
    bot.reply(message, "https://frinkiac.com/img/"+json[rand].Episode+"/"+json[rand].Timestamp+".jpg");
  })
});