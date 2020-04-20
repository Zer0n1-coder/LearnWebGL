define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function main() {
        let canvas = document.getElementById('webgl');
        let gl = canvas.getContext('webgl');
        if (!gl) {
            window.alert('Failed to get the rendering context for WebGL');
            return;
        }
        gl.clearColor(0.2, 0.3, 0.3, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    exports.main = main;
});
//# sourceMappingURL=main.js.map