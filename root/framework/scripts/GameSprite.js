(function() {
	"use strict";
	window.Game = window.Game || {};
	window.Game.Sprite = function(name, url) {
		if(!(this instanceof window.Game.Sprite)) {
			throw new window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation();
		}
		if (!("string" === typeof name && "string" === typeof url)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Sprite name and/or sprite url is not correct.");
		}
		this.id = Game.Shared.getNewId();
		this.spriteUrl = url;
		this.spriteName = name;
		this.sprite = null;
		this.width = null;
		this.height = null;
	};
	window.Game.Sprite.prototype.getName = function() {
		return this.spriteName;
	};
	window.Game.Sprite.prototype.load = function(callback) {
		var image = new Image();
		var that = this;
		image.onload = function() {
			that.sprite = image;
			that.width = image.naturalWidth;
			that.height = image.naturalHeight;
			callback();
		};
		image.onerror = function(e) {
			window.Game.Exceptions.consoleError(new window.Game.Exceptions.ResourceNotFoundException(image.src));
			callback();
		};
		image.src = window.Game.Shared.rootDirectory + window.Game.Shared.imagesDirectory + this.spriteUrl;
	};
	window.Game.Sprite.prototype.draw = function(gameRoom, x, y) {
		if(!(gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sprite draw function");
		}
		if(this.sprite != null) {
			gameRoom.getCanvasContext().drawImage(this.sprite, x, y);
		}
	};
	window.Game.Sprite.prototype.drawWithOffset = function(gameRoom, x, y, offsetX, offsetY) {
		this.draw(gameRoom, x - offsetX, y - offsetY);
	};
	window.Game.Sprite.prototype.drawResized = function(gameRoom, x, y, resizeFactor) {
		if(!(gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sprite draw function");
		}
		if(this.sprite != null) {
			gameRoom.getCanvasContext().drawImage(this.sprite, x, y, this.width * resizeFactor, this.height * resizeFactor);
		}
	};

})();