const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export class Tile {
    protected floor: any;
    protected wall: any;

    constructor() {
        this.floor = document.getElementById('floor') as HTMLImageElement;
        this.wall = document.getElementById('wall') as HTMLImageElement;
    }

    getWall(): any {
        return this.wall;
    }

    getFloor(): any {
        return this.floor;
    }

    drawFloor(x: number, y: number): void {
        ctx.drawImage(this.floor, x, y);
    }
}