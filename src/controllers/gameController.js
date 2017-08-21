import gameModel from './gameModel';
import Map from './../components/map/model';
import Person from '../components/person/viewModel';
import bottomPanel from '../components/info/bottomPanel';
import topPanel from '../components/info/topPanel';
import {settings} from './../defs';

import PF from 'pathfinding';

let mapSize = settings.cellSize * settings.cells;

export default class GameController{
	constructor(app){
		this.stage = app.stage;
		this.gameModel = new gameModel();

		this.gameModel.stage = app.stage;
		this.gameModel.map = new Map((...rest)=>this.clickCell(...rest));

		this.swipeContainer = new PIXI.Container();
        this.swipeContainer.addChild( this.gameModel.map.pixi );
		app.stage.addChild( this.swipeContainer );
        this.gameModel.swipeContainer = this.swipeContainer;

		//let pos = this.gameModel.map.getCoordsByColRow(1, 1);
		let cell = this.gameModel.map.getCellByColRow(1, 1);
		this.gameModel.addPerson( new Person({person:'fast', level:0, cell}, (...rest)=>this.clickPerson(...rest)) );

        cell = this.gameModel.map.getCellByColRow(13, 5);
        this.gameModel.addPerson( new Person({person:'middle', level:0, cell}, (...rest)=>this.clickPerson(...rest)) );

		cell = this.gameModel.map.getCellByColRow(14, 5);
		this.gameModel.addPerson( new Person({person:'strong', level:0, cell}, (...rest)=>this.clickPerson(...rest)) );

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
        // hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
        // hammertime.on('swipe', (e)=>this.swipeMap(e));

        this.bottomPanel = new bottomPanel();
        app.stage.addChild( this.bottomPanel.pixi );

        this.topPanel = new topPanel();
        app.stage.addChild( this.topPanel.pixi );

		app.start();
	}

	clickPerson(e, somePerson){
		let {gameModel: GM} = this;

		e.stopPropagation();

		GM.setActivePerson(somePerson);

		GM.map.hideAvailableSquare();
		GM.currentActiveSquare = null;

		if(somePerson.active){
			GM.currentActiveSquare = GM.map.viewAvailableSquare(somePerson.state.cell, somePerson.state.speed);
		}

	}

	clickCell(cell){
		let {gameModel: GM} = this;

		if(!GM.currentActiveSquare || !GM.currentActiveSquare.length) return;

		if(!!~GM.currentActiveSquare.indexOf(cell)){
			GM.activePerson.state.cell.movable = true;
			GM.activePerson.changePosition( this.createWay(GM.activePerson.state.cell, cell) );
			cell.movable = false;
			GM.map.updateMatrix();

			GM.map.hideAvailableSquare();
			GM.currentActiveSquare = null;
		}
	}

	createWay(startCell, endCell){
		let grid = new PF.Grid(this.gameModel.map.mapMatrix);
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
		path.forEach(path => convertPath.push(this.gameModel.map.getCellByColRow(path[0], path[1])));
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

        if(swCnt.y + panEvent.deltaY * settings.velocity > 0) {
            swCnt.y = 0;
        } else if(Math.abs(swCnt.y + panEvent.deltaY * settings.velocity) >= (mapSize - settings.height)){
            swCnt.y = -(mapSize - settings.height);
        } else {
            swCnt.y += panEvent.deltaY * settings.velocity;
        }
    }
}