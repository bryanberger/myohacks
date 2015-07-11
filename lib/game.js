var hub = new Myo.Hub();

// image dims
var imgWidth = 342;
var imgHeight = 289;
var canvasWidth = 800;
var canvasHeight = 600;

var renderer = PIXI.autoDetectRenderer(canvasWidth, canvasHeight);
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

var count = 0;
var speed = 0.08;

// build a rope!
var ropeCount = 10;
var ropeLength = imgWidth / ropeCount;

var points = [];

for (var i = 0; i < ropeCount; i++)
{
    points.push(new PIXI.Point(i * ropeLength, 0));
}

var strip = new PIXI.mesh.Rope(PIXI.Texture.fromImage('assets/stingray.png'), points);

//strip.x = (imgWidth - canvasWidth)/2;

var snakeContainer = new PIXI.Container();
snakeContainer.position.x = (canvasWidth-imgWidth)/2;
snakeContainer.position.y = (canvasHeight-imgHeight)/2;

console.log(snakeContainer.position.y);

//snakeContainer.scale.set(canvasWidth / 1100);
stage.addChild(snakeContainer);

snakeContainer.addChild(strip);

// events
hub.on('ready', function() {
    console.log("ready");
});
hub.on('connect', function() {
    console.log("connected!");
});
hub.on('frame', function(frame) {
   // console.log(frame.rotation);
    speed = frame.euler.pitch;
    //document.getElementById('out').innerHTML = frame.rotation;
});
hub.on('disconnect', function() {
    console.log("disconnect");
});


// start animating
requestAnimationFrame(animate);

function animate() {

    // animation speed
    count += speed;

    // make the snake
    for (var i = 0; i < points.length; i++) {

        points[i].y = Math.sin((i * 0.5) + count) * 30;

        points[i].x = i * ropeLength + Math.cos((i * 0.3) + count) * 20;

    }

    // render the stage
    renderer.render(stage);

    requestAnimationFrame(animate);
}
