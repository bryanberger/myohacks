var hub = new Myo.Hub();

var punchTime = 0;
var lastTime = 0;
var lastIdleTime = 0;
var game = {
    ready: false,
    punches: 0,
    avgPunchSpeed: 0,
    punchSpeeds: [],
    myos: [
        // {id:0, type:, punches:}
    ]
};
var zones = {
    "PUNCH_PITCH": {low: -0.5, high: 0.5},
    "IDLE": {}
};


var lastVX = 0;
var lastAccX = 0;
var velocity = 0;
var highPunch = 0;

// Myo Events
hub.on('connect', function(event) {
    console.log("connected!", hub.myo);
    hub.myo.unlock(1);
});

var i = 0;
hub.on('frame', function(frame) {

    var time = (new Date()).getTime();

    // every 10 frames
    if(i % 10 === 0) {

        var delta = time - lastTime;
        var magA = Math.sqrt( (frame.accel.x*frame.accel.x) * ((frame.accel.y-1)*(frame.accel.y-1)) * (frame.accel.z*frame.accel.z) ) * 9.8;
        velocity = (delta/1000) * magA;

        mappedVelocity = map(velocity, 0, 30, 0, 100);

        if(velocity > highPunch && velocity < 200) {
            highPunch = velocity;
        }

         console.log(mappedVelocity, magA.toFixed(2));
        // lastTime = time;
    }

    // punch detected
    if (punchTime < time - 500 && frame.accel.x < -1.0) {

        if(game.ready) {

            // Am I within my punch zone?
            if(frame.euler.pitch > zones.PUNCH_PITCH.low && 
                frame.euler.pitch < zones.PUNCH_PITCH.high) {

                game.punches++;
                console.log('PUNCH', game.punches);
 
            }
        }

        // highPunch = 0;
        punchTime = time;
    }
    
    // save
    lastTime = time;
    //lastAccX = frame.accel.x;
    //lastVX = velocity;
    i++;

});

hub.on('pose', function(pose) {
    currentPose = pose;

    switch(currentPose.type) {
        case currentPose.POSE_FIST:
            if(game.ready) return;

            game.ready = true;
            console.log('SESSION STARTED!');
        break;

        case currentPose.POSE_WAVE_OUT:
            game.ready = false;
            resetGame();
            console.log("SESSION OVER...");
        break;
    }
});

hub.on('disconnect', function() {
    console.log("disconnect");
});

function average(data) {
    var sum = data.reduce(function(a, b) { return a + b; });
    var avg = sum / data.length;

    return avg;
}

function resetGame() {
    game.ready = false;
    game.punches = punchTime = lastTime = lastIdleTime = 0;
}

function map( x,  in_min,  in_max,  out_min,  out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}