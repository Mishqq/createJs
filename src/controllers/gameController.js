import Map from './../components/map/model';

export default class GameController{
	constructor(app){
		this.stage = app.stage;

		this.map = new Map();
		app.stage.addChild( this.map.pixi );

		app.start();
	}
}