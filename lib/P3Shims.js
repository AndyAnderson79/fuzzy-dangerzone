if( typeof Function.prototype.bind != 'function' )
{
	Function.prototype.bind = ( function()
    {
		var slice = Array.prototype.slice;

		return function( thisArg )
        {
			var target = this;
            var boundArgs = slice.call( arguments, 1 );

			if( typeof target != 'function' ) throw new TypeError();

			function bound()
            {
				var args = boundArgs.concat( slice.call( arguments ) );
				target.apply( ( this instanceof bound ) ? this : thisArg, args );
			}

			bound.prototype = ( function F( proto )
            {
				proto && ( F.prototype = proto );
				if( !( this instanceof F ) ) return new F;
			} )( target.prototype );

			return bound;
		};
	} )();
}

function Vector3( x, y, z )
{
    var vector3 = {};
    vector3.x = x || 0;
    vector3.y = y || 0;
    vector3.z = z || 0;
    vector3.lengthSquared = ( vector3.x * vector3.x ) + ( vector3.y * vector3.y ) + ( vector3.z * vector3.z );

    return vector3;
}