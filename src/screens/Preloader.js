(function(VIZ)
{
    var p = Preloader.prototype;
    var assetCounter = 0;
    var assetsToLoad = [
        {
            src: "assets/images/loading.png"
        }
    ];
    var loadedAssets = {};

    p.view = null;
    p.spinner = null;
    p.loaderText = null;

    function Preloader()
    {
        createjs.EventDispatcher.initialize(this);
    }

    p.preload = function()
    {
        if (assetsToLoad.length == 0) this.createView();
        else
        {
            for (var i = assetsToLoad.length; i--;)
            {
                var img = new Image();
                img.onload = this.assetLoaded.bind(this);
                img.src = assetsToLoad[i].src;

                loadedAssets[assetsToLoad[i].id] = img;
            }
        }
    };

    p.assetLoaded = function()
    {
        assetCounter++;

        if (assetCounter >= assetsToLoad.length) this.createView();
    };

    p.createView = function()
    {
        this.spinner = new createjs.Bitmap("assets/images/loading.png");
        this.spinner.regX = this.spinner.image.width * 0.5;
        this.spinner.regY = this.spinner.image.height * 0.5;
        this.spinner.x = this.spinner.regX + 20;
        this.spinner.y = (Globals.STAGE_HEIGHT - 20) - this.spinner.regY;

        this.loaderText = new createjs.Text("0%", "44px 'Segoe UI'", "#000");
        this.loaderText.textBaseline = "bottom";
        this.loaderText.x = this.spinner.x * 2;
        this.loaderText.y = Globals.STAGE_HEIGHT - 10;

        this.view = new createjs.Container();
        this.view.addChild(this.spinner, this.loaderText);

        var evt = document.createEvent("Event");
        evt.initEvent(Globals.PRELOADER_READY, true, true);
        this.dispatchEvent(evt);
    };

    p.update = function()
    {
        if (this.view)
        {
            this.spinner.rotation += 1;
            this.loaderText.text = Math.floor(VIZ.assetManager.progress * 100) + "%";
        }
    };

    p.dispose = function()
    {

    };

    VIZ.Preloader = Preloader;
})(window.VIZ);