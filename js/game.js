// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos


// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512; //32 cada arbol
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// armor image
var armorReady = false;
var armorImage = new Image();
armorImage.onload = function () {
	armorReady = true;
};
armorImage.src = "images/armour1.gif";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var stones_array = [];
var monsters_array = [];
var princessesCaught = localStorage.getItem("princess");
if (princessesCaught == null) {
	princessesCaught = 0;
}
var level = localStorage.getItem("level");
if (level == null) {
	level = 1;
}
var lives = localStorage.getItem("lives");
if (lives == null) {
	lives = 3;
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	var index;
	var number = level;

	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 96));
	princess.y = 32 + (Math.random() * (canvas.height - 96));

	// Throw the stones somewhere on the screen randomly
	stones_array.length = 0;
	for (index = 0; index < number; index++) {
		var stone = {};
		do {
			stone.x = 32 + (Math.random() * (canvas.width - 96));
			stone.y = 32 + (Math.random() * (canvas.height - 96));
		} while ((stone.x <= (princess.x + 32)
			&& princess.x <= (stone.x + 32)
			&& stone.y <= (princess.y + 32)
			&& princess.y <= (stone.y + 32)) 
			|| (stone.x <= (hero.x + 32)
			&& hero.x <= (stone.x + 32)
			&& stone.y <= (hero.y + 32)
			&& hero.y <= (stone.y + 32)));
		stones_array.push(stone);
	}

	// Throw the monsters somewhere on the screen randomly
	monsters_array.length = 0;
	for (index = 0; index < number; index++) {
		var monster = {
			speed: 0.1 * level
		};
		do {
			monster.x = 32 + (Math.random() * (canvas.width - 96));
			monster.y = 32 + (Math.random() * (canvas.height - 96));
		} while ((monster.x <= (princess.x + 32)
			&& princess.x <= (monster.x + 32)
			&& monster.y <= (princess.y + 32)
			&& princess.y <= (monster.y + 32)) 
			|| (monster.x <= (hero.x + 32)
			&& hero.x <= (monster.x + 32)
			&& monster.y <= (hero.y + 32)
			&& hero.y <= (monster.y + 32)));
		monsters_array.push(monster);
	}
};

var touching = function () {
	var touch = false;
	for (index = 0; index < stones_array.length; index++) {
		if (stones_array[index].x <= (hero.x + 32)
			&& hero.x <= (stones_array[index].x + 32)
			&& stones_array[index].y <= (hero.y + 32)
			&& hero.y <= (stones_array[index].y + 32)) {
			touch = true;
		}
	}
	return touch;
}

// Update game objects
var update = function (modifier) {
	var index;
	if (38 in keysDown && hero.y > 32) { // Player holding up
		hero.y -= hero.speed * modifier;
		if (touching()) {
			hero.y += hero.speed * modifier;
		}
	}
	if (40 in keysDown && hero.y < 416) { // Player holding down
		hero.y += hero.speed * modifier;
		if (touching()) {
			hero.y -= hero.speed * modifier;
		}
	}
	if (37 in keysDown && hero.x > 32) { // Player holding left
		hero.x -= hero.speed * modifier;
		if (touching()) {
			hero.x += hero.speed * modifier;
		}
	}
	if (39 in keysDown && hero.x < 448) { // Player holding right
		hero.x += hero.speed * modifier;
		if (touching()) {
			hero.x -= hero.speed * modifier;
		}
	}

	//monsters movements
	var dist_x;
	var dist_y;
	for (index = 0; index < monsters_array.length; index++) {
		dist_x = monsters_array[index].x - hero.x;
		dist_y = monsters_array[index].y - hero.y;
		if (Math.abs(dist_x) >= Math.abs(dist_y)) {
			if (dist_x >= 0) {
				monsters_array[index].x -= monsters_array[index].speed;
			} else {
				monsters_array[index].x += monsters_array[index].speed;
			}
		} else {
			if (dist_y >= 0) {
				monsters_array[index].y -= monsters_array[index].speed;
			} else {
				monsters_array[index].y += monsters_array[index].speed;
			}
		}
	}
	 
	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		if ((princessesCaught%10) == 0) {
			++level;
		}

		localStorage.setItem("princess", princessesCaught);
		localStorage.setItem("level", level);
		reset();
	}

	// Are monster touching?
	var ok = false;
	for (index = 0; index < monsters_array.length; index++) {
		if (
			hero.x <= (monsters_array[index].x + 16)
			&& monsters_array[index].x <= (hero.x + 16)
			&& hero.y <= (monsters_array[index].y + 16)
			&& monsters_array[index].y <= (hero.y + 32)
		) {
			ok = true;
		}
	}
	if (ok) {
		lives -= 1;
		if (lives == 0) {
			princessesCaught = 0;
			level = 1;
			lives = 3;
		}
		localStorage.setItem("lives", lives);
		localStorage.setItem("level", level);
		localStorage.setItem("princess", princessesCaught);
		reset();
	}
};

// Draw everything
var render = function () {
	var index;
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (stoneReady) {
		for (index = 0; index < stones_array.length; index++) {
			ctx.drawImage(stoneImage, stones_array[index].x, stones_array[index].y);
		}
	}

	if (monsterReady) {
		for (index = 0; index < monsters_array.length; index++) {
			ctx.drawImage(monsterImage, monsters_array[index].x, monsters_array[index].y);
		}
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("Level: " + level, 32, 64);
	ctx.fillText("Lives: " + lives, 32, 96);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible

//Hay que tener en cuenta que el pixel que se tiene en cuenta de las figuras es el de la esquina superior izquierda