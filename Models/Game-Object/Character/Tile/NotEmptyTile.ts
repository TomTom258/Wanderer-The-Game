import { Tile } from "./Tile";

export abstract class NotEmptyTile extends Tile{
    protected wall: any;

    abstract getWall(): any
}

