(function() {
	"use strict";
	window.Game = window.Game || {};
	window.Game.Background = function(name, url) {
		if(!(this instanceof window.Game.Background)) {
			throw new window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation();
		}
		if (!("string" === typeof name && "string" === typeof url)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Background name and/or sprite url is not correct.");
		}
		window.Game.Sprite.call(this, name, url);
		this.id = Game.Shared.getNewId();
		this.x1 = 0;
		this.y1 = 0;
		this.x2 = 0;
		this.y2 = 0;
	};
	window.Game.Background.prototype = Object.create(window.Game.Sprite.prototype);
	window.Game.Background.prototype.constructor = window.Game.Background;

	window.Game.Background.prototype.setBackgroundArea = function(gameRoom, x1, y1, x2, y2) {
		// This function should be loaded only after the sprite is loaded i.e., window.Game.Game is out 
		if(!(gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sprite draw function");
		}
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.pattern = null;
		if(this.sprite != null) {
			this.pattern = gameRoom.getCanvasContext().createPattern(this.sprite, "repeat");
		}
	};
	window.Game.Background.prototype.draw = function(gameRoom) {
		if(!(gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sprite draw function");
		}
		var ctx = gameRoom.getCanvasContext();
		ctx.rect(this.x1, this.y1, this.x2, this.y2);
		if(this.pattern == null && this.sprite != null) {
			this.pattern = gameRoom.getCanvasContext().createPattern(this.sprite, "repeat");
		}
		ctx.fillStyle = this.pattern;
		ctx.fill();
	};

})();