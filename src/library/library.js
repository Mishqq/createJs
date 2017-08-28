import PF from 'pathfinding';
import Hammer from 'hammerjs'
import {TimelineMax, TweenMax, Power0} from "gsap";

import Map from './components/map/model';
import Person from './components/person/viewModel';

class gameEngine{
    constructor(settings){
        this.pixi = new PIXI.Container();

        for(let key in settings){

            if(key === 'mapContainer'){

                let swipeContainer = this.mapContainer = new PIXI.Container();
                swipeContainer.position = settings.mapContainer;
                this.pixi.addChild( swipeContainer );

                let canv = settings.canvas;
                let hammertime = new Hammer(canv);
                hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
                hammertime.on('pan', (e)=>this.panMap(e, swipeContainer, settings));
                hammertime.on('panstart', (e)=>{
                    let start = {x: e.center.x - canv.offsetLeft, y: e.center.y - canv.offsetTop};

                    this.swipeFlag = start.x >= settings.mapContainer.x &&
                        start.x <= settings.mapContainer.x + settings.mapContainer.w &&
                        start.y >= settings.mapContainer.y &&
                        start.y <= settings.mapContainer.y + settings.mapContainer.h
                });

            } else if(key === 'topBar'){

            } else if(key === 'bottomBar'){

            } else if(key === 'leftBar'){

            } else if(key === 'rightBar'){

            }

        }
    }


    panMap(panEvent, swCnt, settings){
        let velocity = settings.mapContainer.velocity,
            topBar = settings.topBar,
            bottomBar = settings.bottomBar,
            mapSize = settings.cellSize * settings.cells;

        if(!this.swipeFlag) return;

        if(swCnt.x + panEvent.deltaX * velocity > 0) {
            swCnt.x = 0;
        } else if(Math.abs(swCnt.x + panEvent.deltaX * velocity) >= (mapSize - settings.width)){
            swCnt.x = -(mapSize - settings.width);
        } else {
            swCnt.x += panEvent.deltaX * velocity;
        }

        if(swCnt.y + panEvent.deltaY * velocity - topBar.h > 0) {
            swCnt.y = settings.mapContainer.y;
        } else if(Math.abs(swCnt.y + panEvent.deltaY * velocity) >= (mapSize - settings.width + bottomBar.h)){
            swCnt.y = -(mapSize - settings.width + bottomBar.h);
        } else {
            swCnt.y += panEvent.deltaY * velocity;
        }
    }


    createMap(settings){
        settings = Object.assign({}, settings, {cellClick: (...rest)=>this.clickCell(...rest)});
        this.map = new Map(settings);
        this.mapContainer.addChild( this.map.pixi );
    }


    createPerson(settings, clickCallback){
        return new Person(settings, clickCallback)
    }


    removePerson(){}


    addPerson(personSettings, pos){
        if(!this.map) {
            console.log('Некуда добавлять персонажа. Создайте карту');
            return false;
        }

        let cell = this.map.getCellByColRow(pos[0], pos[1]);
        let person = this.createPerson(personSettings, (...args)=>this.clickPerson(...args));

        person.pixi.position = {x: cell.view.center.x, y: cell.view.center.y};
        person.cell = cell;

        cell.person = person;
        cell.movable = false;

        this.map.pixi.addChild( person.pixi );
    }


    addPersons(persons){
        persons.forEach( person => this.addPerson(person[0], person[1], person[2]) )
    }


    clickPerson(e, person){
        if( !this.activePerson ){

            this.activePerson = person;
            this.square = this.map.viewSquare(person.cell, person.speed);
            person.state = 'canWalk';
            console.log('1 ➥', person.state);

        } else if( this.activePerson && person.state === 'canWalk' ){

            this.map.hideSquare();
            person.state = 'canFight';
            this.square = this.map.viewSquare(person.cell, person.attackRange);
            console.log('2 ➥', person.state);

        } else if( this.activePerson && person.state === 'canFight' ) {

            this.map.hideSquare();
            person.state = 'disable';
            this.activePerson = null;
            console.log('3 ➥', person.state);

        }
    }


    clickCell(cell){
        if(!this.activePerson) return;

        if( this.activePerson.state === 'canWalk' ){

            let way = this.findPath(this.map, this.activePerson.cell, cell);

            this.changePosition(this.activePerson,
                way,
                this.activePerson.cell,
                cell,
                ()=>{
                    this.map.hideSquare();
                    this.map.viewSquare(this.activePerson.cell, this.activePerson.attackRange);
                    this.activePerson.state = 'canFight';
                })
        } else if( this.activePerson.state === 'canFight' ){

            console.log('Отаке ➥');
            this.map.hideSquare();
            this.activePerson = null;

        }
    }

    findPath(map, startCell, endCell){
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


    changePosition(person, way, startCell, endCell, callback){

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
}

export default gameEngine;