//song by David Fesliyan

document.querySelector(".start-game").addEventListener("click", ()=>{
    document.querySelector(".start-game").style.display = 'none';
    startGame(0)
})

let gameOn = true
let score = 0
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let ASTEROIDSAMOUNT = 5
let ASTEROIDSONSCREEN = []
canvas.width = 500;
canvas.height = 500;
const IMPACTSONG = new Audio("./songs/impact.wav")
const GAMEMUSIC = new Audio("./songs/music.mp3")
let df = 0;
GAMEMUSIC.play();


    const commands = {
    up: "ArrowUp",
    left:"ArrowLeft",
    right:"ArrowRight",
    down: "ArrowDown",
    shoot: "s"
}

class Inputs{
    constructor(){
        this.keys = [];
        
        document.querySelectorAll(".btn").forEach(button => {
            button.addEventListener("touchstart", (e)=>{
                const key = e.target.className.split(' ')[1]
                const eventKeyDown = new KeyboardEvent('keydown', {
                    key: commands[key],
                });
                window.dispatchEvent(eventKeyDown)
            })
        })

        document.querySelectorAll('.btn').forEach(button =>{
            button.addEventListener("touchend", (e)=>{
                const key = e.target.className.split(' ')[1]
                const eventKeyUp = new KeyboardEvent('keyup', {
                    key: commands[key],
                }); 
                window.dispatchEvent(eventKeyUp)
            })
        })

        window.addEventListener("keydown", (e) => {
            const KEY = e.key
            if((KEY === commands.left ||
                KEY === commands.right ||
                KEY === commands.up ||
                KEY === commands.down ||
                KEY === commands.shoot) && !this.keys.includes(KEY)){
                    this.keys.push(KEY);
                }
        });
    
        window.addEventListener("keyup", (e) => {
            const KEY = e.key
            const index = this.keys.indexOf(KEY);
            if (index !== -1) {
                this.keys.splice(index, 1);
            }
        });
    }
}

class Player{
    constructor(){
        this.height = 100;
        this.width = 100;
        this.speed = 5;
        this.x = canvas.width / 2 - 50 ;
        this.y = canvas.height - this.height;
        this.img = new Image();
        this.img.src = "./images/Spaceship.png"
    }

    reset(){
        this.x = canvas.width / 2 - 50 ;
        this.y = canvas.height - this.height;
        this.speed = 5;
    }

    stop(){
        this.speed = 0;
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        //i might need this later
        // ctx.strokeStyle = "#fff";
        // ctx.strokeRect(this.x + 10 , this.y, this.width - 20, this.height)
        // //head hitbox
        // ctx.strokeRect(this.x + this.width / 2.3, this.y + this.height / 4.5, this.width / 8 , this.height / 2)
        // //wings hitbox
        // ctx.strokeRect(player.x + player.width / 5, player.y + player.height / 2 + 1, player.width / 2 + 10 , player.height / 10)            
    }

    update(){

        //moves
        if(inputs.keys.indexOf(commands.up) > -1) {
            this.y -= this.speed
        }
        if(inputs.keys.indexOf(commands.down) > -1) {
            this.y += this.speed
        }
        if(inputs.keys.indexOf(commands.left) > -1) {
            this.x -= this.speed
        }
        if(inputs.keys.indexOf(commands.right) > -1) {
            this.x += this.speed
        }

        //avoid fall over borders
        if(this.x >= canvas.width - this.width + 15){
            this.x = canvas.width - this.width + 15
        }
        if(this.x <= -15){
            this.x = -15
        }
        if(this.y >= canvas.height - this.height + 25){
            this.y = canvas.height - this.height + 25
        }
        if(this.y <= -20){
            this.y = -20
        }
    }
}

class Background{
    constructor(){
        this.height = canvas.height;
        this.width = canvas.width;
        this.x = 0;
        this.y = 0;
        this.speed = 2; 
        this.img = new Image()
        this.img.src = './images/bg.png'
    }

    reset(){
        this.speed = 5
        this.x = 0;
        this.y = 0;
    }

    stop(){
        this.speed = 0
    }
    
    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.img, this.x, this.y - this.height, this.width, this.height)
    }

    update(){
        //creates an infinite background effect
        this.y += this.speed
        if(this.y >= this.height) this.y = 0
    }
}

class Asteroid{
    constructor(){
        this.width = 50
        this.height = 50
        this.y = Math.floor(Math.random() * (-100 + -200) -100)
        this.x = Math.floor(Math.random() * 450)
        this.speed = 6
        this.color = "#FFF"
        this.img = new Image()
        this.meteors = ["Meteor_02.png", "Meteor_05.png", "Meteor_06.png", "Meteor_07.png","Meteor_10.png"]
        this.img.src = this.changeImage();
    }

