import gameModel from './gameModel';
import Map from './../components/map/model';
import Mech from './../components/mech/viewModel';

export default class GameController{
	constructor(app){
		this.stage = app.stage;
		this.gameModel = new gameModel();

		this.gameModel.stage = app.stage;
		this.gameModel.map = new Map();
		app.stage.addChild( this.gameModel.map.pixi );

		this.gameModel.addPerson( new Mech({radius: 10, x: 45, y: 45}) );

		app.start();
	}
}