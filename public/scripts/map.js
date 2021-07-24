const map = {
  tileW: 40,
  tileH: 40,
  mapW: 5,
  mapH: 5,
  board: [
    "", 1, "", "", "",
    "", "", "", 0, "",
    "", "", 1, 0, "",
    "", "", "W", "", "",
    "", "", "", "", ""
  ],
  canvas: document.getElementById("map"),
  context: document.getElementById("map").getContext("2d")
};

const frames = {
  current: 0,
  count: 0,
  lastSecond: 0,
  lastFrameTime: 0
};


function setMap(){
  map.canvas.width = window.innerWidth; 
  map.canvas.height = window.innerHeight;
  requestAnimationFrame(render);
}

function toIndex(x, y)
{
	return((y * map.mapW) + x);
}


function render(){
  let currentFrameTime = Date.now();
	let timeElapsed = currentFrameTime - frames.lastFrameTime;


  if(map.context === null) return;
  let second = Math.floor(Date.now()/1000);
  if(second !== frames.current){
    frames.current = second;
    frames.lastSecond = frames.count;
    frames.count = 1;
  } else {
    frames.count++;
  }

  for (let y = 0; y < map.mapH; y++) {
    for (let x = 0; x < map.mapW; x++) {
      switch(map.board[(y*map.mapW)+x]){
        case 0:
          map.context.fillStyle = "#999999";
          break;
        case "W":
          map.context.fillStyle = "blue";
          break;
        default: 
          map.context.fillStyle = "green";
      }
      map.context.fillRect(x*map.tileW, y*map.tileH, map.tileW, map.tileH);
    
    }
    
  }

  map.context.fillStyle = "#ff0000";
  map.context.fillRect(player.position[0], player.position[1],
		player.dimensions[0], player.dimensions[1]);

  map.context.fillStyle = "#ff0000";
  map.context.fillText(`FPS: ${frames.lastSecond}`, 10, 20);

  frames.lastFrameTime = currentFrameTime;
  requestAnimationFrame(render);

}