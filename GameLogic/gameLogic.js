"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogic = void 0;
var Boss_1 = require("../Models/Game-Object/Character/Monster/Boss");
var Hero_1 = require("../Models/Game-Object/Character/Monster/Hero");
var Monster_1 = require("../Models/Game-Object/Character/Monster/Monster");
var Skeleton_1 = require("../Models/Game-Object/Character/Monster/Skeleton");
var canvas = document.querySelector('.main-canvas');
var ctx = canvas.getContext('2d');
var GameLogic = /** @class */ (function (_super) {
    __extends(GameLogic, _super);
    function GameLogic() {
        var _this = _super.call(this) || this;
        _this.npcs = [];
        _this.player = new Hero_1.Hero();
        _this.npcs = [];
        _this.boss = new Boss_1.Boss();
        _this.steps = 0;
        _this.currentLevel = 1;
        return _this;
    }
    GameLogic.prototype.startGame = function () {
        this.createMap();
        this.spawnHero();
        this.spawnMonsters();
        this.spawnBoss();
        this.hud();
    };
    GameLogic.prototype.moveToNextArea = function () {
        this.createMap();
        this.player.setHeroX(0);
        this.player.setHeroY(0);
        this.player.drawHeroDown();
        this.npcs = [];
        this.spawnMonsters();
        this.boss = new Boss_1.Boss();
        this.spawnBoss();
        this.boss.setBossAlive();
        this.hud();
        this.increaseDifficulty();
        this.player.restoreHeroHp();
        this.player.setKey(false);
    };
    GameLogic.prototype.increaseDifficulty = function () {
        var _this = this;
        this.currentLevel += 4;
        this.npcs.forEach(function (npc) { return npc.increaseSkeletonLevel(_this.currentLevel); });
        this.boss.bossLevelUp(this.currentLevel);
    };
    GameLogic.prototype.gameUpdate = function () {
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
    };
    GameLogic.prototype.spawnHero = function () {
        this.player = new Hero_1.Hero();
        this.player.setHeroX(0);
        this.player.setHeroY(0);
        this.player.drawHeroDown();
    };
    GameLogic.prototype.spawnMonsters = function () {
        var numberOfSpawns = Math.floor(Math.random() * (7 - 3) + 3);
        var pickKeyHolder = 0;
        console.log('Spawning ' + numberOfSpawns + ' monsters and one boss. Someone has the key. Find it and kill the boss to progress.');
        for (var i = 0; i < numberOfSpawns; i) {
            var generatedX = this.generateCoordinates()[0];
            var generatedY = this.generateCoordinates()[1];
            if (this.isThisAWall(generatedX, generatedY) === false && !(this.isThisTileOccupied(generatedX, generatedY))) {
                this.npcs.push(new Skeleton_1.Skeleton());
                this.npcs[i].setSkeletonX(generatedX);
                this.npcs[i].setSkeletonY(generatedY);
                ctx.drawImage(this.npcs[i].getSkeleton(), generatedX, generatedY);
                i++;
            }
        }
        pickKeyHolder = Math.floor(Math.random() * (this.npcs.length - 1) + 1);
        this.npcs[pickKeyHolder].setKey();
    };
    GameLogic.prototype.spawnBoss = function () {
        var generatedX = this.generateCoordinates()[0];
        var generatedY = this.generateCoordinates()[1];
        if (this.isThisAWall(generatedX, generatedY) === false && !(this.areCoordinatesIdentical(generatedX, generatedY))) {
            ctx.drawImage(this.boss.getBoss(), generatedX, generatedY);
            this.boss.setPositionX(generatedX);
            this.boss.setPositionY(generatedY);
        }
        else {
            this.spawnBoss();
        }
    };
    GameLogic.prototype.areCoordinatesIdentical = function (x, y) {
        for (var i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].getSkeletonX() === x && this.npcs[i].getSkeletonY() === y) {
                return true;
            }
        }
        return false;
    };
    GameLogic.prototype.generateCoordinates = function () {
        var randomX = Math.floor(Math.random() * (9 - 1) + 1) * 72;
        var randomY = Math.floor(Math.random() * (9 - 1) + 1) * 72;
        return [randomX, randomY];
    };
    GameLogic.prototype.moveHeroDown = function () {
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
    };
    GameLogic.prototype.moveHeroUp = function () {
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
    };
    GameLogic.prototype.moveHeroLeft = function () {
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
    };
    GameLogic.prototype.moveHeroRight = function () {
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
    };
    GameLogic.prototype.hud = function () {
        var hud = document.querySelector('#hud');
        hud.textContent = "Hero (Level ".concat(this.player.getHeroLevel(), ") HP: ").concat(this.player.getHeroHp(), "/").concat(this.player.getHeroMaxHp(), " | DP: ").concat(this.player.getHeroDp(), " | SP: ").concat(this.player.getHeroSp(), " | Key: ").concat(this.player.hasHeroKey());
    };
    GameLogic.prototype.hudfight = function () {
        var hud = document.querySelector('#hud-fight');
        hud.textContent = "Fighting with ".concat(this.getMonster(this.player.getHeroX(), this.player.getHeroY()).constructor.name, " (Level ").concat(this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonLevel(), ") | DP : ").concat(this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonDp(), " | SP : ").concat(this.getMonster(this.player.getHeroX(), this.player.getHeroY()).getSkeletonSp());
    };
    GameLogic.prototype.hudfightUpdate = function () {
        var hud = document.querySelector('#hud-fight');
        hud.textContent = '';
    };
    GameLogic.prototype.moveMonsters = function () {
        this.moveBoss();
        this.moveSkeletons();
        this.hudfightUpdate();
    };
    GameLogic.prototype.checkFreeDirectionBoss = function (boss) {
        // 0th index = up, 1 == down, 2 == left, 3 == right  
        var freeDirections = [];
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
    };
    GameLogic.prototype.moveBoss = function () {
        var pickRandomDirection = (Math.floor(Math.random() * 4));
        var freeDirectionArray = this.checkFreeDirectionBoss(this.boss);
        for (var i = 0; i < freeDirectionArray.length; i) {
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
    };
    GameLogic.prototype.checkFreeDirectionsSkeleton = function (skeleton) {
        var freeDirections = [];
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
    };
    GameLogic.prototype.moveSkeletons = function () {
        for (var j = 0; j < this.npcs.length; j++) {
            var pickRandomDirection = (Math.floor(Math.random() * 4));
            var freeDirectionArray = this.checkFreeDirectionsSkeleton(this.npcs[j]);
            for (var i = 0; i < freeDirectionArray.length; i) {
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
    };
    GameLogic.prototype.isThisTileOccupied = function (x, y) {
        if (x === this.boss.getBossX() && y === this.boss.getBossY()) {
            return true;
        }
        else if (this.areCoordinatesIdentical(x, y)) {
            return true;
        }
        else {
            return false;
        }
    };
    GameLogic.prototype.checkForBattle = function () {
        if (this.isThisTileOccupied(this.player.getHeroX(), this.player.getHeroY())) {
            return true;
        }
        else {
            return false;
        }
    };
    GameLogic.prototype.battle = function () {
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
    };
    GameLogic.prototype.getMonster = function (x, y) {
        return this.npcs.find(function (skeleton) { return skeleton.getSkeletonX() === x && skeleton.getSkeletonY() === y; });
    };
    GameLogic.prototype.gameOver = function () {
        var hud = document.querySelector('#game-over');
        hud.textContent = 'Game over!';
        this.drawFloor(this.player.getHeroX(), this.player.getHeroY());
        this.player = null;
    };
    GameLogic.prototype.removeMonster = function (x, y) {
        var skeletonToDelete = this.npcs.find(function (skeleton) { return skeleton.getSkeletonX() === x && skeleton.getSkeletonY() === y; });
        for (var i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i] === skeletonToDelete) {
                this.npcs.splice(i, 1);
            }
        }
    };
    GameLogic.prototype.checkVictoryConditions = function () {
        if (this.player.hasHeroKey() && this.boss.isBossAlive() === false) {
            return true;
        }
        else {
            return false;
        }
    };
    return GameLogic;
}(Monster_1.Monster));
exports.GameLogic = GameLogic;
