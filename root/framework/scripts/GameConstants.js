(function() {
    "use strict";
    window.Game = window.Game || {};


    var _defineProperty = function (object, key, value) {
        Object.defineProperty(object, key, {
            configurable: false,
            writable: false,
            value: value
        });
    };

    _defineProperty(window.Game, "Constants", {});
    _defineProperty(window.Game.Constants, "SCALE", {});
    _defineProperty(window.Game.Constants.SCALE, "FULL", "FULL");
    _defineProperty(window.Game.Constants.SCALE, "HALF", "HALF");
    _defineProperty(window.Game.Constants, "KEY", {});
    _defineProperty(window.Game.Constants.KEY, "SCALE_BY", "SCALE_BY");
})();