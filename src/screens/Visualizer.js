(function(VIZ)
{
    var p = Visualizer.prototype;
    var numBars;
    var FFT_SIZE = 512;
    var BAR_WIDTH = 15;
    var BAR_HEIGHT = 300;
    var BAR_GAP = 2;

    p.view = null;
    p.soundInstance = null;
    p.paused = false;
    p.playing = false;
    p.analyserNode = null;
    p.frequencyFloatData = null;
    p.frequencyByteData = null;
    p.timeByteData = null;
    p.frequencyChunk = null;
    p.stopButton = null;
    p.playButton = null;
    p.playTime = null;
    p.totalTime = null;
    p.barContainer = null;
    p.bars = [];

    function Visualizer()
    {
        var context = createjs.WebAudioPlugin.context;

        this.analyserNode = context.createAnalyser();
        this.analyserNode.fftSize = FFT_SIZE;
        this.analyserNode.smoothingTimeConstant = 0.85;
        this.analyserNode.connect(context.destination);

        var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
        dynamicsNode.disconnect();
        dynamicsNode.connect(this.analyserNode);

        numBars = Math.floor(Globals.STAGE_WIDTH / (BAR_WIDTH + BAR_GAP)) - 2;

        this.frequencyFloatData = new Float32Array(this.analyserNode.frequencyBinCount);
        this.frequencyByteData = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.timeByteData = new Uint8Array(this.analyserNode.frequencyBinCount);
        this.frequencyChunk = Math.floor(this.analyserNode.frequencyBinCount / numBars);

        this.soundInstance = createjs.Sound.play("track", 0, 0, 0, -1);
        this.soundInstance.addEventListener("ready", onSoundInstanceReady.bind(this));
        this.soundInstance.addEventListener("succeeded", onSoundInstanceSucceeded.bind(this));
        this.soundInstance.addEventListener("interrupted", onSoundInstanceInterrupted.bind(this));
        this.soundInstance.addEventListener("complete", onSoundInstanceComplete.bind(this));
        this.soundInstance.addEventListener("failed", onSoundInstanceFailed.bind(this));
        this.soundInstance.addEventListener("loop", onSoundInstanceLoop.bind(this));

        this.duration = this.soundInstance.getDuration();

        this.soundInstance.stop();

        this.createView();
    }

    p.createView = function()
    {
        this.stopButton = new createjs.Bitmap(VIZ.assetManager.getTexture("stopButton-off"));
        this.stopButton.cursor = "pointer";
        this.stopButton.regX = this.stopButton.image.width / 2;
        this.stopButton.regY = this.stopButton.image.height / 2;
        this.stopButton.x = 40;
        this.stopButton.y = 40;
        this.stopButton.addEventListener("mouseover", onStopButtonMouseOver.bind(this));
        this.stopButton.addEventListener("mouseout", onStopButtonMouseOut.bind(this));
        this.stopButton.addEventListener("click", onStopButtonClick.bind(this));

        this.playButton = new createjs.Bitmap(VIZ.assetManager.getTexture("playButton-off"));
        this.playButton.cursor = "pointer";
        this.playButton.regX = this.playButton.image.width / 2;
        this.playButton.regY = this.playButton.image.height / 2;
        this.playButton.x = 80;
        this.playButton.y = 40;
        this.playButton.addEventListener("mouseover", onPlayButtonMouseOver.bind(this));
        this.playButton.addEventListener("mouseout", onPlayButtonMouseOut.bind(this));
        this.playButton.addEventListener("click", onPlayButtonClick.bind(this));
        this.playButton.hitArea = new createjs.Shape(new createjs.Graphics().beginFill("rgba(0,0,0,1").drawRect(0, 0, this.playButton.image.width, this.playButton.image.height));

        this.playTime = new createjs.Text("00:00:00", "72px 'ds-digitalbold'", "#fff");
        this.playTime.textAlign = "right";
        this.playTime.x = Globals.STAGE_WIDTH - 20;
        this.playTime.y = 20;

        this.totalTime = new createjs.Text("00:00:00", "36px 'ds-digitalbold'", "#fff");
        this.totalTime.textAlign = "right";
        this.totalTime.x = Globals.STAGE_WIDTH - 20;
        this.totalTime.y = 80;

        this.barContainer = new createjs.Container();
        this.barContainer.x = 20;
        this.barContainer.y = Globals.STAGE_HEIGHT - BAR_HEIGHT - 20;

        for (var i = 0; i < numBars; i++)
        {
            var bar = new createjs.Shape();
            bar.graphics.beginFill("#fff").drawRect(0, 0, BAR_WIDTH, BAR_HEIGHT);
            bar.scaleY = 0.01;
            bar.x = (BAR_WIDTH + BAR_GAP) * i;
            bar.y = -((bar.scaleY - 1) * BAR_HEIGHT);

            this.barContainer.addChild(bar);
        }

        if (this.duration) updateClock(this.duration, this.totalTime);

        this.view = new createjs.Container();
        this.view.addChild(this.stopButton, this.playButton, this.playTime, this.totalTime, this.barContainer);
    };

    p.update = function()
    {
        if (this.view)
        {
            if (this.playing)
            {
                updateClock(this.soundInstance.getPosition(), this.playTime);

                this.analyserNode.getFloatFrequencyData(this.frequencyFloatData);
                this.analyserNode.getByteFrequencyData(this.frequencyByteData);
                this.analyserNode.getByteTimeDomainData(this.timeByteData);

                for (var i = 0; i < numBars; i++)
                {
                    var bar = this.barContainer.getChildAt(i);
                    var freqSum = 0;
                    var timeSum = 0;

                    for (var x = 0; x < this.frequencyChunk; x++)
                    {
                        var index = (this.frequencyChunk * i) + x;
                        freqSum += this.frequencyByteData[index];
                        timeSum += this.timeByteData[index];
                    }

                    freqSum = freqSum / this.frequencyChunk / 255;
                    timeSum = timeSum / this.frequencyChunk / 255;

                    bar.scaleY = freqSum || 0.01;
                    bar.y = -((bar.scaleY - 1) * BAR_HEIGHT);
                }
            }
        }
    };

    p.dispose = function()
    {

    };

    function onStopButtonMouseOver()
    {
        this.stopButton.image = VIZ.assetManager.getTexture("stopButton-on");
    }

    function onStopButtonMouseOut()
    {
        this.stopButton.image = VIZ.assetManager.getTexture("stopButton-off");
    }

    function onStopButtonClick()
    {
        if (this.playing)
        {
            this.playing = false;
            this.paused = false;

            this.playButton.image = VIZ.assetManager.getTexture("playButton-off");

            this.soundInstance.stop();
            this.soundInstance.setPosition(0);

            resetBars(this.barContainer);
            updateClock(0, this.playTime);
        }
    }

    function onPlayButtonMouseOver()
    {
        if (!this.playing) this.playButton.image = VIZ.assetManager.getTexture("playButton-on");
        else this.playButton.image = VIZ.assetManager.getTexture("pauseButton-on");

        this.playButton.regX = this.playButton.image.width / 2;
        this.playButton.regY = this.playButton.image.height / 2;
    }

    function onPlayButtonMouseOut()
    {
        if (!this.playing) this.playButton.image = VIZ.assetManager.getTexture("playButton-off");
        else this.playButton.image = VIZ.assetManager.getTexture("pauseButton-off");

        this.playButton.regX = this.playButton.image.width / 2;
        this.playButton.regY = this.playButton.image.height / 2;
    }

    function onPlayButtonClick()
    {
        if (!this.playing)
        {
            this.playing = true;
            this.playButton.image = VIZ.assetManager.getTexture("pauseButton-on");

            if (this.paused)
            {
                this.paused = false;
                this.soundInstance.resume();
            }
            else this.soundInstance.play();
        }
        else
        {
            this.playing = false;
            this.paused = true;
            this.playButton.image = VIZ.assetManager.getTexture("playButton-on");
            this.soundInstance.pause();
        }

        this.playButton.regX = this.playButton.image.width / 2;
        this.playButton.regY = this.playButton.image.height / 2;
    }

    function onSoundInstanceReady( e )
    {

    }

    function onSoundInstanceSucceeded( e )
    {
        if (!this.duration)
        {
            this.duration = this.soundInstance.getDuration();
            updateClock(this.duration, this.totalTime);
        }
    }

    function onSoundInstanceInterrupted( e )
    {

    }

    function onSoundInstanceComplete()
    {
        this.playButton.image = VIZ.assetManager.getTexture("playButton-off");
        this.playButton.regX = this.playButton.image.width / 2;
        this.playButton.regY = this.playButton.image.height / 2;

        this.soundInstance.stop();
        this.soundInstance.setPosition(0);

        resetBars(this.barContainer);
        updateClock(0, this.playTime);
    }

    function onSoundInstanceFailed( e )
    {

    }

    function onSoundInstanceLoop( e )
    {

    }

    function updateClock(ms, clock)
    {
        var date = new Date(ms);
        clock.text = zeroPad(date.getHours(), 2) + ":" + zeroPad(date.getMinutes(), 2) + ":" + zeroPad(date.getSeconds(), 2);
    }

    function resetBars(bars)
    {
        for (var i = 0; i < numBars; i++)
        {
            var bar = bars.getChildAt(i);
            bar.scaleY = 0.01;
            bar.y = -((bar.scaleY - 1) * BAR_HEIGHT);
        }
    }

    function zeroPad(num, places)
    {
        var zero = places - num.toString().length + 1;
        return new Array( +(zero > 0 && zero)).join("0") + num;
    }

    VIZ.Visualizer = Visualizer;
})(window.VIZ);