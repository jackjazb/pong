//////////////////////////////////////////////////////
//PONG VILLAGE										//
//TODO:												//
//-improve speed calculations + angle calulations	//
//-stabilise framerate								//
//-fix the ball getting stuck behind the paddle		//
//////////////////////////////////////////////////////

//
//GAME VARIABLES
//
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//paddle dimensions
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;

//the x offset of the paddles
const X_POS = 50;

//initial y position of each paddle
var VPOS = (canvas.height - PADDLE_HEIGHT) / 2;

//the speed at which various game objects move
const PL_SPEED = 8;
const BALL_SPEED = 5;
const FR_INC_RATE = 0.001;

//some colors (black and white currently)
const BG_COL = 'red';
const OBJ_COL = 'white';

//
//RUNTIME VARIABLES
//

var rallyLength = 0;

//stores some html for debugging
var stat = "";

//
//GAME OBJECTS
//
function Player(x, y, width, height){
	this.x = x;
	this.y = y;
	
	//the paddle's next y position
	this.nextY = this.y;
	
	//the paddle's dimensions
	this.width = width;
	this.height = height;
	
	//stores the paddles current movement.
	this.up = false;
	this.down = false;
	
	//the player's score
	this.score = 0;
	
	this.update = function(){
		if(this.up){
			this.nextY -= PL_SPEED;
		}
		if(this.down){
			this.nextY += PL_SPEED;
		}	
		
		if(this.isColliding()){
			this.nextY = this.y;
		}
		else{
			//update position
			this.y = this.nextY;
			
		}
		//redraw this paddle
		this.draw(OBJ_COL);
	}
	
	//check if the paddle is in the bounds of the canvas
	this.isColliding = function(){
		if(this.nextY > 0 && this.nextY < canvas.height - this.height){
			return false;
		}
		else{
			return true;
		}
	}
	
	this.draw = function(col){
		
		ctx.fillStyle = col;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
}

function Ball(x, y, radius, speed){

	//the current position of the ball
	this.x = x;
	this.y = y;
	
	//the size of the ball
	this.radius = radius;
	
	//actual speed of the ball
	this.speed = speed;
	
	//vetrtical and horizontal components of speed
	var v = 0;
	var h = 0;
	
	//the balls angle from the horizontal
	this.angle = Math.PI/5;
	
	//runs every frame
	this.update = function(){		
		//minus sin because y is inverted here
		v = this.speed * -Math.sin(this.angle);
		h = this.speed * Math.cos(this.angle);
		
		//update x and y position according to the horizontal and vertical components of speed
		this.x += h;
		this.y += v;
		
		//check for a bounce
		this.checkCollisions();
		
		//draw the ball for this frame
		this.draw();
	}
	
	this.draw = function(){
		//draw a circle
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.fillStyle = OBJ_COL;
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = OBJ_COL;
		ctx.stroke();
	}
	
	//returns true if the ball  has hit the paddle;
	this.checkCollisions = function(){
		//if colliding with the paddle, and between the two edges of the paddle, then bounce
		if(this.x < player1.x + PADDLE_WIDTH && this.y > player1.y && this.y < player1.y + PADDLE_HEIGHT){
			this.angle = Math.PI - this.angle;
			rallyLength ++;
		}
		else if(this.x > player2.x && this.y > player2.y && this.y < player2.y + PADDLE_HEIGHT){
			this.angle = Math.PI-this.angle;
			rallyLength ++;
		}
		else if(this.y < 0 || this.y > canvas.height){
			this.angle = -this.angle;
		}
		
		
		
		//SCORING MECHANICS
		//player 2 score
		else if(this.x < 0){
			this.x = x;
			this.y = y;
			player2.score ++;
			rallyLength = 0;
		}
		//player 1 score
		else if(this.x > canvas.width){
			this.x = x;
			this.y = y;
			player1.score ++;
			rallyLength = 0;
		}
	}
}

//
//SETUP
//

//instance player objects
var player1 = new Player(X_POS, VPOS, PADDLE_WIDTH, PADDLE_HEIGHT);
var player2 = new Player(canvas.width - X_POS - PADDLE_WIDTH, VPOS,  PADDLE_WIDTH, PADDLE_HEIGHT);
var ball = new Ball(canvas.width/2, canvas.height/2, 2, BALL_SPEED, FR_INC_RATE);

function initialise(){
	
	//start the main loop
	requestAnimationFrame(mainLoop);
}

//add key listeners
window.onkeydown = function(e){
	var key = e.keyCode;
	if(key == 87){player1.up = true;}	
	if(key == 83){player1.down = true;}	
	if(key == 102){player2.up = true;}	
	if(key == 99){player2.down = true;}
}
window.onkeyup = function(e){
	var key = e.keyCode;
	if(key == 87){player1.up = false;}	
	if(key == 83){player1.down = false;}	
	if(key == 102){player2.up = false;}	
	if(key == 99){player2.down = false;}
}

//
//MAIN GAME LOOP
//
function mainLoop(){
	update();
	
	requestAnimationFrame(mainLoop);
}

//runs every frame
function update(){
	//clear the canvas by redrawing the background
	ctx.fillStyle = BG_COL;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	//update the ball
	ball.update();
	
	//update both players
	player1.update();
	player2.update();
	
	//debugging
	stat = "";
	stat += "<h1>status:</h1>";
	stat += "<p>SCORES: p1: " + parseInt(player1.score) + ", p2: " + parseInt(player2.score) + "</p>";
	stat += "<p>BALL POS: (" + parseFloat(ball.x).toFixed(3) + ", " + parseFloat(ball.y).toFixed(3) + ")</p>";
	stat += "<p>PLAYER1: (" + parseFloat(player1.x).toFixed(3) + ", " + parseFloat(player1.y).toFixed(3) + "), PLAYER2: ("+ parseFloat(player2.x).toFixed(3) + ", " + parseFloat(player2.y).toFixed(3) + ")</p>";
	stat += "<p>rallyLength: " + parseInt(rallyLength) + "</p>";
	$("#status").html(stat);
}

//start everything
initialise();