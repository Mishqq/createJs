import MapView from './view';
import {settings, cellTypes, mapTemplate as map} from './../../defs';

export default class Model{
	constructor(clickCallback){
		this.mapMatrix = [];
		this.map = this.createMapModel(settings.cells);

		let view = new MapView( this, this.map, clickCallback );

		this.pixi = view.pixi;
	}

	/**
	 * Функция создаёт объект-модель сцены
	 * @param w - параметр ширины сцены
	 * @returns {Array}
	 */
	createMapModel(w){
		let mapModel = [];

		for(let y=0; y<map.length/w; y+=1){
			this.mapMatrix.push([]);

			for(let x=0; x<w; x+=1){
				let newCell = this.createCell(w*y+x, x, y, map[w*y+x]);
				mapModel.push( newCell );

				this.mapMatrix[y].push(newCell.movable ? 0 : 1);
			}
		}

		this.linkCells(mapModel, w);

		return mapModel;
	}

	/**
	 * Шаблон одной ячейки для модели сцены
	 * @param idx
	 * @param col
	 * @param row
	 * @param content ~ cellTypes: x, w, f...
	 * @returns {{idx: null, col: null, row: null, movable: null, type: null, neighbors: Array}}
	 */
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

		template.textColor = cellTypes[content].textColor;

		template.movable = cellTypes[content].movable;
		if(template.movable)
			template.movableCf = cellTypes[content].movableCf;

		return template;
	}

	/**
	 * Рекурсивное связывание соседних ячеек
	 * @param mapModel
	 * @param w
	 */
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

	/**
	 * Функция рассчета доступных для передвижения ячеек
	 * @param cell - точка отсчета (объект ячейки в сцене)
	 * @param steps - радиус обзора (скорость объекта)
	 * @returns {Array}
	 */
	calculateAvailableCells(cell, steps){
		let cellArr = [];

		let setTrace = (arr, startTrace)=>{
			arr = arr.filter(cell => cell.movable && (startTrace + cell.movableCf) <= steps);

			arr.forEach(cell => {
				if(cell._trace !== undefined && startTrace + cell.movableCf > cell._trace){
					return false;
				} else {
					cell._trace = startTrace + cell.movableCf;
				}

				cell.view.text.text = cell._trace;
				if(!~cellArr.indexOf(cell)) cellArr.push(cell);

				setTrace(cell.neighbors, cell._trace);
			});

		};
		setTrace(cell.neighbors, 0);

		return cellArr;
	}


	/**
	 * Функция возвращает объект ячейки в сцене по координатам
	 * @param col
	 * @param row
	 * @returns {T}
	 */
	getCellByColRow(col, row){
		return this.map.find(cell => cell.row === row && cell.col === col);
	}

	/**
	 * Подстветка доступной для передвижения объекта области
	 * @param cell
	 * @param speed
	 */
	viewAvailableSquare(cell, speed){
		// TODO: неявное поведение hideAvailableSquare, переписать
		let availCells = this.calculateAvailableCells(cell, speed);
		availCells.forEach(cell => cell.view.setActive());
		return availCells;
	}

	/**
	 * Скрытие области подсветки доступной для перемещения области
	 */
	hideAvailableSquare(){
		this.map.forEach(cell => {
			delete cell._trace;
			if(cell.view._active){
				cell.view.setActive();
				cell.view.text.text = '';
			}
		});
	}

	/**
	 * Апдейт Матрицы для pathFinder
	 */
	updateMatrix(){
		for(let y=0; y<this.map.length/settings.cells; y+=1){
			for(let x=0; x<settings.cells; x+=1){
				this.mapMatrix[y][x] = this.map[settings.cells*y+x].movable ? 0 : 1;
			}
		}
	}
}
