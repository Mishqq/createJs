import MapView from './view';

const map = [
	'x', ' ', ' ', 'x', ' ', 'x', 'x', 'x', ' ', ' ',
	'x', ' ', ' ', 'x', ' ', ' ', ' ', 'x', ' ', ' ',
	'x', ' ', ' ', ' ', ' ', ' ', ' ', 'x', ' ', ' ',
	'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
	' ', ' ', 'x', 'x', 'x', ' ', ' ', 'x', 'x', ' ',
	' ', 'x', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
	' ', 'x', ' ', 'x', ' ', 'x', ' ', ' ', ' ', 'x',
	' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x',
	'x', 'x', 'x', ' ', 'x', ' ', 'x', ' ', ' ', 'x',
	' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'x',
];

export default class Model{
	constructor(){

		this.map = this.createMapModel(10);

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
		let template = {
			idx: null,
			col: null,
			row: null,
			empty: null,
			neighbors: []
		};

		template.idx = idx;
		template.col = col;
		template.row = row;
		template.empty = content !== 'x';

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

		let setTrace = (arr, trace)=>{
			if(trace > steps) return false;

			arr.forEach(cell => {
				if(cell.empty){

					if(cell._trace === undefined){
						cell._trace = trace;
					} else {
						cell._trace = trace < cell._trace ? trace : cell._trace;
					}

					cell.view.text.text = cell._trace;
					if(!~cellArr.indexOf(cell)) cellArr.push(cell);

					setTrace(cell.neighbors, trace+1);
				}
			});

		};
		setTrace([cell], 0);

		return cellArr;
	}
}
