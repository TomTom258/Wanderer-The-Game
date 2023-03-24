import { Area } from "../Area/Area";

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export class Monster extends Area {
    protected positionX: number;
    protected positionY: number;

    constructor() {
        super();
        this.positionX = 0;
        this.positionY = 0;
    }
      
    getPositions(): Array<number> {
        return [this.positionX, this.positionY];
    }

    setPositions(x: number, y: number): void {
        this.positionX = x;
        this.positionY = y;
    }

    moveMonsterDown(): void {
        this.positionY += 72;
    }

    moveMonsterUp(): void {
        this.positionY -= 72;
    }

    moveMonsterLeft(): void {
        this.positionX -= 72;
    }

    moveMonsterRight(): void {
        this.positionX += 72;
    }
}