import { Boss } from "../Models/Game-Object/Character/Monster/Boss";
import { Hero } from "../Models/Game-Object/Character/Monster/Hero";
import { Monster } from "../Models/Game-Object/Character/Monster/Monster";
import { Skeleton } from "../Models/Game-Object/Character/Monster/Skeleton";

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export class GameLogic extends Monster {
    protected player: Hero;
    protected npcs: Skeleton[] = [];
    protected boss: Boss;
    protected steps: number;
    protected currentLevel: number;

    constructor() {
        super();
        this.player = new Hero();
        this.npcs = [];
        this.boss = new Boss();
        this.steps = 0;
        this.currentLevel = 1;
    }
    
    startGame(): void {
        this.createMap();
        this.spawnHero();
        this.spawnMonsters();
        this.spawnBoss();
        this.hud();
    }

    moveToNextArea(): void {
        this.createMap();
        this.player.setHeroX(0);
        this.player.setHeroY(0);
        this.player.drawHeroDown();
        this.npcs = [];
        this.spawnMonsters();
        this.boss = new Boss();
        this.spawnBoss();
        this.boss.setBossAlive();
        this.hud();
        this.increaseDifficulty();
        this.player.restoreHeroHp();
        this.player.setKey(false);
    }

    increaseDifficulty(): void {
        this.currentLevel += 4;
        this.npcs.forEach((npc) => npc.increaseSkeletonLevel(this.currentLevel));
        this.boss.bossLevelUp(this.currentLevel);
    }
    
    gameUpdate(): void {
        this.hud();
        console.log(this.npcs);

        if (this.checkForBattle()) {
            this.battle();

            if (this.player.isHeroAlive() === false) {
                this.gameOver();
            }
        }

        if (this.checkVictoryConditions()) {
            console.log('Increasing difficulty. Moving to next area')
            this.moveToNextArea();
        }
    }

    spawnHero(): void {
        this.player = new Hero();
        this.player.setHeroX(0);
        this.player.setHeroY(0);
        this.player.drawHeroDown();
    }

    spawnMonsters(): void {
        let numberOfSpawns: number = Math.floor(Math.random() * (7 - 3) + 3);
        let pickKeyHolder: number = 0;
        console.log('Spawning ' + numberOfSpawns + ' monsters and one boss. Someone has the key. Find it and kill the boss to progress.');


        for (let i: number = 0; i < numberOfSpawns; i) {
            let generatedX: number = this.generateCoordinates()[0];
            let generatedY: number = this.generateCoordinates()[1];
            
            if (this.isThisAWall(generatedX, generatedY) === false && !(this.isThisTileOccupied(generatedX, generatedY))) {
                this.npcs.push(new Skeleton());
                this.npcs[i].setSkeletonX(generatedX);
                this.npcs[i].setSkeletonY(generatedY);
                ctx.drawImage(this.npcs[i].getSkeleton(), generatedX, generatedY);
                i++;
            }
        }

        pickKeyHolder = Math.floor(Math.random() * (this.npcs.length - 1) + 1);
        this.npcs[pickKeyHolder].setKey();
    }
    
    spawnBoss(): void {
        let generatedX: number = this.generateCoordinates()[0];
        let generatedY: number = this.generateCoordinates()[1];

        if (this.isThisAWall(generatedX, generatedY) === false && !(this.areCoordinatesIdentical(generatedX, generatedY))) {
            ctx.drawImage(this.boss.getBoss(), generatedX, generatedY);
            this.boss.setPositionX(generatedX);
            this.boss.setPositionY(generatedY);
        }
        
        else {
            this.spawnBoss();
        }
    }

    areCoordinatesIdentical(x: number, y: number): boolean {
        
        for (let i: number = 0; i < this.npcs.length; i++) {
            
            if (this.npcs[i].getSkeletonX() === x && this.npcs[i].getSkeletonY() === y) {
                return true;
            }
        } 
        
        return false;
    }
    
    generateCoordinates(): Array<number> {
        let randomX: number = Math.floor(Math.random() * (9 - 1) + 1) * 72;
        let randomY: number = Math.floor(Math.random() * (9 - 1) + 1) * 72;

        return [randomX, randomY];
    }
    
    moveHeroDown(): void {
        this.steps++;

        if (this.steps === 2) {
            this.moveMonsters();
            this.steps = 0;
        }
        
        if (this.isThisAWall(this.player.getHeroX(), this.player.getHeroY() + 72) === false && this.isThisEdgeOfMapBottom(this.player.getHeroY()) === false) {
            this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
            this.player.moveHeroDown();
            this.player.drawHeroDown();
        }

        else {
            this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
            this.player.drawHeroDown();
        }

        this.gameUpdate();
    }

    moveHeroUp(): void  {
        this.steps++;

        if (this.steps === 2) {
            this.moveMonsters();
            this.steps = 0;
        }
        
        if (this.isThisAWall(this.player.getHeroX(), this.player.getHeroY() - 72) === false && this.isThisEdgeOfMapTop(this.player.getHeroY()) === false) {
            this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
            this.player.moveHeroUp();
            this.player.drawHeroUp();
        }

        else {
            this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
            this.player.drawHeroUp();
        }

        this.gameUpdate();
    }

    moveHeroLeft(): void {
        this.steps++;

        if (this.steps === 2) {
            this.moveMonsters();
            this.steps = 0;
        }
        
        if (this.isThisAWall(this.player.getHeroX() - 72, this.player.getHeroY()) === false && this.isThisEdgeOfMapLeft(this.player.getHeroX()) === false) {
            this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
            this.player.moveHeroLeft();
            this.player.drawHeroLeft();
        }

        else {
            this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
            this.player.drawHeroLeft();
        }

        this.gameUpdate();
    }

    moveHeroRight(): void {
        this.steps++;

        if (this.steps === 2) {
            this.moveMonsters();
            this.steps = 0;
        }
        
        if (this.isThisAWall(this.player.getHeroX() + 72, this.player.getHeroY()) === false && this.isThisEdgeOfMapRight(this.player.getHeroX()) === false) {
            this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
            this.player.moveHeroRight();
            this.player.drawHeroRight();
        }

        else {
            this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
            this.player.drawHeroRight();
        }

        this.gameUpdate();
    }

    hud(): void {
        let hud = document.querySelector('#hud') as HTMLDivElement;
        hud.textContent = `Hero (Level ${this.player.getHeroLevel()}) HP: ${this.player.getHeroHp()}/${this.player.getHeroMaxHp()} | DP: ${this.player.getHeroDp()} | SP: ${this.player.getHeroSp()} | Key: ${this.player.hasHeroKey()}`;
    }

    hudfight(): void {
        let hud = document.querySelector('#hud-fight') as HTMLDivElement;
        hud.textContent = `Fighting with ${this.getMonster(this.player.getHeroX(), this.player.getHeroY()).constructor.name} (Level ${this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonLevel()}) | DP : ${this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonDp()} | SP : ${this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonSp()}`
    }

    hudfightUpdate(): void {
        let hud = document.querySelector('#hud-fight') as HTMLDivElement;
        hud.textContent = '';
    }

    moveMonsters(): void {            
        this.moveBoss()
        this.moveSkeletons();
        this.hudfightUpdate();
    }

    checkFreeDirectionBoss(boss: Boss): Array<number> {
        // 0th index = up, 1 == down, 2 == left, 3 == right  
        
        let freeDirections: number [] = [];

        if (this.isThisAWall(boss.getBossX(), (boss.getBossY() - 72)) === false && this.isThisEdgeOfMapTop(boss.getBossY()) === false && this.areCoordinatesIdentical(boss.getBossX(), boss.getBossY() - 72) === false) {
            freeDirections.push(1);
        }

        else {
            freeDirections.push(0);
        }

        if (this.isThisAWall(boss.getBossX(), (boss.getBossY() + 72)) === false && this.isThisEdgeOfMapBottom(boss.getBossY()) === false && this.areCoordinatesIdentical(boss.getBossX(), boss.getBossY() + 72) === false) {
            freeDirections.push(1);
        }

        else {
            freeDirections.push(0);
        }

        if (this.isThisAWall(boss.getBossX() - 72, boss.getBossY()) === false && this.isThisEdgeOfMapLeft(boss.getBossX()) === false && this.areCoordinatesIdentical(boss.getBossX() - 72, boss.getBossY()) === false) {
            freeDirections.push(1);
        }

        else {
            freeDirections.push(0);
        }

        if (this.isThisAWall(boss.getBossX() + 72, boss.getBossY()) === false && this.isThisEdgeOfMapRight(boss.getBossX()) === false && this.areCoordinatesIdentical(boss.getBossX() + 72, boss.getBossY()) === false) {
            freeDirections.push(1);
        }

        else {
            freeDirections.push(0);
        }
        
        return freeDirections;
    }

    moveBoss(): void {
        let pickRandomDirection: number = (Math.floor(Math.random() * 4));
        let freeDirectionArray: number [] = this.checkFreeDirectionBoss(this.boss);

        for (let i: number = 0; i < freeDirectionArray.length; i) {
                
            if (this.checkFreeDirectionBoss(this.boss)[pickRandomDirection] === 1) {

                if (pickRandomDirection === 0) {
                    //moves boss up
                    this.drawFloor(this.boss.getBossX(), this.boss.getBossY());
                    this.boss.moveBossUp();
                    this.boss.drawBoss();
                    break;
                }

                if (pickRandomDirection === 1) {
                    //moves boss down
                    this.drawFloor(this.boss.getBossX(), this.boss.getBossY());
                    this.boss.moveBossDown();
                    this.boss.drawBoss();
                    break;
                }

                if (pickRandomDirection === 2) {
                    //moves boss left
                    this.drawFloor(this.boss.getBossX(), this.boss.getBossY());
                    this.boss.moveBossLeft();
                    this.boss.drawBoss();
                    break;
                }

                if (pickRandomDirection === 3) {
                    //moves boss right
                    this.drawFloor(this.boss.getBossX(), this.boss.getBossY());
                    this.boss.moveBossRight();
                    this.boss.drawBoss();
                    break;
                }  
            }

            else {
                pickRandomDirection = (Math.floor(Math.random() * 4));
                i++;
                continue;
            }
        }
    }

    checkFreeDirectionsSkeleton(skeleton: Skeleton): Array<number> {
        let freeDirections: number [] = [];

        if (this.isThisAWall(skeleton.getSkeletonX(), (skeleton.getSkeletonY() - 72)) === false && this.isThisEdgeOfMapTop(skeleton.getSkeletonY()) === false && this.isThisTileOccupied(skeleton.getSkeletonX(), skeleton.getSkeletonY() - 72) === false && this.isThisTileOccupied(skeleton.getSkeletonX(), skeleton.getSkeletonY() - 144) === false) {
            freeDirections.push(1);
        }

        else {
            freeDirections.push(0);
        }

        if (this.isThisAWall(skeleton.getSkeletonX(), (skeleton.getSkeletonY() + 72)) === false && this.isThisEdgeOfMapBottom(skeleton.getSkeletonY()) === false && this.isThisTileOccupied(skeleton.getSkeletonX(), skeleton.getSkeletonY() + 72) === false && this.isThisTileOccupied(skeleton.getSkeletonX(), skeleton.getSkeletonY() + 144) === false) {
            freeDirections.push(1);
        }

        else {
            freeDirections.push(0);
        }

        if (this.isThisAWall(skeleton.getSkeletonX() - 72, skeleton.getSkeletonY()) === false && this.isThisEdgeOfMapLeft(skeleton.getSkeletonX()) === false && this.isThisTileOccupied(skeleton.getSkeletonX() - 72, skeleton.getSkeletonY()) === false && this.isThisTileOccupied(skeleton.getSkeletonX() - 144, skeleton.getSkeletonY()) === false) {
            freeDirections.push(1);
        }

        else {
            freeDirections.push(0);
        }

        if (this.isThisAWall(skeleton.getSkeletonX() + 72, skeleton.getSkeletonY()) === false && this.isThisEdgeOfMapRight(skeleton.getSkeletonX()) === false && this.isThisTileOccupied(skeleton.getSkeletonX() + 72, skeleton.getSkeletonY()) === false && this.isThisTileOccupied(skeleton.getSkeletonX() + 144, skeleton.getSkeletonY()) === false) {
            freeDirections.push(1);
        }

        else {
            freeDirections.push(0);
        }
        
        return freeDirections;
    }
    
    moveSkeletons(): void {
        
        for(let j: number = 0; j < this.npcs.length; j++) {

        let pickRandomDirection: number = (Math.floor(Math.random() * 4));
        let freeDirectionArray: number [] = this.checkFreeDirectionsSkeleton(this.npcs[j]);

            for (let i: number = 0; i < freeDirectionArray.length; i) {
                
                if (this.checkFreeDirectionsSkeleton(this.npcs[j])[pickRandomDirection] === 1) {

                    if (pickRandomDirection === 0) {
                        //moves skeleton up
                        this.drawFloor(this.npcs[j].getSkeletonX(), this.npcs[j].getSkeletonY());
                        this.npcs[j].moveSkeletonUp();
                        this.npcs[j].drawSkeleton();
                        break;
                    }

                    if (pickRandomDirection === 1) {
                        //moves skeleton down
                        this.drawFloor(this.npcs[j].getSkeletonX(), this.npcs[j].getSkeletonY());
                        this.npcs[j].moveSkeletonDown();
                        this.npcs[j].drawSkeleton();
                        break;
                    }

                    if (pickRandomDirection === 2) {
                        //moves skeleton left
                        this.drawFloor(this.npcs[j].getSkeletonX(), this.npcs[j].getSkeletonY());
                        this.npcs[j].moveSkeletonLeft();
                        this.npcs[j].drawSkeleton();
                        break;
                    }

                    if (pickRandomDirection === 3) {
                        //moves skeleton right
                        this.drawFloor(this.npcs[j].getSkeletonX(), this.npcs[j].getSkeletonY());
                        this.npcs[j].moveSkeletonRight();
                        this.npcs[j].drawSkeleton();
                        break;
                    }  
                }

                else {
                    pickRandomDirection = (Math.floor(Math.random() * 4));
                    i++;
                    continue;
                }
            } 
        }
    }

    isThisTileOccupied(x: number, y: number): boolean {
        if (x === this.boss.getBossX() && y === this.boss.getBossY()) {
            return true
        }

        else if (this.areCoordinatesIdentical(x, y)) {
            return true;
        }

        else {
            return false;
        }
    }

    checkForBattle(): boolean {
        if (this.isThisTileOccupied(this.player.getHeroX(), this.player.getHeroY())) {
            return true
        }

        else {
            return false;
        }
    }

    battle(): void {
        console.log('A battle forms');
        
        if (this.player.getHeroX() === this.boss.getBossX() && this.player.getHeroX() === this.boss.getBossX()) {
            console.log('A boss fight forms')

            while (this.player.isHeroAlive() && this.boss.isBossAlive()) {
                this.player.strikeBoss(this.boss);
                this.boss.strike(this.player);
            }

            if (this.boss.isBossAlive()) {
                console.log('You lost the battle');
                this.player.setHeroDead();
            }

            else {
                console.log('You win the  boss battle');
                this.boss.setDead();
            }
        }
        
        else {
            this.hudfight();
            while (this.player.isHeroAlive() && this.getMonster(this.player.getHeroX(), this.player.getHeroY()).isSkeletonAlive()) {
                this.player.strike(this.getMonster(this.player.getHeroX(), this.player.getHeroY()));
                this.getMonster(this.player.getHeroX(), this.player.getHeroY()).strike(this.player);
            }
    
            if (this.getMonster(this.player.getHeroX(), this.player.getHeroY()).isSkeletonAlive()) {
                console.log('Monster won the battle');
                this.player.setHeroDead();
            }
    
            else {
                console.log('You won the battle! Leveling Up');
                if (this.getMonster(this.player.getHeroX(), this.player.getHeroY()).hasSkeletonKey()) {
                    this.player.setKey(true);
                }
    
                this.getMonster(this.player.getHeroX(), this.player.getHeroY()).setSkeletonDead();
                this.removeMonster(this.player.getHeroX(), this.player.getHeroY());
                this.player.heroLevelUp();
            }
        } 
    }

    getMonster(x: number, y: number): Skeleton {
        return this.npcs.find(skeleton => skeleton.getSkeletonX() === x && skeleton.getSkeletonY() === y);
    }

    gameOver(): void {
        let hud = document.querySelector('#game-over') as HTMLDivElement;
        hud.textContent = 'Game over!';
        this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
        this.player = null;
    }

    removeMonster(x: number, y: number): void {
        let skeletonToDelete: Skeleton = this.npcs.find(skeleton => skeleton.getSkeletonX() === x && skeleton.getSkeletonY() === y);
        
        for (let i: number = 0; i < this.npcs.length; i++) {
            if (this.npcs[i] === skeletonToDelete) {
                this.npcs.splice(i, 1);
            }
        }
    }

    checkVictoryConditions(): boolean {
        if (this.player.hasHeroKey() && this.boss.isBossAlive() === false) {
            return true;
        }

        else {
            return false;
        }
    }
}
