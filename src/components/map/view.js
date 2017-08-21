import {TimelineMax, TweenMax} from "gsap";
import {settings, cellTypes} from './../../defs';
import Hammer from 'hammerjs';

let cellWidth = settings.cellSize;

export default class MapView {
	constructor(mapModel, map, clickCallback){
        this.cells = [];
		this.mapModel = mapModel;
		this.map = map;
		this.clickCallback = clickCallback;

		this.pixi = new PIXI.Container();
        this.pixi.position = settings.mapPosition;

		map.forEach(cell => {
			let cellView = this.createCellView(cell);
			cell.view = cellView;

			this.pixi.addChild( cellView );
			this.cells.push( cellView );
		});
	}

	createCellView(cell){
		let view = new PIXI.Container();

		view.model = cell;
		view.interactive = cell.movable;
		view.buttonMode = cell.movable;
		view.position = {x: cell.col*cellWidth, y: cell.row*cellWidth};
		view.center = {x: cell.col*cellWidth + cellWidth/2, y: cell.row*cellWidth + cellWidth/2};

		let bg = new PIXI.Graphics();
		bg.beginFill(cellTypes[cell.type].bg);
		bg.lineStyle(1, cellTypes[cell.type].border, 1);
		bg.moveTo(0, 0).lineTo(cellWidth, 0).lineTo(cellWidth, cellWidth).lineTo(0, cellWidth).lineTo(0, 0).endFill();

		view.bg = bg;
		view.addChild( bg );

		if(cell.movable){
			let active = new PIXI.Graphics();

			['tap', 'click'].forEach(event=>{ view.on(event, this.cellClick, this) });

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

		view.angleText = new PIXI.Text(cell.movableCf || 'x', {fontFamily: 'Arial', fontSize: 10, fill: cell.textColor});
		view.angleText.anchor = {x: 1, y:1};
		view.angleText.position = {x: cellWidth-1, y: cellWidth-1};
		view.addChild( view.angleText );

		return view;
	}

	cellClick(event){
		let cell = event.currentTarget,
			cellModel = cell.model;

		this.clickCallback(cellModel);
	}
}
