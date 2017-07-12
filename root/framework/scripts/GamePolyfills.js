(function() {
	"use strict";
	window.requestAnimationFrame = window.requestAnimationFrame
	    || window.mozRequestAnimationFrame
	    || window.webkitRequestAnimationFrame
	    || window.msRequestAnimationFrame
	    || function(f){return setTimeout(f, 1000/60)}; // simulate calling code 60

	window.cancelAnimationFrame = window.cancelAnimationFrame
	    || window.mozCancelAnimationFrame
	    || function(requestID){clearTimeout(requestID)} //fall back
})();