window.onDocumentReady(function(){
	"use strict";

	// Define root directory
	window.Game.Shared.rootDirectory = "../";

	// Define all sprites here
	var sprites = {};
	sprites.player = new Game.Sprite("spr_player", "spr_player.jpg");

	// Define all backgrounds here
	var backgrounds = {};
	backgrounds.background = new Game.Background("background_room", "background.jpg");

	// Define all sounds here
	var sounds = {};

	// Define all fonts here
	var fonts = {};
	fonts.greatVibes = new Game.Font("greatVibes", "GreatVibes-Regular.otf");
	fonts.IndieFlower = new Game.Font("indieFlower", "IndieFlower.ttf");

	// Define all rooms here
	var rooms = {};
	rooms.game = new Game.Room("room_game", function(gameRoom) {
		window.Game.RenderingHelper.setDefaultForRenderingText(gameRoom, fonts.greatVibes, "30px", "black", "left", "top");	
	});
	rooms.game.setBackgroundColor("#444");
	rooms.game.setBackgroundImage(backgrounds.background);

	// Create a game object and override functions
	var game = new window.Game.Game("Test game", rooms.game);
	game.setOnCreate(function() {

	});
	game.setOnStart(function() {

	});


	// Add all the sprites, backgrounds, sounds and fonts to the game object so that these can be loaded before game starts
	for(var key in sprites) {
		game.addSprite(key, sprites[key]);
	}
	for(var key in backgrounds) {
		game.addBackground(key, backgrounds[key]);
	}
	for(var key in sounds) {
		game.addSound(key, sounds[key]);
	}
	for(var key in fonts) {
		game.addFont(key, fonts[key]);
	}

	// Define all game objects here
	var objects = {};
	(function() {
		// Define common objects

		// Player object
		objects.player = new Game.Object("obj_player", 100, 100, sprites.player);
		objects.player.setOnCreate(function(object, gameRoom){
			object.speed = 1;
			object.x = gameRoom.getWidth() / 2;
			object.y = gameRoom.getHeight() / 2;
		});
		objects.player.setOnFrameChange(function(object, gameRoom){
			object.x += object.speed;
			object.y += object.speed;
			if(object.x > gameRoom.getWidth() || object.x < 0 || object.y > gameRoom.getHeight() || object.y < 0) {
				object.speed *= -1;
			}
		});

		// stats object
		objects.stats = new Game.Object("obj_stats", 0, 0, null, 1000);
		objects.stats.setOnDraw(function(object, gameRoom) {
			window.Game.RenderingHelper.drawText(gameRoom, "Hi " + (new Date().getTime()), 10, 10);
		});

		// Add object instances to the game room
		var obj1 = objects.player.getNewInstance();
		obj1.setUpdateOnCreate(function(object, gameRoom) {
			object.x += 50;
		});
		var obj2 = objects.player.getNewInstance();
		obj2.setUpdateOnCreate(function(object, gameRoom) {
			object.x += 200;
		});
		var obj3 = objects.player.getNewInstance();
		obj3.setUpdateOnCreate(function(object, gameRoom) {
			object.x += 200;
			object.y += 200;
		});
		var obj4 = objects.player.getNewInstance();
		obj4.setUpdateOnCreate(function(object, gameRoom) {
			object.x -= 200;
			object.y -= 200;
		});
		obj4.setOnDraw(function(object, gameRoom) {
			if(object.sprite != null) {
				object.sprite.draw(gameRoom, object.x, object.y);
			}
			window.Game.RenderingHelper.drawText(gameRoom, "Hi " + (new Date().getTime()), object.x, object.y + 100);
		});
		obj4.setZIndex(-100);
		rooms.game.addObject(objects.player.getName(), obj1);
		rooms.game.addObject(objects.player.getName(), obj2);
		rooms.game.addObject(objects.player.getName(), obj3);
		rooms.game.addObject(objects.player.getName(), obj4);
		rooms.game.addObject(objects.stats.getName(), objects.stats);
	})();

	// Initialize the game
	game.initialize("#gameWrapper");
});