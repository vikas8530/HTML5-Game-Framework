(function() {
	"use strict";

	// private variables
	var _privates = {

	};

	window.Game = window.Game || {};
	window.Game.Room = function(name, optionalOnCreate) {
		if(!(this instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation();
		}
		if (!"string" === typeof name) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Room name is not correct.");
		}
		this.roomName = name;
		this.id = Game.Shared.getNewId();
		if("function" === typeof optionalOnCreate) {
			this.overriddenOnCreate = optionalOnCreate;
		} else {
			this.overriddenOnCreate = null;
		}

		// Initialize private variables
		_privates[this.id] = {
			objects: {},
			objectsSortedForRenderingUsingZIndex: [],
			canvas: null,
			background: {
				color: "#000",
				sprite: null
			},
			width:0,
			height: 0
		};
	};
	window.Game.Room.prototype.getName = function() {
		return this.roomName;
	};
	window.Game.Room.prototype.onCreate = function(canvas) {
		_privates[this.id].canvas = canvas;
		_privates[this.id].canvasContext = canvas.getContext('2d');
		_privates[this.id].width = canvas.width;
		_privates[this.id].height = canvas.height;	

		// Defaults for text rendering
		window.Game.RenderingHelper.setDefaultForRenderingText(this, new window.Game.Font("default", ""), "30px", "black", "left", "top");	

		if(null != this.overriddenOnCreate) {
			this.overriddenOnCreate(this);
		}

		// Provide area to background
		if(_privates[this.id].background.sprite != null) {
			_privates[this.id].background.sprite.setBackgroundArea(this, 0, 0, _privates[this.id].width, _privates[this.id].height);
		}

		// OnCreate of the objects
		var objects = _privates[this.id].objects;
		for(var key in objects) {
			for (var index in objects[key]) {
				objects[key][index].execute("onCreate", this);
			}
		}
	};
	window.Game.Room.prototype.addObject = function(objectName, object) {
		if(!(object instanceof window.Game.Object)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("addObject function expects window.Game.Object");
		}
		if (!("string" === typeof objectName)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Name of the object is not correct.");
		}
		if("undefined" == typeof _privates[this.id].objects[objectName]) {
			_privates[this.id].objects[objectName] = [];
		}
		_privates[this.id].objects[objectName].push(object);
		_addObjectToSortedZIndexList.call(this, object);
	};
	window.Game.Room.prototype.getCanvasContext = function() {
		return _privates[this.id].canvasContext;
	};
	window.Game.Room.prototype.setBackgroundColor = function(color) {
		// color can be null
		_privates[this.id].background.color = color;
	};
	window.Game.Room.prototype.setBackgroundImage = function(background) {
		if(!(_privates[this.id].background.sprite == null || _privates[this.id].background.sprite instanceof window.Game.Background)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("setBackgroundImage function expects null or window.Game.Background");
		}
		_privates[this.id].background.sprite = background;
	};
	window.Game.Room.prototype.onFrameChangeForStarted = function() {
		var objects = _privates[this.id].objects;
		for(var key in objects) {
			for (var index in objects[key]) {
				objects[key][index].execute("onFrameChange", this);
			}
		}
	};
	window.Game.Room.prototype.drawBackground = function() {
		// draw color
		if(_privates[this.id].background.color != null) {
			var ctx = _privates[this.id].canvasContext;
			ctx.fillStyle = _privates[this.id].background.color;
			ctx.fillRect(0, 0, _privates[this.id].width, _privates[this.id].height);
		}

		// draw image
		if(_privates[this.id].background.sprite != null) {
			_privates[this.id].background.sprite.draw(this);
		}
	};
	window.Game.Room.prototype.drawObjects = function() {
		var objects = _privates[this.id].objectsSortedForRenderingUsingZIndex;
		for(var key in objects) {
			objects[key].execute("onDraw", this);
		}
	};
	window.Game.Room.prototype.objectZIndexChanged = function(object) {
		var list = _privates[this.id].objectsSortedForRenderingUsingZIndex;
		var done = false;
		for(var i = 0; i < list.length; i++) {
			if (list.id == object.id) {
				// Remove object from list.
				_privates[this.id].objectsSortedForRenderingUsingZIndex.splice(i, 1);

				// Add object to list
				_addObjectToSortedZIndexList.call(this, object);
				done = true;
				break;
			}
		}
		if(!done) {
			throw new window.Game.Exceptions.ObjectNotLinkedToRoomException(object.name + " is not added to this room.");
		}
	};
	window.Game.Room.prototype.getWidth = function() {
		return _privates[this.id].width;
	};
	window.Game.Room.prototype.getHeight = function() {
		return _privates[this.id].height;
	};
	var _addObjectToSortedZIndexList = function(obj) {
		var zIndex = obj.getZIndex();
		var list = _privates[this.id].objectsSortedForRenderingUsingZIndex;
		var done = false;
		for(var i = 0; i < list.length; i++) {
			if(list[i].getZIndex() > zIndex) {
				_privates[this.id].objectsSortedForRenderingUsingZIndex.splice(i, 0, obj);
				done = true;
				break;
			}
		}
		if(!done) {
			_privates[this.id].objectsSortedForRenderingUsingZIndex.push(obj);
		}
	};
})();