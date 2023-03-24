'use strict';

import { GameLogic } from "./GameLogic/gameLogic";

const canvas = document.querySelector('.main-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const gameLogic = new GameLogic();

window.onload = () => {
  gameLogic.startGame();
};

function onKeyPress(event: any) {
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