export function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}
export function normalize(a) {
    let length = Math.sqrt(a[0] * a[0] + a[1] * a[1]);
    let bLength = 1 / length;
    return [a[0] * bLength, a[1] * bLength];
}
export function length(a) {
    return Math.hypot(a[0], a[1]);
}
export function multiply(a, b) {
    if (typeof b === "number")
        return [a[0] * b, a[1] * b];
    else
        return [a[0] * b[0], a[1] * b[1]];
}
export function add(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}
export function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}
