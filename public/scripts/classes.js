console.log(
  "%c [Classes Loaded]",
  "padding:5px; background:orange; color:white;"
);

const socket = io();

class Player {
  constructor(data, role) {
    this.data = data;
    this.role = role;

    // render rulesets
    this.tileFrom = [1,1];
    this.tileTo = [1,1];
    this.timeMoved = 0;
    this.dimensions = [30,30];
    this.position = [40,40];
    this.delayMove = 700;

    this.move = this.move.bind(this);
    this.look = this.look.bind(this);
    this.activate = this.activate.bind(this);
  }

  placeAt(x,y){
    this.tileFrom	= [x,y];
	  this.tileTo		= [x,y];
	  this.position	= [((tileW*x)+((tileW-this.dimensions[0])/2)),
		((tileH*y)+((tileH-this.dimensions[1])/2))];
  }

  processMovement(t){
    if(this.tileFrom[0]===this.tileTo[0] && this.tileFrom[1]===this.tileTo[1]){      
      return false; 
    }

    if((t-this.timeMoved)>=this.delayMove){
        this.placeAt(this.tileTo[0], this.tileTo[1]);
    } else {
      this.position[0] = (this.tileFrom[0] * tileW) + ((tileW-this.dimensions[0])/2);
      this.position[1] = (this.tileFrom[1] * tileH) + ((tileH-this.dimensions[1])/2);

      if(this.tileTo[0] != this.tileFrom[0]) {
			  let diff = (tileW / this.delayMove) * (t-this.timeMoved);
			  this.position[0]+= (this.tileTo[0]<this.tileFrom[0] ? 0 - diff : diff);
		  }
		  if(this.tileTo[1] != this.tileFrom[1]) {
			  let diff = (tileH / this.delayMove) * (t-this.timeMoved);
			  this.position[1]+= (this.tileTo[1]<this.tileFrom[1] ? 0 - diff : diff);
		  }

      this.position[0] = Math.round(this.position[0]);
		  this.position[1] = Math.round(this.position[1]);
    }
    return true;

  }

  move(e) {
    if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */) {
      console.log("up");
      socket.emit("move", { id: this.data.socket_id, movement: "up" });
    }
    if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
      console.log("right");
      socket.emit("move", { id: this.data.socket_id, movement: "right" });
    }
    if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
      console.log("down");
      socket.emit("move", { id: this.data.socket_id, movement: "down" });
    }
    if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */) {
      console.log("left");
      socket.emit("move", { id: this.data.socket_id, movement: "left" });
    }
  }

  look(e) {
    let characterCenter = document
      .getElementById(`player-${this.data.socket_id}`)
      .getBoundingClientRect();
    let characterHitBox = {
      x: characterCenter.left + characterCenter.width / 2,
      y: characterCenter.top + characterCenter.height / 2,
    };
    let angle =
      Math.atan2(e.pageX - characterHitBox.x, -(e.pageY - characterHitBox.y)) *
      (180 / Math.PI);
    document.getElementById(
      `player-${this.data.socket_id}`
    ).style.transform = `rotate(${angle}deg)`;

    socket.emit("look", { id: this.data.socket_id, angle });
  }

  activate(e) {
    if (e.keyCode === 69) {
      console.log("activate");
    }
  }

  reassignRole(role) {
    document.body.removeEventListener("mousedown", this.role.attack);
    this.role = role;
    document.body.addEventListener("mousedown", this.role.attack);
  }
}

class Role {
  constructor() {
    this.attack = this.attack.bind(this);
  }

  attack(e) {
    if (e.button === 0) console.log("attacked");
  }
}

class Gatherer extends Role {
  constructor(level = 1) {
    super();
    this.level = level;
  }

  attack(e) {
    if (e.button === 0) console.log("gather attack");
  }
}

class Knight extends Role {
  constructor(level = 1) {
    super();
    this.level = level;
  }

  attack(e) {
    if (e.button === 0) console.log("knight attack");
  }
}

socket.on("move", function (msg) {
  console.log(msg);
});

socket.on("newPlayer", function (id, allPlayers) {
  console.log(allPlayers);
  createPlayer(id);
});

socket.on("look", function (data) {
  const lookingPlayer = document.getElementById(`player-${data.id}`);
  if (lookingPlayer === null) {
    createPlayer(data.id);
  } else {
    document.getElementById(
      `player-${data.id}`
    ).style.transform = `rotate(${data.angle}deg)`;
  }
});

function createPlayer(id) {
  const newPlayerBox = document.createElement("div");
  newPlayerBox.classList.add("player-box");
  newPlayerBox.innerHTML = `<div class="player" id="player-${id}" ></div><div class="player-tag">${id}</div>`;

  document.body.appendChild(newPlayerBox);
}
