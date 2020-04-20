
function getWebGL() {
    let canvas = <HTMLCanvasElement>document.getElementById('webgl');

    let gl: WebGLRenderingContext = canvas.getContext('webgl');
    if (!gl) {
        window.alert('Failed to get the rendering context for WebGL');
        return null;
    }
    return gl;
}

export let gl = getWebGL();