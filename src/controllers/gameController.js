import {settings, cellTypes, mapTemplate} from './../defs';
import gameEngine from './../library/library';

export default class GameController{
	constructor(app){
	    let game = new gameEngine(Object.assign({}, settings, {canvas: document.querySelector('#game canvas')}));

        app.stage.addChild( game.pixi );
        game.createMap({
            mapTemplate: mapTemplate,
            mapWidthCell: settings.cells,
            mapHeightCell: settings.cells,
            cellWidth: settings.cellSize,
            cellHeight: settings.cellSize,
            cellTypes
        });
        game.addPerson({personType: 'fast'}, [1, 1]);
        game.addPerson({personType: 'middle'}, [2, 2]);

		app.start();
	}
}