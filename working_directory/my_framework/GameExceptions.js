(function() {
	"use strict";
	window.Game = window.Game || {};
	window.Game.Exceptions = {};
	window.Game.Exceptions.IllegalArgumentsException = function(message) {
		Error.call(this, message);
		this.message = message;
  		this.stack = (new Error()).stack;
	};
	window.Game.Exceptions.IllegalArgumentsException.prototype = Object.create(Error.prototype);
	window.Game.Exceptions.IllegalArgumentsException.prototype.constructor = window.Game.Exceptions.IllegalArgumentsException;
	window.Game.Exceptions.IllegalArgumentsException.prototype.name = "IllegalArgumentsException";

	window.Game.Exceptions.IllegalArgumentValueException = function(message) {
		Error.call(this, message);
		this.message = message;
  		this.stack = (new Error()).stack;
	};
	window.Game.Exceptions.IllegalArgumentValueException.prototype = Object.create(Error.prototype);
	window.Game.Exceptions.IllegalArgumentValueException.prototype.constructor = window.Game.Exceptions.IllegalArgumentValueException;
	window.Game.Exceptions.IllegalArgumentValueException.prototype.name = "IllegalArgumentValueException";

	window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation = function(message) {
		if("undefined" == typeof message) {
			message = "You can't call this function without 'new' keyword. This can be used only to create an object. If you are inheriting this object, do it properly.";
		}
		Error.call(this, message);
		this.message = message;
  		this.stack = (new Error()).stack;
	};
	window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation.prototype = Object.create(Error.prototype);
	window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation.prototype.constructor = window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation;
	window.Game.Exceptions.IllegalFunctionCallInsteadOfObjectCreation.prototype.name = "IllegalFunctionCallInsteadOfObjectCreation";

	window.Game.Exceptions.ResourceNotFoundException = function(message) {
		Error.call(this, message);
		this.message = message;
  		this.stack = (new Error()).stack;
	};
	window.Game.Exceptions.ResourceNotFoundException.prototype = Object.create(Error.prototype);
	window.Game.Exceptions.ResourceNotFoundException.prototype.constructor = window.Game.Exceptions.ResourceNotFoundException;
	window.Game.Exceptions.ResourceNotFoundException.prototype.name = "ResourceNotFoundException";

	window.Game.Exceptions.ObjectNotLinkedToRoomException = function(message) {
		Error.call(this, message);
		this.message = message;
  		this.stack = (new Error()).stack;
	};
	window.Game.Exceptions.ObjectNotLinkedToRoomException.prototype = Object.create(Error.prototype);
	window.Game.Exceptions.ObjectNotLinkedToRoomException.prototype.constructor = window.Game.Exceptions.ObjectNotLinkedToRoomException;
	window.Game.Exceptions.ObjectNotLinkedToRoomException.prototype.name = "ObjectNotLinkedToRoomException";

	var _simplifiedException = function(e) {
		if (e && e.stack && e.name && e.message) {
			return (e.name + "\t-\t" + e.message + "\n" + e.stack);
		} else {
			return (e);
		}
	}

	// Modify the error (when raised), to show proper stacktrace
	window.addEventListener("error", function(e) {
		console.error(_simplifiedException(e.error));
		e.preventDefault()
	});

	window.Game.Exceptions.consoleError = function(exception) {
		console.error(_simplifiedException(exception));
	};
})();
