let score = 0;
let lives = 3;
let target = document.getElementById('target');
let immune = false;
let gotPoint = false;

let mouseX = 0;
let mouseY = 0;

let spawnEnemyInterval = 10;
let spawnLifeInterval = 25;
let spawnSnitchInterval = 100;
let spawnShieldInterval = 75;

let spawnBoss = 50;

let shieldTime = 5000;

initialise();

function initialise(){
  setScore();
  setLives();
  setSpeed(target, 0.4);
  detectTarget();
  document.onmousemove = findMouse;
}

function detectTarget() {
    setInterval(function () {
        if (findCollision(target) === true) {
            getPoint();
        }
    }, 50);
}

function findCollision(element) {
    if (mouseX+10 >= element.getBoundingClientRect().left &&
        mouseX+10 <= element.getBoundingClientRect().right &&
        mouseY >= element.getBoundingClientRect().top &&
        mouseY <= element.getBoundingClientRect().bottom) {
        return true;
    }
  if (mouseX-10 >= element.getBoundingClientRect().left &&
      mouseX-10 <= element.getBoundingClientRect().right &&
      mouseY >= element.getBoundingClientRect().top &&
      mouseY <= element.getBoundingClientRect().bottom) {
    return true;
  }
  if (mouseX >= element.getBoundingClientRect().left &&
      mouseX <= element.getBoundingClientRect().right &&
      mouseY+10 >= element.getBoundingClientRect().top &&
      mouseY+10 <= element.getBoundingClientRect().bottom) {
    return true;
  }
  if (mouseX >= element.getBoundingClientRect().left &&
      mouseX <= element.getBoundingClientRect().right &&
      mouseY-10 >= element.getBoundingClientRect().top &&
      mouseY-10 <= element.getBoundingClientRect().bottom) {
    return true;
  }

}

function getPoint() {
    if(gotPoint === false){
      score++;
      setScore();
      move(target);
      gotPoint = true;
      if (score % spawnEnemyInterval === 0) {
        spawn("enemy", 2);
      }
      if (score % spawnLifeInterval === 0) {
        spawn("life", 1);
      }
      if (score === spawnBoss) {
        spawn("boss", 3);
      }
      if(score % spawnSnitchInterval === 0){
        spawn("snitch", 0.4);
      }
      if(score % spawnShieldInterval === 0){
        spawn("shield", 5);
      }
      setTimeout(function () {
        gotPoint = false;
      }, 200);
    }
}

function spawn(className, speed) {
    let spawn = document.createElement('div');
    spawn.classList.add(className);
    document.getElementById('game').appendChild(spawn);
    setSpeed(spawn, speed);
    enemyMove(spawn);
    setEffect(spawn);
}

function move(element) {
    let x = Math.floor(Math.random() * (getScreenWidth() - getWidth(element)));
    let y = Math.floor(Math.random() * (getScreenHeight() - getHeight(element)));
    element.style.marginLeft = x + "px";
    element.style.marginTop = y + "px";
}

function enemyMove(element) {
    move(element);
    setTimeout(function () {
        if (lives > 0) {
            enemyMove(element);
        }
      }, getSpeed(element) * 1000);
}

function setEffect(element) {
    switch (element.className) {
        case "enemy":
            setInterval(function () {
                if (findCollision(element) === true && immune === false) {
                    loseLife();
                    noCollision(500);
                }
            }, 50);
            break;
        case "boss":
            setInterval(function () {
                if (findCollision(element) === true && immune === false) {
                    loseGame();
                }
            }, 50);
            break;
        case "life":
            setInterval(function () {
                if (findCollision(element) === true) {
                    gainLife(element);
                }
            }, 50);
            break;
      case "snitch":
        setInterval(function () {
          if (findCollision(element) === true) {
            catchSnitch(element);
          }
        }, 50);
        break;
      case "shield":
        setInterval(function () {
          if (findCollision(element) === true && immune === false) {
            noCollision(shieldTime);
            animateShield(shieldTime);
            destroy(element);
          }
        }, 50);
        break;
    }
}

function noCollision(immuneTime) {
    immune = true;
    setTimeout(function () {
        immune = false;
    }, immuneTime)
}

function destroy(element) {
    document.getElementById('game').removeChild(element);
}

function catchSnitch(element) {
  score = score+50;
  setScore();
  destroy(element);
  animateSnitch();
  let enemies = document.getElementsByClassName("enemy");
  for(let i = 0;i<3; i++){
    destroy(enemies[i]);
  }
}

function gainLife(element) {
    lives++;
    setLives();
    animateLife();
    destroy(element);
}

function loseLife() {
    lives--;
    setLives();
    animateDamage();
    if (lives === 0) {
        loseGame();
    }
}

function loseGame() {
  document.getElementById('highscore').innerHTML = "Your score was "+score+"!";
  animateLoss();
}

function animateLife() {
  document.getElementById('body').style.background = "rgb(90,15,60)";
  setTimeout(function () {
    document.getElementById('body').style.background = "rgb(15,15,15)";
  }, 100);
}

function animateShield(shieldTime){
  let animate = true;
  let time = 5;
  document.getElementById('counter').innerHTML = ""+time;
  document.getElementById('cursor').classList.add('shielded');
  countDown();
  function countDown(){
    setTimeout(function () {
      time--;
      document.getElementById('counter').innerHTML = ""+time;
      if(animate === true){
        countDown();
      } else{
        document.getElementById('counter').innerHTML = "";
      }
    }, 1000);
  }
  setTimeout(function () {
    document.getElementById('cursor').classList.remove('shielded');
    document.getElementById('counter').innerHTML = "";
    animate = false;
  }, shieldTime)
}

function animateSnitch() {
  lives++;
  setLives();
  document.getElementById('body').style.background = "rgb(120,100,15)";
  setTimeout(function () {
    document.getElementById('body').style.background = "rgb(15,15,15)";
  }, 100);
}

function animateDamage() {
  document.getElementById('body').style.background = "rgb(80,15,15)";
  setTimeout(function () {
    document.getElementById('body').style.background = "rgb(15,15,15)";
  }, 100);
}

function animateLoss(){
  document.getElementById('overlayLoss').classList.remove('gone');
  setTimeout(function () {
    document.getElementById('overlayLoss').classList.add("overlay");
  }, 50);
  document.getElementById('body').style.cursor = "default";
  document.getElementById('cursor').style.display = "none";
}

function findMouse(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    document.getElementById('cursor').style.marginLeft = mouseX-10+"px";
    document.getElementById('cursor').style.marginTop = mouseY-10+"px";
}

function getScreenWidth() {
    return window.innerWidth;
}

function getScreenHeight() {
    return window.innerHeight;
}

function getWidth(element) {
    return element.offsetWidth;
}

function getHeight(element) {
    return element.offsetHeight;
}

function getSpeed(element) {
    let speed = element.style.transition.replace('all ', '');
    return speed.replace('s ease 0s', '');
}

function setScore() {
    document.getElementById('score').innerHTML = "" + score;
}

function setLives() {
    document.getElementById('lives').innerHTML = "" + lives;
}

function setSpeed(element, speed) {
    element.style.transition = speed + "s";
}