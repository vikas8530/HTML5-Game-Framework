(function() {
	"use strict";
	window.Game = window.Game || {};
	window.Game.Script = function(name, callback) {
		if(!(this instanceof window.Game.Script)) {
			throw new window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation();
		}
		if (!("string" === typeof name && "function" === typeof callback)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("Script name and/or script callback function is not correct.");
		}
		this.id = Game.Shared.getNewId();
		this.scriptCallback = callback;
		this.scriptName = name;
	};
	window.Game.Script.prototype.getName = function() {
		return this.scriptName;
	};
	window.Game.Script.prototype.execute = function(context) {
		this.scriptCallback.call(context);
	};

})();