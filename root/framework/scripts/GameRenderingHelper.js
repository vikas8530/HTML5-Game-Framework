(function() {
	"use strict";
	window.Game = window.Game || {};
	window.Game.RenderingHelper = {};
	var defaultFont = null;
	var defaultSize = null;
	var defaultStyle = null;
	var defaultAlignHorizontally = null;
	var defaultAlignVertically = null;
	window.Game.RenderingHelper.setDefaultForRenderingText = function(gameRoom, font, size, style, alignHorizontally, alignVertically) {
		if(!(gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected to draw text.");
		}
		if(font instanceof window.Game.Font && size && style && alignHorizontally && alignVertically) {
			var ctx = gameRoom.getCanvasContext();
			ctx.font = size + " " + font.getValueToSetInCanvas();
			ctx.fillStyle = style;
			ctx.textAlign = alignHorizontally;
			ctx.textBaseline = alignVertically;
			defaultFont = font;
			defaultSize = size;
			defaultStyle = style;
			defaultAlignHorizontally = alignHorizontally;
			defaultAlignVertically = alignVertically;
		} else {
			throw new window.Game.Exceptions.IllegalArgumentsException("Font, size, style and align (horizontally and vertically) are must");
		}
	};
	window.Game.RenderingHelper.drawText = function(gameRoom, text, x, y, font, size, alignHorizontally, alignVertically, style, stroke) {
		if(!(gameRoom instanceof window.Game.Room)) {
			throw new window.Game.Exceptions.IllegalArgumentsException("A gameRoom object is expected to draw text.");
		}
		var ctx = gameRoom.getCanvasContext();
		if(alignHorizontally) {
			ctx.textAlign = alignHorizontally;
		} else {
			ctx.textAlign = defaultAlignHorizontally;
		}
		if(alignVertically) {
			ctx.textBaseline = alignVertically;
		} else {
			ctx.textBaseline = defaultAlignVertically;
		}
		if(style) {
			ctx.fillStyle = style;
		} else {
			ctx.fillStyle = defaultStyle;
		}
		if(!size) {
			size = defaultSize;
		}
		if(font instanceof window.Game.Font) {
			ctx.font = size + " " + font.getValueToSetInCanvas();
		} else {
            ctx.font = size + " " + defaultFont.getValueToSetInCanvas();
        }
		if(stroke) {
			ctx.strokeText(("" + text), x, y);
		} else {
			ctx.fillText(("" + text), x, y);
		}
	};
})();
