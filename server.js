var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
var app = express();
var server = http.Server(app);
var io = socketIO(server);
let max = true;
app.set("port", 5000);
app.use("/static", express.static(__dirname + "/public"));
// Routing
app.get("/", function(request, response) {
  response.sendFile(path.join(__dirname + "/public", "index.html"));
});
// Starts the server.
server.listen(5000, function() {
  console.log("Starting server on port 5000");
});

var players = {};
var allClients = [];
io.on("connection", function(socket) {
  socket.on('disconnect', function() {
    console.log(socket.id);
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
 });

  socket.on("new player", function() {
    if(max){
      players[socket.id] = {
        x: 300,
        y: 0,
      };
      max = false;
  }
  else{
    players[socket.id] = {
      x: 300,
      y: 575,
    };
    max = true;
  }
  });
  socket.on("movement", function(data) {
    var player = players[socket.id] || {};
    if (data.key_code == 97) {
      if(player.x >= 5){
        player.x -= 5;
      }
    }
    if (data.key_code == 119) {
      if(player.y >= 5){
      player.y -= 5;
      }
      
    }
    if (data.key_code == 100) {
      if(player.x <= 600){
      player.x += 5;
      }
      }
    if (data.key_code == 115) {
      if(player.y <= 575 ){
      player.y += 5;
      }
    }
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);