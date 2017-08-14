import {TimelineMax, TweenMax} from "gsap";

export default class MapView {
	constructor(mapModel, map){
		this.cells = [];
		this.mapModel = mapModel;
		this.map = map;

		this.pixi = new PIXI.Container();

		map.forEach(cell => {
			let cellView = this.createCellView(cell);
			cell.view = cellView;

			this.pixi.addChild( cellView );
			this.cells.push( cellView );
		})
	}

	createCellView(cell){
		let cellView = new PIXI.Container();

		cellView.model = cell;

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
			['tap', 'click'].forEach(event=>{ cellView.on(event, this.viewAvailableSquare, this) });

			let active = new PIXI.Graphics();

			active.beginFill(cell.empty ? 0xC3EEE8 : 0xEE4D63);
			active.lineStyle(1, cell.empty ? 0x5159EE : 0xEEC78C, 1);
			active.moveTo(0, 0).lineTo(100, 0).lineTo(100, 100).lineTo(0, 100).lineTo(0, 0).endFill();
			active.alpha = 0;

			cellView.active = active;
			cellView.addChild( active );
		}

		cellView.setActive = function(){
			if(this._active){
				this.active.alpha = 0;
				this.tween.kill();
			} else {
				this.tween = new TweenMax(this.active, 0.3, {alpha: 0.75, repeat: -1, yoyo: true});
			}
			this._active = !this._active;
		}.bind(cellView);

		cellView.text = new PIXI.Text('', {fontFamily: 'Arial', fontSize: 20, fill: 0x0C3E74});
		cellView.text.anchor = {x: 0.5, y:0.5};
		cellView.text.position = {x: 50, y:50};
		cellView.addChild( cellView.text );

		return cellView;
	}

	cellClick(cell){
		if(cell._active){

			cell.active.alpha = 0;
			cell.tween.kill();

		} else {

			cell.tween = new TweenMax(cell.active, 0.3, {alpha: 0.75, repeat: -1, yoyo: true});

		}

		cell._active = !cell._active;
	}

	viewAvailableSquare(event){
		let clickedCell = event.currentTarget;

		if(clickedCell._active && clickedCell.model._trace === 0){
			this.map.forEach(cell => {
				delete cell._trace;
				if(cell.view._active){
					cell.view.setActive();
					cell.view.text.text = '';
				}
			});
		} else {
			this.map.forEach(cell => {
				delete cell._trace;
				if(cell.view._active){
					cell.view.setActive();
					cell.view.text.text = '';
				}
			});

			let availCells = this.mapModel.calculateAvailableCells(clickedCell.model, 5);
			availCells.forEach(cell => cell.view.setActive());
		}
	}
}
