export function main(): void {
    let canvas = <HTMLCanvasElement>document.getElementById('webgl');

    let gl: WebGLRenderingContext = canvas.getContext('webgl');
    if (!gl) {
        window.alert('Failed to get the rendering context for WebGL');
        return;
    }
    gl.clearColor(0.2, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}