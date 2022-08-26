const TILE_WIDTH = 101;
const TILE_HEIGHT = 83;

const BOARD_WIDTH = TILE_WIDTH * 4;
const BOARD_HEIGHT = TILE_HEIGHT * 5;

const CHARACTERS_WIDTH = 101;
const CHARACHTERS_HEIGHT = 171;

const SIZE_DIFFERENCE = 20;

const INITIAL_ENEMY_X = -CHARACTERS_WIDTH;
const ENEMY_MIN_SPEED = 100;
const ENEMY_MAX_SPEED = 500;

const INITAL_PLAYER_X = BOARD_WIDTH / 2;
const INITAL_PLAYER_Y = BOARD_HEIGHT - SIZE_DIFFERENCE;

const Enemy = function(x, y, player) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = this.generateSpeed();
    this.player = player;
};

Enemy.prototype.update = function(dt) {
    this.checkCollisions();
    this.x += this.speed * dt;
    if(this.x > BOARD_WIDTH + CHARACTERS_WIDTH){
        this.x = INITIAL_ENEMY_X;
    };
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.generateSpeed = function() {
    return (Math.floor(Math.random() * (ENEMY_MAX_SPEED / 100 - ENEMY_MIN_SPEED / 100 + 1)) + ENEMY_MIN_SPEED / 100) * 100;
};

Enemy.prototype.checkCollisions = function() {
    if(Math.abs(this.x - this.player.x) <= CHARACTERS_WIDTH - SIZE_DIFFERENCE && Math.abs(this.y - this.player.y) <= SIZE_DIFFERENCE){
        this.player.loses += 1;
        this.player.resetInitialPosition();
    }
};

function generateEnemies(player){
    return [2, 3, 4].map(i => new Enemy(INITIAL_ENEMY_X, TILE_HEIGHT * i - (CHARACHTERS_HEIGHT / 2 + SIZE_DIFFERENCE), player));
};

const Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.wins = 0;
    this.loses = 0;
};

Player.prototype.update = function() {
    this.checkPosition();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    this.update();
    switch(key){
        case 'left':
            this.x -= TILE_WIDTH;
            break;
        case 'right':
            this.x += TILE_WIDTH;
            break;
        case 'up':
            this.y -= TILE_HEIGHT;
            break;
        case 'down':
            this.y += TILE_HEIGHT;
            break;
    };
};

Player.prototype.resetInitialPosition = function(){
    this.x = INITAL_PLAYER_X;
    this.y = INITAL_PLAYER_Y;
};

Player.prototype.checkPosition = function() {
    if(this.x < 0){
        this.x = 0;
    }else if(this.x > BOARD_WIDTH){
        this.x = BOARD_WIDTH;
    }else if(this.y > BOARD_HEIGHT){
        this.y = BOARD_HEIGHT - 20;
    }else if(this.y < 0){
        this.wins += 1;
        this.resetInitialPosition();
    };
};

const player = new Player(INITAL_PLAYER_X, INITAL_PLAYER_Y);
const allEnemies = generateEnemies(player);

document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});