import { GameObject } from "./GameObject";
export class BallObject extends GameObject {
    constructor(pos, radius, velocity, sptite) {
        if (pos !== undefined && radius !== undefined && velocity !== undefined && sptite !== undefined) {
            super(pos, [radius * 2.0, radius * 2.0], sptite, [1.0, 1.0, 1.0], velocity);
            this.radius = radius;
            this.stuck = true;
            this.sticky = false;
            this.passThrough = false;
        }
        else {
            super();
            this.radius = 12.5;
            this.stuck = true;
            this.sticky = false;
            this.passThrough = false;
        }
    }
    move(dt, windowWidth) {
        if (!this.stuck) {
            this.position[0] += this.velocity[0] * dt;
            this.position[1] += this.velocity[1] * dt;
            if (this.position[0] <= 0.0) {
                this.velocity[0] = -this.velocity[0];
                this.position[0] = 0.0;
            }
            else if (this.position[0] + this.size[0] >= windowWidth) {
                this.velocity[0] = -this.velocity[0];
                this.position[0] = windowWidth - this.size[0];
            }
            if (this.position[1] <= 0.0) {
                this.velocity[1] = -this.velocity[1];
                this.position[1] = 0.0;
            }
        }
        return this.position;
    }
    reset(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.stuck = true;
        this.sticky = false;
        this.passThrough = false;
    }
}
