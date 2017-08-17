export default class gameModel {
	constructor(){
		this.stage = null;

		this.map = null;

		this.persons = [];
	}

	addPerson(person){
		this.persons.push( person );

		this.stage.addChild( person.pixi );
	}
}
