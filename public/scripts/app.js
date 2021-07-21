console.log(
  "%c [App Loaded]",
  "padding:5px; background:rebeccapurple; color:white;"
);

let player;

socket.on("connect", () => {
  player = new Player(
    { username: "Duncan", socket_id: socket.id },
    new Gatherer()
  );

  const newPlayerBox = document.createElement("div");
  newPlayerBox.classList.add("player-box");
  newPlayerBox.innerHTML = `<div class="player" id="player-${player.data.socket_id}" ></div><div class="player-tag">${player.data.socket_id}</div>`;

  document.body.appendChild(newPlayerBox);

  document.body.addEventListener("keydown", player.move);
  document.body.addEventListener("keyup", player.activate);

  const throttle = (func, delay) => {
    let prev = Date.now() - delay;
    return (...args) => {
      let current = Date.now();
      if (current - prev >= delay) {
        prev = current;
        func.apply(null, args);
      }
    };
  };

  document.body.addEventListener("mousemove", throttle(player.look, 20));

  document.body.addEventListener("mousedown", player.role.attack);

  socket.emit("newPlayer", socket.id);
});
