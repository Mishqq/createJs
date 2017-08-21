import {TimelineMax, TweenMax, Power0} from "gsap";
import {settings, cellTypes, personTypes} from './../../defs';

export default class view {
    constructor(){
        this.pixi = new PIXI.Container();
        this.pixi.position = {x: settings.bars.bottom.x, y: settings.bars.bottom.y};

        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x232763, 0.8);
        graphics.lineStyle(1, 0x232763, 1);
        graphics.moveTo(0, 0)
            .lineTo(settings.bars.bottom.w, 0)
            .lineTo(settings.bars.bottom.w, settings.bars.bottom.h)
            .lineTo(0, settings.bars.bottom.h)
            .endFill();

        this.pixi.addChild( graphics );
    }
}
