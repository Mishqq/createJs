import {TimelineMax, TweenMax, Power0} from "gsap";
import {personTypes} from './../../defaults';

const states = ['canWalk', 'canAttack', 'disable'];

export default class ViewModel {
	constructor({personType, level, clickCallback}){
		let pixi = new PIXI.Container();
		pixi.interactive = true;
		pixi.buttonMode = true;


		let graphics = new PIXI.Graphics();
		graphics.lineStyle(1, 0x88EEE8, 1).beginFill(0x394CEE, 0.75).drawCircle(0, 0, 10).endFill();
		pixi.addChild( graphics );

        let data = {
            speed: personTypes[personType].level[level].speed,
            health: personTypes[personType].level[level].health,
            power: personTypes[personType].level[level].power,
            attackRange: personTypes[personType].level[level].attackRange,
            state: states[0],
            pixi,
			changeState: (idx)=>data.state = states[idx]
        };

        ['tap', 'click'].forEach(eventName=> pixi.on(eventName, event =>clickCallback(event, data)));

		return data;
	}
}
