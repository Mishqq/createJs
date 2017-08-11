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

		let map = this.createMapModel(10);

		let view = new MapView( map );

		this.pixi = view.pixi;

	}

	createMapModel(w){
		let mapModel = [];

		for(let y=0; y<map.length/w; y+=1){
			for(let x=0; x<w; x+=1){

				mapModel.push( this.createCell(w*y+x, x, y, map[w*y+x]) );

			}
		}

		return mapModel;
	}

	createCell(idx, col, row, content){
		let template = {
			idx: null,
			col: null,
			row: null,
			empty: null
		};

		template.idx = idx;
		template.col = col;
		template.row = row;
		template.empty = content !== 'x';

		return template;
	}
}
