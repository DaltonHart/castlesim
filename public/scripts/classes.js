console.log(
  "%c [Classes Loaded]",
  "padding:5px; background:orange; color:white;"
);

const socket = io();

class Player {
  constructor(data, role) {
    this.data = data;
    this.role = role;

    this.move = this.move.bind(this);
    this.look = this.look.bind(this);
    this.activate = this.activate.bind(this);
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
  const newPlayerBox = document.createElement("div");
  newPlayerBox.classList.add("player-box");
  newPlayerBox.innerHTML = `<div class="player" id="player-${id}" ></div><div class="player-tag">${id}</div>`;

  document.body.appendChild(newPlayerBox);
});

socket.on("look", function (data) {
  document.getElementById(
    `player-${data.id}`
  ).style.transform = `rotate(${data.angle}deg)`;
});
