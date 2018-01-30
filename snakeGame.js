var step = 20;
var slow = 10;

class Food {
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.color = color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
	}
	static randomLocation(snake, width, height){
	    var x = Math.random() * width;
		var y = Math.random() * height;
		x = Math.floor(x / step) * step;
		y = Math.floor(x / step) * step;
		
		// check collision
		var isInSnake = false;
		snake.tail.forEach(function(cell){
			if((cell.x === x) && (cell.y === y)){
			    isInSnake = true;
			}
		});
		if((snake.head.x === x) && (snake.head.y === y)){
			isInSnake = true;
		}
		// /!\ slow with a big snake
		if(!isInSnake){
		    return {x : x, y : y};
			}else{
		    return Food.randomLocation(snake, width, height);
		}
		
	}
}

class SnakeCell{
	constructor(x, y, color){
		this.x = x;
		this.y = y;
		this.color = color;
	}
}

class Snake {
	constructor(){
		this.head = new SnakeCell(step * 5, step * 5, color(255, 255, 255));
		this.tail = new Array();
		this.tailSize = 0;
		this.die = new Event("die");
    this.onDeath = () => {};
	}
	move(){
		this.moveTail();
		// move the head
		if(this.direction == "down"){
			this.head.y += step;
			}else if(this.direction == "right"){
			this.head.x += step;
			}else if (this.direction == "up"){
			this.head.y -= step;
			}else if (this.direction == "left"){
			this.head.x -= step;
		}
		this.handleWallHit();
		this.checkDeath();
	}
	handleWallHit(){
		if(this.head.x < 0) // left
		{
			this.head.x = width - step;
			}else if (this.head.x + step > width){ // right
			this.head.x = 0;
			}else if(this.head.y < 0){ // top
			this.head.y = height - step;
			}else if(this.head.y + step > height){ //bottom
			this.head.y = 0;
		}
	}
	checkDeath(){
	    var dies = false;
	    this.tail.forEach(function(cell){
		    if((cell.x === this.head.x) && (cell.y === this.head.y)){
				dies = true;
			}
		}, this);
		
		if(dies){
		    console.log("dies");
			dispatchEvent(this.die);
		}
	}
	eat(food){
		console.log("growing", this);
		this.tailSize++;
		this.head.color = food.color;
	}
	moveTail(){
		if(this.tailSize === this.tail.length){
			for(var i = 0; i < this.tail.length - 1; i++){
				this.tail[i].x = this.tail[i + 1].x;
				this.tail[i].y = this.tail[i + 1].y;
				
			}
		}
		this.tail[this.tailSize - 1] = Object.assign({}, this.head);
	}
	
}
var snake;
var food;

function headTriangleCoordinates(){
	var points = new Array();
	var topLeft = {x: snake.head.x, y : snake.head.y};
	var leftMiddle = {x: snake.head.x, y: snake.head.y + step / 2};
	var bottomLeft = {x: snake.head.x, y: snake.head.y + step};
	var bottomMiddle = {x: snake.head.x + step / 2, y: snake.head.y + step};
	var bottomRight = {x: snake.head.x + step, y: snake.head.y + step};
	var rightMiddle = {x: snake.head.x + step, y: snake.head.y + step / 2};
	var topRight = {x: snake.head.x + step, y: snake.head.y};
	var topMiddle = {x: snake.head.x + step / 2, y: snake.head.y};
	
	if (snake.direction === "up"){
		points.push(bottomLeft);
		points.push(bottomRight);
		points.push(topMiddle)
		}else if(snake.direction === "left"){
		points.push(topRight);
		points.push(bottomRight);
		points.push(leftMiddle);
		}else if (snake.direction === "down"){
		points.push(topLeft);
		points.push(topRight);
		points.push(bottomMiddle);
		}else{
		points.push(topLeft);
		points.push(bottomLeft);
		points.push(rightMiddle);
	}
	
	return points;
}

function drawSnake(){
	// head
	fill(snake.head.color);
	var headTriangle = headTriangleCoordinates();
	triangle(headTriangle[0].x, headTriangle[0].y, headTriangle[1].x, headTriangle[1].y, headTriangle[2].x, headTriangle[2].y, 10)
	
	// tail
	snake.tail.forEach(function(cell) {
		if(cell){
			fill(cell.color);
			rect(cell.x, cell.y, step, step, 2);
		}
	});
	
}

function drawFood(){
	fill(food.color);
	rect(food.x, food.y, step, step, step / 2);
}

function setup() {
	createCanvas(300, 300);
	snake = new Snake();
	addEventListener("die", function() {
      console.log("end game");
   });
    var foodLocation = Food.randomLocation(snake, width, height);
	food = new Food(foodLocation.x, foodLocation.y);
}

function keyPressed() {
	if ((keyCode === DOWN_ARROW) && (snake.direction != "up")) {
		snake.direction = "down";
		} else if ((keyCode === RIGHT_ARROW) && (snake.direction != "left")) {
		snake.direction = "right";
		}else if ((keyCode === UP_ARROW) && (snake.direction != "down")){
		snake.direction = "up";
		}else if ((keyCode === LEFT_ARROW) && (snake.direction != "right")){
		snake.direction = "left";
	}
}

function checkFoodCollision(){
	if((snake.head.x === food.x) && (snake.head.y === food.y)){
		snake.eat(food);
		var newFoodLocation = Food.randomLocation(snake, width, height);
		food = new Food(newFoodLocation.x, newFoodLocation.y);
	}
}

function draw() {
	if(frameCount % slow == 0){
	    background(120,120,120);
		snake.move();
		checkFoodCollision();
		drawSnake();
		drawFood();
	}
}
