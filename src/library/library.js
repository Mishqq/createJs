import PF from 'pathfinding';
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

    addPersons: (persons)=>{

        persons.forEach( person => library.addPerson(person[0], person[1], person[2]) )

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
    },

    findPath: (map, startCell, endCell)=>{
        let grid = new PF.Grid(map.getMatrix());
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
        path.forEach(path => convertPath.push(map.getCellByColRow(path[0], path[1])));
        return convertPath;
    }

};

export default library;