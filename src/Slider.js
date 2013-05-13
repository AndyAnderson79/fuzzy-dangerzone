(function(VIZ)
{
    var p = Slider.prototype;

    p.view = null;
    p.min = null;
    p.max = null;

    function Slider(min, max)
    {
        this.min = min || 0;
        this.max = max || 100;

        this.createView();
    }

    p.createView = function()
    {
        var bar = new createjs.Bitmap(VIZ.assetManager.getTexture("sliderBar"));

        this.view = new createjs.Container();
        this.view.addChild(bar);
    };

    VIZ.Slider = Slider;
})(window.VIZ);