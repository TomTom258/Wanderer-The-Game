import { Tile } from "./Tile";

export abstract class EmptyTile extends Tile{
    protected floor: any;

    abstract getFloor(): any
}