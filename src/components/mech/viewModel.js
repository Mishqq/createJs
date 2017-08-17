import {TimelineMax, TweenMax} from "gsap";
import {settings, cellTypes} from './../../defs';


export default class ViewModel {
	constructor({radius, x, y}){
		this._state = {
			position: null,
			viewPathSquare: false,
			viewFightSquare: false
		};

		this.pixi = new PIXI.Container();
		this.pixi.interactive = true;
		this.pixi.buttonMode = true;
		['tap', 'click'].forEach(event=>{ this.pixi.on(event, this.clickHandler, this) });

		let graphics = new PIXI.Graphics();
		graphics.lineStyle(1, 0x88EEE8, 1);
		graphics.beginFill(0x394CEE, 0.75);
		graphics.drawCircle(x, y, radius);
		graphics.endFill();
		this.pixi.addChild( graphics );
	}

	changePosition(endPoint){

	}

	clickHandler(event){
		event.stopPropagation();

		console.log(this);
	}
}
