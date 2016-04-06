var Botkit = require('botkit');
var fs = require("fs");
var params = {};
var http = require("https");

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

  http.get({
      host: 'frinkiac.com',
      path: '/api/search?q=rappin%27%20ronnie%20regan'},
           function(response){
              var body = "";
              response.on("data", function(d) {
                body += d;
              });

              response.on("end", function(){
                var json = JSON.parse(body);
                console.log(body);
                callback(json);
              })
              });
}

// give the bot something to listen for.
controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {
  /*http.request({
      host: 'frinkiac.com',
      path: '/api/search?q=rappin%27%20ronnie%20regan'}, callback).end("blah");*/
  //bot.reply(message,'Hello yourself.');
  frinkiac("", function(json){
    bot.reply(message, "Hello Yourself "+
              "https://frinkiac.com/img/"+json[0].Episode+"/"+json[0].Timestamp+".jpg");
  })

});