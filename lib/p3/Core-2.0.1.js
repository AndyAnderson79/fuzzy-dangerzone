this.p3 = this.p3 || {};

p3.Core = (function()
{
    "use strict";

    // ----------------
    // GLOBAL VARIABLES
    // ----------------

    var EVENT_COMPLETE = "complete";
    var EVENT_PAUSE = "pause";
    var EVENT_UNPAUSE = "unpause";
    var DELAY = 10;
    var LOCKDOWN_IMAGE = "data:image/png;base64,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";

    // TODO: needs to be externally accessible
    var CHROME = "Chrome";
    var OMNIWEB = "OmniWeb";
    var APPLE = "Apple";
    var SAFARI = "Safari";
    var OPERA = "Opera";
    var ICAB = "iCab";
    var KONQUEROR = "Konqueror";
    var FIREFOX = "Firefox";
    var CAMINO = "Camino";
    var NETSCAPE = "Netscape";
    var MOZILLA = "Mozilla";
    var EXPLORER = "Explorer";
    var SILK = "Silk";
    var WEBKIT = "Webkit";
    var ANDROID = "Android";
    var GECKO = "Gecko";
    var WINDOWS = "Windows";
    var MAC = "Mac";
    var IOS = "iOS";
    var LINUX = "Linux";

    var IPHONE = "iPhone";
    var IPOD = "iPod";
    var IPAD = "iPad";


    // ------------------------
    // PRIVATE STATIC VARIABLES
    // ------------------------

    var _proto = Core.prototype;
    var _instance = null;
    var _running = null;
    var _paused = null;
    var _iframe = null;
    var _ios6 = null;
    var _debug = null;
    var _versionSearchString = null;
    var _browsers = [
        {
            string: navigator.userAgent,
            subString: CHROME,
            identity: CHROME
        },
        {
            string: navigator.userAgent,
            subString: OMNIWEB,
            versionSearch: OMNIWEB + "/",
            identity: OMNIWEB
        },
        {
            string: navigator.vendor,
            subString: APPLE,
            identity: SAFARI,
            versionSearch: "Version"
        },
        {
            string: navigator.userAgent,
            subString: SILK,
            identity: SILK
        },
        {
            prop: window.opera,
            identity: OPERA
        },
        {
            string: navigator.vendor,
            subString: ICAB,
            identity: ICAB
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: KONQUEROR
        },
        {
            string: navigator.userAgent,
            subString: FIREFOX,
            identity: FIREFOX
        },
        {
            string: navigator.vendor,
            subString: CAMINO,
            identity: CAMINO
        },
        {
            // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: NETSCAPE,
            identity: NETSCAPE
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: EXPLORER,
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: ANDROID,
            identity: WEBKIT,
            versionSearch: "Version"
        },
        {
            string: navigator.userAgent,
            subString: GECKO,
            identity: MOZILLA,
            versionSearch: "rv"
        },
        {
            // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: MOZILLA,
            identity: NETSCAPE,
            versionSearch: MOZILLA
        }
    ];
    var _operatingSystems = [
        {
            string: navigator.platform,
            subString: "Win",
            identity: WINDOWS
        },
        {
            string: navigator.platform,
            subString: MAC,
            identity: MAC
        },
        {
            string: navigator.userAgent,
            subString: IPHONE,
            identity: IOS
        },
        {
            string: navigator.userAgent,
            subString: IPOD,
            identity: IOS
        },
        {
            string: navigator.userAgent,
            subString: IPAD,
            identity: IOS
        },
        {
            string: navigator.userAgent,
            subString: ANDROID,
            identity: ANDROID
        },
        {
            string: navigator.platform,
            subString: LINUX,
            identity: LINUX
        },
        {
            string: navigator.userAgent,
            subString: LINUX,
            identity: LINUX
        }
    ];
    // TODO: this needs to be easily updated. external maybe?
    var _devices = [
        {
            string: navigator.userAgent,
            subString: "Nexus 7",
            identity: "Nexus 7"
        },
        {
            string: navigator.userAgent,
            subString: "GT-P3110",
            identity: "galaxyTab2_7"
        },
        {
            string: navigator.userAgent,
            subString: "GT-P",
            identity: "galaxyTab"
        },
        {
            string: navigator.userAgent,
            subString: "GT-I9100",
            identity: "galaxyPhoneSII"
        },
        {
            string: navigator.userAgent,
            subString: "GT-I930",
            identity: "galaxyPhoneSIII"
        },
        {
            string: navigator.userAgent,
            subString: "GT-I",
            identity: "galaxyPhone"
        },
        {
            identity: "iPod5",
            os: IPOD,
            screen:
            {
                width: 300,
                height: 568
            }
        },
        {
            identity: "iPhone5",
            os: IPHONE,
            screen:
            {
                width: 320,
                height: 548
            }
        },
        {
            identity: "iPod4",
            os: IPOD,
            screen:
            {
                width: 320,
                height: 460
            }
        },
        {
            identity: "iPhone4",
            os: IPHONE,
            screen:
            {
                width: 300,
                height: 480
            }
        }
    ];

    // ----------------
    // PUBLIC VARIABLES
    // ----------------

    _proto.canvas = {};
    _proto.device = {};
    _proto.orientation = {};
    _proto.options = {};
    _proto.width = null;
    _proto.height = null;
    _proto.aspectRatio = null;
    _proto.hd = null;
    _proto.scale = null;

    function Core(canvas, width, height, options)
    {
        _running = false;
        _paused = true;
        _iframe = (window.self !== window.top);

        // collect Canvas info
        this.canvas.id = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.aspectRatio = calculateAspectRatio(width, height);

        // collect Device info
        this.device.os = searchString(_operatingSystems) || "unknown";
        this.device.browserName = searchString(_browsers) || "unknown";
        this.device.browserVersion = searchVersion(navigator.userAgent) || searchVersion(navigator.appVersion) || "an unknown version";
        this.device.pixelRatio = window.devicePixelRatio || 1;
        this.device.model = searchString(_devices) || "unknown";

        // collect Orientation data
        this.orientation.supported = ("onorientationchange" in window.self);
        this.orientation.event = (this.orientation.supported) ? "orientationchange" : "resize";
        this.orientation.desired = calculateDesiredOrientation(this.canvas.aspectRatio);

        // handle defined Options
        this.options.debugMode = options.debugMode || false;
        this.options.autoResize = options.autoResize || true;
        this.options.hdThreshold = options.hdThreshold || 480;
        this.options.backgroundColor = options.backgroundColor || "#000000";
        this.options.backgroundImageSD = options.backgroundImageSD || null;
        this.options.backgroundImageHD = options.backgroundImageHD || null;
        this.options.backgroundPosition  = options.backgroundPosition || "left top";
        this.options.backgroundRepeat = options.backgroundRepeat || "no-repeat";
        this.options.backgroundSize = options.backgroundSize || "auto";
        this.options.lockdownColor  = options.lockdownColor || "#2C2E2E";
        this.options.lockdownPosition = options.lockdownPosition || "50% 50%";
        this.options.lockdownRepeat = options.lockdownRepeat || "no-repeat";
        this.options.lockdownSize = options.lockdownSize || "auto";
        this.options.lockdownImageSD = options.lockdownImageSD || null;
        this.options.lockdownImageHD = options.lockdownImageHD || null;

        // initially set final dimensions to desired dimensions
        this.width = width;
        this.height = height;
    }

    _proto.init = function()
    {
        if (this.options.debugMode)
        {
            _debug = document.createElement("pre");
            _debug.style.position = "absolute";
            _debug.style.top = 0;
            _debug.style.left = 0;
            _debug.style.width = "260px";
            _debug.style.height = "100%";
            _debug.style.padding = "10px";
            _debug.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
            _debug.style.font = "normal 10px arial";
            _debug.style.color = "#00ff00";
            _debug.style.zIndex = 999;
            _debug.innerText = "* DEBUG OUTPUT *\n================\n\n";
        }

        // create viewport meta for mobile devices
        if (this.isMobile())
        {
            // add appropriate meta headers to page head for mobile devices
            var meta = document.createElement("meta");
            meta.name = "viewport";
            meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no";
            if (this.isAndroid()) meta.content += ", target-densitydpi=device-dpi";
            document.head.insertBefore(meta, document.head.firstChild);

            // handle ios6 iPod/iPhone devices differently
            _ios6 = ((this.device.os == IPHONE || this.device.os == IPHONE) && this.device.browserVersion >= 6);
        }

        // delay until mobile device is ready
        setTimeout(function()
        {
            // calculate orientation and aspect ratio
            this.calculateCurrentOrientation();
            this.calculateDeviceDimensions();

            // determine whether to use HD assets by calculating real pixels
            this.hd = (Math.max(this.device.width, this.device.height) * this.device.pixelRatio > this.options.hdThreshold);

            // add styles to html element
            var html = document.getElementsByTagName("html")[0];
            html.style.width = "100%";
            html.style.height = "100%";

            // add styles to body
            var body = document.body;
            body.style.width = "100%";
            body.style.height = "100%";
            body.style.backgroundColor = this.options.backgroundColor;

            if (this.options.backgroundImageSD && this.options.backgroundImageHD)
            {
                body.style.backgroundImage = "url(" + (this.hd ? this.options.backgroundImageHD : this.options.backgroundImageSD) + ")";
                body.style.backgroundPosition = this.options.backgroundPosition;
                body.style.backgroundRepeat = this.options.backgroundRepeat;
                body.style.backgroundSize = this.options.backgroundSize;
            }

            // create wrapper element and append it to page body
            var wrapper = document.createElement("div");
            wrapper.id = "wrapper";
            wrapper.style.width = "100%";
            wrapper.style.height = "100%";
            body.appendChild(wrapper);

            if(this.isAndroid())
            {
                wrapper.style["-webkit-transform-origin"] = "0 0";
                wrapper.style["-webkit-transform"] = "scale3d(" + this.device.pixelRatio + ", " + this.device.pixelRatio + ", 0);";
            }

            // create orientation lockdown screen and append it to wrapper
            var lockdown = document.createElement("div");
            lockdown.id = "lockdown";
            lockdown.style.position = "absolute";
            lockdown.style.top = 0;
            lockdown.style.left = 0;
            lockdown.style.width = "100%";
            lockdown.style.height = "100%";
            lockdown.style.display = "none";
            lockdown.style.backgroundColor = this.options.lockdownColor;
            lockdown.style.backgroundPosition = this.options.lockdownPosition;
            lockdown.style.backgroundRepeat = this.options.lockdownRepeat;
            lockdown.style.backgroundSize = this.options.lockdownSize;
            wrapper.appendChild(lockdown);
            if (this.options.lockdownImageSD && this.options.lockdownImageHD) lockdown.style.backgroundImage = "url(" + (this.hd ? this.options.lockdownImageHD : this.options.lockdownImageSD) + ")";
            else lockdown.style.backgroundImage = "url(" + LOCKDOWN_IMAGE + ")";

            // debug output if debugMode option is set
            if (this.options.debugMode)
            {
                wrapper.appendChild(_debug);

                this.debug(navigator.userAgent);

                // TODO: Here's the regEx magic!
                var match, name, version;
                var OSs =
                {
                    iOS:
                    {
                        name: /iPad|iPod|iPhone/,
                        version: /;\sCPU.*OS\s(\d_\d_\d)/,
                        searchString: navigator.userAgent
                    },
                    Android:
                    {
                        name: /Android/,
                        version: /;\sAndroid\s(\d\.\d\.\d)/,
                        searchString: navigator.userAgent
                    }
                };

                for (var os in OSs)
                {
                    match = OSs[os].searchString.match(OSs[os].name);

                    if (match)
                    {
                        name = os;
                        match = OSs[os].searchString.match(OSs[os].version);
                        match = match[match.length - 1];
                        match = match.split(/_|\./);
                        version = (match.shift() + "." + match.join("") * 1);

                        this.debug("osName : " + name);
                        this.debug("osVersion : " + version);

                        break;
                    }
                }

                //this.debug((new Error).lineNumber || (new Error().stack).split(":")[2] || "");
            }

            // stop screen from scrolling
            document.ontouchmove = function(e)
            {
                e.preventDefault();
                return false;
            };

            // bind update function to orientation event
            if (this.options.autoResize)
            {
                window.addEventListener("orientationchange", this.update.bind(this), false);
                window.addEventListener("resize", this.resize.bind(this), false);
            }

            // either display lockdown screen or call run() depending on current & desired aspect ratios
            if (this.orientation.current == this.orientation.desired) this.run();
            else lockdown.style.display = "block";

        }.bind(this), DELAY);
    };

    _proto.run = function()
    {
        _running = true;
        _paused = false;

        // delay until mobile devices know their dimensions reliably
        setTimeout(function()
        {
            // get fresh orientation and aspect ratio data
            this.calculateCurrentOrientation();
            this.calculateDeviceDimensions();

            // store final aspect ratio
            this.aspectRatio = this.device.aspectRatio;

            // scale final dimensions and generate styles for canvas
            var canvasWidth, canvasHeight;
            if (this.options.autoResize)
            {
                canvasWidth = this.device.width + "px";
                canvasHeight = this.device.height + "px";
                if (this.canvas.aspectRatio < this.aspectRatio) this.width = Math.round(this.aspectRatio * this.height);
                else this.height = Math.round(this.width / this.aspectRatio);
            }
            else
            {
                canvasWidth = this.canvas.width + "px";
                canvasHeight = this.canvas.height + "px";
            }

            // create canvas element(s) and append them to wrapper
            var canvas, canvases;
            if (this.canvas.id instanceof Array) canvases = this.canvas.id;
            else canvases = [this.canvas.id];

            for (var i = 0; i < canvases.length; i++)
            {
                canvas = document.createElement("canvas");
                canvas.id = canvases[i];
                canvas.width = this.width;
                canvas.height = this.height;
                canvas.style.position = "absolute";
                canvas.style.top = 0;
                canvas.style.left = (_ios6 && this.orientation.current == "landscape") ? Math.round((window.self.innerWidth - this.device.width) * 0.5) + "px" : 0;
                canvas.style.width = canvasWidth;
                canvas.style.height = canvasHeight;
                canvas.style.webkitTapHighlightColor = "rgba( 0, 0, 0, 0 )";
                canvas.style.msTouchAction = "none";
                document.getElementById("wrapper").appendChild(canvas);
            }

            // store final scale
            this.scale =
            {
                x: calculateAspectRatio(this.width, this.canvas.width),
                y: calculateAspectRatio(this.height, this.canvas.height)
            };

            // dispatch "complete" event
            var evt = document.createEvent("Event");
            evt.initEvent(EVENT_COMPLETE, true, true);
            this.dispatchEvent(evt);
        }.bind(this), DELAY);
    };

    _proto.update = function(e)
    {
        // delay until mobile devices know their dimensions reliably
        setTimeout(function()
        {
            // get fresh orientation and aspect ratio data
            this.calculateCurrentOrientation();
            this.calculateDeviceDimensions();

            // establish if the current orientation is the desired one
            var desiredOrientation = (this.orientation.current == this.orientation.desired);

            // fire off a pause/unpause event depending on current state
            var pauseEvent = document.createEvent("Event");
            if (desiredOrientation && _paused)
            {
                _paused = false;
                pauseEvent.initEvent(EVENT_UNPAUSE, true, true);
            }
            else if (!desiredOrientation && !_paused)
            {
                _paused = true;
                pauseEvent.initEvent(EVENT_PAUSE, true, true);
            }
            this.dispatchEvent(pauseEvent);

            // display rotate image if device is currently in the wrong orientation
            var lockdown = document.getElementById("lockdown");
            lockdown.style.display = (desiredOrientation) ? "none" : "block";

            if(_running)
            {
                var canvasStyles = {};

                // no change in device aspect ratio
                if(this.device.aspectRatio == this.aspectRatio)
                {
                    canvasStyles.width = this.device.width + "px";
                    canvasStyles.height = this.device.height + "px";
                    canvasStyles.top = 0;
                    canvasStyles.left = (_ios6 && this.orientation.current == "landscape") ? Math.round((window.self.innerWidth - this.device.width) * 0.5) + "px" : 0;
                }
                else if(this.device.aspectRatio < this.aspectRatio) // device narrower or taller after update
                {
                    var newHeight = Math.round(this.device.width / this.aspectRatio);

                    canvasStyles.width = "100%";
                    canvasStyles.height = newHeight + "px";
                    canvasStyles.top = ((this.device.height - newHeight) * 0.5) + "px";
                    canvasStyles.left = 0;
                }
                else // device wider or shorter after update
                {
                    var newWidth = Math.round(this.aspectRatio * this.device.height);

                    canvasStyles.width = newWidth + "px";
                    canvasStyles.height = "100%";
                    canvasStyles.top = 0;
                    canvasStyles.left = ((this.device.width - newWidth) * 0.5) + "px";
                }

                // apply updated canvas styles
                var canvas, canvases;

                if (this.canvas.id instanceof Array) canvases = this.canvas.id;
                else canvases = [this.canvas.id];

                for (var i = 0; i < canvases.length; i++)
                {
                    canvas = document.getElementById(canvases[i]);
                    canvas.style.display = (desiredOrientation) ? "block" : "none";
                    for (var s in canvasStyles) canvas.style[s] = canvasStyles[s];
                }

                // attempt to hide url bar on Android devices
                if (this.isMobile() && this.isAndroid()) window.self.scrollTo(0, 0);
            }
            else if (desiredOrientation) this.run();

        }.bind(this), DELAY);
    };

    _proto.resize = function()
    {
        setTimeout(this.update.bind(this), DELAY + 10);
    };

    _proto.isMobile = function()
    {
        return (this.isIPhone() || this.isIPad() || this.isAndroid() || (this.device.os === LINUX));
    };

    _proto.isIPhone = function()
    {
        return (this.device.os === IPHONE);
    };

    _proto.isIPod = function()
    {
        return (this.device.os === IPOD);
    };

    _proto.isIPad = function()
    {
        return (this.device.os === IPAD);
    };

    _proto.isAndroid = function()
    {
        return (this.device.os === ANDROID);
    };

    _proto.calculateCurrentOrientation = function()
    {
        if (this.orientation.supported)
        {
            if (_iframe) this.orientation.current = (window.self.outerWidth > window.self.outerHeight) ? "landscape" : "portrait";

            // TODO: handle individual device orientations here
            else if (this.device.model == "galaxyTab") this.orientation.current = (window.orientation == 0 || window.orientation == 180) ? "landscape" : "portrait";

            else if (window.self.orientation == 90 || window.self.orientation == -90) this.orientation.current = "landscape";
            else if (window.self.innerWidth == window.self.innerHeight) this.orientation.current = "square";
            else this.orientation.current = "portrait";
        }
        else
        {
            if (window.self.innerWidth > window.self.innerHeight) this.orientation.current = "landscape";
            else if (window.self.innerWidth == window.self.innerHeight) this.orientation.current = "square";
            else this.orientation.current = "portrait";
        }
    };

    _proto.calculateDeviceDimensions = function()
    {
        // TODO: handle individual device dimensions & aspect ratios here
        if(this.orientation.current == 'landscape')
        {
            switch(this.device.model)
            {
                case 'iPhone5':
                case 'iPod5':

                    this.device.aspectRatio = 1.775;
                    this.device.height = window.self.innerHeight;
                    this.device.width = parseFloat((window.self.innerHeight * this.device.aspectRatio).toFixed(3));

                    break;

                case 'iPhone4':
                case 'iPod4':

                    this.device.aspectRatio = (_ios6) ? 1.5 : 2.308;
                    this.device.height = window.self.innerHeight;
                    this.device.width = parseFloat((window.self.innerHeight * this.device.aspectRatio).toFixed(3));

                case 'galaxyPhoneSII':
                case 'galaxyPhoneSIII':
                case 'galaxyPhone':

                    this.device.aspectRatio = 2.25;
                    this.device.width = window.self.outerWidth;
                    this.device.height = calculateAspectRatio(this.device.width, this.device.aspectRatio);

                    break;

                case 'galaxyTab2_7':
                case 'galaxyTab':

                    this.device.aspectRatio = 1.975;
                    this.device.width = window.self.outerWidth;
                    this.device.height = calculateAspectRatio(this.device.width, this.device.aspectRatio);

                    break;

                default:
                case 'unknown':

                    this.device.width = window.self.innerWidth;
                    this.device.height = window.self.innerHeight;
                    this.device.aspectRatio = calculateAspectRatio(this.device.width, this.device.height);

                    break;
            }
        }
    };

    _proto.debug = function(text)
    {
        if(this.options.debugMode)
        {
            var date = new Date();
            var time = pad(date.getHours(), 2) + ":";
            time += pad(date.getMinutes(), 2) + ":";
            time += pad(date.getSeconds(), 2);

            _debug.innerHTML += time + " - " + text + "\n";
        }
    };

    function calculateAspectRatio(a, b)
    {
        return parseFloat((a / b).toFixed(3));
    }

    function searchString(array)
    {
        var dataString, dataScreen;
        var result = null;

        for (var i = 0; i < array.length; i++)
        {
            dataString = array[i].string;
            dataScreen = array[i].screen;

            if (dataScreen)
            {
                if (screen.availWidth == dataScreen.width && screen.availHeight == dataScreen.height)
                {
                    result = array[i].identity;
                    break;
                }
            }
            else _versionSearchString = array[i].versionSearch || array[i].identity;

            if (result || (dataString && dataString.indexOf(array[i].subString) > -1) || array[i].prop)
            {
                result = array[i].identity;
                break;
            }
        }

        return result;
    }

    function searchVersion(string)
    {
        var index = string.indexOf(_versionSearchString);
        return (index > -1) ? parseFloat(string.substring(index + _versionSearchString.length + 1)) : null;
    }

    function calculateDesiredOrientation(aspectRatio)
    {
        var desired;

        if(aspectRatio == 1) desired = "square";
        else if(aspectRatio > 1) desired = "landscape";
        else desired = "portrait";

        return desired;
    }

    function pad(num, size)
    {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    return {
        getInstance: function(canvas, width, height, options)
        {
            if (!_instance)
            {
                _instance = new Core(canvas, width, height, options);
                createjs.EventDispatcher.initialize(_instance);
            }

            return _instance;
        }
    }
})();


