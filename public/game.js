var socket = io();

var movement = {
  key_code: 0
}

document.addEventListener('keypress', function(event) {
    switch (event.keyCode) {
      case 97: // A
         movement.key_code = 97;
        break;
      case 119: // W
          movement.key_code = 119;
        break;
      case 100: // D
        movement.key_code = 100;
      break;
      case 115: // S
        movement.key_code = 115
        break;
    } 
  });

  socket.emit('new player');
  setInterval(function() {
    socket.emit('movement', movement);
  }, 1000 / 60);


  

 
  var canvas = document.getElementById('canvas');
  canvas.width = 800;
  canvas.height = 600;
  var context = canvas.getContext('2d');
  var gun = canvas.getContext('2d');
  socket.on('state', function(players) {
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = 'green';
    for (var id in players) {
      var player = players[id];
      context.beginPath();
      context.rect(player.x,player.y,40,20);
      context.fill();
    }
  });

