
import { Hero } from "./Hero";
import { Monster } from "./Monster";

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export class Boss extends Monster {
    protected boss: any;
    protected bossX: number;
    protected bossY: number;
    protected bossLevel: number;
    protected bossHp: number;
    protected bossDp: number;
    protected bossSp: number;
    protected isAlive: boolean;

    constructor() {
        super();
        this.boss = document.getElementById('boss') as HTMLImageElement;
        this.bossX = 0;
        this.bossY = 0;
        this.bossLevel = 2;
        this.bossHp = 2 * (this.bossLevel) * (Math.floor(Math.random() * (6 - 1) + 1)) + (Math.floor(Math.random() * (6 - 1) + 1));
        this.bossDp = ((this.bossLevel / 2) * (Math.floor(Math.random() * (6 - 1) + 1))) + ((Math.floor(Math.random() * (6 - 1) + 1)) / 2);
        this.bossSp = (this.bossLevel * (Math.floor(Math.random() * (6 - 1) + 1))) + this.bossLevel;
        this.isAlive = true;
    }

    lowerBossHp(number: number): void {
        this.bossHp -= number;
    }

    strike(hero: Hero): void {
        if ((this.bossSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1)))) > hero.getHeroDp()) {
            console.log('strike from Monster was succesful');
            hero.lowerHeroHp(this.bossSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1))) - hero.getHeroDp());
        }
        
        else {
            console.log('strike from Monster wasnt succesful');
        }
    }
    
    getBossDp(): number {
        return this.bossDp;
    }

    isBossAlive(): boolean {
        if (this.bossHp > 0) {
            return true;
        }

        return false;
    }

    bossLevelUp(number: number): void {
        this.bossLevel += number;
        this.bossHp = 2 * (this.bossLevel) * (Math.floor(Math.random() * (6 - 1) + 1)) + (Math.floor(Math.random() * (6 - 1) + 1));
        this.bossDp = ((this.bossLevel / 2) * (Math.floor(Math.random() * (6 - 1) + 1))) + ((Math.floor(Math.random() * (6 - 1) + 1)) / 2);
        this.bossSp = (this.bossLevel * (Math.floor(Math.random() * (6 - 1) + 1))) + this.bossLevel;
    }
    
    setBossAlive(): void {
        this.isAlive = true;
    }
    
    setDead(): void {
        this.isAlive = false;
    }

    getBoss(): any {
        return this.boss;
    }

    drawBoss(): void {
        ctx.drawImage(this.boss, this.bossX, this.bossY);
    }

    moveBossUp(): void {
        this.bossY -= 72;
    }

    moveBossDown(): void {
        this.bossY += 72;
    }

    moveBossLeft(): void {
        this.bossX -= 72;
    }

    moveBossRight(): void {
        this.bossX += 72;
    }

    getBossX(): number {
        return this.bossX;
    }

    getBossY(): number {
        return this.bossY;
    }

    setPositionX(number: number): void {
        this.bossX = number;
    }

    setPositionY(number: number): void {
        this.bossY = number;
    }
}