import {TimelineMax, TweenMax} from "gsap";
import {settings, cellTypes} from './../../defs';

let cellWidth = settings.width / settings.cells;

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
		let view = new PIXI.Container();

		view.model = cell;
		view.interactive = cell.movable;
		view.buttonMode = cell.movable;
		view.position = {x: cell.col*cellWidth, y: cell.row*cellWidth};


		let bg = new PIXI.Graphics();
		bg.beginFill(cellTypes[cell.type].bg);
		bg.lineStyle(1, cellTypes[cell.type].border, 1);
		bg.moveTo(0, 0).lineTo(cellWidth, 0).lineTo(cellWidth, cellWidth).lineTo(0, cellWidth).lineTo(0, 0).endFill();

		view.bg = bg;
		view.addChild( bg );

		if(cell.movable){
			['tap', 'click'].forEach(event=>{ view.on(event, this.viewAvailableSquare, this) });

			let active = new PIXI.Graphics();

			active.beginFill(cellTypes[cell.type].bgActive);
			active.lineStyle(1, cellTypes[cell.type].border, 1);
			active.moveTo(0, 0).lineTo(cellWidth, 0).lineTo(cellWidth, cellWidth).lineTo(0, cellWidth).lineTo(0, 0).endFill();
			active.alpha = 0;

			view.active = active;
			view.addChild( active );
		}

		view.setActive = function(){
			if(this._active){
				this.active.alpha = 0;
				this.tween.kill();
			} else {
				this.tween = new TweenMax(this.active, 0.3, {alpha: 0.75, repeat: -1, yoyo: true});
			}
			this._active = !this._active;
		}.bind(view);

		view.text = new PIXI.Text('', {fontFamily: 'Arial', fontSize: 18, fill: 0x0C3E74});
		view.text.anchor = {x: 0.5, y:0.5};
		view.text.position = {x: cellWidth/2, y:cellWidth/2};
		view.addChild( view.text );

		return view;
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