    reset(){
        this.speed = 6
        this.defineRandom();
    }

    stop(){
        this.speed = 0
    }

    changeImage(){
        return `./images/${this.meteors[Math.floor(Math.random() * 4)]}`
    }

    draw(){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.beginPath();
        //i might need this later
        //hitbox
        // ctx.strokeStyle = "#fff";
        // ctx.strokeRect(this.x + 7, this.y + 8, this.width - 15, this.height - 15)
    }

    update(){
        this.y += this.speed
        if(this.y > background.height){
            score++
            this.defineRandom();
        }
    }

    defineRandom(){
        this.changeImage()
        this.y = Math.floor(Math.random() * -400) + (-this.height * 2)
        this.x = Math.floor(Math.random() * 450)
    }

    collidesWith(otherAsteroid) {
        return (
            this.x < otherAsteroid.x + otherAsteroid.width + 20 &&
            this.x + this.width + 20 > otherAsteroid.x &&
            this.y < otherAsteroid.y + otherAsteroid.height + 10 &&
            this.y + this.height + 10 > otherAsteroid.y
        );
    }
}

const inputs = new Inputs()
const background = new Background()
const player = new Player()
    
for(let i = 1; i <= ASTEROIDSAMOUNT; i++){
    const asteroid = new Asteroid()
    ASTEROIDSONSCREEN.push(asteroid)
}

function startGame(delta){
    if(gameOn){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        df = delta
        background.draw()
        background.update()
        player.draw()
        player.update()
        checkCollisions()
        displayScore()
        drawAsteroids()
        requestAnimationFrame(startGame)
    }
}


function drawAsteroids(){
    ASTEROIDSONSCREEN.forEach((asteroid, currentIndex) =>{
        asteroid.draw()
        asteroid.update()
        
        for(let i = 0; i < ASTEROIDSONSCREEN.length; i++){
            if (i !== currentIndex) {
                const otherAsteroid = ASTEROIDSONSCREEN[i];
                //avoid asteroids to have the same coordinates
                avoidAsteroidsToColideEachOther(asteroid, otherAsteroid)
            }
        }
    })
}

function avoidAsteroidsToColideEachOther(asteroid, otherAsteroid){
    if (asteroid.collidesWith(otherAsteroid)) {
        otherAsteroid.defineRandom()
    }
}

function checkCollisions() {
    ASTEROIDSONSCREEN.forEach(asteroid => {
        // check asteroids collision against the wings
        if (
            (player.x + player.width / 5 < asteroid.x + asteroid.width - 15 &&
            player.x + player.width / 5 + player.width / 2 + 10 > asteroid.x + 7 &&
            player.y + player.height / 2 < asteroid.y + asteroid.height - 15 &&
            player.y + player.height / 2 + player.height / 10 > asteroid.y + 7) 
            || 
            
            //check asteroids collision against the head
            (player.x + player.width / 2.3 < asteroid.x + asteroid.width - 15 &&
            player.x + player.width / 2.3 + player.width / 8 > asteroid.x + 7 &&
            player.y + player.height / 4.5 < asteroid.y + asteroid.height - 15 &&
            player.y + player.height / 4.5 + player.height / 2 > asteroid.y + 8)
        ) {
            stopGame()
        }
    });
}

function stopGame(){
    gameOn = false
    GAMEMUSIC.pause()
    IMPACTSONG.play()
    background.stop()
    player.stop()
    ASTEROIDSONSCREEN.forEach(item => item.stop())
    document.querySelector(".end-game-board").style.display = "flex";
    document.querySelector('.score-display').innerHTML = "Your Score: " + score
    document.querySelector(".retry-btn").focus()
}

function restart(){
    GAMEMUSIC.play()
    score = 0
    ASTEROIDSONSCREEN.length = 5
    ASTEROIDSONSCREEN.forEach(item => item.speed = 6)
    background.speed = 2
    document.querySelector(".end-game-board").style.display = "none"
    gameOn = true
    background.reset()
    player.reset()
    ASTEROIDSONSCREEN.forEach(item => {
        item.reset()
    })
    startGame(0)
}


//increase obstacles and their speed
setInterval(()=>{
    if(gameOn){
        const ast = new Asteroid()
        ASTEROIDSONSCREEN.push(ast)
        ASTEROIDSONSCREEN.forEach(item => item.speed += .2)
        background.speed += .2
    }
}, 5000)

document.querySelector(".retry-btn").addEventListener("click", ()=>{
    restart();
})

function displayScore(){
    document.querySelector("#score").innerHTML = "Score: " + score
}

