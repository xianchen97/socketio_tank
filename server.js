let express = require("express");
let http = require("http");
let path = require("path");
let socketIO = require("socket.io");

let app = express();
let server = http.Server(app);
let firstPlayer = true;
let maxPlayers = 1;
var io = socketIO(server);
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
let allClients = [];
io.on("connection", function(socket) {
  socket.on("disconnect", function() {
    console.log(socket.id);
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
    console.log(players[socket.id])
    if(players[socket.id] != null){
      x = players[socket.id]
      firstPlayer = x.firstPlayer
    }
    delete players[socket.id];
    maxPlayers--;
  });

  socket.on("new player", function() {
    if (firstPlayer && (maxPlayers <= 2)) {
      players[socket.id] = {
        x: 300,
        y: 0,
        firstPlayer: true,
        lives: 3,
      };
      firstPlayer = false;
      maxPlayers++;
      console.log('first player');
    } else if (!firstPlayer && (maxPlayers <= 2)) {
      players[socket.id] = {
        x: 300,
        y: 575,
        firstPlayer: false,
        lives: 3,
      };
      console.log('second player')
      firstPlayer = true;
      maxPlayers++;
    }
    else{
      console.log("fuckkkk");
    }
  });

  socket.on("movement", function(data) {
    var player = players[socket.id] || {};
    if (data.key_code == 97) {
      if (player.x >= 5) {
        player.x -= 5;
      }
    }
    if (data.key_code == 119) {
      if (player.y >= 5) {
        player.y -= 5;
      }
    }
    if (data.key_code == 100) {
      if (player.x <= 600) {
        player.x += 5;
      }
    }
    if (data.key_code == 115) {
      if (player.y <= 575) {
        player.y += 5;
      }
    }
  });
});

setInterval(function() {
  io.sockets.emit("state", players);
}, 1000 / 60);

setInterval(function() {
  io.sockets.emit("lives", players);
}, 1000);



