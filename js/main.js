const barHeight = getHeight(document.getElementById('bar'));
let width = getWidth(window);
let height = getHeight(window) - barHeight;

let score = 0;
let lives = 3;
let damaged = false;
let collision = setInterval(findCollision, 50);

setScore();
setLives();

const target = document.getElementById('target');
const dead = document.getElementById('dead');
let enemies = document.getElementsByClassName('enemy');

let targetSpeed = 0.3;
let enemySpeed = 1.2;
let deadSpeed = 1.5;
let interval = 900;
let spawnDeadWhen = 50;
let spawnInterval = 10;

target.style.transition = targetSpeed+"s";
target.onmouseover = getPoint;

dead.style.transition = deadSpeed+"s";
setInterval(move, interval, dead);

let mouseX = 1000;
let mouseY = 1000;

document.onmousemove = findMouse;

function findMouse(e){
  mouseX = e.pageX;
  mouseY = e.pageY;
}

function findCollision(){
  for(let i = 0; i < enemies.length; i++){
    if( mouseX>=enemies[i].getBoundingClientRect().left &&
      mouseX<=enemies[i].getBoundingClientRect().right &&
      mouseY>=enemies[i].getBoundingClientRect().top &&
      mouseY<=enemies[i].getBoundingClientRect().bottom &&
      damaged === false)
    {
      clearInterval(collision);
      damaged = true;
      loseLife();
      setTimeout(function(){
        damaged = false;
        collision = setInterval(findCollision, 50);
      }, 500);
    }
  }
  if( mouseX>=dead.getBoundingClientRect().left &&
    mouseX<=dead.getBoundingClientRect().right &&
    mouseY>=dead.getBoundingClientRect().top &&
    mouseY<=dead.getBoundingClientRect().bottom)
  {
    loseGame();
  }
}

for(let i = 0; i < enemies.length; i++){
  enemies[i].style.transition = enemySpeed+"s";
  setInterval(move, interval, enemies[i]);
}

checkScreen();

function checkScreen(){
  width = window.innerWidth;
  height = window.innerHeight - barHeight;
}

function getWidth(element) {
  return element.offsetWidth;
}

function getHeight(element) {
  return element.offsetHeight;
}

function setLives(){
  document.getElementById('lives').innerHTML = lives;
}

function setScore(){
  document.getElementById('score').innerHTML = score;
}

function move(element) {
  checkScreen();
  let x = Math.floor(Math.random() * (width - getWidth(element)));
  let y = Math.floor(Math.random() * (height - getHeight(element)));
  element.style.marginLeft = x+"px";
  element.style.marginTop = y+"px";
}

function spawn(element){
  element.style.display = "block";
}

function getPoint() {
  score++;
  setScore();
  move(this);
  if(score >= spawnDeadWhen){
    spawn(dead);
  }
  if(score < (enemies.length*spawnInterval)-1){
    if(score % spawnInterval === 0){
      spawn(enemies[((score/spawnInterval)-1)]);
    }
  }
}

function loseLife(){
  lives--;
  setLives();
  if(lives === 0){
    loseGame();
  }
}

function loseGame(){
  alert("You died, your score is "+score+"!");
  location.reload();
}

