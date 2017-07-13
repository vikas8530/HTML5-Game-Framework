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
	window.Game.Sprite.prototype.draw = function(gameRoom, x, y, rotate) {
		if(!(gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sprite draw function");
		}
		if(this.sprite !== null) {
			if("number" !== typeof rotate) {
				rotate = 0;
            }
            if(rotate !== 0) {
                var ctx = gameRoom.getCanvasContext();
                ctx.translate(x, y);
                ctx.rotate(rotate);
                ctx.drawImage(this.sprite, 0, 0);
                ctx.rotate(-rotate);
                ctx.translate(-x, -y);
            } else {
                gameRoom.getCanvasContext().drawImage(this.sprite, x, y);
			}
        }
	};
	window.Game.Sprite.prototype.drawWithOffset = function(gameRoom, x, y, offsetX, offsetY, rotate) {
        if(!(gameRoom instanceof window.Game.Room)) {
            throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sprite draw function");
        }
        if(this.sprite !== null) {
            var _offset = _calculateOffset.call(this, offsetX, offsetY);
            if("number" !== typeof rotate) {
                rotate = 0;
            }
            if(rotate !== 0) {
                var ctx = gameRoom.getCanvasContext();
                ctx.translate(x, y);
                ctx.rotate(rotate);
                ctx.drawImage(this.sprite, -_offset.x, -_offset.y);
                ctx.rotate(-rotate);
                ctx.translate(-x, -y);
            } else {
                gameRoom.getCanvasContext().drawImage(this.sprite, x - _offset.x, y - _offset.y);
            }
        }
	};
	window.Game.Sprite.prototype.drawResized = function(gameRoom, x, y, resizeFactor) {
		if(!(gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected in sprite draw function");
		}
		if(this.sprite !== null) {
			gameRoom.getCanvasContext().drawImage(this.sprite, x, y, this.width * resizeFactor, this.height * resizeFactor);
		}
	};

    var _calculateSide = function (length, scale) {
		var response = 0;
        if ("object" === typeof scale && scale.hasOwnProperty(window.Game.Constants.KEY.SCALE_BY) && "number" === typeof scale[window.Game.Constants.KEY.SCALE_BY]) {
			response = length * scale[window.Game.Constants.KEY.SCALE_BY];
        } else if("string" === typeof scale && window.Game.Constants.SCALE.hasOwnProperty(scale)) {
			switch (scale) {
                case window.Game.Constants.SCALE.FULL:
                    response = length;
                    break;
				case window.Game.Constants.SCALE.HALF:
					response = length / 2;
					break;
            }
		}
		return response;
    };
    var _calculateOffset = function (offsetX, offsetY) {
		var _offset = {
			x: 0,
			y: 0
		};
        if("number" === typeof offsetX) {
            _offset.x = offsetX;
        } else if (this.width !== null) {
        	_offset.x = _calculateSide(this.width, offsetX);
		}
        if("number" === typeof offsetY) {
            _offset.y = offsetY;
        } else if (this.height !== null) {
            _offset.y = _calculateSide(this.height, offsetY);
        }
		return _offset;
    }
})();