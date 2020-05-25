export function dot(a:number[],b:number[]){
    return a[0]*b[0]+a[1] *b[1];
}

export function normalize(a:number[]){
    let length = Math.sqrt(a[0]*a[0] + a[1] * a[1]);
    let bLength = 1 / length;
    return [a[0]*bLength,a[1]*bLength];
}

export function length(a:number[]){
    return Math.hypot(a[0],a[1]);
}

export function multiply(a:number[],b:number[]):number[];
export function multiply(a:number[],b:number):number[];
export function multiply(a:number[],b:number[] | number):number[]{
    if(typeof b === "number")
        return [a[0] *b,a[1] *b];
    else
        return [a[0]*b[0],a[1]*b[1]];
}

export function add(a:number[],b:number[]){
    return [a[0] + b[0],a[1] + b[1]];
}

export function subtract(a:number[],b:number[]){
    return [a[0] - b[0],a[1] - b[1]];
}