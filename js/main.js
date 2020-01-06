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

let winScore = 350;
let targetSpeed = 0.3;
let enemySpeed = 1.2;
let deadSpeed = 1.5;
let interval = 900;
let spawnDeadWhen = 75;
let spawnInterval = 30;

target.style.transition = targetSpeed+"s";

dead.style.transition = deadSpeed+"s";
let death = setInterval(move, interval, dead);

let mouseX = 1000;
let mouseY = 1000;

document.onmousemove = findMouse;

function findMouse(e){
  mouseX = e.pageX+15;
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
      loseLife(enemies[i]);
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
  if( mouseX>=target.getBoundingClientRect().left &&
      mouseX<=target.getBoundingClientRect().right &&
      mouseY>=target.getBoundingClientRect().top &&
      mouseY<=target.getBoundingClientRect().bottom)
  {
    clearInterval(collision);
    damaged = true;
    getPoint();
    setTimeout(function(){
      damaged = false;
      collision = setInterval(findCollision, 50);
    }, 100);
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
  let x = Math.floor(Math.random() * (width - (getWidth(element)/2)));
  let y = Math.floor(Math.random() * (height - (getHeight(element)/2)));
  element.style.marginLeft = x+"px";
  element.style.marginTop = y+"px";
}

function spawn(element){
  element.style.display = "block";
}

function getPoint() {
  if(score > 5){
    if(score < 175){
      if(score % 10 === 0){
        target.style.width = target.offsetWidth-10+"px";
        target.style.height = target.offsetHeight-10+"px";
      }
    }
  }
  animate(target);
  pointAnimate();
  if(score < winScore){
    score++;
  }
  setScore();
  if(score < winScore){
    move(target);
  }
  if(score === winScore){
    winGame();
  }
  if(score >= spawnDeadWhen){
    spawn(dead);
  }
  if(score < (enemies.length*spawnInterval)-1){
    if(score % spawnInterval === 0){
      spawn(enemies[((score/spawnInterval)-1)]);
    }
  }
}

function loseLife(element){
  animate(element);
  damageAnimate();
  lives--;
  setLives();
  if(lives === 0){
    loseGame();
  }
}

function animate(element){
  element.classList.add("animate");
  setTimeout(function(){
    element.classList.remove("animate");
  }, 100);
}

function damageAnimate(){
  document.getElementById("game").style.background = "red";
  setTimeout(function(){
    document.getElementById("game").style.background = "";
  }, 100);
}

function pointAnimate(){
  document.getElementById("game").style.background = "green";
  setTimeout(function(){
    document.getElementById("game").style.background = "";
  }, 70);
}

function loseGame(){
  lives = 0;
  setLives();
  clearInterval(death);
  clearInterval(collision);
  dead.classList.add("yeet");
  setTimeout(function(){
    dead.classList.add("gameOver");
  }, 50);
  setTimeout(function(){
    document.getElementById("overlay").classList.remove('gone');
    setTimeout(function(){
      document.getElementById("overlay").classList.add('yeet');
    }, 50);
  }, 2000);
  document.getElementById("overlaytext").innerHTML = "Game over, your score was "+score+"!";
}

function winGame(){
  //dead.classList.add('gone');
  for(let i = 0; i < enemies.length; i++){
    enemies[i].classList.add('gone');
  }
  clearInterval(death);
  clearInterval(collision);
  target.classList.add("yeet");
  document.getElementById('link').classList.add('winLink');
  setTimeout(function(){
    target.classList.add("gameWin");
  }, 50);
  setTimeout(function(){
    document.getElementById("overlay").classList.remove('gone');
    setTimeout(function(){
      document.getElementById("overlay").classList.add('yeet');
      document.getElementById("overlay").classList.add('overlayWin');
    }, 50);
  }, 2000);
  document.getElementById("overlaytext").innerHTML = "You crazy son of a bitch, you did it! You won!";
}