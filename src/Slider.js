(function(VIZ)
{
    var p = Slider.prototype;

    p.view = null;
    p.min = null;
    p.max = null;
    p.buttonDown = null;
    p.bar = null;
    p.button = null;

    function Slider(min, max)
    {
        createjs.EventDispatcher.initialize(this);

        this.min = min || 0;
        this.max = max || 100;
        this.buttonDown = false;

        this.createView();
    }

    p.createView = function()
    {
        this.bar = new createjs.Bitmap(VIZ.assetManager.getTexture("sliderBar"));

        this.button = new createjs.Bitmap(VIZ.assetManager.getTexture("sliderButton-off"));
        this.button.cursor = "pointer";
        this.button.regX = 11;
        this.button.regY = 11;
        this.button.x = 0;
        this.button.y = 3;
        this.button.addEventListener("mousedown", onButtonMouseDown.bind(this));

        this.view = new createjs.Container();
        this.view.addChild(this.bar, this.button);
    };

    function onButtonMouseDown(eDown)
    {
        var offsetX = this.button.x - eDown.stageX;

        this.buttonDown = true;
        this.button.image = VIZ.assetManager.getTexture("sliderButton-on");

        eDown.addEventListener("mousemove", (function(eMove)
        {
            this.button.x = eMove.stageX + offsetX;

            if (this.button.x < 0) this.button.x = 0;
            else
            {
                var barWidth = this.bar.image.width * this.bar.scaleX;

                if (this.button.x > barWidth) this.button.x = barWidth;
            }

            var evt = document.createEvent("Event");
            evt.initEvent("updateClock", true, true );
            evt.value = Math.floor(((this.max - this.min) / (this.bar.image.width * this.bar.scaleX)) * this.button.x);
            this.dispatchEvent(evt);
        }).bind(this));

        eDown.addEventListener("mouseup", (function()
        {
            this.buttonDown = false;
            this.button.image = VIZ.assetManager.getTexture("sliderButton-off");

            var evt = document.createEvent("Event");
            evt.initEvent("updatePosition", true, true );
            evt.value = Math.floor(((this.max - this.min) / (this.bar.image.width * this.bar.scaleX)) * this.button.x);
            this.dispatchEvent(evt);

            eDown.removeAllEventListeners();
        }).bind(this));
    }

    VIZ.Slider = Slider;
})(window.VIZ);