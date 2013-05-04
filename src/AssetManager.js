var AssetManager = (function()
{
    var instance;
    var assetManager = function()
    {                  
        var scaleFactor = 1;                                               
        var debugMode = false;
        var progress = 0;
        
        var queueLoader = null;
        var tempCanvas = null;
        var tempCtx = null;
        var assets = 
        {
            audio: [],
            data: [],
            fonts: [],
            images: [],
            atlases: [],
            fontAtlases: []
        };

        var textureAtlasCount = 0;
        var textureAtlasCountLoaded = 0;

        var buildAtlases = function()
        {
            var foundAtlas = null;

            for( var name in assets.data )
            {
                var image = assets.images[ name ];

                if( image )
                {
                    foundAtlas = true;
                    textureAtlasCount++;

                    var data = assets.data[ name ];

                    if( data.images && data.images[ 0 ] )
                    {
                        data.images[ 0 ] = image;

                        var atlas = new TextureAtlas( name, data, scaleFactor );
                        atlas.addEventListener( "loaded", onAtlasLoaded );
                        atlas.parseAtlas();
                    }
                    else console.log( '[AssetManager] buildAtlases(): The data does not have an image property. Are you trying to load a font?: ' + name );
                }
            }

            if( !foundAtlas ) allAssetsReady();
        };

        var buildFontAtlases = function()
        {
            var fontAtlases = [];

            for( var name in assets.fontAtlases )
            {
                var image = assets.images[ name ];

                if( image )
                {
                    var data = assets.fontAtlases[ name ];
                    var textAtlas = new FontAtlas( name, data, image );

                    fontAtlases[ name ] = textAtlas;
                }
            }

            assets.fontAtlases = fontAtlases;
        };

        var resizeAndCacheImage = function( img )
        {
            if( instance.scaleFactor != 1 )
            {
                if( tempCanvas ) tempCtx.clearRect( 0, 0, tempCanvas.width, tempCanvas.height );
                else
                {
                    tempCanvas = document.createElement('canvas');
                    tempCtx = tempCanvas.getContext( '2d' );
                    tempCtx.imageSmoothingEnabled = false;
                }

                tempCanvas.width = img.width * scaleFactor;
                tempCanvas.height = img.height * scaleFactor;

                tempCtx.scale( scaleFactor, scaleFactor );
                tempCtx.drawImage( img, 0, 0 );

                img = new Image();
                img.src = tempCanvas.toDataURL( 'image/png' );
            }

            return img;
        };

        var precacheFont = function( font )
        {
            var img = new Image();
            img.src = font.src;
            img.onerror = function()
            {
                if( tempCanvas ) tempCtx.clearRect( 0, 0, tempCanvas.width, tempCanvas.height );
                else
                {
                    tempCanvas = document.createElement('canvas');
                    tempCtx = tempCanvas.getContext( '2d' );
                    tempCtx.imageSmoothingEnabled = false;
                }

                try
                {
                    tempCtx.fillStyle = "black";
                    tempCtx.font = "20px '"+font.id+"'";
                    tempCtx.fillText( "0123456789", 0, 0 );
                }
                catch( e ){}
                finally
                {
                    tempCtx.fillText( "0123456789", 0, 0 );
                }
            };

            return font.id;
        };

        var onLoadingProgress = function( e )
        {            
            instance.progress = e.loaded;
            
            var evt = document.createEvent( "Event" );
            evt.initEvent( 'progress', true, true );
            evt.loaded = e.loaded;
            instance.dispatchEvent( evt );
            
            if( debugMode ) console.log( "[AssetManager] Loading progress: "+queueLoader.progress );
        };    
        
        var onLoadingFileLoaded = function( e )
        {
            switch( e.item.type )
            {
                case createjs.LoadQueue.IMAGE:
                    //assets.images[ e.item.id ] = resizeAndCacheImage( e.result );
                    assets.images[ e.item.id ] = e.result;
                    break;

                case createjs.LoadQueue.SOUND:
                    assets.audio[ e.item.id ] = e.item.src;
                    break;

                case createjs.LoadQueue.XML:
                case createjs.LoadQueue.CSS:
                case createjs.LoadQueue.JAVASCRIPT:     
                case createjs.LoadQueue.JSON:
                    if( e.result && e.result.info && e.result.info.face ) assets.fontAtlases[ e.item.id ] = e.result;
                    else assets.data[ e.item.id ] = e.result;
                    break;

                case createjs.LoadQueue.TEXT:
                case createjs.LoadQueue.SVG:
                    assets.fonts[ e.item.id ] = precacheFont( e.item );
                    break;
            }

            var evt = document.createEvent( "Event" );
            evt.initEvent( 'fileload', true, true );
            instance.dispatchEvent( evt );
            
            if( debugMode ) console.log( "[AssetManager] File loaded: "+e.item.id );
        };
        
        var onLoadingComplete = function( e )
        {
            buildFontAtlases();
            buildAtlases();
        };
        
        var onLoadingError = function( e )
        {
            var evt = document.createEvent( "Event" );
            evt.initEvent( 'error', true, true );
            evt.error = e;
            instance.dispatchEvent( evt );

            alert( e.toSource() );

            if( debugMode ) console.log( "[AssetManager] Loading error: "+e.error.toString() );
        };

        var onAtlasLoaded = function( e )
        {
            assets.atlases[ e.data.name ] = e.data;
            textureAtlasCountLoaded++;

            if( debugMode ) console.log( "[AssetManager] Atlas loaded: "+e.data.name );

            if( textureAtlasCountLoaded == textureAtlasCount ) allAssetsReady();
        };

        var allAssetsReady = function( e )
        {
            var evt = document.createEvent( "Event" );
            evt.initEvent( 'complete', true, true );
            instance.dispatchEvent( evt );
            instance.removeAllEventListeners();

            if( debugMode ) console.log( "[AssetManager] Loading complete" );
        };

        return {
            scaleFactor: scaleFactor,
            debugMode: debugMode,
            progress: progress,
            setScaleFactor: function( $scaleFactor )
            {
                scaleFactor = $scaleFactor;
            },
            setDebugMode: function( $debugMode )
            {
                debugMode = $debugMode;
            },
            load: function( manifest )
            {
                queueLoader = new createjs.LoadQueue( false );

                if( createjs.Sound )
                {
                    // force HTML Audio for iOS devices < v6
                    //if( ( CONNECT4.p3core.device.os == ( P3Core.IPHONE+'/'+P3Core.IPOD ) || P3Core.getInstance().device.os == P3Core.IPAD ) && P3Core.getInstance().device.version < 6 ) createjs.Sound.registerPlugin( createjs.HTMLAudioPlugin );

                    queueLoader.installPlugin( createjs.Sound );
                }
                
                queueLoader.addEventListener( "progress", onLoadingProgress );
                queueLoader.addEventListener( "fileload", onLoadingFileLoaded );
                queueLoader.addEventListener( "complete", onLoadingComplete );
                queueLoader.addEventListener( "error", onLoadingError );
                queueLoader.loadManifest( manifest );
            },
            getAudio: function( id )
            {
                return ( assets.audio[ id ] ) ? assets.audio[ id ] : null;
            },
            getTexture: function( id )
            {
                return ( assets.images[ id ] ) ? assets.images[ id ] : null;
            },
            getJSON: function( id )
            {
                return ( assets.data[ id ] ) ? assets.data[ id ] : null;
            },
            getTextureAtlas: function( id )
            {
                return ( assets.atlases[ id ] ) ? assets.atlases[ id ] : null;
            },
            getFontAtlas : function( id )
            {
                return ( assets.fontAtlases[ id ] ) ? assets.fontAtlases[ id ] : null;
            }
        };
    };

    return {
        getInstance: function()
        {                    
            if( !instance )
            {
                instance = assetManager();
                createjs.EventDispatcher.initialize( instance );
            }
            return instance;    
        }
    };
})( window );

AssetManager.EVENT_PROGRESS = 'progress';
AssetManager.EVENT_FILELOAD = 'fileload';
AssetManager.EVENT_COMPLETE = 'complete';
AssetManager.EVENT_ERROR = 'error';