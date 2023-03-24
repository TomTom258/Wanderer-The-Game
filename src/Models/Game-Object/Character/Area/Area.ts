import { Tile } from "../Tile/Tile";

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

export abstract class Area extends Tile{
    protected floor: any;
    protected wall: any;
    protected map: number[][];
    protected previousPartialRotation: boolean;
    protected generatedMap: number [][];

    constructor() {
        super();    
        this.floor = document.getElementById('floor') as HTMLImageElement;
        this.wall = document.getElementById('wall') as HTMLImageElement;
        this.map = [
            [0,0,0,1,0,0,0,0,0,0],
            [0,0,0,1,0,1,0,1,1,0],
            [0,1,1,1,0,1,0,1,1,0],
            [0,0,0,0,0,1,0,0,0,0],
            [1,1,1,1,0,1,1,1,1,0],
            [0,1,0,1,0,0,0,0,0,0],
            [0,1,0,1,0,1,1,0,1,0],
            [0,0,0,0,0,1,1,0,1,0],
            [0,1,1,1,0,0,0,0,1,0],
            [0,0,0,1,0,1,1,0,0,0]
        ];
        this.previousPartialRotation = false;
    }


    rotateMap(matrix: number [][]): number[][] {
        let n: number = matrix.length;
    
        for (let i: number = 0; i < n; i++) {
          for (let j: number = i; j < n; j++) {
            let temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
          }
        }
    
        for (let i: number = 0; i < n; i++) {
          for (let j: number = 0; j < (n/2); j++) {
            let temp = matrix[i][j];
            matrix[i][j] = matrix[i][n - 1 - j];
            matrix[i][n - 1 - j] = temp;
          }
        }
    
        return matrix;
    }

    partialRotation(matrix: number [][]): number[][] {
        let n: number = matrix.length;
    
        for (let i: number = 0; i < n; i++) {
          for (let j: number = i; j < n; j++) {
            let temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
          }
        }
    
        return matrix;
    
    }
    
    createMap(): any {
        const numberOfRotations: number = Math.floor(Math.random() * (4 - 1) + 1);
        let partialRotation: boolean = false;
        let modifiedMap: number [][] = [[]];

        if (Math.floor(Math.random() * 2) === 0) {
            partialRotation = false;
        }

        else {
            partialRotation = true;
        }

        if (partialRotation !== this.previousPartialRotation) {
            for (let i: number = 0; i < numberOfRotations; i++) {
                modifiedMap = this.partialRotation(this.map);
                this.previousPartialRotation = true;
            }
        }

        else {
            for (let i: number = 0; i < numberOfRotations; i++) {
                 modifiedMap = this.rotateMap(this.map);
                 this.previousPartialRotation = false;
            }
        }

        this.generatedMap = modifiedMap;

        for (let i: number = 0; i < modifiedMap.length; i++) {
            for (let j: number = 0; j < modifiedMap.length; j++) {
                    
                if (modifiedMap[i][j] === 0) {
                    ctx.drawImage(this.floor, i * 72, j * 72);
                }
          
                else {
                    ctx.drawImage(this.wall, i * 72, j * 72);
                }  
            }
        }    
    }

    isThisAWall(x: number, y: number): boolean {
        
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

    isThisEdgeOfMapTop(y: number): boolean {
        if (y - 72 < 0) {
            return true;
        }

        else {
            return false;
        }
    }

    isThisEdgeOfMapBottom(y: number): boolean {
        if (y + 72 > 648) {
            return true;
        }

        else {
            return false;
        }
    }

    isThisEdgeOfMapLeft(x: number): boolean {
        if (x - 72 < 0) {
            return true;
        }

        else {
            return false;
        }
    }

    isThisEdgeOfMapRight(x: number): boolean {
        if (x + 72 > 648) {
            return true;
        }

        else {
            return false;
        }
    }
}
