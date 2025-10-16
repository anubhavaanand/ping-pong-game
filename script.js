const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: '#fff'
};

const leftPaddle = {
    x: 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: '#fff',
    score: 0
};

const rightPaddle = {
    x: canvas.width - 20,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: '#fff',
    score: 0
};

// Keyboard controls
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Draw rectangle helper
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw circle helper
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw text helper
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '45px Arial';
    ctx.fillText(text, x, y);
}

// Draw net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#fff');
    }
}

// Draw paddles
function drawPaddle(paddle) {
    drawRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.color);
}

// Draw ball
function drawBall() {
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Draw score
function drawScore() {
    drawText(leftPaddle.score, canvas.width / 4, canvas.height / 5, '#fff');
    drawText(rightPaddle.score, 3 * canvas.width / 4, canvas.height / 5, '#fff');
}

// Update paddle positions
function updatePaddles() {
    // Left paddle controls (W/S)
    if (keys['w'] && leftPaddle.y > 0) {
        leftPaddle.y -= 7;
    }
    if (keys['s'] && leftPaddle.y < canvas.height - leftPaddle.height) {
        leftPaddle.y += 7;
    }

    // Right paddle controls (Arrow Up/Down)
    if (keys['ArrowUp'] && rightPaddle.y > 0) {
        rightPaddle.y -= 7;
    }
    if (keys['ArrowDown'] && rightPaddle.y < canvas.height - rightPaddle.height) {
        rightPaddle.y += 7;
    }
}

// Collision detection
function collision(ball, paddle) {
    ball.top = ball.y - ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    ball.right = ball.x + ball.radius;

    paddle.top = paddle.y;
    paddle.bottom = paddle.y + paddle.height;
    paddle.left = paddle.x;
    paddle.right = paddle.x + paddle.width;

    return ball.right > paddle.left && 
           ball.bottom > paddle.top && 
           ball.left < paddle.right && 
           ball.top < paddle.bottom;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// Update ball position
function updateBall() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Determine which paddle to check for collision
    let paddle = (ball.x < canvas.width / 2) ? leftPaddle : rightPaddle;

    if (collision(ball, paddle)) {
        // Calculate where the ball hit the paddle
        let collidePoint = ball.y - (paddle.y + paddle.height / 2);
        // Normalize the value
        collidePoint = collidePoint / (paddle.height / 2);
        
        // Calculate angle in radians
        let angleRad = collidePoint * Math.PI / 4;
        
        // Change velocity direction
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Increase ball speed
        ball.speed += 0.5;
    }

    // Update score
    if (ball.x - ball.radius < 0) {
        rightPaddle.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        leftPaddle.score++;
        resetBall();
    }
}

// Render game
function render() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    
    // Draw net
    drawNet();
    
    // Draw score
    drawScore();
    
    // Draw paddles
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    
    // Draw ball
    drawBall();
}

// Game loop
function gameLoop() {
    updatePaddles();
    updateBall();
    render();
}

// Start game
const framePerSecond = 60;
setInterval(gameLoop, 1000 / framePerSecond);
