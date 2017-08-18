import gameModel from './gameModel';
import Map from './../components/map/model';
import Mech from './../components/mech/viewModel';

export default class GameController{
	constructor(app){
		this.stage = app.stage;
		this.gameModel = new gameModel();

		this.gameModel.stage = app.stage;
		this.gameModel.map = new Map((...rest)=>this.clickCell(...rest));
		app.stage.addChild( this.gameModel.map.pixi );

		//let pos = this.gameModel.map.getCoordsByColRow(1, 1);
		let cell = this.gameModel.map.getCellByColRow(1, 1);
		this.gameModel.addPerson( new Mech({radius: 10, cell}, (...rest)=>this.clickPerson(...rest)) );

		cell = this.gameModel.map.getCellByColRow(14, 5);
		this.gameModel.addPerson( new Mech({radius: 10, cell}, (...rest)=>this.clickPerson(...rest)) );

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
			GM.activePerson.changePosition(cell);

			GM.map.hideAvailableSquare();
			GM.currentActiveSquare = null;
		}
	}
}