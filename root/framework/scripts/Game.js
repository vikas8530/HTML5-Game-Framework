// Although, there should be only one game object in a browser window. 
// But since this is a framework, at least it should handle multiple objects.
// How the user will handle multiple game objects in a single browser window, it's zer problem.


(function(){
	"use strict";

	// STATIC VARIABLES
	var STATE_NEW = "STATE_NEW", STATE_CREATED = "STATE_CREATED", STATE_STARTED = "STATE_STARTED",
		STATE_PAUSED = "STATE_PAUSED", STATE_RESUMED = "STATE_RESUMED", STATE_STOPPED = "STATE_STOPPED", 
		STATE_RESTARTED = "STATE_RESTARTED", STATE_DESTROYED = "STATE_DESTROYED", 
		STATE_CHANGE_TO_PAUSE = "STATE_CHANGE_TO_PAUSE", STATE_CHANGE_TO_STOP = "STATE_CHANGE_TO_STOP",
		STATE_CHANGE_TO_RESTART = "STATE_CHANGE_TO_RESTART", STATE_CHANGE_TO_DESTROY = "STATE_CHANGE_TO_DESTROY",
		STATE_LOADING = "STATE_LOADING";

	var nextFunctionForState = {
		STATE_NEW: "onCreate",
		STATE_CREATED: "onStart",
		STATE_STARTED: "onFrameChangeForStarted",
		STATE_PAUSED: "onFrameChangeForPaused",
		STATE_RESUMED: "onResume",
		STATE_STOPPED: "onFrameChangeForStopped",
		STATE_RESTARTED: "onRestart",
		STATE_DESTROYED: null,
		STATE_CHANGE_TO_PAUSE: "onPause",
		STATE_CHANGE_TO_RESTART: "onRestart",
		STATE_CHANGE_TO_STOP: "onStop",
		STATE_CHANGE_TO_DESTROY: "onDestroy",
		STATE_LOADING: "onFrameChangeForLoading"
	};

	var framesPerSecond = 0, totalSeconds = 0, totalFPS = 0;

	// Private object, shared by all game objects. These function should be called with the current executing game object's context
	var _game = {
		onCreate: function() {
			this.room.onCreate(_privates[this.id].canvas);
			_executeOverriddenFunction.call(this, "onCreate");
			_privates[this.id].currentState = STATE_LOADING;
		},
		onStart: function() {
			_executeOverriddenFunction.call(this, "onStart");
			_privates[this.id].currentState = STATE_STARTED;
		},
		onFrameChangeForStarted: function() {
			// Call frame change function for everything
			this.room.onFrameChangeForStarted();


			// Call draw function for everything drawable
			// Clean canvas > draw room > draw game specs > draw room objects
			this.room.drawBackground();
			this.room.drawObjects();

			_executeOverriddenFunction.call(this, "onFrameChangeForStarted");
		},
		onFrameChangeForPaused: function() {
			_executeOverriddenFunction.call(this, "onFrameChangeForPaused");
		},
		onFrameChangeForStopped: function() {
			_executeOverriddenFunction.call(this, "onFrameChangeForStopped");
		},
		onFrameChangeForLoading: function() {
			_executeOverriddenFunction.call(this, "onFrameChangeForLoading");
			if(_privates[this.id].remainingResourcesToLoad <= 0) {
				_privates[this.id].currentState = STATE_CREATED;
			}
		},
		onRestart: function() {
			_executeOverriddenFunction.call(this, "onRestart");
			_privates[this.id].currentState = STATE_STARTED;
		},
		onResume: function() {
			_executeOverriddenFunction.call(this, "onResume");
			_privates[this.id].currentState = STATE_STARTED;
		},
		onPause: function() {
			_executeOverriddenFunction.call(this, "onPause");
			_privates[this.id].currentState = STATE_PAUSED;
		},
		onStop: function() {
			_executeOverriddenFunction.call(this, "onStop");
			_privates[this.id].currentState = STATE_STOPPED;
		},
		onDestroy: function() {
			_executeOverriddenFunction.call(this, "onDestroy");
			_privates[this.id].currentState = STATE_DESTROYED;
		}
	};

	// Private object variables
	var _privates = {

	};

	window.Game = window.Game || {};
	// Publicly available constructor function
	window.Game.Game = function(name, room) {
		if(!(this instanceof window.Game.Game)) {
			throw new window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation();
		}
		if (!("string" === typeof name)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Name of the game is not correct.");
		}
		if (!(room instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("room should be a window.Game.Room");
		}
		// Check if an object with same name exists
		if (_aGameObjectWithSameNameExists(name)) {
			throw new window.Game.Exceptions.IllegalArgumentValueException("A game with same name already exists");
		}
		this.id = Game.Shared.getNewId();
		this.name = name;
		this.room = room;

		// Set up private variables
		_privates[this.id] = {
			currentState : STATE_NEW,
			canvas : null,
			allObjectsInGame : {},
			sprites :{},
			backgrounds: {},
			sounds : {},
			fonts : {},
			remainingResourcesToLoad : 0,
			gameRoom : null,
			callbackFunctions : {
				onCreate: null,
				onStart: null,
				onFrameChangeForStarted: null,
				onFrameChangeForPaused: null,
				onFrameChangeForStopped: null,
				onFrameChangeForLoading: null,
				onRestart: null,
				onResume: null,
				onPause: null,
				onStop: null,
				onDestroy: null
			},
			name: name
		};
	};
	window.Game.Game.prototype.getName = function() {
		console.log(_privates[this.id].callbackFunctions);
		return this.name;
	};
	window.Game.Game.prototype.getId = function() {
		return this.id;
	};
	window.Game.Game.prototype.setOnCreate = function(customFunc) {
		_setOnEventFunction.call(this, "onCreate", customFunc);
	};
	window.Game.Game.prototype.setOnStart = function(customFunc) {
		_setOnEventFunction.call(this, "onStart", customFunc);
	};
	window.Game.Game.prototype.setOnFrameChangeForStarted = function(customFunc) {
		_setOnEventFunction.call(this, "onFrameChangeForStarted", customFunc);
	};
	window.Game.Game.prototype.setOnFrameChangeForPaused = function(customFunc) {
		_setOnEventFunction.call(this, "onFrameChangeForPaused", customFunc);
	};
	window.Game.Game.prototype.setOnFrameChangeForStopped = function(customFunc) {
		_setOnEventFunction.call(this, "onFrameChangeForStopped", customFunc);
	};
	window.Game.Game.prototype.setOnFrameChangeForLoading = function(customFunc) {
		_setOnEventFunction.call(this, "onFrameChangeForLoading", customFunc);
	};
	window.Game.Game.prototype.setOnRestart = function(customFunc) {
		_setOnEventFunction.call(this, "onRestart", customFunc);
	};
	window.Game.Game.prototype.setOnResume = function(customFunc) {
		_setOnEventFunction.call(this, "onResume", customFunc);
	};
	window.Game.Game.prototype.setOnPause = function(customFunc) {
		_setOnEventFunction.call(this, "onPause", customFunc);
	};
	window.Game.Game.prototype.setOnStop = function(customFunc) {
		_setOnEventFunction.call(this, "onStop", customFunc);
	};
	window.Game.Game.prototype.setOnDestroy = function(customFunc) {
		_setOnEventFunction.call(this, "onDestroy", customFunc);
	};
	window.Game.Game.prototype.changeState = function(newState) {
		if (newState === window.Game.STATES.PAUSE) {
			_privates[this.id].currentState = STATE_CHANGE_TO_PAUSE;
		} else if (newState === window.Game.STATES.RESUME) {
			_privates[this.id].currentState = STATE_CHANGE_TO_DESTROY;
		}
	};
	window.Game.Game.prototype.addSprite = function(spriteName, sprite) {
		if(!(sprite instanceof window.Game.Sprite)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("addSprite function expects window.Game.Sprite");
		}
		if (!("string" === typeof spriteName)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Name of the sprite is not correct.");
		}
		_privates[this.id].sprites[spriteName] = sprite;
	};
	window.Game.Game.prototype.addBackground = function(backgroundName, background) {
		if(!(background instanceof window.Game.Background)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("addBackground function expects window.Game.Background");
		}
		if (!("string" === typeof backgroundName)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Name of the background is not correct.");
		}
		_privates[this.id].backgrounds[backgroundName] = background;
	};
	window.Game.Game.prototype.addSound = function(soundName, sound) {
		if(!(sound instanceof window.Game.Sound)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("addSound function expects window.Game.Sound");
		}
		if (!("string" === typeof soundName)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Name of the sound is not correct.");
		}
		_privates[this.id].sounds[soundName] = sound;
	};
	window.Game.Game.prototype.addFont = function(fontName, font) {
		if(!(font instanceof window.Game.Font)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("addFont function expects window.Game.Font");
		}
		if (!("string" === typeof fontName)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Name of the font is not correct.");
		}
		_privates[this.id].fonts[fontName] = font;
	};
	window.Game.Game.prototype.initialize = function(canvasWrapperId, debugEnabled) {
		if(_privates[this.id].currentState !== STATE_NEW) {
			throw "Game already initialized.";
		}
		if (document.querySelectorAll(canvasWrapperId).length !== 1) {
			throw "Please provide a valid DOM element for wrapping game. It should exist and unique.";
		}
		var canvas = document.createElement("CANVAS");
		canvas.id = "game_" + this.id;
        document.querySelector(canvasWrapperId).append(canvas);
		_privates[this.id].canvas = canvas;

		// Set drawing size equal to visual size
		_privates[this.id].canvas.width = document.querySelector(canvasWrapperId).offsetWidth;
		_privates[this.id].canvas.height = document.querySelector(canvasWrapperId).offsetHeight;

		_loadSprites.call(this);
		_loadBackgrounds.call(this);
		_loadSounds.call(this);
		_loadFonts.call(this);
		_gameFrameExecutor.call(this);

		if(debugEnabled === true) {
            setInterval(function () {
                totalSeconds++;
                totalFPS += framesPerSecond;
                console.log("Seconds elapsed: " + totalSeconds + "\tFPS: " + framesPerSecond + "\t Average FPS: " + (totalFPS/totalSeconds));
                framesPerSecond=0;
            }, 1000);
		}
	};

	window.Game.STATES = {
		PAUSE: "PAUSE",
		RESUME: "RESUME"
	};

	// Private helper functions
	var _gameFrameExecutor = function() {
		var func = nextFunctionForState[_privates[this.id].currentState];
		if (null !== func && "function" === typeof _game[func]) {
			try {
				_game[func].call(this);
			} catch (err) {
				window.Game.Exceptions.consoleError(err);
			}
		}
		var that = this;
		requestAnimationFrame(function(){
			_gameFrameExecutor.call(that);
		});
	};
	var _loadSprites = function() {
		for(var key in _privates[this.id].sprites) {
			_privates[this.id].remainingResourcesToLoad++;
			var that = this;
			_privates[this.id].sprites[key].load(function() {
				_privates[that.id].remainingResourcesToLoad--;
			});
		}
	};
	var _loadBackgrounds = function() {
		for(var key in _privates[this.id].backgrounds) {
			_privates[this.id].remainingResourcesToLoad++;
			var that = this;
			_privates[this.id].backgrounds[key].load(function() {
				_privates[that.id].remainingResourcesToLoad--;
			});
		}
	};
	var _loadSounds = function() {
		for(var key in _privates[this.id].sounds) {
			_privates[this.id].remainingResourcesToLoad++;
			var that = this;
			_privates[this.id].sounds[key].load(function() {
				_privates[that.id].remainingResourcesToLoad--;
			});
		}
		
	};
	var _loadFonts = function() {
		for(var key in _privates[this.id].fonts) {
			_privates[this.id].remainingResourcesToLoad++;
			var that = this;
			_privates[this.id].fonts[key].load(function() {
				_privates[that.id].remainingResourcesToLoad--;
			});
		}
		
	};
	var _executeOverriddenFunction = function(event) {
        framesPerSecond++;
		var func = _privates[this.id].callbackFunctions[event];
		if("function" === typeof func) {
			try {
				func();
			} catch (err) {
				window.Game.Exceptions.consoleError(err);
			}
		}
	};
	var _setOnEventFunction = function(forEvent, customFunc) {
		if ("function" === typeof customFunc || customFunc === null) {
			// User is overriding this function, update in callbackFunctions 
			_privates[this.id].callbackFunctions[forEvent] = customFunc;
		} else {
			throw new window.Game.Exceptions.IllegalArgumentsException("A function or null is expected.");
		}
	};
	var _aGameObjectWithSameNameExists = function(name) {
		for (var key in _privates) {
			if (_privates[key].name === name) {
				return true;
			}
		}
		return false;
	};
})();
