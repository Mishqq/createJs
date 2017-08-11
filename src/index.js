import * as PIXI from 'pixi.js';
import css from './styles/app.sass'
import * as createJs from 'createjs-module';
import GameController from './controllers/gameController';

window['PIXI'] = PIXI;

const app = new PIXI.Application(1000, 1000, {backgroundColor: 0x1099bb, antialias: true});
document.body.appendChild(app.view);

app.stop();

let gameController = new GameController(app);


