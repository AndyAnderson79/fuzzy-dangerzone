(function(VIZ)
{
    var p = Background.prototype;

    p.view = null;

    function Background()
    {
        this.createView();
    }

    p.createView = function()
    {
        var greyBackground = new createjs.Shape(new createjs.Graphics().beginFill("#797979").drawRect(0, 0, Globals.STAGE_WIDTH, Globals.STAGE_HEIGHT));

        this.view = new createjs.Container();
        this.view.addChild(greyBackground);
    };

    p.update = function()
    {

    };

    p.dispose = function()
    {

    };

    VIZ.Background = Background;
})(window.VIZ);