import * as PIXI from 'pixi.js';
import css from './styles/app.sass'
import * as createJs from 'createjs-module';
import GameController from './controllers/gameController';
import {settings} from './defs';

window['PIXI'] = PIXI;

const app = new PIXI.Application(settings.width, settings.height, {backgroundColor: 0x1099bb, antialias: true});
document.body.querySelector('#game').appendChild(app.view);

app.stop();

let gameController = new GameController(app);


