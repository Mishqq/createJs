import {TimelineMax, TweenMax} from "gsap";

export default class MapView {
	constructor(mapModel){
		this.cells = [];

		this.pixi = new PIXI.Container();

		mapModel.forEach(cell => {
			let cellView = this.createCellView(cell);
			cell.view = cellView;

			this.pixi.addChild( cellView );
			this.cells.push( cellView );
		})
	}

	createCellView(cell){
		let cellView = new PIXI.Container();

		let bg = new PIXI.Graphics();

		cellView.position = {x: cell.col*100, y: cell.row*100};

		bg.beginFill(cell.empty ? 0x5AD5EE : 0xEE4D63);
		bg.lineStyle(1, cell.empty ? 0x5159EE : 0xEEC78C, 1);
		bg.moveTo(0, 0).lineTo(100, 0).lineTo(100, 100).lineTo(0, 100).lineTo(0, 0).endFill();

		cellView.bg = bg;
		cellView.addChild( bg );

		if(cell.empty){
			cellView.interactive = true;
			cellView.buttonMode = true;
			['tap', 'click'].forEach((event)=>{ cellView.on(event, this.cellClick) });

			let active = new PIXI.Graphics();

			active.beginFill(cell.empty ? 0xC3EEE8 : 0xEE4D63);
			active.lineStyle(1, cell.empty ? 0x5159EE : 0xEEC78C, 1);
			active.moveTo(0, 0).lineTo(100, 0).lineTo(100, 100).lineTo(0, 100).lineTo(0, 0).endFill();
			active.alpha = 0;

			cellView.active = active;
			cellView.addChild( active );
		}

		return cellView;
	}

	cellClick(){
		if(this._clicked){

			this.active.alpha = 0;
			this.tween.kill();

		} else {

			this.tween = new TweenMax(this.active, 0.3, {alpha: 0.75, repeat: -1, yoyo: true});

		}

		this._clicked = !this._clicked;
	}
}
