import {TimelineMax, TweenMax} from "gsap";
import {settings, cellTypes} from './../../defs';


export default class ViewModel {
	constructor({radius, cell}, clickCallback){
		this.clickCallback = clickCallback;

		cell.movable = false;

		this.state = {
			cell: cell,
			position: cell.view.center,
			speed: 4,
			active: false,
			viewPathSquare: false,
			viewFightSquare: false
		};

		this.pixi = new PIXI.Container();
		this.pixi.position = {x: cell.view.center.x, y: cell.view.center.y};
		this.pixi.interactive = true;
		this.pixi.buttonMode = true;
		['tap', 'click'].forEach(event=>{ this.pixi.on(event, this.clickHandler, this) });

		let graphics = new PIXI.Graphics();
		graphics.lineStyle(1, 0x88EEE8, 1);
		graphics.beginFill(0x394CEE, 0.75);
		graphics.drawCircle(0, 0, radius);
		graphics.endFill();
		this.pixi.addChild( graphics );
	}

	changePosition(endCell){
		this.state.cell.movable = true;

		TweenMax.to(this.pixi, 0.75, {
			x: endCell.view.center.x,
			y: endCell.view.center.y,
		});

		endCell.movable = false;
		this.state.cell = endCell;
		this.active = false;
	}

	clickHandler(event){
		this.active = !this.active;

		this.clickCallback(event, this);
	}

	get active(){
		return this.state.active;
	}
	set active(status){
		this.state.active = status;
	}
}
