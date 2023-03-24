/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/GameLogic/gameLogic.ts":
/*!************************************!*\
  !*** ./src/GameLogic/gameLogic.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameLogic": () => (/* binding */ GameLogic)
/* harmony export */ });
/* harmony import */ var _Models_Game_Object_Character_Monster_Boss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Models/Game-Object/Character/Monster/Boss */ "./src/Models/Game-Object/Character/Monster/Boss.ts");
/* harmony import */ var _Models_Game_Object_Character_Monster_Hero__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Models/Game-Object/Character/Monster/Hero */ "./src/Models/Game-Object/Character/Monster/Hero.ts");
/* harmony import */ var _Models_Game_Object_Character_Monster_Monster__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Models/Game-Object/Character/Monster/Monster */ "./src/Models/Game-Object/Character/Monster/Monster.ts");
/* harmony import */ var _Models_Game_Object_Character_Monster_Skeleton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Models/Game-Object/Character/Monster/Skeleton */ "./src/Models/Game-Object/Character/Monster/Skeleton.ts");




const canvas = document.querySelector('.main-canvas');
const ctx = canvas.getContext('2d');
class GameLogic extends _Models_Game_Object_Character_Monster_Monster__WEBPACK_IMPORTED_MODULE_2__.Monster {
    constructor() {
        super();
        this.npcs = [];
        this.player = new _Models_Game_Object_Character_Monster_Hero__WEBPACK_IMPORTED_MODULE_1__.Hero();
        this.npcs = [];
        this.boss = new _Models_Game_Object_Character_Monster_Boss__WEBPACK_IMPORTED_MODULE_0__.Boss();
        this.steps = 0;
        this.currentLevel = 1;
    }
    startGame() {
        this.createMap();
        this.spawnHero();
        this.spawnMonsters();
        this.spawnBoss();
        this.hud();
    }
    moveToNextArea() {
        this.createMap();
        this.player.setHeroX(0);
        this.player.setHeroY(0);
        this.player.drawHeroDown();
        this.npcs = [];
        this.spawnMonsters();
        this.boss = new _Models_Game_Object_Character_Monster_Boss__WEBPACK_IMPORTED_MODULE_0__.Boss();
        this.spawnBoss();
        this.boss.setBossAlive();
        this.hud();
        this.increaseDifficulty();
        this.player.restoreHeroHp();
        this.player.setKey(false);
    }
    increaseDifficulty() {
        this.currentLevel += 4;
        this.npcs.forEach((npc) => npc.increaseSkeletonLevel(this.currentLevel));
        this.boss.bossLevelUp(this.currentLevel);
    }
    gameUpdate() {
        this.hud();
        console.log(this.npcs);
        if (this.checkForBattle()) {
            this.battle();
            if (this.player.isHeroAlive() === false) {
                this.gameOver();
            }
        }
        if (this.checkVictoryConditions()) {
            console.log('Increasing difficulty. Moving to next area');
            this.moveToNextArea();
        }
    }
    spawnHero() {
        this.player = new _Models_Game_Object_Character_Monster_Hero__WEBPACK_IMPORTED_MODULE_1__.Hero();
        this.player.setHeroX(0);
        this.player.setHeroY(0);
        this.player.drawHeroDown();
    }
    spawnMonsters() {
        let numberOfSpawns = Math.floor(Math.random() * (7 - 3) + 3);
        let pickKeyHolder = 0;
        console.log('Spawning ' + numberOfSpawns + ' monsters and one boss. Someone has the key. Find it and kill the boss to progress.');
        for (let i = 0; i < numberOfSpawns; i) {
            let generatedX = this.generateCoordinates()[0];
            let generatedY = this.generateCoordinates()[1];
            if (this.isThisAWall(generatedX, generatedY) === false && !(this.isThisTileOccupied(generatedX, generatedY))) {
                this.npcs.push(new _Models_Game_Object_Character_Monster_Skeleton__WEBPACK_IMPORTED_MODULE_3__.Skeleton());
                this.npcs[i].setSkeletonX(generatedX);
                this.npcs[i].setSkeletonY(generatedY);
                ctx.drawImage(this.npcs[i].getSkeleton(), generatedX, generatedY);
                i++;
            }
        }
        pickKeyHolder = Math.floor(Math.random() * (this.npcs.length - 1) + 1);
        this.npcs[pickKeyHolder].setKey();
    }
    spawnBoss() {
        let generatedX = this.generateCoordinates()[0];
        let generatedY = this.generateCoordinates()[1];
        if (this.isThisAWall(generatedX, generatedY) === false && !(this.areCoordinatesIdentical(generatedX, generatedY))) {
            ctx.drawImage(this.boss.getBoss(), generatedX, generatedY);
            this.boss.setPositionX(generatedX);
            this.boss.setPositionY(generatedY);
        }
        else {
            this.spawnBoss();
        }
    }
    areCoordinatesIdentical(x, y) {
        for (let i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].getSkeletonX() === x && this.npcs[i].getSkeletonY() === y) {
                return true;
            }
        }
        return false;
    }
    generateCoordinates() {
        let randomX = Math.floor(Math.random() * (9 - 1) + 1) * 72;
        let randomY = Math.floor(Math.random() * (9 - 1) + 1) * 72;
        return [randomX, randomY];
    }
    moveHeroDown() {
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
    moveHeroUp() {
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
    moveHeroLeft() {
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
    moveHeroRight() {
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
    hud() {
        let hud = document.querySelector('#hud');
        hud.textContent = `Hero (Level ${this.player.getHeroLevel()}) HP: ${this.player.getHeroHp()}/${this.player.getHeroMaxHp()} | DP: ${this.player.getHeroDp()} | SP: ${this.player.getHeroSp()} | Key: ${this.player.hasHeroKey()}`;
    }
    hudfight() {
        let hud = document.querySelector('#hud-fight');
        hud.textContent = `Fighting with ${this.getMonster(this.player.getHeroX(), this.player.getHeroY()).constructor.name} (Level ${this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonLevel()}) | DP : ${this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonDp()} | SP : ${this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonSp()}`;
    }
    hudfightUpdate() {
        let hud = document.querySelector('#hud-fight');
        hud.textContent = '';
    }
    moveMonsters() {
        this.moveBoss();
        this.moveSkeletons();
        this.hudfightUpdate();
    }
    checkFreeDirectionBoss(boss) {
        // 0th index = up, 1 == down, 2 == left, 3 == right  
        let freeDirections = [];
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
    moveBoss() {
        let pickRandomDirection = (Math.floor(Math.random() * 4));
        let freeDirectionArray = this.checkFreeDirectionBoss(this.boss);
        for (let i = 0; i < freeDirectionArray.length; i) {
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
    checkFreeDirectionsSkeleton(skeleton) {
        let freeDirections = [];
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
    moveSkeletons() {
        for (let j = 0; j < this.npcs.length; j++) {
            let pickRandomDirection = (Math.floor(Math.random() * 4));
            let freeDirectionArray = this.checkFreeDirectionsSkeleton(this.npcs[j]);
            for (let i = 0; i < freeDirectionArray.length; i) {
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
    isThisTileOccupied(x, y) {
        if (x === this.boss.getBossX() && y === this.boss.getBossY()) {
            return true;
        }
        else if (this.areCoordinatesIdentical(x, y)) {
            return true;
        }
        else {
            return false;
        }
    }
    checkForBattle() {
        if (this.isThisTileOccupied(this.player.getHeroX(), this.player.getHeroY())) {
            return true;
        }
        else {
            return false;
        }
    }
    battle() {
        console.log('A battle forms');
        if (this.player.getHeroX() === this.boss.getBossX() && this.player.getHeroX() === this.boss.getBossX()) {
            console.log('A boss fight forms');
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
    getMonster(x, y) {
        return this.npcs.find(skeleton => skeleton.getSkeletonX() === x && skeleton.getSkeletonY() === y);
    }
    gameOver() {
        let hud = document.querySelector('#game-over');
        hud.textContent = 'Game over!';
        this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
        this.player = null;
    }
    removeMonster(x, y) {
        let skeletonToDelete = this.npcs.find(skeleton => skeleton.getSkeletonX() === x && skeleton.getSkeletonY() === y);
        for (let i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i] === skeletonToDelete) {
                this.npcs.splice(i, 1);
            }
        }
    }
    checkVictoryConditions() {
        if (this.player.hasHeroKey() && this.boss.isBossAlive() === false) {
            return true;
        }
        else {
            return false;
        }
    }
}


/***/ }),

/***/ "./src/Models/Game-Object/Character/Area/Area.ts":
/*!*******************************************************!*\
  !*** ./src/Models/Game-Object/Character/Area/Area.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Area": () => (/* binding */ Area)
/* harmony export */ });
/* harmony import */ var _Tile_Tile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Tile/Tile */ "./src/Models/Game-Object/Character/Tile/Tile.ts");

const canvas = document.querySelector('.main-canvas');
const ctx = canvas.getContext('2d');
class Area extends _Tile_Tile__WEBPACK_IMPORTED_MODULE_0__.Tile {
    constructor() {
        super();
        this.floor = document.getElementById('floor');
        this.wall = document.getElementById('wall');
        this.map = [
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 1, 0],
            [0, 1, 1, 1, 0, 1, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 1, 0],
            [0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
            [0, 0, 0, 1, 0, 1, 1, 0, 0, 0]
        ];
        this.previousPartialRotation = false;
    }
    rotateMap(matrix) {
        let n = matrix.length;
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                let temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < (n / 2); j++) {
                let temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = temp;
            }
        }
        return matrix;
    }
    partialRotation(matrix) {
        let n = matrix.length;
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                let temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        return matrix;
    }
    createMap() {
        const numberOfRotations = Math.floor(Math.random() * (4 - 1) + 1);
        let partialRotation = false;
        let modifiedMap = [[]];
        if (Math.floor(Math.random() * 2) === 0) {
            partialRotation = false;
        }
        else {
            partialRotation = true;
        }
        if (partialRotation !== this.previousPartialRotation) {
            for (let i = 0; i < numberOfRotations; i++) {
                modifiedMap = this.partialRotation(this.map);
                this.previousPartialRotation = true;
            }
        }
        else {
            for (let i = 0; i < numberOfRotations; i++) {
                modifiedMap = this.rotateMap(this.map);
                this.previousPartialRotation = false;
            }
        }
        this.generatedMap = modifiedMap;
        for (let i = 0; i < modifiedMap.length; i++) {
            for (let j = 0; j < modifiedMap.length; j++) {
                if (modifiedMap[i][j] === 0) {
                    ctx.drawImage(this.floor, i * 72, j * 72);
                }
                else {
                    ctx.drawImage(this.wall, i * 72, j * 72);
                }
            }
        }
    }
    isThisAWall(x, y) {
        if (x < 0 || y < 0) {
            return true;
        }
        if (x > 648 || y > 648) {
            return true;
        }
        if (x === 0) {
            if (this.generatedMap[x][y / 72] === 1) {
                return true;
            }
        }
        if (y === 0) {
            if (this.generatedMap[x / 72][y] === 1) {
                return true;
            }
        }
        if (this.generatedMap[x / 72][y / 72] === 1) {
            return true;
        }
        else {
            return false;
        }
    }
    isThisEdgeOfMapTop(y) {
        if (y - 72 < 0) {
            return true;
        }
        else {
            return false;
        }
    }
    isThisEdgeOfMapBottom(y) {
        if (y + 72 > 648) {
            return true;
        }
        else {
            return false;
        }
    }
    isThisEdgeOfMapLeft(x) {
        if (x - 72 < 0) {
            return true;
        }
        else {
            return false;
        }
    }
    isThisEdgeOfMapRight(x) {
        if (x + 72 > 648) {
            return true;
        }
        else {
            return false;
        }
    }
}


/***/ }),

