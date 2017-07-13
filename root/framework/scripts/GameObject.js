
(function() {
	"use strict";
	window.Game = window.Game || {};
	
	// Shared functions. These functions must be called with context variable
	var _object = {
		onCreate: function(gameRoom) {
			_executeOverriddenFunction.call(this, "onCreate", gameRoom);
			_executeOverriddenFunction.call(this, "updateOnCreate", gameRoom);
		},
		onFrameChange: function(gameRoom) {
			_executeOverriddenFunction.call(this, "onFrameChange", gameRoom);
		},
		onDraw: function(gameRoom) {
			if(!_executeOverriddenFunction.call(this, "onDraw", gameRoom)) {
				if(_privates[this.id].sprite !== null) {
					_privates[this.id].sprite.drawWithOffset(gameRoom, _privates[this.id].x, _privates[this.id].y, _privates[this.id].offset.x, _privates[this.id].offset.y, _privates[this.id].rotate);
				}
			}
		},
		onCollision: function(gameRoom, collisionWith) {
			_executeOverriddenFunction.call(this, "onCollision", gameRoom, collisionWith);
		}
	};

	// Private object variables
	var _privates = {

	};

	window.Game.Object = function(name, _x, _y, _sprite, zIndex, offsetX, offsetY, rotate) {
		if(!(this instanceof window.Game.Object)) {
			throw new window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation();
		}
		if (!("string" === typeof name)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Object name is not correct.");
		}
		if (!(_sprite === null || _sprite instanceof window.Game.Sprite)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Sprite should be null or window.Game.Sprite");
		}
		this.name = name;
		this.id = Game.Shared.getNewId();
		this.zIndex = 1;
		if("number" === typeof zIndex) {
			this.zIndex = zIndex;
		}

		// User overridden functions
		this.onCreate = null; 
		this.updateOnCreate = null;
		this.onFrameChange = null; 
		this.onDraw = null; 
		this.onCollision = null;

		// Set up private variables
		_privates[this.id] = {
			x: _x,
			y: _y,
			sprite: _sprite,
			offset: {
				x: 0,
				y: 0
			},
			rotate: 0
		};
        if("undefined" !== typeof offsetX) {
            _privates[this.id].offset.x = offsetX;
        }
        if("undefined" !== typeof offsetY) {
            _privates[this.id].offset.y = offsetY;
        }
        if("number" === typeof rotate) {
        	_privates[this.id].rotate = (rotate * 180 / Math.PI % 360) * Math.PI / 180;
		}
	};
	window.Game.Object.prototype.getName = function() {
		return this.name;
	};
	window.Game.Object.prototype.setOnCreate = function(customFunc) {
		_setOnEventFunction.call(this, "onCreate", customFunc);
	};
	window.Game.Object.prototype.setUpdateOnCreate = function(customFunc) {
		// This is useful when creating instances of same object and need few different things in OnCreate
		// It will be called just after onCreate in sequence
		_setOnEventFunction.call(this, "updateOnCreate", customFunc);
	};
	window.Game.Object.prototype.setOnFrameChange = function(customFunc) {
		_setOnEventFunction.call(this, "onFrameChange", customFunc);
	};
	window.Game.Object.prototype.setOnDraw = function(customFunc) {
		_setOnEventFunction.call(this, "onDraw", customFunc);
	};
	window.Game.Object.prototype.setOnCollision = function(customFunc) {
		_setOnEventFunction.call(this, "onCollision", customFunc);
	};
	window.Game.Object.prototype.setZIndex = function(zIndex) {
		if(zIndex) {
			this.zIndex = zIndex;
		}
	};
	window.Game.Object.prototype.getZIndex = function() {
		return this.zIndex;
	};
	window.Game.Object.prototype.getNewInstance = function() {
		var newObj = new Game.Object(this.name, _privates[this.id].x, _privates[this.id].y, _privates[this.id].sprite, this.zIndex, _privates[this.id].offset.x, _privates[this.id].offset.y, _privates[this.id].rotate);
		
		// Set properties
		for (var key in this){
			if(this.hasOwnProperty(key)){
				if("function" === typeof this[key]) {
					newObj[key] = this[key];
				} else {	
					if(key !== "id" && key !== "name") {
						// TODO Copy the object
						newObj[key] = this[key];
					}
				}
			}
		}
		return newObj;
	};

	// This function is public but should not be used outside the game framework.
	window.Game.Object.prototype.execute = function(event, gameRoom) {
		if (!("string" === typeof event && gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object and an event name is expected.");
		}
		var func = _object[event];
		if("function" !== typeof func) {
			throw new window.Game.Exceptions.IllegalArgumentsException("The event passed is not expected.");
		} else {
			func.call(this, gameRoom);
		}
	};

	// Private helper functions
	var _executeOverriddenFunction = function(event, gameRoom, arg1) {
		var func = this[event];
		if("function" === typeof func) {
			try {
				func(_privates[this.id], gameRoom, arg1);
			} catch (err) {
				console.error(err);
			}
			return true;
		} else {
			return false;
		}
	};
	var _setOnEventFunction = function(forEvent, customFunc) {
		if ("function" === typeof customFunc || customFunc === null) {
			// User is overriding this function, update. 
			this[forEvent] = customFunc;
		} else {
			throw new window.Game.Exceptions.IllegalArgumentsException("A function or null is expected.");
		}
	};
})();