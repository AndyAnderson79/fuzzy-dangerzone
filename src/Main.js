window.VIZ = window.VIZ || {};

(function(VIZ)
{
    var p = Main.prototype;

    p.manifest = null;
    p.canvas = null;
    p.stage = null;
    p.fps = 30;
    p.currentScreen = null;
    p.background = null;
    p.preloader = null;
    p.visualizer = null;

    function Main()
    {
        createjs.EventDispatcher.initialize( this );

        VIZ.core = p3.Core.getInstance();

        this.initPreloader();
        this.init();
    }

    p.initPreloader = function()
    {
        var scaleFactor = (VIZ.core.hd) ? 1 : 0.5;
        var assetScale = scaleFactor * 2;

        this.manifest = [
            // images
            { id: "stopButton-off", src: "assets/images/stopButton-off.png" },
            { id: "stopButton-on", src: "assets/images/stopButton-on.png" },
            { id: "playButton-off", src: "assets/images/playButton-off.png" },
            { id: "playButton-on", src: "assets/images/playButton-on.png" },
            { id: "pauseButton-off", src: "assets/images/pauseButton-off.png" },
            { id: "pauseButton-on", src: "assets/images/pauseButton-on.png" },

            // fonts
            { id: 'ds-digitalnormal', src: 'fonts/ds-digi-webfont.eot' },
            { id: 'ds-digitalnormal', src: 'fonts/ds-digi-webfont.woff' },
            { id: 'ds-digitalnormal', src: 'fonts/ds-digi-webfont.ttf' },
            { id: 'ds-digitalnormal', src: 'fonts/ds-digi-webfont.svg' },
            { id: 'ds-digitalbold', src: 'fonts/ds-digib-webfont.eot' },
            { id: 'ds-digitalbold', src: 'fonts/ds-digib-webfont.woff' },
            { id: 'ds-digitalbold', src: 'fonts/ds-digib-webfont.ttf' },
            { id: 'ds-digitalbold', src: 'fonts/ds-digib-webfont.svg' },

            // audio
            //{ id: "track", src: "assets/audio/01-datassette--the_aviatrix-dh.mp3", data: 1 }
            //{ id: "track", src: "assets/audio/Paul Weller - Starlite _D-Pulse Remix_.mp3", data: 1 }
            //{ id: "track", src: "assets/audio/Datassette - Flechte.mp3", data: 1 }
            { id: "track", src: "assets/audio/datassette - Malfunction.mp3", data: 1 }
            //{ id: "track", src: "assets/audio/DF_SNL_116 XI.mp3", data: 1 }
        ];

        VIZ.assetManager = AssetManager.getInstance();
        VIZ.assetManager.setScaleFactor(scaleFactor);
        VIZ.assetManager.addEventListener(AssetManager.EVENT_PROGRESS, onLoadingProgress.bind(this));
        VIZ.assetManager.addEventListener(AssetManager.EVENT_FILELOAD, onLoadingFileLoaded.bind(this));
        VIZ.assetManager.addEventListener(AssetManager.EVENT_COMPLETE, onLoadingComplete.bind(this));
        VIZ.assetManager.addEventListener(AssetManager.EVENT_ERROR, onLoadingError.bind(this));
    };

    p.init = function()
    {
        this.initCanvas();
        this.showPreloaderScreen();
        this.initTicker();
    };

    p.initCanvas = function()
    {
        this.canvas = document.getElementById((VIZ.core.canvas.id instanceof Array) ? VIZ.core.canvas.id[0] : VIZ.core.canvas.id);
        this.stage = new createjs.Stage(this.canvas);
        this.stage.mouseEventsEnabled = true;
        this.stage.enableMouseOver(10);

        if(createjs.Touch.isSupported()) createjs.Touch.enable(this.stage);

        Globals.STAGE = this.stage;
        Globals.CANVAS = this.canvas;
        Globals.STAGE_WIDTH = VIZ.core.width;
        Globals.STAGE_HEIGHT = VIZ.core.height;
        Globals.STAGE_CENTER_X = VIZ.core.width * 0.5;
        Globals.STAGE_CENTER_Y = VIZ.core.height * 0.5;
        Globals.CANVAS_WIDTH = VIZ.core.canvas.width;
        Globals.CANVAS_HEIGHT = VIZ.core.canvas.height;
        Globals.SCALE = VIZ.core.scale;
    };

    p.initTicker = function()
    {
        createjs.useRAF = true;
        createjs.Ticker.setFPS(this.fps);
        createjs.Ticker.addEventListener("tick", tick.bind(this));
    };

    p.showPreloaderScreen = function()
    {
        this.clearAllScreens();
        this.preloader = new VIZ.Preloader();
        this.preloader.addEventListener(Globals.PRELOADER_READY, onPreloaderScreenReady.bind(this));
        this.preloader.addEventListener(Globals.EXIT, onPreloaderScreenExit.bind(this));
        this.preloader.preload();
        this.currentScreen = this.preloader;
    };

    p.showBackgroundScreen = function()
    {
        //this.clearAllScreens();
        //this.background = new VIZ.Background();
        //this.stage.addChild(this.background.view);
    };

    p.showVisualizerScreen = function()
    {
        this.clearAllScreens();
        this.visualizer = new VIZ.Visualizer();
        this.stage.addChild(this.visualizer.view);
        this.currentScreen = this.visualizer;
    };

    p.clearAllScreens = function()
    {
        if(this.preloader)
        {
            this.stage.removeChild( this.preloader.view );
            this.preloader.dispose();
            this.preloader = null;
        }

        if(this.visualizer)
        {
            this.stage.removeChild( this.visualizer.view );
            this.visualizer.dispose();
            this.visualizer = null;
        }
    };

    function onLoadingProgress()
    {

    }

    function onLoadingFileLoaded()
    {

    }

    function onLoadingComplete()
    {
        VIZ.assetManager.removeEventListener(AssetManager.EVENT_PROGRESS, onLoadingProgress);
        VIZ.assetManager.removeEventListener(AssetManager.EVENT_FILELOAD, onLoadingFileLoaded);
        VIZ.assetManager.removeEventListener(AssetManager.EVENT_COMPLETE, onLoadingComplete);
        VIZ.assetManager.removeEventListener(AssetManager.EVENT_ERROR, onLoadingError);

        //this.showBackgroundScreen();
        this.showVisualizerScreen();
    }

    function onLoadingError(e)
    {
        console.log(e);
    }

    function onPreloaderScreenReady()
    {
        this.preloader.removeEventListener(Globals.PRELOADER_READY, onPreloaderScreenReady);
        this.stage.addChild(this.preloader.view);

        VIZ.assetManager.load(this.manifest);
    }

    function onPreloaderScreenExit()
    {
        this.preloader.removeEventListener(Globals.EXIT, onPreloaderScreenExit);
    }

    function tick( e )
    {
        if(this.background) this.background.update();
        if(this.currentScreen) this.currentScreen.update(e.delta);

        this.stage.update();
    }

    VIZ.Main = Main;
})(window.VIZ);