const loader = PIXI.loader;
const path = './assets/';
let assets = [
	'texture.json'
];
assets = assets.map(item => path + item);

loader.add(assets);
loader.load(()=>{

});