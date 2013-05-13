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

    // ------------------------
    // PRIVATE STATIC VARIABLES
    // ------------------------

    var _proto = Core.prototype;
    var _instance = null;
    var _running = null;
    var _paused = null;
    var _iframe = null;
    var _debug = null;

    // ----------------
    // PUBLIC VARIABLES
    // ----------------

    _proto.definitions = {};
    _proto.canvas = {};
    _proto.device = {};
    _proto.quirks = {};
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

        // populate definitions from external lists
        for (var os in p3.OperatingSystems) this.definitions[p3.OperatingSystems[os].identity.toUpperCase()] = p3.OperatingSystems[os].identity;
        for (var browser in p3.Browsers) this.definitions[p3.Browsers[browser].identity.toUpperCase()] = p3.Browsers[browser].identity;
        for (var model in p3.Models) this.definitions[p3.Models[model].identity.toUpperCase()] = p3.Models[model].identity;

        // collect Canvas info
        this.canvas.id = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.aspectRatio = calculateAspectRatio(width, height);

        // collect Device info
        this.getDeviceData("os", p3.OperatingSystems);
        this.getDeviceData("browser", p3.Browsers);
        this.getDeviceData("model", p3.Models);
        this.device.pixelRatio = window.devicePixelRatio || 1;

        // check for quirks
        this.getDeviceQuirks();

        // collect Orientation data
        this.orientation.primary = this.quirks.primaryOrientation || "portrait";
        this.orientation.supported = ("onorientationchange" in window.self);
        this.orientation.event = (this.orientation.supported) ? "orientationchange" : "resize";
        this.orientation.desired = calculateDesiredOrientation(this.canvas.aspectRatio);

        // handle defined Options
        this.options.debugMode = options.debugMode || false;
        this.options.autoResize = options.autoResize || false;
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

    _proto.getDeviceData = function(str, data)
    {
        var match, name, version;

        for (var i in data)
        {
            if (!data[i].searchString) continue;

            match = data[i].searchString.match(data[i].name);

            if (match)
            {
                name = data[i].identity;

                if (data[i].version)
                {
                    match = navigator.userAgent.match(data[i].version);

                    if (match)
                    {
                        match = match.pop();
                        match = match.split(/_|\./);
                        version = (match.length > 1) ? (match.shift() + "." + match.join("")) : match;
                    }
                }
                else if (data[i].dimensions)
                {
                    for (var j in data[i].dimensions)
                    {
                        if (screen.availWidth == data[i].dimensions[j].width && screen.availHeight == data[i].dimensions[j].height)
                        {
                            version = data[i].dimensions[j].version;
                            break;
                        }
                    }
                }

                if (!version) version = "unknown";

                this.device[str + "Name"] = name;
                this.device[str + "Version"] = version;

                break;
            }
        }

        this.device[str + "Name"] = name || "unknown";
        this.device[str + "Version"] = version || "unknown";
    };

    _proto.getDeviceQuirks = function()
    {
        for (var q in p3.Quirks)
        {
            var validates = true;

            for (var c in p3.Quirks[q].conditions)
            {
                switch(c)
                {
                    case "osVersion":

                        if (!(Math.floor(this.device.osVersion) == p3.Quirks[q].conditions[c])) validates = false;

                        break;

                    case "modelName":

                        var hit = false;
                        var names = p3.Quirks[q].conditions[c];

                        if (!(names instanceof Array)) names = [names];

                        for (var i = 0; i < names.length; i++)
                        {
                            if (this.definitions[names[i]] == this.device.modelName) hit = true;
                            if (hit) break;
                        }

                        if (!hit) validates = false;

                        break;

                    case "modelVersion":

                        var hit = false;
                        var versions = p3.Quirks[q].conditions[c];

                        if (!(versions instanceof Array)) versions = [versions];

                        for (var i = 0; i < versions.length; i++)
                        {
                            if (versions[i] == this.device.modelVersion) hit = true;
                            if (hit) break;
                        }

                        if (!hit) validates = false;

                        break;
                }

                if (!validates) break;
            }

            if(validates)
            {
                for (var p in p3.Quirks[q].properties) this.quirks[p] = p3.Quirks[q].properties[p]
                break;
            }
        }
    };

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
        }

        // create viewport meta
        var meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0";
        if (this.device.osName === this.definitions.ANDROID) meta.content += ", target-densitydpi=device-dpi";
        document.head.insertBefore(meta, document.head.firstChild);

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

            if (this.device.osName === this.definitions.ANDROID)
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
                this.clearDebug();
            }

            // stop screen from scrolling
            document.ontouchmove = function(e)
            {
                e.preventDefault();
                return false;
            };

            // bind update function to orientation event
            window.addEventListener("orientationchange", this.update.bind(this), false);
            window.addEventListener("resize", this.resize.bind(this), false);

            // either display lockdown screen or call run() depending on current & desired aspect ratios
            if (this.orientation.current == this.orientation.desired) this.run();
            else lockdown.style.display = "block";

        }.bind(this), DELAY);
    };

    _proto.run = function()
    {
        // delay until mobile devices know their dimensions reliably
        setTimeout(function()
        {
            // get fresh orientation and aspect ratio data
            this.calculateCurrentOrientation();
            this.calculateDeviceDimensions();

            // store final aspect ratio
            if (this.quirks.aspectRatio)
            {
                this.aspectRatio = this.quirks.aspectRatio;

                if (this.orientation.current == this.orientation.desired)
                {
                    if (this.orientation.current == 'landscape') this.device.width = parseFloat((this.device.height * this.aspectRatio).toFixed(3));
                    else this.device.height = parseFloat((this.device.width / this.aspectRatio).toFixed(3));
                }

            }
            else this.aspectRatio = this.device.aspectRatio;

            // scale final dimensions and generate styles for canvas
            var canvasStyles = {};
            if (!this.options.autoResize)
            {
                canvasStyles.width = this.canvas.width + "px";
                canvasStyles.height = this.canvas.height + "px";
                canvasStyles.left = 0;
            }
            else
            {
                canvasStyles.width = this.device.width + "px";
                canvasStyles.height = this.device.height + "px";
                canvasStyles.left = (this.orientation.current == "landscape") ? Math.round((window.self.innerWidth - this.device.width) * 0.5) + "px" : Math.round((window.self.innerHeight - this.device.height) * 0.5) + "px";

                if (this.canvas.aspectRatio < this.aspectRatio) this.width = Math.round(this.aspectRatio * this.height);
                else this.height = Math.round(this.width / this.aspectRatio);
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
                canvas.style.left = canvasStyles.left;
                canvas.style.width = canvasStyles.width;
                canvas.style.height = canvasStyles.height;
                canvas.style.webkitTapHighlightColor = "rgba(0,0,0,0)";
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

            if (this.options.debugMode)
            {
                var i;

                this.clearDebug();

                this.debug("CANVAS");
                for (i in this.canvas) this.debug(i + " : " + this.canvas[i]);
                this.debug("\n");

                this.debug("DEVICE");
                for (i in this.device) this.debug(i + " : " + this.device[i]);
                this.debug("\n");

                this.debug("ORIENTATION");
                for (i in this.orientation) this.debug(i + " : " + this.orientation[i]);
                this.debug("\n");

                this.debug("APPLIED QUIRKS");
                for (i in this.quirks) this.debug(i + " : " + this.quirks[i]);
                this.debug("\n");

                this.debug("CORE");
                this.debug("width : " + this.width);
                this.debug("height : " + this.height);
                this.debug("aspectRatio : " + this.aspectRatio);
                this.debug("hd : " + this.hd);
                this.debug("scale : { x: " + this.scale.x + ", y: " + this.scale.y + " }");
                this.debug("\n");
            }

            _running = true;
            _paused = false;
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

                if (!this.options.autoResize)
                {
                    canvasStyles.width = this.canvas.width + "px";
                    canvasStyles.height = this.canvas.height + "px";
                    canvasStyles.top = 0;
                    canvasStyles.left = 0;
                }
                else if(this.device.aspectRatio == this.aspectRatio) // no change in device aspect ratio
                {
                    canvasStyles.width = this.device.width + "px";
                    canvasStyles.height = this.device.height + "px";
                    canvasStyles.top = 0;
                    canvasStyles.left = (this.orientation.current == "landscape") ? Math.round((window.self.innerWidth - this.device.width) * 0.5) + "px" : Math.round((window.self.innerHeight - this.device.height) * 0.5) + "px";
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
            }
            else if (desiredOrientation) this.run();

            if (this.options.debugMode)
            {
                var i;

                this.clearDebug();

                this.debug("CANVAS");
                for (i in this.canvas) this.debug(i + " : " + this.canvas[i]);
                this.debug("\n");

                this.debug("DEVICE");
                for (i in this.device) this.debug(i + " : " + this.device[i]);
                this.debug("\n");

                this.debug("ORIENTATION");
                for (i in this.orientation) this.debug(i + " : " + this.orientation[i]);
                this.debug("\n");

                this.debug("APPLIED QUIRKS");
                for (i in this.quirks) this.debug(i + " : " + this.quirks[i]);
                this.debug("\n");

                this.debug("CORE");
                this.debug("width : " + this.width);
                this.debug("height : " + this.height);
                this.debug("aspectRatio : " + this.aspectRatio);
                this.debug("hd : " + this.hd);
                this.debug("scale : { x: " + this.scale.x + ", y: " + this.scale.y + " }");
                this.debug("\n");
            }

        }.bind(this), DELAY);
    };

    _proto.resize = function()
    {
        setTimeout(this.update.bind(this), DELAY + 10);
    };

    _proto.calculateCurrentOrientation = function()
    {
        if (this.orientation.supported)
        {
            if (_iframe) this.orientation.current = (window.self.outerWidth > window.self.outerHeight) ? "landscape" : "portrait";
            else if (this.orientation.primary == "portrait")
            {
                if (window.self.orientation == 90 || window.self.orientation == -90) this.orientation.current = "landscape";
                else if (window.self.innerWidth == window.self.innerHeight) this.orientation.current = "square";
                else this.orientation.current = "portrait";
            }
            else
            {
                if (window.self.orientation == 0 || window.self.orientation == 180) this.orientation.current = "landscape";
                else if (window.self.innerWidth == window.self.innerHeight) this.orientation.current = "square";
                else this.orientation.current = "portrait";
            }
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
        this.device.width = window.self.innerWidth;
        this.device.height = window.self.innerHeight;
        this.device.aspectRatio = calculateAspectRatio(this.device.width, this.device.height);
    };

    _proto.debug = function(text)
    {
        if(this.options.debugMode)
        {
            if (text == "\n") _debug.innerText += "\n";
            else
            {
                var date = new Date();
                var time = pad(date.getHours(), 2) + ":";
                time += pad(date.getMinutes(), 2) + ":";
                time += pad(date.getSeconds(), 2);

                _debug.innerText += time + " - " + text + "\n";
            }
        }
    };

    _proto.clearDebug = function()
    {
        _debug.innerText = "* DEBUG OUTPUT *\n================\n\n";
    };

    function calculateAspectRatio(a, b)
    {
        return parseFloat((a / b).toFixed(3));
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

p3.OperatingSystems = [
    {
        identity: "Kindle",
        name: /(Kindle|KFJWA|KFJWI|KFTT|KFOT|Silk)/,
        version: null,
        searchString: navigator.userAgent
    },
    {
        identity: "iOS",
        name: /(iPad|iPod|iPhone)/,
        version: /; CPU.*OS ([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Android",
        name: /Android/,
        version: /Android ([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Windows",
        name: /Windows/,
        version: / NT ([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Mac",
        name: /Mac/,
        version: /OS X ([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Linux",
        name: /Linux/,
        searchString: navigator.platform
    },
    {
        identity: "UNIX",
        name: /UNIX/,
        searchString: navigator.platform
    }
];

p3.Browsers = [
    {
        identity: "Chrome",
        name: /Chrome/,
        version: /Chrome\/([\d+_|\.]{3,})/,
        searchString: navigator.userAgent
    },
    {
        identity: "OmniWeb",
        name: /OmniWeb/,
        version: /OmniWeb\/([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Silk",
        name: /Silk/,
        version: /Silk\/([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Safari",
        name: /Apple/,
        version: /Version\/([\d+_|\.]{3,5})/,
        searchString: navigator.vendor
    },
    {
        identity: "Opera",
        name: /Opera/,
        version: /Opera\/([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "iCab",
        name: /iCab/,
        searchString: navigator.vendor
    },
    {
        identity: "Konqueror",
        name: /KDE/,
        searchString: navigator.vendor
    },
    {
        identity: "Firefox",
        name: /Firefox/,
        version: /Firefox\/([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Camino",
        name: /Camino/,
        searchString: navigator.vendor
    },
    {
        // for newer Netscapes (9+)
        identity: "Netscape",
        name: /Navigator/,
        version: /Navigator\/([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        // for newer Netscapes (6+)
        identity: "Netscape",
        name: /Netscape/,
        version: /Netscape\/([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Explorer",
        name: /MSIE/,
        version: /MSIE ([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Webkit",
        name: /Android/,
        version: /Version\/([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        identity: "Mozilla",
        name: /Gecko/,
        version: /rv:([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    },
    {
        // for older Netscapes (4-)
        identity: "Netscape",
        name: /Mozilla/,
        version: /Mozilla\/([\d+_|\.]{3,5})/,
        searchString: navigator.userAgent
    }
];

p3.Models = [
    {
        identity: "Nexus",
        name: /Nexus/,
        version: /Nexus\s(\d)/,
        searchString: navigator.userAgent
    },
    {
        identity: "iPad",
        name: /iPad/,
        searchString: navigator.platform
    },
    {
        identity: "iPhone",
        name: /iPhone/,
        searchString: navigator.platform,
        dimensions: [
            {
                version: 4,
                width: 300,
                height: 480
            },
            {
                version: 5,
                width: 320,
                height: 568
            }
        ]
    },
    {
        identity: "iPod",
        name: /iPod/,
        searchString: navigator.platform,
        dimensions: [
            {
                version: 4,
                width: 320,
                height: 460
            },
            {
                version: 5,
                width: 320,
                height: 548
            }
        ]
    },
    {
        identity: "Galaxy",
        name: /GT-I|GT-P/,
        version: /(GT-[IP][\d]{3,5})/,
        searchString: navigator.userAgent
    }
];

p3.Quirks = [
    {
        conditions:
        {
            osVersion: 6,
            modelName: ["IPHONE", "IPOD"],
            modelVersion: 4
        },
        properties:
        {
            aspectRatio: 1.5
        }
    },
    {
        conditions:
        {
            modelName: ["IPHONE", "IPOD"],
            modelVersion: 4
        },
        properties:
        {
            aspectRatio: 2.308
        }
    },
    {
        conditions:
        {
            modelName: ["IPHONE", "IPOD"],
            modelVersion: 5
        },
        properties:
        {
            aspectRatio: 1.775
        }
    },
    {
        conditions:
        {
            modelName: "GALAXY",
            modelVersion: ["GT-P3100", "GT-P3110", "GT-P5100", "GT-P5110", "GT-P6200", "GT-P6210", "GT-P7300", "GT-P7310", "GT-P7510"]
        },
        properties:
        {
            primaryOrientation: "landscape"
        }
    },
    {
        conditions:
        {
            modelName: "GALAXY",
            modelVersion: ["GT-I9505", "GT-I9300", "GT-I8190", "GT-I9100", "GT-I8160", "GT-P6210", "GT-P7300", "GT-P7310", "GT-P7510"]
        },
        properties:
        {
            aspectRatio: 2.25
        }
    }
];