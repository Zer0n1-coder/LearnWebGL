import { mat4, vec3, glMatrix } from "./gl-matrix/index.js";
export var CameraMovement;
(function (CameraMovement) {
    CameraMovement[CameraMovement["FORWARD"] = 0] = "FORWARD";
    CameraMovement[CameraMovement["BACKWARD"] = 1] = "BACKWARD";
    CameraMovement[CameraMovement["LEFT"] = 2] = "LEFT";
    CameraMovement[CameraMovement["RIGHT"] = 3] = "RIGHT";
})(CameraMovement || (CameraMovement = {}));
export const YAW = -90.0;
export const PITCH = 0.0;
export const SPEED = 2.5;
export const SENSITIVITY = 0.1;
export const ZOOM = 45.0;
export class Camera {
    constructor(position = vec3.fromValues(0.0, 0.0, 0.0), up = vec3.fromValues(0.0, 1.0, 0.0), yaw = YAW, pitch = PITCH) {
        this.Front = vec3.fromValues(0.0, 0.0, -1.0);
        this.MovementSpeed = SPEED;
        this.MouseSensitivity = SENSITIVITY;
        this.Zoom = ZOOM;
        this.Right = new Float32Array(3);
        this.Up = new Float32Array(3);
        this.Position = position;
        this.WorldUp = up;
        this.Yaw = yaw;
        this.Pitch = pitch;
        this.updateCameraVectors();
    }
    GetViewMatrix() {
        return mat4.lookAt(mat4.create(), this.Position, vec3.add(vec3.create(), this.Position, this.Front), this.Up);
    }
    ProcessKeyboard(direction, deltaTime) {
        let velocity = this.MovementSpeed * deltaTime;
        if (direction === CameraMovement.FORWARD)
            vec3.add(this.Position, this.Position, vec3.fromValues(this.Front[0] * velocity, this.Front[1] * velocity, this.Front[2] * velocity));
        else if (direction === CameraMovement.BACKWARD)
            vec3.subtract(this.Position, this.Position, vec3.fromValues(this.Front[0] * velocity, this.Front[1] * velocity, this.Front[2] * velocity));
        else if (direction === CameraMovement.LEFT)
            vec3.subtract(this.Position, this.Position, vec3.fromValues(this.Right[0] * velocity, this.Right[1] * velocity, this.Right[2] * velocity));
        else if (direction === CameraMovement.RIGHT)
            vec3.add(this.Position, this.Position, vec3.fromValues(this.Right[0] * velocity, this.Right[1] * velocity, this.Right[2] * velocity));
    }
    ProcessMouseMovement(xoffset, yoffset, constrainPitch = true) {
        xoffset *= this.MouseSensitivity;
        yoffset *= this.MouseSensitivity;
        this.Yaw += xoffset;
        this.Pitch += yoffset;
        if (constrainPitch) {
            if (this.Pitch > 89.0)
                this.Pitch = 89.0;
            if (this.Pitch < -89.0)
                this.Pitch = -89.0;
        }
        this.updateCameraVectors();
    }
    ProcessMouseScroll(yoffset) {
        if (this.Zoom >= 1.0 && this.Zoom <= 45.0)
            this.Zoom -= yoffset;
        if (this.Zoom <= 1.0)
            this.Zoom = 1.0;
        if (this.Zoom >= 45.0)
            this.Zoom = 45.0;
    }
    updateCameraVectors() {
        let front = new Float32Array(3);
        front[0] = Math.cos(glMatrix.toRadian(this.Yaw)) * Math.cos(glMatrix.toRadian(this.Pitch));
        front[1] = Math.sin(glMatrix.toRadian(this.Pitch));
        front[2] = Math.sin(glMatrix.toRadian(this.Yaw)) * Math.cos(glMatrix.toRadian(this.Pitch));
        vec3.normalize(this.Front, front);
        vec3.normalize(this.Right, vec3.cross(vec3.create(), this.Front, this.WorldUp));
        vec3.normalize(this.Up, vec3.cross(vec3.create(), this.Right, this.Front));
    }
}
//# sourceMappingURL=Camera.js.map