import {TimelineMax, TweenMax, Power0} from "gsap";
import {settings, cellTypes, personTypes} from './../../defs';


export default class ViewModel {
	constructor({person, level, cell}, clickCallback){
		this.clickCallback = clickCallback;

        cell.movable = false;

		this.person = {
			cell: cell,
			position: cell.view.center,
			speed: personTypes[person].level[level].speed,
			health: personTypes[person].level[level].health,
			power: personTypes[person].level[level].power,
			attackRange: personTypes[person].level[level].attackRange,
			active: false,
			status: 'walk'
		};

        cell.person = this.person;

		this.pixi = new PIXI.Container();
		this.pixi.position = {x: cell.view.center.x, y: cell.view.center.y};
		this.pixi.interactive = true;
		this.pixi.buttonMode = true;
		['tap', 'click'].forEach(event=>{ this.pixi.on(event, this.clickHandler, this) });

		let graphics = new PIXI.Graphics();
		graphics
			.lineStyle(1, 0x88EEE8, 1)
			.beginFill(0x394CEE, 0.75)
			.drawCircle(0, 0, 10)
			.endFill();
		this.pixi.addChild( graphics );
	}

	changePosition(arr, startCell, endCell, callback){
		let t1 = new TimelineMax();
		arr.forEach((cell, idx) => {
			t1.to(this.pixi, 0.3, {
				x: cell.view.center.x,
				y: cell.view.center.y,
				easy: Power0.easeNone,
				onComplete: ()=>{if(idx === arr.length-1) callback()}
			});
		});

		startCell.movable = true;
        startCell.person = null;

        endCell.person = this.person;
        endCell.movable = false;
		this.person.cell = endCell;
		this.active = false;
	}

	clickHandler(event){
		this.active = !this.active;

		this.clickCallback(event, this);
	}

	get active(){
		return this.person.active;
	}
	set active(status){
		this.person.active = status;
	}
}
