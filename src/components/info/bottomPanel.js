import {TimelineMax, TweenMax, Power0} from "gsap";
import {settings, cellTypes, personTypes} from './../../defs';

export default class view {
    constructor(){
        this.pixi = new PIXI.Container();
        this.pixi.position = {x: 0, y: settings.height-100};

        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x232763, 0.8);
        graphics.lineStyle(1, 0x232763, 1);
        graphics.moveTo(0, 0)
            .lineTo(0, 0)
            .lineTo(settings.width, 0)
            .lineTo(settings.width, 100)
            .lineTo(0, 100)
            .endFill();

        this.pixi.addChild( graphics );
    }
}
