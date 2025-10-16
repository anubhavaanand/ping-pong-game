// Get the canvas and context
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

// Paddle positions
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

// Ball position and velocity
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

// Scores
let leftScore = 0;
let rightScore = 0;

// Paddle speed
const paddleSpeed = 6;

// Keyboard state
const keys = {};

// Event listeners for keyboard
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Draw rectangle helper
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Draw circle helper
function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Draw text helper
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '30px Arial';
    ctx.fillText(text, x, y);
}

// Draw net
function drawNet() {
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 2, i, 4, 10, '#fff');
    }
}

// Update game state
function update() {
    // Move left paddle (W and S keys)
    if (keys['w'] && leftPaddleY > 0) {
        leftPaddleY -= paddleSpeed;
    }
    if (keys['s'] && leftPaddleY < canvas.height - paddleHeight) {
        leftPaddleY += paddleSpeed;
    }

    // Move right paddle (Arrow Up and Down keys)
    if (keys['ArrowUp'] && rightPaddleY > 0) {
        rightPaddleY -= paddleSpeed;
    }
    if (keys['ArrowDown'] && rightPaddleY < canvas.height - paddleHeight) {
        rightPaddleY += paddleSpeed;
    }

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY - ballSize / 2 <= 0 || ballY + ballSize / 2 >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with left paddle
    if (ballX - ballSize / 2 <= paddleWidth) {
        if (ballY >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            // Add some variation based on where ball hits paddle
            let deltaY = ballY - (leftPaddleY + paddleHeight / 2);
            ballSpeedY = deltaY * 0.15;
        }
    }

    // Ball collision with right paddle
    if (ballX + ballSize / 2 >= canvas.width - paddleWidth) {
        if (ballY >= rightPaddleY && ballY <= rightPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            // Add some variation based on where ball hits paddle
            let deltaY = ballY - (rightPaddleY + paddleHeight / 2);
            ballSpeedY = deltaY * 0.15;
        }
    }

    // Ball goes out of bounds (scoring)
    if (ballX - ballSize / 2 <= 0) {
        rightScore++;
        resetBall();
    }
    if (ballX + ballSize / 2 >= canvas.width) {
        leftScore++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Change direction
    ballSpeedY = 3;
}

// Draw everything
function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    // Draw net
    drawNet();

    // Draw paddles
    drawRect(0, leftPaddleY, paddleWidth, paddleHeight, '#fff');
    drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight, '#fff');

    // Draw ball
    drawCircle(ballX, ballY, ballSize / 2, '#fff');

    // Draw scores
    drawText(leftScore, canvas.width / 4, 50, '#fff');
    drawText(rightScore, 3 * canvas.width / 4, 50, '#fff');

    // Draw controls text
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('Left: W/S', 10, canvas.height - 10);
    ctx.fillText('Right: ↑/↓', canvas.width - 80, canvas.height - 10);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