/***/ "./src/Models/Game-Object/Character/Monster/Boss.ts":
/*!**********************************************************!*\
  !*** ./src/Models/Game-Object/Character/Monster/Boss.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Boss": () => (/* binding */ Boss)
/* harmony export */ });
/* harmony import */ var _Monster__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Monster */ "./src/Models/Game-Object/Character/Monster/Monster.ts");

const canvas = document.querySelector('.main-canvas');
const ctx = canvas.getContext('2d');
class Boss extends _Monster__WEBPACK_IMPORTED_MODULE_0__.Monster {
    constructor() {
        super();
        this.boss = document.getElementById('boss');
        this.bossX = 0;
        this.bossY = 0;
        this.bossLevel = 2;
        this.bossHp = 2 * (this.bossLevel) * (Math.floor(Math.random() * (6 - 1) + 1)) + (Math.floor(Math.random() * (6 - 1) + 1));
        this.bossDp = ((this.bossLevel / 2) * (Math.floor(Math.random() * (6 - 1) + 1))) + ((Math.floor(Math.random() * (6 - 1) + 1)) / 2);
        this.bossSp = (this.bossLevel * (Math.floor(Math.random() * (6 - 1) + 1))) + this.bossLevel;
        this.isAlive = true;
    }
    lowerBossHp(number) {
        this.bossHp -= number;
    }
    strike(hero) {
        if ((this.bossSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1)))) > hero.getHeroDp()) {
            console.log('strike from Monster was succesful');
            hero.lowerHeroHp(this.bossSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1))) - hero.getHeroDp());
        }
        else {
            console.log('strike from Monster wasnt succesful');
        }
    }
    getBossDp() {
        return this.bossDp;
    }
    isBossAlive() {
        if (this.bossHp > 0) {
            return true;
        }
        return false;
    }
    bossLevelUp(number) {
        this.bossLevel += number;
        this.bossHp = 2 * (this.bossLevel) * (Math.floor(Math.random() * (6 - 1) + 1)) + (Math.floor(Math.random() * (6 - 1) + 1));
        this.bossDp = ((this.bossLevel / 2) * (Math.floor(Math.random() * (6 - 1) + 1))) + ((Math.floor(Math.random() * (6 - 1) + 1)) / 2);
        this.bossSp = (this.bossLevel * (Math.floor(Math.random() * (6 - 1) + 1))) + this.bossLevel;
    }
    setBossAlive() {
        this.isAlive = true;
    }
    setDead() {
        this.isAlive = false;
    }
    getBoss() {
        return this.boss;
    }
    drawBoss() {
        ctx.drawImage(this.boss, this.bossX, this.bossY);
    }
    moveBossUp() {
        this.bossY -= 72;
    }
    moveBossDown() {
        this.bossY += 72;
    }
    moveBossLeft() {
        this.bossX -= 72;
    }
    moveBossRight() {
        this.bossX += 72;
    }
    getBossX() {
        return this.bossX;
    }
    getBossY() {
        return this.bossY;
    }
    setPositionX(number) {
        this.bossX = number;
    }
    setPositionY(number) {
        this.bossY = number;
    }
}


/***/ }),

/***/ "./src/Models/Game-Object/Character/Monster/Hero.ts":
/*!**********************************************************!*\
  !*** ./src/Models/Game-Object/Character/Monster/Hero.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hero": () => (/* binding */ Hero)
/* harmony export */ });
/* harmony import */ var _Monster__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Monster */ "./src/Models/Game-Object/Character/Monster/Monster.ts");

const canvas = document.querySelector('.main-canvas');
const ctx = canvas.getContext('2d');
class Hero extends _Monster__WEBPACK_IMPORTED_MODULE_0__.Monster {
    constructor() {
        super();
        this.heroDown = document.getElementById('hero-down');
        this.heroLeft = document.getElementById('hero-left');
        this.heroRight = document.getElementById('hero-right');
        this.heroUp = document.getElementById('hero-up');
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
    isHeroAlive() {
        if (this.heroHp > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    hasHeroKey() {
        return this.hasKey;
    }
    setKey(boolean) {
        this.hasKey = boolean;
    }
    setHeroX(x) {
        this.heroX = x;
    }
    setHeroY(y) {
        this.heroY = y;
    }
    getHeroX() {
        return this.heroX;
    }
    getHeroY() {
        return this.heroY;
    }
    getHeroLevel() {
        return this.heroLevel;
    }
    getHeroHp() {
        return this.heroHp;
    }
    getHeroMaxHp() {
        return this.heroMaxHp;
    }
    getHeroDp() {
        return this.heroDp;
    }
    getHeroSp() {
        return this.heroSp;
    }
    moveHeroUp() {
        this.heroY -= 72;
    }
    moveHeroDown() {
        this.heroY += 72;
    }
    moveHeroLeft() {
        this.heroX -= 72;
    }
    moveHeroRight() {
        this.heroX += 72;
    }
    drawHeroDown() {
        ctx.drawImage(this.heroDown, this.heroX, this.heroY);
    }
    drawHeroUp() {
        ctx.drawImage(this.heroUp, this.heroX, this.heroY);
    }
    drawHeroLeft() {
        ctx.drawImage(this.heroLeft, this.heroX, this.heroY);
    }
    drawHeroRight() {
        ctx.drawImage(this.heroRight, this.heroX, this.heroY);
    }
    strike(skeleton) {
        if ((this.heroSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1)))) > skeleton.getSkeletonDp()) {
            console.log('strike to Monster was succesful');
            skeleton.lowerSkeletonHp(this.heroSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1))) - skeleton.getSkeletonDp());
        }
        else {
            console.log('strike to Monster wasnt succesful');
        }
    }
    strikeBoss(boss) {
        if ((this.heroSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1)))) > boss.getBossDp()) {
            console.log('strike to Boss was succesful');
            boss.lowerBossHp(this.heroSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1))) - boss.getBossDp());
        }
        else {
            console.log('strike to Boss wasnt succesful');
        }
    }
    lowerHeroHp(number) {
        this.heroHp -= number;
    }
    setHeroDead() {
        this.isAlive = false;
    }
    heroLevelUp() {
        let hpToAdd = Math.floor(Math.random() * (6 - 1) + 1);
        this.heroLevel++;
        this.heroMaxHp += hpToAdd;
        this.heroHp += Math.round(hpToAdd / 2);
        this.heroDp += Math.floor(Math.random() * (6 - 1) + 1);
        this.heroSp += (Math.floor(Math.random() * (6 - 1) + 1));
    }
    restoreHeroHp() {
        let pickRandomNumber = Math.floor(Math.random() * 10);
        let chanceArray = [0, 1, 1, 1, 1, 2, 2, 2, 2, 2];
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


/***/ }),

/***/ "./src/Models/Game-Object/Character/Monster/Monster.ts":
/*!*************************************************************!*\
  !*** ./src/Models/Game-Object/Character/Monster/Monster.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Monster": () => (/* binding */ Monster)
/* harmony export */ });
/* harmony import */ var _Area_Area__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Area/Area */ "./src/Models/Game-Object/Character/Area/Area.ts");

const canvas = document.querySelector('.main-canvas');
const ctx = canvas.getContext('2d');
class Monster extends _Area_Area__WEBPACK_IMPORTED_MODULE_0__.Area {
    constructor() {
        super();
        this.positionX = 0;
        this.positionY = 0;
    }
    getPositions() {
        return [this.positionX, this.positionY];
    }
    setPositions(x, y) {
        this.positionX = x;
        this.positionY = y;
    }
    moveMonsterDown() {
        this.positionY += 72;
    }
    moveMonsterUp() {
        this.positionY -= 72;
    }
    moveMonsterLeft() {
        this.positionX -= 72;
    }
    moveMonsterRight() {
        this.positionX += 72;
    }
}


/***/ }),

/***/ "./src/Models/Game-Object/Character/Monster/Skeleton.ts":
/*!**************************************************************!*\
  !*** ./src/Models/Game-Object/Character/Monster/Skeleton.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Skeleton": () => (/* binding */ Skeleton)
/* harmony export */ });
/* harmony import */ var _Monster__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Monster */ "./src/Models/Game-Object/Character/Monster/Monster.ts");

