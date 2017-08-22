import PF from 'pathfinding';
import Hammer from 'hammerjs'
import {settings, cellTypes, mapTemplate} from './../defs';
import GL from './../library/library';

let mapSize = settings.cellSize * settings.cells;

export default class GameController{
	constructor(app){
        this.map = GL.createMap({
            mapTemplate: mapTemplate,
			mapWidthCell: settings.cells,
			mapHeightCell: settings.cells,
			cellWidth: settings.cellSize,
			cellHeight: settings.cellSize,
			cellTypes,
			cellClick: (...rest)=>this.clickCell(...rest)
		});

        let person = GL.newPerson({
			personType: 'fast',
			level: 0,
			clickCallback: (...args)=>{ this.clickPerson(...args) }
        });

        this.swipeContainer = new PIXI.Container();
        this.swipeContainer.position = settings.mapPosition;
        this.swipeContainer.addChild( this.map.pixi );
        app.stage.addChild( this.swipeContainer );
        let canvas = document.querySelector('#game canvas');
        let hammertime = new Hammer(canvas);
        hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
        hammertime.on('pan', (e)=>this.panMap(e));
        hammertime.on('panstart', (e)=>{
            let start = {x: e.center.x - canvas.offsetLeft, y: e.center.y - canvas.offsetTop};

            this.swipeFlag = start.x >= settings.swipeSquare.x &&
                start.x <= settings.swipeSquare.x + settings.swipeSquare.w &&
                start.y >= settings.swipeSquare.y &&
                start.y <= settings.swipeSquare.y + settings.swipeSquare.h
        });

        GL.addPerson(person, this.map.getCellByColRow(1, 1), this.swipeContainer);

		app.start();
	}

	clickPerson(e, person){
		if( !this.activePerson ){

            this.activePerson = person;
            this.square = this.map.viewSquare(person.cell, person.speed);
            person.state = 'canWalk';

		} else if( this.activePerson && person.state === 'canWalk' ){

            this.map.hideSquare();
            person.state = 'canFight';

		} else if( this.activePerson && person.state === 'canFight' ) {

            this.map.hideSquare();
            this.square = this.map.viewSquare(person.cell, person.attackRange);
            this.activePerson = null;
            person.state = 'disable';

		} else if( this.activePerson && person.state === 'disable' ) {

            this.map.hideSquare();
            this.activePerson = null;

		}
	}

	clickCell(cell){
		if(this.square && this.activePerson && this.activePerson.state === 'canWalk'){

            let way = this.createWay(this.activePerson.cell, cell);

            GL.changePosition(this.activePerson,
				way,
				this.activePerson.cell,
				cell,
				()=>{
            		this.map.hideSquare();
                    this.map.viewSquare(this.activePerson.cell, this.activePerson.attackRange);
                    this.activePerson.state = 'canFight';
            	})
		} else if( this.activePerson && this.activePerson.state === 'canFight' ){

            console.log('Отаке ➥');
            this.map.hideSquare();
            this.activePerson = null;

		}

	}

	createWay(startCell, endCell){
		let grid = new PF.Grid(this.map.mapMatrix);
		let finder = new PF.BreadthFirstFinder({
			allowDiagonal: false
		});
		let path = finder.findPath(startCell.col, startCell.row, endCell.col, endCell.row, grid);

		let rollUpIdxs = [];
		for(let i=2; i<path.length; i+=1){
			if(path[i][0] !== path[i-2][0] && path[i][1] !== path[i-2][1]) rollUpIdxs.push(i-1);
		}

		rollUpIdxs.push( path.length-1 );
		let rollUpPath = [];
		rollUpIdxs.forEach(idx => rollUpPath.push( path[idx] ));
		path = rollUpPath;

		let convertPath = [];
		path.forEach(path => convertPath.push(this.map.getCellByColRow(path[0], path[1])));
		return convertPath;
	}

    swipeMap(swipeEvent){
        //console.log('swipeEvent ➥',swipeEvent);
    }

    panMap(panEvent){
        if(!this.swipeFlag) return;

    	let {swipeContainer: swCnt} = this;

        if(swCnt.x + panEvent.deltaX * settings.velocity > 0) {
            swCnt.x = 0;
        } else if(Math.abs(swCnt.x + panEvent.deltaX * settings.velocity) >= (mapSize - settings.width)){
            swCnt.x = -(mapSize - settings.width);
		} else {
            swCnt.x += panEvent.deltaX * settings.velocity;
        }

        if(swCnt.y + panEvent.deltaY * settings.velocity - settings.bars.top.h > 0) {
            swCnt.y = settings.mapPosition.y;
        } else if(Math.abs(swCnt.y + panEvent.deltaY * settings.velocity) >= (mapSize - settings.width + settings.bars.bottom.h)){
            swCnt.y = -(mapSize - settings.width + settings.bars.bottom.h);
        } else {
            swCnt.y += panEvent.deltaY * settings.velocity;
        }
    }
}