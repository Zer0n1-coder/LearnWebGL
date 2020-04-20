define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getWebGL() {
        let canvas = document.getElementById('webgl');
        let gl = canvas.getContext('webgl');
        if (!gl) {
            window.alert('Failed to get the rendering context for WebGL');
            return null;
        }
        return gl;
    }
    exports.gl = getWebGL();
});
//# sourceMappingURL=Global.js.map