const canvas = document.querySelector('.main-canvas');
const ctx = canvas.getContext('2d');
class Skeleton extends _Monster__WEBPACK_IMPORTED_MODULE_0__.Monster {
    constructor() {
        super();
        this.skeleton = document.getElementById('skeleton');
        this.skeletonX = 0;
        this.skeletonY = 0;
        this.skeletonLevel = 1;
        this.skeletonHp = 2 * (this.skeletonLevel) * (Math.floor(Math.random() * (6 - 1) + 1));
        this.skeletonDp = ((this.skeletonLevel / 2) * (Math.floor(Math.random() * (6 - 1) + 1))) + ((Math.floor(Math.random() * (6 - 1) + 1)) / 2);
        this.skeletonSp = (this.skeletonLevel * ((Math.floor(Math.random() * (6 - 1) + 1)))) + this.skeletonLevel;
        this.hasKey = false;
        this.isAlive = true;
    }
    setKey() {
        this.hasKey = true;
    }
    getKey() {
        return this.hasKey;
    }
    hasSkeletonKey() {
        return this.hasKey;
    }
    increaseSkeletonLevel(number) {
        this.skeletonLevel += number;
        this.skeletonHp = 2 * (this.skeletonLevel) * (Math.floor(Math.random() * (6 - 1) + 1));
        this.skeletonDp = ((this.skeletonLevel / 2) * (Math.floor(Math.random() * (6 - 1) + 1))) + ((Math.floor(Math.random() * (6 - 1) + 1)) / 2);
        this.skeletonSp = (this.skeletonLevel * ((Math.floor(Math.random() * (6 - 1) + 1)))) + this.skeletonLevel;
    }
    getSkeletonHp() {
        return this.skeletonHp;
    }
    getSkeletonSp() {
        return this.skeletonSp;
    }
    getSkeletonDp() {
        return this.skeletonDp;
    }
    getSkeleton() {
        return this.skeleton;
    }
    drawSkeleton() {
        ctx.drawImage(this.skeleton, this.skeletonX, this.skeletonY);
    }
    getSkeletonX() {
        return this.skeletonX;
    }
    getSkeletonY() {
        return this.skeletonY;
    }
    setSkeletonX(x) {
        this.skeletonX = x;
    }
    setSkeletonY(y) {
        this.skeletonY = y;
    }
    moveSkeletonUp() {
        this.skeletonY -= 72;
    }
    moveSkeletonDown() {
        this.skeletonY += 72;
    }
    moveSkeletonLeft() {
        this.skeletonX -= 72;
    }
    moveSkeletonRight() {
        this.skeletonX += 72;
    }
    strike(hero) {
        if ((this.skeletonSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1)))) > hero.getHeroDp()) {
            console.log('strike from Monster was succesful');
            hero.lowerHeroHp(this.skeletonSp + (2 * (Math.floor(Math.random() * (6 - 1) + 1))) - hero.getHeroDp());
        }
        else {
            console.log('strike from Monster wasnt succesful');
        }
    }
    lowerSkeletonHp(number) {
        this.skeletonHp -= number;
    }
    isSkeletonAlive() {
        if (this.skeletonHp > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    getSkeletonLevel() {
        return this.skeletonLevel;
    }
    setSkeletonDead() {
        this.skeleton.isAlive = false;
    }
}


/***/ }),

/***/ "./src/Models/Game-Object/Character/Tile/Tile.ts":
/*!*******************************************************!*\
  !*** ./src/Models/Game-Object/Character/Tile/Tile.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tile": () => (/* binding */ Tile)
