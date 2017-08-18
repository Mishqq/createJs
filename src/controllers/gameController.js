import gameModel from './gameModel';
import Map from './../components/map/model';
import Person from './../components/mech/viewModel';
import PF from 'pathfinding';

export default class GameController{
	constructor(app){
		this.stage = app.stage;
		this.gameModel = new gameModel();

		this.gameModel.stage = app.stage;
		this.gameModel.map = new Map((...rest)=>this.clickCell(...rest));
		app.stage.addChild( this.gameModel.map.pixi );

		//let pos = this.gameModel.map.getCoordsByColRow(1, 1);
		let cell = this.gameModel.map.getCellByColRow(1, 1);
		this.gameModel.addPerson( new Person({radius: 10, cell}, (...rest)=>this.clickPerson(...rest)) );

		cell = this.gameModel.map.getCellByColRow(14, 5);
		this.gameModel.addPerson( new Person({radius: 10, cell}, (...rest)=>this.clickPerson(...rest)) );

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
		let finder = new PF.BestFirstFinder({
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
}