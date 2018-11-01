//Vars
let socket = io();
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

//Hooks
document.onmousemove = function(e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
};

//Listen for keypress, Tanks only go left and right.
document.addEventListener("keypress", function(event) {
  switch (event.keyCode) {
    case 97: // A
      movement.key_code = 97;
      break;
    case 100: // D
      movement.key_code = 100;
      break;
  }
});

document.addEventListener("keyup", function(event) {
  movement.key_code = 0;
});

//Keycode pressed for each browser
let movement = {
  key_code: 0
};

let mouse = {
  x: 0,
  y: 0,
  angle: 0
};

let tank = function(x, y) {
  context.beginPath();
  context.rect(x, y, 40, 20);
  context.fill();
};

//Constantly update player movement unique to each socket.
socket.emit("new player");
setInterval(function() {
  socket.emit("movement", movement);
}, 1000 / 60);


//Game State
socket.on("state", function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = "green";
  //Render out tank for each player
  for (var id in players) {
    //Select player logged in
    var player = players[id];
    tank(player.x, player.y);
    //Create barrel to follow on mouse movement
    // context.globalCompositeOperation = "lighter";
    // context.strokeStyle = "#a00";
    // context.lineWidth = Math.random() * 2;
    // context.beginPath();
    // context.moveTo(325, 5)
    // context.lineTo(mouse.x, 30);
    // context.stroke();
    // context.globalCompositeOperation = "source-over";
  }
});



let lookAt = {
  calc: function(x, y, lookX, lookY) {
    if (x == lookX && y == lookY) return 0;

    x = lookX - x;
    y = lookY - y;

    var angle = this.angle(x, y, 1, 0);

    if (y < 0) {
      return 2 * Math.PI - angle;
    } else {
      return angle;
    }
  },

  // utilities
  length: function(x, y) {
    return Math.sqrt(x * x + y * y);
  },

  dot: function(ax, ay, bx, by) {
    return ax * bx + ay * by;
  },

  angle: function(ax, ay, bx, by) {
    return Math.acos(
      this.dot(ax, ay, bx, by) / (this.length(ax, ay) * this.length(bx, by))
    );
  }
};
