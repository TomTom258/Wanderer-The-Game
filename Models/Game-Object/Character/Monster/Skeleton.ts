import { Hero } from "./Hero";
import { Monster } from "./Monster";

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export class Skeleton extends Monster{
    protected skeleton: any;
    protected skeletonX: number;
    protected skeletonY: number;
    protected skeletonHp: number;
    protected skeletonDp: number;
    protected skeletonSp: number;
    protected skeletonLevel: number;
    protected hasKey: boolean;
    protected isAlive: boolean;

    constructor() {
        super();
        this.skeleton = document.getElementById('skeleton') as HTMLImageElement;
        this.skeletonX = 0;
        this.skeletonY = 0;
        this.skeletonLevel = 1;
        this.skeletonHp = 2 * (this.skeletonLevel) * (Math.floor(Math.random() * (6 - 1) + 1));
        this.skeletonDp = ((this.skeletonLevel / 2) * (Math.floor(Math.random() * (6 - 1) + 1))) + ((Math.floor(Math.random() * (6 - 1) + 1)) / 2);
        this.skeletonSp = (this.skeletonLevel * ((Math.floor(Math.random() * (6 - 1) + 1)))) + this.skeletonLevel;
        this.hasKey = false;
        this.isAlive = true;
    }

    setKey(): void {
        this.hasKey = true;
    }

    getKey(): boolean {
        return this.hasKey;
    }

    hasSkeletonKey(): boolean {
        return this.hasKey;
    }

    increaseSkeletonLevel(number: number): void {
        this.skeletonLevel += number;
        this.skeletonHp = 2 * (this.skeletonLevel) * (Math.floor(Math.random() * (6 - 1) + 1));
        this.skeletonDp = ((this.skeletonLevel / 2) * (Math.floor(Math.random() * (6 - 1) + 1))) + ((Math.floor(Math.random() * (6 - 1) + 1)) / 2);
        this.skeletonSp = (this.skeletonLevel * ((Math.floor(Math.random() * (6 - 1) + 1)))) + this.skeletonLevel;
    }

    getSkeletonHp(): number {
        return this.skeletonHp;
    }

    getSkeletonSp(): number {
        return this.skeletonSp;
    }

    getSkeletonDp(): number {
        return this.skeletonDp;
    }

    getSkeleton(): any {
        return this.skeleton;
    }

    drawSkeleton(): void {
        ctx.drawImage(this.skeleton, this.skeletonX, this.skeletonY);
    }

    getSkeletonX(): number {
        return this.skeletonX;
    }

    getSkeletonY(): number {
        return this.skeletonY;
    }

    setSkeletonX(x: number): void {
        this.skeletonX = x;
    }

    setSkeletonY(y: number): void {
        this.skeletonY = y;
    }

    moveSkeletonUp(): void {
        this.skeletonY -= 72;
    }

    moveSkeletonDown(): void {
        this.skeletonY += 72;
    }

    moveSkeletonLeft(): void {
        this.skeletonX -= 72;
    }

    moveSkeletonRight(): void {
        this.skeletonX += 72;
    }

    strike(hero: Hero): void {
        if ((this.skeletonSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1)))) > hero.getHeroDp()) {
            console.log('strike from Monster was succesful');
            hero.lowerHeroHp(this.skeletonSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1))) - hero.getHeroDp());
        }
        
        else {
            console.log('strike from Monster wasnt succesful');
        }
    }

    lowerSkeletonHp(number: number): void {
        this.skeletonHp -= number;
    }

    isSkeletonAlive(): boolean {
        if (this.skeletonHp > 0) {
            return true;
        }

        else {
            return false;
        }
    }

    getSkeletonLevel(): number {
        return this.skeletonLevel;
    }

    setSkeletonDead(): void {
        this.skeleton.isAlive = false;
    }
}