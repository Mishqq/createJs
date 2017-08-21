import {TimelineMax, TweenMax, Power0} from "gsap";
import {settings, cellTypes, personTypes} from './../../defs';

export default class view {
    constructor(){
        this.pixi = new PIXI.Container();
        this.pixi.position = {x: settings.bars.top.x, y: settings.bars.top.y};

        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x232763, 0.8);
        graphics.lineStyle(1, 0x232763, 1);
        graphics.moveTo(0, 0)
            .lineTo(0, 0)
            .lineTo(settings.bars.top.w, 0)
            .lineTo(settings.bars.top.w, settings.bars.top.h)
            .lineTo(0, settings.bars.top.h)
            .endFill();

        this.pixi.addChild( graphics );
    }
}
