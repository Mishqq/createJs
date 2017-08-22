import MapView from './view';

export default class Model{
	constructor({mapTemplate, mapWidthCell, mapHeightCell, cellWidth, cellHeight, cellTypes, cellClick}){

		this.mapMatrix = [];

		this.map = this.createMapModel(
			mapTemplate || [' ', ' ', ' ', ' '],
			mapWidthCell || 30,
			mapHeightCell || 30,
			cellTypes || {
                empty: {
                    bg: 0xF0ECBE,
                    bgActive: 0xDAB363,
                    border: 0x817D65,
                    movable: true,
                    movableCf: 1,
                    textColor: 0xBBBD73,
                    text: '',
                    texture: ''
                }
            });

		let view = new MapView( this.map, cellWidth, cellHeight, cellTypes, cellClick );

		this.pixi = view.pixi;
	}

    /**
	 * Функция создаёт объект-модель сцены
     * @param mapTemplate
     * @param width
     * @param height
     * @param cellTypes
     * @returns {Array}
     */
	createMapModel(mapTemplate, width, height, cellTypes){
		let mapModel = [];

        height = height || mapTemplate.length/width;

		for(let y=0; y<height; y+=1){
			this.mapMatrix.push([]);

			for(let x=0; x<width; x+=1){
				let newCell = this.createCell(width*y+x, x, y, mapTemplate[width*y+x], cellTypes);
				mapModel.push( newCell );

				this.mapMatrix[y].push(newCell.movable ? 0 : 1);
			}
		}

		this.linkCells(mapModel, width);

		return mapModel;
	}

	/**
	 * Шаблон одной ячейки для модели сцены
	 * @param idx
	 * @param col
	 * @param row
	 * @param type ~ cellTypes: x, w, f...
	 * @param cellTypes
	 * @returns {{idx: null, col: null, row: null, movable: null, type: null, neighbors: Array}}
	 */
	createCell(idx, col, row, type, cellTypes){
        type = type === ' ' ? 'empty' : type;

		let template = {
			idx: idx || null,
			col: col || null,
			row: row || null,
			movable: null,
			type: type || null,
			neighbors: []
		};

		template.textColor = cellTypes[type].textColor;

		template.movable = cellTypes[type].movable;
		if(template.movable)
			template.movableCf = cellTypes[type].movableCf;

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
	 * @param distance
	 */
	viewSquare(cell, distance){
		// TODO: неявное поведение hideAvailableSquare, переписать
		let availCells = this.calculateAvailableCells(cell, distance);
		availCells.forEach(cell => cell.view.setActive());
		return availCells;
	}

	/**
	 * Скрытие области подсветки доступной для перемещения области
	 */
    hideSquare(){
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
