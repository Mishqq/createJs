export default class gameModel {
	constructor(){
		this.stage = null;

		this.map = null;

		this.persons = [];
	}

	addPerson(person){
		this.persons.push( person );

		this.stage.addChild( person.pixi );

		this.map.updateMatrix();
	}

	setActivePerson(person){
		// this.persons.forEach(somePerson => somePerson.active = false);
		//
		// person.active = this.activePerson !== person;
		// this.activePerson = this.activePerson !== person ?person : undefined;

		this.activePerson = person;
	}
}
