import { Boss } from "./Boss";
import { Monster } from "./Monster";
import { Skeleton } from "./Skeleton";

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export class Hero extends Monster {
    protected heroDown: any;
    protected heroLeft: any;
    protected heroRight: any;
    protected heroUp: any;
    protected heroLevel: number;
    protected heroHp: number;
    protected heroMaxHp: number;
    protected heroDp: number;
    protected heroSp: number;
    protected heroX: number;
    protected heroY: number;
    protected hasKey: boolean;
    protected isAlive: boolean;

    constructor() {
        super();
        this.heroDown = document.getElementById('hero-down') as HTMLImageElement;
        this.heroLeft = document.getElementById('hero-left') as HTMLImageElement;
        this.heroRight = document.getElementById('hero-right') as HTMLImageElement;
        this.heroUp = document.getElementById('hero-up') as HTMLImageElement;
        this.heroLevel = 1;
        this.heroHp = 20 + (3 * (Math.floor(Math.random() * (6 - 1) + 1)));
        this.heroMaxHp = this.heroHp;
        this.heroDp = 2 * (Math.floor(Math.random() * (6 - 1) + 1));
        this.heroSp = 5 + (Math.floor(Math.random() * (6 - 1) + 1));
        this.heroX = 0;
        this.heroY = 0;
        this.hasKey = false;
        this.isAlive = true;
    }

    isHeroAlive(): boolean {
        if (this.heroHp > 0) {
            return true;
        }

        else {
            return false;
        }
    }

    hasHeroKey(): boolean {
        return this.hasKey;
    }

    setKey(boolean: boolean): void {
        this.hasKey = boolean;
    }

    setHeroX(x: number) {
        this.heroX = x;
    }

    setHeroY(y: number) {
        this.heroY = y;
    }

    getHeroX(): number {
        return this.heroX;
    }

    getHeroY(): number {
        return this.heroY;
    }

    getHeroLevel(): number {
        return this.heroLevel;
    }

    getHeroHp(): number {
        return this.heroHp;
    }

    getHeroMaxHp(): number {
        return this.heroMaxHp;
    }

    getHeroDp(): number {
        return this.heroDp;
    }

    getHeroSp(): number {
        return this.heroSp;
    }

    moveHeroUp(): void {
        this.heroY -= 72;
    }

    moveHeroDown(): void {
        this.heroY += 72;
    }

    moveHeroLeft(): void {
        this.heroX -= 72;
    }

    moveHeroRight(): void {
        this.heroX += 72;
    }

    drawHeroDown(): void {
        ctx.drawImage(this.heroDown, this.heroX, this.heroY);
    }

    drawHeroUp(): void {
        ctx.drawImage(this.heroUp, this.heroX, this.heroY);
    }

    drawHeroLeft(): void {
        ctx.drawImage(this.heroLeft, this.heroX, this.heroY);
    }

    drawHeroRight(): void {
        ctx.drawImage(this.heroRight, this.heroX, this.heroY);
    }

    strike(skeleton: Skeleton): void {
        if ((this.heroSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1)))) > skeleton.getSkeletonDp()) {
            console.log('strike to Monster was succesful');
            skeleton.lowerSkeletonHp(this.heroSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1))) - skeleton.getSkeletonDp());
        }
        
        else {
            console.log('strike to Monster wasnt succesful');
        }
    }

    strikeBoss(boss: Boss): void {
        if ((this.heroSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1)))) > boss.getBossDp()) {
            console.log('strike to Boss was succesful');
            boss.lowerBossHp(this.heroSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1))) - boss.getBossDp());
        }
        
        else {
            console.log('strike to Boss wasnt succesful');
        }
    }

    lowerHeroHp(number: number): void {
        this.heroHp -= number;
    }

    setHeroDead(): void {
        this.isAlive = false;
    }

    heroLevelUp(): void {
        let hpToAdd: number = Math.floor(Math.random() * (6 - 1) + 1);

        this.heroLevel++;
        this.heroMaxHp += hpToAdd;
        this.heroHp += Math.round(hpToAdd / 2);
        this.heroDp += Math.floor(Math.random() * (6 - 1) + 1);
        this.heroSp += (Math.floor(Math.random() * (6 - 1) + 1));
    }

    restoreHeroHp(): void {
        let pickRandomNumber: number = Math.floor(Math.random() * 10);
        let chanceArray: number [] = [0,1,1,1,1,2,2,2,2,2];

        if (chanceArray[pickRandomNumber] === 0) {
            this.heroHp = this.heroMaxHp;
            console.log('Restoring full HP of hero');
        }
        
        if (chanceArray[pickRandomNumber] === 1) {
            if (this.heroHp + Math.round(this.heroMaxHp / 3) > this.heroMaxHp) {
                this.heroHp = this.heroMaxHp;
            }

            else {
                this.heroHp + Math.round(this.heroMaxHp / 3);
            }
            
            console.log('Restoring third HP of hero');
        }

        if (chanceArray[pickRandomNumber] === 2) {
            if (this.heroHp + Math.round(this.heroMaxHp / 10) > this.heroMaxHp) {
                this.heroHp = this.heroMaxHp;
            }

            else {
                this.heroHp + Math.round(this.heroMaxHp / 10);
            }

            console.log('Restoring tenth HP of hero');
        }
    }
}