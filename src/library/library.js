import {TimelineMax, TweenMax, Power0} from "gsap";

import Map from './components/map/model';
import Person from './components/person/viewModel';

const library = {

    createMap: (...args)=> new Map(...args),

    newPerson: (...args)=> new Person(...args),

    addPerson: (person, cell, container)=>{
        person.pixi.position = {x: cell.view.center.x, y: cell.view.center.y};
        person.cell = cell;

        cell.person = person;
        cell.movable = false;

        container.addChild( person.pixi );
    },

    removePerson: (person)=>{
        // TODO: выпиливать слушатель клика
        person.cell.movable = true;
        person.cell.person = null;

        person = null;
    },

    changePosition: (person, way, startCell, endCell, callback)=>{

        let t1 = new TimelineMax();
        way.forEach((cell, idx) => {
            t1.to(person.pixi, 0.3, {
                x: cell.view.center.x, y: cell.view.center.y, easy: Power0.easeNone,
                onComplete: ()=>{if(idx === way.length-1) callback()}
            });
        });

        person.cell = endCell;

        startCell.movable = true;
        startCell.person = null;

        endCell.person = person.data;
        endCell.movable = false;
    }

};

export default library;