/* harmony export */ });
const canvas = document.querySelector('.main-canvas');
const ctx = canvas.getContext('2d');
class Tile {
    constructor() {
        this.floor = document.getElementById('floor');
        this.wall = document.getElementById('wall');
    }
    getWall() {
        return this.wall;
    }
    getFloor() {
        return this.floor;
    }
    drawFloor(x, y) {
        ctx.drawImage(this.floor, x, y);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GameLogic_gameLogic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameLogic/gameLogic */ "./src/GameLogic/gameLogic.ts");


const canvas = document.querySelector('.main-canvas');
const ctx = canvas.getContext('2d');
const gameLogic = new _GameLogic_gameLogic__WEBPACK_IMPORTED_MODULE_0__.GameLogic();
window.onload = () => {
    gameLogic.startGame();
};
function onKeyPress(event) {
    switch (event.keyCode) {
        case 37:
            gameLogic.moveHeroLeft();
            break;
        case 38:
            gameLogic.moveHeroUp();
            break;
        case 39:
            gameLogic.moveHeroRight();
            break;
        case 40:
            gameLogic.moveHeroDown();
            break;
    }
}
document.body.addEventListener('keydown', onKeyPress);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDckIsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxF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QUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM1RixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQWM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUM7SUFDMUIsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFVO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7WUFDcEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1B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QztZQUN6QixNQUFNO0tBQ1Q7QUFDSCxDQUFDO0FBRUQsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93YW5kZXJlci8uL3NyYy9HYW1lTG9naWMvZ2FtZUxvZ2ljLnRzIiwid2VicGFjazovL3dhbmRlcmVyLy4vc3JjL01vZGVscy9HYW1lLU9iamVjdC9DaGFyYWN0ZXIvQXJlYS9BcmVhLnRzIiwid2VicGFjazovL3dhbmRlcmVyLy4vc3JjL01vZGVscy9HYW1lLU9iamVjdC9DaGFyYWN0ZXIvTW9uc3Rlci9Cb3NzLnRzIiwid2VicGFjazovL3dhbmRlcmVyLy4vc3JjL01vZGVscy9HYW1lLU9iamVjdC9DaGFyYWN0ZXIvTW9uc3Rlci9IZXJvLnRzIiwid2VicGFjazovL3dhbmRlcmVyLy4vc3JjL01vZGVscy9HYW1lLU9iamVjdC9DaGFyYWN0ZXIvTW9uc3Rlci9Nb25zdGVyLnRzIiwid2VicGFjazovL3dhbmRlcmVyLy4vc3JjL01vZGVscy9HYW1lLU9iamVjdC9DaGFyYWN0ZXIvTW9uc3Rlci9Ta2VsZXRvbi50cyIsIndlYnBhY2s6Ly93YW5kZXJlci8uL3NyYy9Nb2RlbHMvR2FtZS1PYmplY3QvQ2hhcmFjdGVyL1RpbGUvVGlsZS50cyIsIndlYnBhY2s6Ly93YW5kZXJlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93YW5kZXJlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2FuZGVyZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93YW5kZXJlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dhbmRlcmVyLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJvc3MgfSBmcm9tIFwiLi4vTW9kZWxzL0dhbWUtT2JqZWN0L0NoYXJhY3Rlci9Nb25zdGVyL0Jvc3NcIjtcclxuaW1wb3J0IHsgSGVybyB9IGZyb20gXCIuLi9Nb2RlbHMvR2FtZS1PYmplY3QvQ2hhcmFjdGVyL01vbnN0ZXIvSGVyb1wiO1xyXG5pbXBvcnQgeyBNb25zdGVyIH0gZnJvbSBcIi4uL01vZGVscy9HYW1lLU9iamVjdC9DaGFyYWN0ZXIvTW9uc3Rlci9Nb25zdGVyXCI7XHJcbmltcG9ydCB7IFNrZWxldG9uIH0gZnJvbSBcIi4uL01vZGVscy9HYW1lLU9iamVjdC9DaGFyYWN0ZXIvTW9uc3Rlci9Ta2VsZXRvblwiO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVMb2dpYyBleHRlbmRzIE1vbnN0ZXIge1xyXG4gICAgcHJvdGVjdGVkIHBsYXllcjogSGVybztcclxuICAgIHByb3RlY3RlZCBucGNzOiBTa2VsZXRvbltdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgYm9zczogQm9zcztcclxuICAgIHByb3RlY3RlZCBzdGVwczogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIGN1cnJlbnRMZXZlbDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgSGVybygpO1xyXG4gICAgICAgIHRoaXMubnBjcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYm9zcyA9IG5ldyBCb3NzKCk7XHJcbiAgICAgICAgdGhpcy5zdGVwcyA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50TGV2ZWwgPSAxO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGFydEdhbWUoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVNYXAoKTtcclxuICAgICAgICB0aGlzLnNwYXduSGVybygpO1xyXG4gICAgICAgIHRoaXMuc3Bhd25Nb25zdGVycygpO1xyXG4gICAgICAgIHRoaXMuc3Bhd25Cb3NzKCk7XHJcbiAgICAgICAgdGhpcy5odWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlVG9OZXh0QXJlYSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZU1hcCgpO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnNldEhlcm9YKDApO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnNldEhlcm9ZKDApO1xyXG4gICAgICAgIHRoaXMucGxheWVyLmRyYXdIZXJvRG93bigpO1xyXG4gICAgICAgIHRoaXMubnBjcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3Bhd25Nb25zdGVycygpO1xyXG4gICAgICAgIHRoaXMuYm9zcyA9IG5ldyBCb3NzKCk7XHJcbiAgICAgICAgdGhpcy5zcGF3bkJvc3MoKTtcclxuICAgICAgICB0aGlzLmJvc3Muc2V0Qm9zc0FsaXZlKCk7XHJcbiAgICAgICAgdGhpcy5odWQoKTtcclxuICAgICAgICB0aGlzLmluY3JlYXNlRGlmZmljdWx0eSgpO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnJlc3RvcmVIZXJvSHAoKTtcclxuICAgICAgICB0aGlzLnBsYXllci5zZXRLZXkoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGluY3JlYXNlRGlmZmljdWx0eSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRMZXZlbCArPSA0O1xyXG4gICAgICAgIHRoaXMubnBjcy5mb3JFYWNoKChucGMpID0+IG5wYy5pbmNyZWFzZVNrZWxldG9uTGV2ZWwodGhpcy5jdXJyZW50TGV2ZWwpKTtcclxuICAgICAgICB0aGlzLmJvc3MuYm9zc0xldmVsVXAodGhpcy5jdXJyZW50TGV2ZWwpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnYW1lVXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaHVkKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5ucGNzKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tGb3JCYXR0bGUoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmJhdHRsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLmlzSGVyb0FsaXZlKCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNoZWNrVmljdG9yeUNvbmRpdGlvbnMoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSW5jcmVhc2luZyBkaWZmaWN1bHR5LiBNb3ZpbmcgdG8gbmV4dCBhcmVhJylcclxuICAgICAgICAgICAgdGhpcy5tb3ZlVG9OZXh0QXJlYSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzcGF3bkhlcm8oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgSGVybygpO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnNldEhlcm9YKDApO1xyXG4gICAgICAgIHRoaXMucGxheWVyLnNldEhlcm9ZKDApO1xyXG4gICAgICAgIHRoaXMucGxheWVyLmRyYXdIZXJvRG93bigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNwYXduTW9uc3RlcnMoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IG51bWJlck9mU3Bhd25zOiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNyAtIDMpICsgMyk7XHJcbiAgICAgICAgbGV0IHBpY2tLZXlIb2xkZXI6IG51bWJlciA9IDA7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1NwYXduaW5nICcgKyBudW1iZXJPZlNwYXducyArICcgbW9uc3RlcnMgYW5kIG9uZSBib3NzLiBTb21lb25lIGhhcyB0aGUga2V5LiBGaW5kIGl0IGFuZCBraWxsIHRoZSBib3NzIHRvIHByb2dyZXNzLicpO1xyXG5cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IG51bWJlck9mU3Bhd25zOyBpKSB7XHJcbiAgICAgICAgICAgIGxldCBnZW5lcmF0ZWRYOiBudW1iZXIgPSB0aGlzLmdlbmVyYXRlQ29vcmRpbmF0ZXMoKVswXTtcclxuICAgICAgICAgICAgbGV0IGdlbmVyYXRlZFk6IG51bWJlciA9IHRoaXMuZ2VuZXJhdGVDb29yZGluYXRlcygpWzFdO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNUaGlzQVdhbGwoZ2VuZXJhdGVkWCwgZ2VuZXJhdGVkWSkgPT09IGZhbHNlICYmICEodGhpcy5pc1RoaXNUaWxlT2NjdXBpZWQoZ2VuZXJhdGVkWCwgZ2VuZXJhdGVkWSkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5wY3MucHVzaChuZXcgU2tlbGV0b24oKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5wY3NbaV0uc2V0U2tlbGV0b25YKGdlbmVyYXRlZFgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ucGNzW2ldLnNldFNrZWxldG9uWShnZW5lcmF0ZWRZKTtcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5ucGNzW2ldLmdldFNrZWxldG9uKCksIGdlbmVyYXRlZFgsIGdlbmVyYXRlZFkpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwaWNrS2V5SG9sZGVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMubnBjcy5sZW5ndGggLSAxKSArIDEpO1xyXG4gICAgICAgIHRoaXMubnBjc1twaWNrS2V5SG9sZGVyXS5zZXRLZXkoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3Bhd25Cb3NzKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBnZW5lcmF0ZWRYOiBudW1iZXIgPSB0aGlzLmdlbmVyYXRlQ29vcmRpbmF0ZXMoKVswXTtcclxuICAgICAgICBsZXQgZ2VuZXJhdGVkWTogbnVtYmVyID0gdGhpcy5nZW5lcmF0ZUNvb3JkaW5hdGVzKClbMV07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzVGhpc0FXYWxsKGdlbmVyYXRlZFgsIGdlbmVyYXRlZFkpID09PSBmYWxzZSAmJiAhKHRoaXMuYXJlQ29vcmRpbmF0ZXNJZGVudGljYWwoZ2VuZXJhdGVkWCwgZ2VuZXJhdGVkWSkpKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5ib3NzLmdldEJvc3MoKSwgZ2VuZXJhdGVkWCwgZ2VuZXJhdGVkWSk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9zcy5zZXRQb3NpdGlvblgoZ2VuZXJhdGVkWCk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9zcy5zZXRQb3NpdGlvblkoZ2VuZXJhdGVkWSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNwYXduQm9zcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhcmVDb29yZGluYXRlc0lkZW50aWNhbCh4OiBudW1iZXIsIHk6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLm5wY3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm5wY3NbaV0uZ2V0U2tlbGV0b25YKCkgPT09IHggJiYgdGhpcy5ucGNzW2ldLmdldFNrZWxldG9uWSgpID09PSB5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZW5lcmF0ZUNvb3JkaW5hdGVzKCk6IEFycmF5PG51bWJlcj4ge1xyXG4gICAgICAgIGxldCByYW5kb21YOiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoOSAtIDEpICsgMSkgKiA3MjtcclxuICAgICAgICBsZXQgcmFuZG9tWTogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDkgLSAxKSArIDEpICogNzI7XHJcblxyXG4gICAgICAgIHJldHVybiBbcmFuZG9tWCwgcmFuZG9tWV07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmVIZXJvRG93bigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0ZXBzKys7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0ZXBzID09PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZU1vbnN0ZXJzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RlcHMgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5pc1RoaXNBV2FsbCh0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpICsgNzIpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc0VkZ2VPZk1hcEJvdHRvbSh0aGlzLnBsYXllci5nZXRIZXJvWSgpKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Rmxvb3IodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLm1vdmVIZXJvRG93bigpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5kcmF3SGVyb0Rvd24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdGbG9vcih0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZHJhd0hlcm9Eb3duKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhbWVVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlSGVyb1VwKCk6IHZvaWQgIHtcclxuICAgICAgICB0aGlzLnN0ZXBzKys7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0ZXBzID09PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW92ZU1vbnN0ZXJzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RlcHMgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5pc1RoaXNBV2FsbCh0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpIC0gNzIpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc0VkZ2VPZk1hcFRvcCh0aGlzLnBsYXllci5nZXRIZXJvWSgpKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Rmxvb3IodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLm1vdmVIZXJvVXAoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZHJhd0hlcm9VcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Zsb29yKHRoaXMucGxheWVyLmdldEhlcm9YKCksIHRoaXMucGxheWVyLmdldEhlcm9ZKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5kcmF3SGVyb1VwKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhbWVVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlSGVyb0xlZnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGVwcysrO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGVwcyA9PT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVNb25zdGVycygpO1xyXG4gICAgICAgICAgICB0aGlzLnN0ZXBzID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuaXNUaGlzQVdhbGwodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSAtIDcyLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKSA9PT0gZmFsc2UgJiYgdGhpcy5pc1RoaXNFZGdlT2ZNYXBMZWZ0KHRoaXMucGxheWVyLmdldEhlcm9YKCkpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdGbG9vcih0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIubW92ZUhlcm9MZWZ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLmRyYXdIZXJvTGVmdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Zsb29yKHRoaXMucGxheWVyLmdldEhlcm9YKCksIHRoaXMucGxheWVyLmdldEhlcm9ZKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5kcmF3SGVyb0xlZnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZVVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVIZXJvUmlnaHQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5zdGVwcysrO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGVwcyA9PT0gMikge1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVNb25zdGVycygpO1xyXG4gICAgICAgICAgICB0aGlzLnN0ZXBzID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHRoaXMuaXNUaGlzQVdhbGwodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSArIDcyLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKSA9PT0gZmFsc2UgJiYgdGhpcy5pc1RoaXNFZGdlT2ZNYXBSaWdodCh0aGlzLnBsYXllci5nZXRIZXJvWCgpKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3Rmxvb3IodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLm1vdmVIZXJvUmlnaHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wbGF5ZXIuZHJhd0hlcm9SaWdodCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd0Zsb29yKHRoaXMucGxheWVyLmdldEhlcm9YKCksIHRoaXMucGxheWVyLmdldEhlcm9ZKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5kcmF3SGVyb1JpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdhbWVVcGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBodWQoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGh1ZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNodWQnKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgICAgICBodWQudGV4dENvbnRlbnQgPSBgSGVybyAoTGV2ZWwgJHt0aGlzLnBsYXllci5nZXRIZXJvTGV2ZWwoKX0pIEhQOiAke3RoaXMucGxheWVyLmdldEhlcm9IcCgpfS8ke3RoaXMucGxheWVyLmdldEhlcm9NYXhIcCgpfSB8IERQOiAke3RoaXMucGxheWVyLmdldEhlcm9EcCgpfSB8IFNQOiAke3RoaXMucGxheWVyLmdldEhlcm9TcCgpfSB8IEtleTogJHt0aGlzLnBsYXllci5oYXNIZXJvS2V5KCl9YDtcclxuICAgIH1cclxuXHJcbiAgICBodWRmaWdodCgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaHVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2h1ZC1maWdodCcpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgICAgIGh1ZC50ZXh0Q29udGVudCA9IGBGaWdodGluZyB3aXRoICR7dGhpcy5nZXRNb25zdGVyKHRoaXMucGxheWVyLmdldEhlcm9YKCksIHRoaXMucGxheWVyLmdldEhlcm9ZKCkpLmNvbnN0cnVjdG9yLm5hbWV9IChMZXZlbCAke3RoaXMuZ2V0TW9uc3Rlcih0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKS5nZXRTa2VsZXRvbkxldmVsKCl9KSB8IERQIDogJHt0aGlzLmdldE1vbnN0ZXIodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSkuZ2V0U2tlbGV0b25EcCgpfSB8IFNQIDogJHt0aGlzLmdldE1vbnN0ZXIodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSkuZ2V0U2tlbGV0b25TcCgpfWBcclxuICAgIH1cclxuXHJcbiAgICBodWRmaWdodFVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgaHVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2h1ZC1maWdodCcpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgICAgIGh1ZC50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVNb25zdGVycygpOiB2b2lkIHsgICAgICAgICAgICBcclxuICAgICAgICB0aGlzLm1vdmVCb3NzKClcclxuICAgICAgICB0aGlzLm1vdmVTa2VsZXRvbnMoKTtcclxuICAgICAgICB0aGlzLmh1ZGZpZ2h0VXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tGcmVlRGlyZWN0aW9uQm9zcyhib3NzOiBCb3NzKTogQXJyYXk8bnVtYmVyPiB7XHJcbiAgICAgICAgLy8gMHRoIGluZGV4ID0gdXAsIDEgPT0gZG93biwgMiA9PSBsZWZ0LCAzID09IHJpZ2h0ICBcclxuICAgICAgICBcclxuICAgICAgICBsZXQgZnJlZURpcmVjdGlvbnM6IG51bWJlciBbXSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1RoaXNBV2FsbChib3NzLmdldEJvc3NYKCksIChib3NzLmdldEJvc3NZKCkgLSA3MikpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc0VkZ2VPZk1hcFRvcChib3NzLmdldEJvc3NZKCkpID09PSBmYWxzZSAmJiB0aGlzLmFyZUNvb3JkaW5hdGVzSWRlbnRpY2FsKGJvc3MuZ2V0Qm9zc1goKSwgYm9zcy5nZXRCb3NzWSgpIC0gNzIpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBmcmVlRGlyZWN0aW9ucy5wdXNoKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZyZWVEaXJlY3Rpb25zLnB1c2goMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1RoaXNBV2FsbChib3NzLmdldEJvc3NYKCksIChib3NzLmdldEJvc3NZKCkgKyA3MikpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc0VkZ2VPZk1hcEJvdHRvbShib3NzLmdldEJvc3NZKCkpID09PSBmYWxzZSAmJiB0aGlzLmFyZUNvb3JkaW5hdGVzSWRlbnRpY2FsKGJvc3MuZ2V0Qm9zc1goKSwgYm9zcy5nZXRCb3NzWSgpICsgNzIpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBmcmVlRGlyZWN0aW9ucy5wdXNoKDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZyZWVEaXJlY3Rpb25zLnB1c2goMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1RoaXNBV2FsbChib3NzLmdldEJvc3NYKCkgLSA3MiwgYm9zcy5nZXRCb3NzWSgpKSA9PT0gZmFsc2UgJiYgdGhpcy5pc1RoaXNFZGdlT2ZNYXBMZWZ0KGJvc3MuZ2V0Qm9zc1goKSkgPT09IGZhbHNlICYmIHRoaXMuYXJlQ29vcmRpbmF0ZXNJZGVudGljYWwoYm9zcy5nZXRCb3NzWCgpIC0gNzIsIGJvc3MuZ2V0Qm9zc1koKSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGZyZWVEaXJlY3Rpb25zLnB1c2goMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZnJlZURpcmVjdGlvbnMucHVzaCgwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzVGhpc0FXYWxsKGJvc3MuZ2V0Qm9zc1goKSArIDcyLCBib3NzLmdldEJvc3NZKCkpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc0VkZ2VPZk1hcFJpZ2h0KGJvc3MuZ2V0Qm9zc1goKSkgPT09IGZhbHNlICYmIHRoaXMuYXJlQ29vcmRpbmF0ZXNJZGVudGljYWwoYm9zcy5nZXRCb3NzWCgpICsgNzIsIGJvc3MuZ2V0Qm9zc1koKSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGZyZWVEaXJlY3Rpb25zLnB1c2goMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZnJlZURpcmVjdGlvbnMucHVzaCgwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGZyZWVEaXJlY3Rpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVCb3NzKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwaWNrUmFuZG9tRGlyZWN0aW9uOiBudW1iZXIgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCkpO1xyXG4gICAgICAgIGxldCBmcmVlRGlyZWN0aW9uQXJyYXk6IG51bWJlciBbXSA9IHRoaXMuY2hlY2tGcmVlRGlyZWN0aW9uQm9zcyh0aGlzLmJvc3MpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgZnJlZURpcmVjdGlvbkFycmF5Lmxlbmd0aDsgaSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRnJlZURpcmVjdGlvbkJvc3ModGhpcy5ib3NzKVtwaWNrUmFuZG9tRGlyZWN0aW9uXSA9PT0gMSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwaWNrUmFuZG9tRGlyZWN0aW9uID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9tb3ZlcyBib3NzIHVwXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3Rmxvb3IodGhpcy5ib3NzLmdldEJvc3NYKCksIHRoaXMuYm9zcy5nZXRCb3NzWSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvc3MubW92ZUJvc3NVcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9zcy5kcmF3Qm9zcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwaWNrUmFuZG9tRGlyZWN0aW9uID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9tb3ZlcyBib3NzIGRvd25cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbG9vcih0aGlzLmJvc3MuZ2V0Qm9zc1goKSwgdGhpcy5ib3NzLmdldEJvc3NZKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9zcy5tb3ZlQm9zc0Rvd24oKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvc3MuZHJhd0Jvc3MoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGlja1JhbmRvbURpcmVjdGlvbiA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vbW92ZXMgYm9zcyBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3Rmxvb3IodGhpcy5ib3NzLmdldEJvc3NYKCksIHRoaXMuYm9zcy5nZXRCb3NzWSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvc3MubW92ZUJvc3NMZWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3NzLmRyYXdCb3NzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBpY2tSYW5kb21EaXJlY3Rpb24gPT09IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL21vdmVzIGJvc3MgcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdGbG9vcih0aGlzLmJvc3MuZ2V0Qm9zc1goKSwgdGhpcy5ib3NzLmdldEJvc3NZKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9zcy5tb3ZlQm9zc1JpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3NzLmRyYXdCb3NzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwaWNrUmFuZG9tRGlyZWN0aW9uID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrRnJlZURpcmVjdGlvbnNTa2VsZXRvbihza2VsZXRvbjogU2tlbGV0b24pOiBBcnJheTxudW1iZXI+IHtcclxuICAgICAgICBsZXQgZnJlZURpcmVjdGlvbnM6IG51bWJlciBbXSA9IFtdO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pc1RoaXNBV2FsbChza2VsZXRvbi5nZXRTa2VsZXRvblgoKSwgKHNrZWxldG9uLmdldFNrZWxldG9uWSgpIC0gNzIpKSA9PT0gZmFsc2UgJiYgdGhpcy5pc1RoaXNFZGdlT2ZNYXBUb3Aoc2tlbGV0b24uZ2V0U2tlbGV0b25ZKCkpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc1RpbGVPY2N1cGllZChza2VsZXRvbi5nZXRTa2VsZXRvblgoKSwgc2tlbGV0b24uZ2V0U2tlbGV0b25ZKCkgLSA3MikgPT09IGZhbHNlICYmIHRoaXMuaXNUaGlzVGlsZU9jY3VwaWVkKHNrZWxldG9uLmdldFNrZWxldG9uWCgpLCBza2VsZXRvbi5nZXRTa2VsZXRvblkoKSAtIDE0NCkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGZyZWVEaXJlY3Rpb25zLnB1c2goMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZnJlZURpcmVjdGlvbnMucHVzaCgwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzVGhpc0FXYWxsKHNrZWxldG9uLmdldFNrZWxldG9uWCgpLCAoc2tlbGV0b24uZ2V0U2tlbGV0b25ZKCkgKyA3MikpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc0VkZ2VPZk1hcEJvdHRvbShza2VsZXRvbi5nZXRTa2VsZXRvblkoKSkgPT09IGZhbHNlICYmIHRoaXMuaXNUaGlzVGlsZU9jY3VwaWVkKHNrZWxldG9uLmdldFNrZWxldG9uWCgpLCBza2VsZXRvbi5nZXRTa2VsZXRvblkoKSArIDcyKSA9PT0gZmFsc2UgJiYgdGhpcy5pc1RoaXNUaWxlT2NjdXBpZWQoc2tlbGV0b24uZ2V0U2tlbGV0b25YKCksIHNrZWxldG9uLmdldFNrZWxldG9uWSgpICsgMTQ0KSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgZnJlZURpcmVjdGlvbnMucHVzaCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmcmVlRGlyZWN0aW9ucy5wdXNoKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNUaGlzQVdhbGwoc2tlbGV0b24uZ2V0U2tlbGV0b25YKCkgLSA3Miwgc2tlbGV0b24uZ2V0U2tlbGV0b25ZKCkpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc0VkZ2VPZk1hcExlZnQoc2tlbGV0b24uZ2V0U2tlbGV0b25YKCkpID09PSBmYWxzZSAmJiB0aGlzLmlzVGhpc1RpbGVPY2N1cGllZChza2VsZXRvbi5nZXRTa2VsZXRvblgoKSAtIDcyLCBza2VsZXRvbi5nZXRTa2VsZXRvblkoKSkgPT09IGZhbHNlICYmIHRoaXMuaXNUaGlzVGlsZU9jY3VwaWVkKHNrZWxldG9uLmdldFNrZWxldG9uWCgpIC0gMTQ0LCBza2VsZXRvbi5nZXRTa2VsZXRvblkoKSkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGZyZWVEaXJlY3Rpb25zLnB1c2goMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZnJlZURpcmVjdGlvbnMucHVzaCgwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzVGhpc0FXYWxsKHNrZWxldG9uLmdldFNrZWxldG9uWCgpICsgNzIsIHNrZWxldG9uLmdldFNrZWxldG9uWSgpKSA9PT0gZmFsc2UgJiYgdGhpcy5pc1RoaXNFZGdlT2ZNYXBSaWdodChza2VsZXRvbi5nZXRTa2VsZXRvblgoKSkgPT09IGZhbHNlICYmIHRoaXMuaXNUaGlzVGlsZU9jY3VwaWVkKHNrZWxldG9uLmdldFNrZWxldG9uWCgpICsgNzIsIHNrZWxldG9uLmdldFNrZWxldG9uWSgpKSA9PT0gZmFsc2UgJiYgdGhpcy5pc1RoaXNUaWxlT2NjdXBpZWQoc2tlbGV0b24uZ2V0U2tlbGV0b25YKCkgKyAxNDQsIHNrZWxldG9uLmdldFNrZWxldG9uWSgpKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgZnJlZURpcmVjdGlvbnMucHVzaCgxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmcmVlRGlyZWN0aW9ucy5wdXNoKDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZnJlZURpcmVjdGlvbnM7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG1vdmVTa2VsZXRvbnMoKTogdm9pZCB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yKGxldCBqOiBudW1iZXIgPSAwOyBqIDwgdGhpcy5ucGNzLmxlbmd0aDsgaisrKSB7XHJcblxyXG4gICAgICAgIGxldCBwaWNrUmFuZG9tRGlyZWN0aW9uOiBudW1iZXIgPSAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCkpO1xyXG4gICAgICAgIGxldCBmcmVlRGlyZWN0aW9uQXJyYXk6IG51bWJlciBbXSA9IHRoaXMuY2hlY2tGcmVlRGlyZWN0aW9uc1NrZWxldG9uKHRoaXMubnBjc1tqXSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgZnJlZURpcmVjdGlvbkFycmF5Lmxlbmd0aDsgaSkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGVja0ZyZWVEaXJlY3Rpb25zU2tlbGV0b24odGhpcy5ucGNzW2pdKVtwaWNrUmFuZG9tRGlyZWN0aW9uXSA9PT0gMSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocGlja1JhbmRvbURpcmVjdGlvbiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL21vdmVzIHNrZWxldG9uIHVwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Zsb29yKHRoaXMubnBjc1tqXS5nZXRTa2VsZXRvblgoKSwgdGhpcy5ucGNzW2pdLmdldFNrZWxldG9uWSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ucGNzW2pdLm1vdmVTa2VsZXRvblVwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubnBjc1tqXS5kcmF3U2tlbGV0b24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocGlja1JhbmRvbURpcmVjdGlvbiA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL21vdmVzIHNrZWxldG9uIGRvd25cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3Rmxvb3IodGhpcy5ucGNzW2pdLmdldFNrZWxldG9uWCgpLCB0aGlzLm5wY3Nbal0uZ2V0U2tlbGV0b25ZKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5wY3Nbal0ubW92ZVNrZWxldG9uRG93bigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5wY3Nbal0uZHJhd1NrZWxldG9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBpY2tSYW5kb21EaXJlY3Rpb24gPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9tb3ZlcyBza2VsZXRvbiBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Zsb29yKHRoaXMubnBjc1tqXS5nZXRTa2VsZXRvblgoKSwgdGhpcy5ucGNzW2pdLmdldFNrZWxldG9uWSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ucGNzW2pdLm1vdmVTa2VsZXRvbkxlZnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ucGNzW2pdLmRyYXdTa2VsZXRvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwaWNrUmFuZG9tRGlyZWN0aW9uID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vbW92ZXMgc2tlbGV0b24gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmF3Rmxvb3IodGhpcy5ucGNzW2pdLmdldFNrZWxldG9uWCgpLCB0aGlzLm5wY3Nbal0uZ2V0U2tlbGV0b25ZKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5wY3Nbal0ubW92ZVNrZWxldG9uUmlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ucGNzW2pdLmRyYXdTa2VsZXRvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwaWNrUmFuZG9tRGlyZWN0aW9uID0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpKTtcclxuICAgICAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzVGhpc1RpbGVPY2N1cGllZCh4OiBudW1iZXIsIHk6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh4ID09PSB0aGlzLmJvc3MuZ2V0Qm9zc1goKSAmJiB5ID09PSB0aGlzLmJvc3MuZ2V0Qm9zc1koKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5hcmVDb29yZGluYXRlc0lkZW50aWNhbCh4LCB5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrRm9yQmF0dGxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLmlzVGhpc1RpbGVPY2N1cGllZCh0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYmF0dGxlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBIGJhdHRsZSBmb3JtcycpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLnBsYXllci5nZXRIZXJvWCgpID09PSB0aGlzLmJvc3MuZ2V0Qm9zc1goKSAmJiB0aGlzLnBsYXllci5nZXRIZXJvWCgpID09PSB0aGlzLmJvc3MuZ2V0Qm9zc1goKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQSBib3NzIGZpZ2h0IGZvcm1zJylcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLnBsYXllci5pc0hlcm9BbGl2ZSgpICYmIHRoaXMuYm9zcy5pc0Jvc3NBbGl2ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5zdHJpa2VCb3NzKHRoaXMuYm9zcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvc3Muc3RyaWtlKHRoaXMucGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9zcy5pc0Jvc3NBbGl2ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGxvc3QgdGhlIGJhdHRsZScpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc2V0SGVyb0RlYWQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IHdpbiB0aGUgIGJvc3MgYmF0dGxlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvc3Muc2V0RGVhZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmh1ZGZpZ2h0KCk7XHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLnBsYXllci5pc0hlcm9BbGl2ZSgpICYmIHRoaXMuZ2V0TW9uc3Rlcih0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKS5pc1NrZWxldG9uQWxpdmUoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc3RyaWtlKHRoaXMuZ2V0TW9uc3Rlcih0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldE1vbnN0ZXIodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSkuc3RyaWtlKHRoaXMucGxheWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdldE1vbnN0ZXIodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSkuaXNTa2VsZXRvbkFsaXZlKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNb25zdGVyIHdvbiB0aGUgYmF0dGxlJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5zZXRIZXJvRGVhZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IHdvbiB0aGUgYmF0dGxlISBMZXZlbGluZyBVcCcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0TW9uc3Rlcih0aGlzLnBsYXllci5nZXRIZXJvWCgpLCB0aGlzLnBsYXllci5nZXRIZXJvWSgpKS5oYXNTa2VsZXRvbktleSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc2V0S2V5KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmdldE1vbnN0ZXIodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSkuc2V0U2tlbGV0b25EZWFkKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU1vbnN0ZXIodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5oZXJvTGV2ZWxVcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBcclxuICAgIH1cclxuXHJcbiAgICBnZXRNb25zdGVyKHg6IG51bWJlciwgeTogbnVtYmVyKTogU2tlbGV0b24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5wY3MuZmluZChza2VsZXRvbiA9PiBza2VsZXRvbi5nZXRTa2VsZXRvblgoKSA9PT0geCAmJiBza2VsZXRvbi5nZXRTa2VsZXRvblkoKSA9PT0geSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2FtZU92ZXIoKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGh1ZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lLW92ZXInKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgICAgICBodWQudGV4dENvbnRlbnQgPSAnR2FtZSBvdmVyISc7XHJcbiAgICAgICAgdGhpcy5kcmF3Rmxvb3IodGhpcy5wbGF5ZXIuZ2V0SGVyb1goKSwgdGhpcy5wbGF5ZXIuZ2V0SGVyb1koKSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU1vbnN0ZXIoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgc2tlbGV0b25Ub0RlbGV0ZTogU2tlbGV0b24gPSB0aGlzLm5wY3MuZmluZChza2VsZXRvbiA9PiBza2VsZXRvbi5nZXRTa2VsZXRvblgoKSA9PT0geCAmJiBza2VsZXRvbi5nZXRTa2VsZXRvblkoKSA9PT0geSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMubnBjcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ucGNzW2ldID09PSBza2VsZXRvblRvRGVsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5wY3Muc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrVmljdG9yeUNvbmRpdGlvbnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyLmhhc0hlcm9LZXkoKSAmJiB0aGlzLmJvc3MuaXNCb3NzQWxpdmUoKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgeyBUaWxlIH0gZnJvbSBcIi4uL1RpbGUvVGlsZVwiO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFyZWEgZXh0ZW5kcyBUaWxle1xyXG4gICAgcHJvdGVjdGVkIGZsb29yOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgd2FsbDogYW55O1xyXG4gICAgcHJvdGVjdGVkIG1hcDogbnVtYmVyW11bXTtcclxuICAgIHByb3RlY3RlZCBwcmV2aW91c1BhcnRpYWxSb3RhdGlvbjogYm9vbGVhbjtcclxuICAgIHByb3RlY3RlZCBnZW5lcmF0ZWRNYXA6IG51bWJlciBbXVtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7ICAgIFxyXG4gICAgICAgIHRoaXMuZmxvb3IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxvb3InKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgICAgIHRoaXMud2FsbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3YWxsJykgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICB0aGlzLm1hcCA9IFtcclxuICAgICAgICAgICAgWzAsMCwwLDEsMCwwLDAsMCwwLDBdLFxyXG4gICAgICAgICAgICBbMCwwLDAsMSwwLDEsMCwxLDEsMF0sXHJcbiAgICAgICAgICAgIFswLDEsMSwxLDAsMSwwLDEsMSwwXSxcclxuICAgICAgICAgICAgWzAsMCwwLDAsMCwxLDAsMCwwLDBdLFxyXG4gICAgICAgICAgICBbMSwxLDEsMSwwLDEsMSwxLDEsMF0sXHJcbiAgICAgICAgICAgIFswLDEsMCwxLDAsMCwwLDAsMCwwXSxcclxuICAgICAgICAgICAgWzAsMSwwLDEsMCwxLDEsMCwxLDBdLFxyXG4gICAgICAgICAgICBbMCwwLDAsMCwwLDEsMSwwLDEsMF0sXHJcbiAgICAgICAgICAgIFswLDEsMSwxLDAsMCwwLDAsMSwwXSxcclxuICAgICAgICAgICAgWzAsMCwwLDEsMCwxLDEsMCwwLDBdXHJcbiAgICAgICAgXTtcclxuICAgICAgICB0aGlzLnByZXZpb3VzUGFydGlhbFJvdGF0aW9uID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHJvdGF0ZU1hcChtYXRyaXg6IG51bWJlciBbXVtdKTogbnVtYmVyW11bXSB7XHJcbiAgICAgICAgbGV0IG46IG51bWJlciA9IG1hdHJpeC5sZW5ndGg7XHJcbiAgICBcclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBqOiBudW1iZXIgPSBpOyBqIDwgbjsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wID0gbWF0cml4W2ldW2pdO1xyXG4gICAgICAgICAgICBtYXRyaXhbaV1bal0gPSBtYXRyaXhbal1baV07XHJcbiAgICAgICAgICAgIG1hdHJpeFtqXVtpXSA9IHRlbXA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IChuLzIpOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IHRlbXAgPSBtYXRyaXhbaV1bal07XHJcbiAgICAgICAgICAgIG1hdHJpeFtpXVtqXSA9IG1hdHJpeFtpXVtuIC0gMSAtIGpdO1xyXG4gICAgICAgICAgICBtYXRyaXhbaV1bbiAtIDEgLSBqXSA9IHRlbXA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICAgICAgcmV0dXJuIG1hdHJpeDtcclxuICAgIH1cclxuXHJcbiAgICBwYXJ0aWFsUm90YXRpb24obWF0cml4OiBudW1iZXIgW11bXSk6IG51bWJlcltdW10ge1xyXG4gICAgICAgIGxldCBuOiBudW1iZXIgPSBtYXRyaXgubGVuZ3RoO1xyXG4gICAgXHJcbiAgICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gaTsgaiA8IG47IGorKykge1xyXG4gICAgICAgICAgICBsZXQgdGVtcCA9IG1hdHJpeFtpXVtqXTtcclxuICAgICAgICAgICAgbWF0cml4W2ldW2pdID0gbWF0cml4W2pdW2ldO1xyXG4gICAgICAgICAgICBtYXRyaXhbal1baV0gPSB0ZW1wO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIHJldHVybiBtYXRyaXg7XHJcbiAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgY3JlYXRlTWFwKCk6IGFueSB7XHJcbiAgICAgICAgY29uc3QgbnVtYmVyT2ZSb3RhdGlvbnM6IG51bWJlciA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg0IC0gMSkgKyAxKTtcclxuICAgICAgICBsZXQgcGFydGlhbFJvdGF0aW9uOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IG1vZGlmaWVkTWFwOiBudW1iZXIgW11bXSA9IFtbXV07XHJcblxyXG4gICAgICAgIGlmIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSA9PT0gMCkge1xyXG4gICAgICAgICAgICBwYXJ0aWFsUm90YXRpb24gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJ0aWFsUm90YXRpb24gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBhcnRpYWxSb3RhdGlvbiAhPT0gdGhpcy5wcmV2aW91c1BhcnRpYWxSb3RhdGlvbikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbnVtYmVyT2ZSb3RhdGlvbnM7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbW9kaWZpZWRNYXAgPSB0aGlzLnBhcnRpYWxSb3RhdGlvbih0aGlzLm1hcCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXZpb3VzUGFydGlhbFJvdGF0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBudW1iZXJPZlJvdGF0aW9uczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgbW9kaWZpZWRNYXAgPSB0aGlzLnJvdGF0ZU1hcCh0aGlzLm1hcCk7XHJcbiAgICAgICAgICAgICAgICAgdGhpcy5wcmV2aW91c1BhcnRpYWxSb3RhdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmdlbmVyYXRlZE1hcCA9IG1vZGlmaWVkTWFwO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbW9kaWZpZWRNYXAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IG1vZGlmaWVkTWFwLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBpZiAobW9kaWZpZWRNYXBbaV1bal0gPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuZmxvb3IsIGkgKiA3MiwgaiAqIDcyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLndhbGwsIGkgKiA3MiwgaiAqIDcyKTtcclxuICAgICAgICAgICAgICAgIH0gIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgICBcclxuICAgIH1cclxuXHJcbiAgICBpc1RoaXNBV2FsbCh4OiBudW1iZXIsIHk6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh4IDwgMCB8fCB5IDwgMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh4ID4gNjQ4IHx8IHkgPiA2NDgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoeCA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZW5lcmF0ZWRNYXBbeF1beSAvIDcyXSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKHkgPT09IDApIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2VuZXJhdGVkTWFwW3ggLyA3Ml1beV0gPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICh0aGlzLmdlbmVyYXRlZE1hcFt4IC8gNzJdW3kgLyA3Ml0gPT09IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc1RoaXNFZGdlT2ZNYXBUb3AoeTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHkgLSA3MiA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc1RoaXNFZGdlT2ZNYXBCb3R0b20oeTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHkgKyA3MiA+IDY0OCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzVGhpc0VkZ2VPZk1hcExlZnQoeDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHggLSA3MiA8IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc1RoaXNFZGdlT2ZNYXBSaWdodCh4OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoeCArIDcyID4gNjQ4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiXHJcbmltcG9ydCB7IEhlcm8gfSBmcm9tIFwiLi9IZXJvXCI7XHJcbmltcG9ydCB7IE1vbnN0ZXIgfSBmcm9tIFwiLi9Nb25zdGVyXCI7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1jYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5leHBvcnQgY2xhc3MgQm9zcyBleHRlbmRzIE1vbnN0ZXIge1xyXG4gICAgcHJvdGVjdGVkIGJvc3M6IGFueTtcclxuICAgIHByb3RlY3RlZCBib3NzWDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIGJvc3NZOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgYm9zc0xldmVsOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgYm9zc0hwOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgYm9zc0RwOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgYm9zc1NwOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgaXNBbGl2ZTogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuYm9zcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib3NzJykgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICB0aGlzLmJvc3NYID0gMDtcclxuICAgICAgICB0aGlzLmJvc3NZID0gMDtcclxuICAgICAgICB0aGlzLmJvc3NMZXZlbCA9IDI7XHJcbiAgICAgICAgdGhpcy5ib3NzSHAgPSAyICogKHRoaXMuYm9zc0xldmVsKSAqIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSkpICsgKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSk7XHJcbiAgICAgICAgdGhpcy5ib3NzRHAgPSAoKHRoaXMuYm9zc0xldmVsIC8gMikgKiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSkgKyAoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSkgLyAyKTtcclxuICAgICAgICB0aGlzLmJvc3NTcCA9ICh0aGlzLmJvc3NMZXZlbCAqIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSkpKSArIHRoaXMuYm9zc0xldmVsO1xyXG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbG93ZXJCb3NzSHAobnVtYmVyOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmJvc3NIcCAtPSBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgc3RyaWtlKGhlcm86IEhlcm8pOiB2b2lkIHtcclxuICAgICAgICBpZiAoKHRoaXMuYm9zc1NwICsgKDIgKiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSkpID4gaGVyby5nZXRIZXJvRHAoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3RyaWtlIGZyb20gTW9uc3RlciB3YXMgc3VjY2VzZnVsJyk7XHJcbiAgICAgICAgICAgIGhlcm8ubG93ZXJIZXJvSHAodGhpcy5ib3NzU3AgKyAoMiAqIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSkpKSAtIGhlcm8uZ2V0SGVyb0RwKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N0cmlrZSBmcm9tIE1vbnN0ZXIgd2FzbnQgc3VjY2VzZnVsJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBnZXRCb3NzRHAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib3NzRHA7XHJcbiAgICB9XHJcblxyXG4gICAgaXNCb3NzQWxpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuYm9zc0hwID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBib3NzTGV2ZWxVcChudW1iZXI6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9zc0xldmVsICs9IG51bWJlcjtcclxuICAgICAgICB0aGlzLmJvc3NIcCA9IDIgKiAodGhpcy5ib3NzTGV2ZWwpICogKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSkgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKTtcclxuICAgICAgICB0aGlzLmJvc3NEcCA9ICgodGhpcy5ib3NzTGV2ZWwgLyAyKSAqIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSkpKSArICgoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSAvIDIpO1xyXG4gICAgICAgIHRoaXMuYm9zc1NwID0gKHRoaXMuYm9zc0xldmVsICogKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSkpICsgdGhpcy5ib3NzTGV2ZWw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldEJvc3NBbGl2ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmlzQWxpdmUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZXREZWFkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEJvc3MoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib3NzO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdCb3NzKCk6IHZvaWQge1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5ib3NzLCB0aGlzLmJvc3NYLCB0aGlzLmJvc3NZKTtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlQm9zc1VwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9zc1kgLT0gNzI7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZUJvc3NEb3duKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9zc1kgKz0gNzI7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZUJvc3NMZWZ0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9zc1ggLT0gNzI7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZUJvc3NSaWdodCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmJvc3NYICs9IDcyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEJvc3NYKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9zc1g7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Qm9zc1koKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib3NzWTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb3NpdGlvblgobnVtYmVyOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmJvc3NYID0gbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBvc2l0aW9uWShudW1iZXI6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYm9zc1kgPSBudW1iZXI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBCb3NzIH0gZnJvbSBcIi4vQm9zc1wiO1xyXG5pbXBvcnQgeyBNb25zdGVyIH0gZnJvbSBcIi4vTW9uc3RlclwiO1xyXG5pbXBvcnQgeyBTa2VsZXRvbiB9IGZyb20gXCIuL1NrZWxldG9uXCI7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1jYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG5leHBvcnQgY2xhc3MgSGVybyBleHRlbmRzIE1vbnN0ZXIge1xyXG4gICAgcHJvdGVjdGVkIGhlcm9Eb3duOiBhbnk7XHJcbiAgICBwcm90ZWN0ZWQgaGVyb0xlZnQ6IGFueTtcclxuICAgIHByb3RlY3RlZCBoZXJvUmlnaHQ6IGFueTtcclxuICAgIHByb3RlY3RlZCBoZXJvVXA6IGFueTtcclxuICAgIHByb3RlY3RlZCBoZXJvTGV2ZWw6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBoZXJvSHA6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBoZXJvTWF4SHA6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBoZXJvRHA6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBoZXJvU3A6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBoZXJvWDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIGhlcm9ZOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgaGFzS2V5OiBib29sZWFuO1xyXG4gICAgcHJvdGVjdGVkIGlzQWxpdmU6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmhlcm9Eb3duID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlcm8tZG93bicpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5oZXJvTGVmdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZXJvLWxlZnQnKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuaGVyb1JpZ2h0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlcm8tcmlnaHQnKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuaGVyb1VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hlcm8tdXAnKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuaGVyb0xldmVsID0gMTtcclxuICAgICAgICB0aGlzLmhlcm9IcCA9IDIwICsgKDMgKiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSk7XHJcbiAgICAgICAgdGhpcy5oZXJvTWF4SHAgPSB0aGlzLmhlcm9IcDtcclxuICAgICAgICB0aGlzLmhlcm9EcCA9IDIgKiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKTtcclxuICAgICAgICB0aGlzLmhlcm9TcCA9IDUgKyAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKTtcclxuICAgICAgICB0aGlzLmhlcm9YID0gMDtcclxuICAgICAgICB0aGlzLmhlcm9ZID0gMDtcclxuICAgICAgICB0aGlzLmhhc0tleSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgaXNIZXJvQWxpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGVyb0hwID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhc0hlcm9LZXkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzS2V5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldEtleShib29sZWFuOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oYXNLZXkgPSBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEhlcm9YKHg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaGVyb1ggPSB4O1xyXG4gICAgfVxyXG5cclxuICAgIHNldEhlcm9ZKHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaGVyb1kgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldEhlcm9YKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVyb1g7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SGVyb1koKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZXJvWTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRIZXJvTGV2ZWwoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZXJvTGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SGVyb0hwKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVyb0hwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEhlcm9NYXhIcCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhlcm9NYXhIcDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRIZXJvRHAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5oZXJvRHA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SGVyb1NwKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVyb1NwO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVIZXJvVXAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oZXJvWSAtPSA3MjtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlSGVyb0Rvd24oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oZXJvWSArPSA3MjtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlSGVyb0xlZnQoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oZXJvWCAtPSA3MjtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlSGVyb1JpZ2h0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaGVyb1ggKz0gNzI7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0hlcm9Eb3duKCk6IHZvaWQge1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5oZXJvRG93biwgdGhpcy5oZXJvWCwgdGhpcy5oZXJvWSk7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd0hlcm9VcCgpOiB2b2lkIHtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaGVyb1VwLCB0aGlzLmhlcm9YLCB0aGlzLmhlcm9ZKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3SGVyb0xlZnQoKTogdm9pZCB7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmhlcm9MZWZ0LCB0aGlzLmhlcm9YLCB0aGlzLmhlcm9ZKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3SGVyb1JpZ2h0KCk6IHZvaWQge1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5oZXJvUmlnaHQsIHRoaXMuaGVyb1gsIHRoaXMuaGVyb1kpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0cmlrZShza2VsZXRvbjogU2tlbGV0b24pOiB2b2lkIHtcclxuICAgICAgICBpZiAoKHRoaXMuaGVyb1NwICsgKDIgKiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSkpID4gc2tlbGV0b24uZ2V0U2tlbGV0b25EcCgpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdHJpa2UgdG8gTW9uc3RlciB3YXMgc3VjY2VzZnVsJyk7XHJcbiAgICAgICAgICAgIHNrZWxldG9uLmxvd2VyU2tlbGV0b25IcCh0aGlzLmhlcm9TcCArICgyICogKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSkpIC0gc2tlbGV0b24uZ2V0U2tlbGV0b25EcCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdHJpa2UgdG8gTW9uc3RlciB3YXNudCBzdWNjZXNmdWwnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RyaWtlQm9zcyhib3NzOiBCb3NzKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCh0aGlzLmhlcm9TcCArICgyICogKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSkpKSA+IGJvc3MuZ2V0Qm9zc0RwKCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N0cmlrZSB0byBCb3NzIHdhcyBzdWNjZXNmdWwnKTtcclxuICAgICAgICAgICAgYm9zcy5sb3dlckJvc3NIcCh0aGlzLmhlcm9TcCArICgyICogKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSkpIC0gYm9zcy5nZXRCb3NzRHAoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3RyaWtlIHRvIEJvc3Mgd2FzbnQgc3VjY2VzZnVsJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxvd2VySGVyb0hwKG51bWJlcjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5oZXJvSHAgLT0gbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEhlcm9EZWFkKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGhlcm9MZXZlbFVwKCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBocFRvQWRkOiBudW1iZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSk7XHJcblxyXG4gICAgICAgIHRoaXMuaGVyb0xldmVsKys7XHJcbiAgICAgICAgdGhpcy5oZXJvTWF4SHAgKz0gaHBUb0FkZDtcclxuICAgICAgICB0aGlzLmhlcm9IcCArPSBNYXRoLnJvdW5kKGhwVG9BZGQgLyAyKTtcclxuICAgICAgICB0aGlzLmhlcm9EcCArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSk7XHJcbiAgICAgICAgdGhpcy5oZXJvU3AgKz0gKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzdG9yZUhlcm9IcCgpOiB2b2lkIHtcclxuICAgICAgICBsZXQgcGlja1JhbmRvbU51bWJlcjogbnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG4gICAgICAgIGxldCBjaGFuY2VBcnJheTogbnVtYmVyIFtdID0gWzAsMSwxLDEsMSwyLDIsMiwyLDJdO1xyXG5cclxuICAgICAgICBpZiAoY2hhbmNlQXJyYXlbcGlja1JhbmRvbU51bWJlcl0gPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5oZXJvSHAgPSB0aGlzLmhlcm9NYXhIcDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Jlc3RvcmluZyBmdWxsIEhQIG9mIGhlcm8nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGNoYW5jZUFycmF5W3BpY2tSYW5kb21OdW1iZXJdID09PSAxKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhlcm9IcCArIE1hdGgucm91bmQodGhpcy5oZXJvTWF4SHAgLyAzKSA+IHRoaXMuaGVyb01heEhwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhlcm9IcCA9IHRoaXMuaGVyb01heEhwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVyb0hwICsgTWF0aC5yb3VuZCh0aGlzLmhlcm9NYXhIcCAvIDMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVzdG9yaW5nIHRoaXJkIEhQIG9mIGhlcm8nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaGFuY2VBcnJheVtwaWNrUmFuZG9tTnVtYmVyXSA9PT0gMikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oZXJvSHAgKyBNYXRoLnJvdW5kKHRoaXMuaGVyb01heEhwIC8gMTApID4gdGhpcy5oZXJvTWF4SHApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGVyb0hwID0gdGhpcy5oZXJvTWF4SHA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oZXJvSHAgKyBNYXRoLnJvdW5kKHRoaXMuaGVyb01heEhwIC8gMTApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUmVzdG9yaW5nIHRlbnRoIEhQIG9mIGhlcm8nKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBBcmVhIH0gZnJvbSBcIi4uL0FyZWEvQXJlYVwiO1xyXG5cclxuY29uc3QgY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1haW4tY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbmNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vbnN0ZXIgZXh0ZW5kcyBBcmVhIHtcclxuICAgIHByb3RlY3RlZCBwb3NpdGlvblg6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBwb3NpdGlvblk6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25YID0gMDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uWSA9IDA7XHJcbiAgICB9XHJcbiAgICAgIFxyXG4gICAgZ2V0UG9zaXRpb25zKCk6IEFycmF5PG51bWJlcj4ge1xyXG4gICAgICAgIHJldHVybiBbdGhpcy5wb3NpdGlvblgsIHRoaXMucG9zaXRpb25ZXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb3NpdGlvbnMoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uWCA9IHg7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvblkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVNb25zdGVyRG93bigpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uWSArPSA3MjtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTW9uc3RlclVwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25ZIC09IDcyO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVNb25zdGVyTGVmdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uWCAtPSA3MjtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlTW9uc3RlclJpZ2h0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25YICs9IDcyO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgSGVybyB9IGZyb20gXCIuL0hlcm9cIjtcclxuaW1wb3J0IHsgTW9uc3RlciB9IGZyb20gXCIuL01vbnN0ZXJcIjtcclxuXHJcbmNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWNhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBTa2VsZXRvbiBleHRlbmRzIE1vbnN0ZXJ7XHJcbiAgICBwcm90ZWN0ZWQgc2tlbGV0b246IGFueTtcclxuICAgIHByb3RlY3RlZCBza2VsZXRvblg6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBza2VsZXRvblk6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBza2VsZXRvbkhwOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgc2tlbGV0b25EcDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIHNrZWxldG9uU3A6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBza2VsZXRvbkxldmVsOiBudW1iZXI7XHJcbiAgICBwcm90ZWN0ZWQgaGFzS2V5OiBib29sZWFuO1xyXG4gICAgcHJvdGVjdGVkIGlzQWxpdmU6IGJvb2xlYW47XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnNrZWxldG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NrZWxldG9uJykgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICB0aGlzLnNrZWxldG9uWCA9IDA7XHJcbiAgICAgICAgdGhpcy5za2VsZXRvblkgPSAwO1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b25MZXZlbCA9IDE7XHJcbiAgICAgICAgdGhpcy5za2VsZXRvbkhwID0gMiAqICh0aGlzLnNrZWxldG9uTGV2ZWwpICogKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSk7XHJcbiAgICAgICAgdGhpcy5za2VsZXRvbkRwID0gKCh0aGlzLnNrZWxldG9uTGV2ZWwgLyAyKSAqIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSkpKSArICgoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSAvIDIpO1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b25TcCA9ICh0aGlzLnNrZWxldG9uTGV2ZWwgKiAoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSkpKSArIHRoaXMuc2tlbGV0b25MZXZlbDtcclxuICAgICAgICB0aGlzLmhhc0tleSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuaXNBbGl2ZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0S2V5KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaGFzS2V5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRLZXkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaGFzS2V5O1xyXG4gICAgfVxyXG5cclxuICAgIGhhc1NrZWxldG9uS2V5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmhhc0tleTtcclxuICAgIH1cclxuXHJcbiAgICBpbmNyZWFzZVNrZWxldG9uTGV2ZWwobnVtYmVyOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNrZWxldG9uTGV2ZWwgKz0gbnVtYmVyO1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b25IcCA9IDIgKiAodGhpcy5za2VsZXRvbkxldmVsKSAqIChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSkpO1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b25EcCA9ICgodGhpcy5za2VsZXRvbkxldmVsIC8gMikgKiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSkgKyAoKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICg2IC0gMSkgKyAxKSkgLyAyKTtcclxuICAgICAgICB0aGlzLnNrZWxldG9uU3AgPSAodGhpcy5za2VsZXRvbkxldmVsICogKChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoNiAtIDEpICsgMSkpKSkgKyB0aGlzLnNrZWxldG9uTGV2ZWw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2tlbGV0b25IcCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNrZWxldG9uSHA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2tlbGV0b25TcCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNrZWxldG9uU3A7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2tlbGV0b25EcCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNrZWxldG9uRHA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2tlbGV0b24oKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5za2VsZXRvbjtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3U2tlbGV0b24oKTogdm9pZCB7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLnNrZWxldG9uLCB0aGlzLnNrZWxldG9uWCwgdGhpcy5za2VsZXRvblkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNrZWxldG9uWCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNrZWxldG9uWDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTa2VsZXRvblkoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5za2VsZXRvblk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U2tlbGV0b25YKHg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b25YID0geDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTa2VsZXRvblkoeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5za2VsZXRvblkgPSB5O1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVTa2VsZXRvblVwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc2tlbGV0b25ZIC09IDcyO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVTa2VsZXRvbkRvd24oKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5za2VsZXRvblkgKz0gNzI7XHJcbiAgICB9XHJcblxyXG4gICAgbW92ZVNrZWxldG9uTGVmdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNrZWxldG9uWCAtPSA3MjtcclxuICAgIH1cclxuXHJcbiAgICBtb3ZlU2tlbGV0b25SaWdodCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNrZWxldG9uWCArPSA3MjtcclxuICAgIH1cclxuXHJcbiAgICBzdHJpa2UoaGVybzogSGVybyk6IHZvaWQge1xyXG4gICAgICAgIGlmICgodGhpcy5za2VsZXRvblNwICsgKDIgKiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSkpID4gaGVyby5nZXRIZXJvRHAoKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc3RyaWtlIGZyb20gTW9uc3RlciB3YXMgc3VjY2VzZnVsJyk7XHJcbiAgICAgICAgICAgIGhlcm8ubG93ZXJIZXJvSHAodGhpcy5za2VsZXRvblNwICsgKDIgKiAoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKDYgLSAxKSArIDEpKSkgLSBoZXJvLmdldEhlcm9EcCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdHJpa2UgZnJvbSBNb25zdGVyIHdhc250IHN1Y2Nlc2Z1bCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsb3dlclNrZWxldG9uSHAobnVtYmVyOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNrZWxldG9uSHAgLT0gbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGlzU2tlbGV0b25BbGl2ZSgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5za2VsZXRvbkhwID4gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFNrZWxldG9uTGV2ZWwoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5za2VsZXRvbkxldmVsO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNrZWxldG9uRGVhZCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNrZWxldG9uLmlzQWxpdmUgPSBmYWxzZTtcclxuICAgIH1cclxufSIsImNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tYWluLWNhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG5jb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBUaWxlIHtcclxuICAgIHByb3RlY3RlZCBmbG9vcjogYW55O1xyXG4gICAgcHJvdGVjdGVkIHdhbGw6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmZsb29yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zsb29yJykgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuICAgICAgICB0aGlzLndhbGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2FsbCcpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0V2FsbCgpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLndhbGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Rmxvb3IoKTogYW55IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbG9vcjtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3Rmxvb3IoeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuZmxvb3IsIHgsIHkpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgeyBHYW1lTG9naWMgfSBmcm9tIFwiLi9HYW1lTG9naWMvZ2FtZUxvZ2ljXCI7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFpbi1jYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbmNvbnN0IGdhbWVMb2dpYyA9IG5ldyBHYW1lTG9naWMoKTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgZ2FtZUxvZ2ljLnN0YXJ0R2FtZSgpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gb25LZXlQcmVzcyhldmVudDogYW55KSB7XHJcbiAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICBjYXNlIDM3OlxyXG4gICAgICBnYW1lTG9naWMubW92ZUhlcm9MZWZ0KCk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAzODpcclxuICAgICAgZ2FtZUxvZ2ljLm1vdmVIZXJvVXAoKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlIDM5OlxyXG4gICAgICBnYW1lTG9naWMubW92ZUhlcm9SaWdodCgpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgNDA6XHJcbiAgICAgIGdhbWVMb2dpYy5tb3ZlSGVyb0Rvd24oKTtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG59XHJcblxyXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleVByZXNzKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=