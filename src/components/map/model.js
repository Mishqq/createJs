import MapView from './view';
import {settings, cellTypes, mapTemplate as map} from './../../defs';

export default class Model{
	constructor(){

		this.map = this.createMapModel(settings.cells);

		let view = new MapView( this, this.map );

		this.pixi = view.pixi;

	}

	createMapModel(w){
		let mapModel = [];

		for(let y=0; y<map.length/w; y+=1){
			for(let x=0; x<w; x+=1){

				mapModel.push( this.createCell(w*y+x, x, y, map[w*y+x]) );

			}
		}

		this.linkCells(mapModel, w);

		return mapModel;
	}

	createCell(idx, col, row, content){
		content = content === ' ' ? 'empty' : content;

		let template = {
			idx: null,
			col: null,
			row: null,
			movable: null,
			type: null,
			neighbors: []
		};

		template.idx = idx;
		template.col = col;
		template.row = row;
		template.type = content;

		template.movable = cellTypes[content].movable;
		if(template.movable)
			template.movableCf = cellTypes[content].movableCf;

		return template;
	}

	linkCells(mapModel, w){
		for(let i=0; i<mapModel.length; i+=1){
			let cell = mapModel[i];

			if(mapModel[ w*(cell.row-1) + cell.col ]) cell.neighbors.push( mapModel[ w*(cell.row-1) + cell.col ] );

			if(mapModel[ w*cell.row + cell.col+1 ] && mapModel[ w*cell.row + cell.col+1 ].row === cell.row)
				cell.neighbors.push( mapModel[ w*cell.row + cell.col+1 ] );

			if(mapModel[ w*(cell.row+1) + cell.col ]) cell.neighbors.push( mapModel[ w*(cell.row+1) + cell.col ] );

			if(mapModel[ w*cell.row + cell.col-1 ] && mapModel[ w*cell.row + cell.col-1 ].row === cell.row)
				cell.neighbors.push( mapModel[ w*cell.row + cell.col-1 ] );
		}
	}

	calculateAvailableCells(cell, steps){
		let cellArr = [];

		let setTrace = (arr, prevTrace, start)=>{
			arr = arr.filter(cell => cell.movable && (prevTrace + cell.movableCf) <= steps);

			arr.forEach(cell => {
				if(start){
					cell._trace = 0;
				} else {
					if(cell._trace !== undefined && prevTrace + cell.movableCf > cell._trace){
						return false;
					} else {
						cell._trace = prevTrace + cell.movableCf;
					}
				}

				cell.view.text.text = cell._trace;
				if(!~cellArr.indexOf(cell)) cellArr.push(cell);

				setTrace(cell.neighbors, cell._trace);
			});

		};
		setTrace([cell], 0, true);

		return cellArr;
	}
}
