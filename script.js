// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables 
const gridSize = 20;
let snake = [{ x: 10, y: 10 }] //More or less the middle of the board
// As we don't want a static food on the board we'll do a function to randomize the food generation
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;

// Draw game map (snake and food)
function draw() {
    // Every single time we reset we put an empty HTML
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw the snake
function drawSnake() {
    snake.forEach((segment) => {
        // It will be a div with a snake class
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

// Create a snake or food cube/div (tag = div and className = snake)
function createGameElement(tag, className) {
    // You should create a tag and the tag will be wherever the parameter is on drawSnake
    const element = document.createElement(tag);
    // His className will be the parameter that you are passing up there
    element.className = className;
    return element;
}

// Set the position of the snake or the food on the game board (element = snakeElement)
function setPosition(element, position) {
    // We are painting the snakeElement on the gridColumn with the position x of the segment(position). 
    // The segment is every single element of the snake(array) that have x and y (segment.x and segment.y)
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Testing draw function
//draw();

// Draw food function
function drawFood() {
    if(gameStarted ){
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    } 
}

// Generate food
function generateFood(){
    const x = Math.floor(Math.random()* gridSize) + 1;
    const y = Math.floor(Math.random()* gridSize) + 1;
    return{x,y};
}

// Moving the snake
function move() {
    const head = {...snake[0] } // It's a copy of the position 0 of the snake
    switch (direction) {
         case 'up':
            head.y--;
            break;

        case 'down':
            head.y++;
            break;

        case 'right':
            head.x++;
            break;
    
        case 'left':
            head.x--;
            break;

    }

    snake.unshift(head); // The copy of the snake will append on the array of the snake lile this : let snake = [{ x: 7, y: 13 },{ x: 10, y: 10 }]
    //snake.pop(); // We remove the last peace of the snake to make the illusion of movement

    // If we have the same position than the food, we will generate new food, clear the interval, draw a new piece of snake and
    // the game will be faster else we pop the snake
    if(head.x === food.x && head.y === food.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // Clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else{
        snake.pop();
    } 

    
}

// Start game function
function startGame() {
    gameStarted = true; // Keep the track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
    if( (!gameStarted && event.code === 'Space') || (!gameStarted && event.key === '') ){
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            
            case 'ArrowDown':
                direction = 'down';
                break;

            case 'ArrowLeft':
                direction = 'left';
                break;

            case 'ArrowRight':
                direction = 'right';
                break;
           
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed(){
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    // The 1 and the gridSize are the walls
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();
    } 

    for (let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame()
        }
    }

}


function resetGame(){
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length - 1;
    // We are setting the score to the current score making that triple digit number start cunting from the left
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block    ';
}