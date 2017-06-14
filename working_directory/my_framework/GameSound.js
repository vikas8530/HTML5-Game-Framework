(function() {
	"use strict";
	window.Game = window.Game || {};
	window.Game.Sound = function(name, url) {
		if(!(this instanceof window.Game.Sound)) {
			throw new window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation();
		}
		if (!("string" === typeof name && "string" === typeof url)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Sound name and/or sound url is not correct.");
		}
		this.id = Game.Shared.getNewId();
		this.soundUrl = url;
		this.soundName = name;
		this.sound = null;
	};
	window.Game.Sound.prototype.getName = function() {
		return this.soundName;
	};
	window.Game.Sound.prototype.load = function(callback) {
		var audio = new Audio();
		var that = this;
		audio.onload = function() {
			that.sound = audio;
			callback();
		}
		audio.onerror = function(e) {
			window.Game.Exceptions.consoleError(new window.Game.Exceptions.ResourceNotFoundException(audio.src));
			callback();
		}
		audio.src =  window.Game.Shared.rootDirectory + window.Game.Shared.soundsDirectory + this.soundUrl;
	};
	window.Game.Sound.prototype.play = function(gameRoom) {
		if(!(gameRoom instanceof window.Game.GameRoom)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sound play function");
		}
		this.sound.play();
	};
	window.Game.Sound.prototype.pause = function(gameRoom) {
		if(!(gameRoom instanceof window.Game.GameRoom)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sound play function");
		}
		this.sound.pause();
	};

})();