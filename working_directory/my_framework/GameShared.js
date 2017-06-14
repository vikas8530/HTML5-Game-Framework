(function() {
	"use strict";
	window.Game = window.Game || {};
	window.Game.Shared = {};
	window.Game.Shared.rootDirectory = "./";
	window.Game.Shared.imagesDirectory = "assets/images/";
	window.Game.Shared.soundsDirectory = "assets/sounds/";
	window.Game.Shared.fontsDirectory = "assets/fonts/";


	var id = Math.floor(new Date().getTime() / 2);
	window.Game.Shared.getNewId = function() {
		id++;
		return id.toString();
	};
})();