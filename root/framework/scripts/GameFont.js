(function() {
	"use strict";
	window.Game = window.Game || {};
	window.Game.Font = function(name, url) {
		if(!(this instanceof window.Game.Font)) {
			throw new window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation();
		}
		if (!("string" === typeof name && "string" === typeof url)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Font name and/or Font url is not correct.");
		}
		this.id = Game.Shared.getNewId();
		this.fontUrl = url;
		this.fontName = name;
		this.font = null;
	};
	window.Game.Font.prototype.getName = function() {
		return this.fontName;
	};
	window.Game.Font.prototype.load = function(callback) {
		var font = new Font();
		var that = this;
		font.onload = function() {
			that.font = font;
			callback();
		};
		font.onerror = function(e) {
			window.Game.Exceptions.consoleError(new window.Game.Exceptions.ResourceNotFoundException(font.src));
			callback();
		};
		font.fontFamily  = this.fontName;
		font.src =  window.Game.Shared.rootDirectory + window.Game.Shared.fontsDirectory + this.fontUrl;
	};
	window.Game.Font.prototype.getValueToSetInCanvas = function() {
		if(this.font != null) {
			return this.font.fontFamily;
		} else {
			// Fallback font
			return "Arial";
		}
	};

})();