var hub = new Myo.Hub();

// 
var punchTime = 0;

// events
hub.on('ready', function() {
    console.log("ready");
});

hub.on('connect', function(event) {
    console.log("connected!", hub.myo);
    hub.myo.unlock(1);
});

hub.on('frame', function(frame) {
    //speed = frame.euler.pitch

    var time = (new Date()).getTime();

    if (punchTime < time - 1000 && frame.accel.x < -1.0) {
        console.log("PUNCH!");
        punchTime = time;
    }

});

hub.on('pose', function(pose) {
    currentPose = pose;

    switch(currentPose.type) {
        case currentPose.POSE_FIST:
            console.log(currentPose.type, currentPose);
        break;
    }
});

hub.on('disconnect', function() {
    console.log("disconnect");
});