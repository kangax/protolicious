/*

Modified version of Cookie module from Livepipe.net by Ryan Johnson
(mostly "fix" few variables being declared globally + minor rearrangements)

Original version:
http://livepipe.net/downloads/prototype.tidbits.1.7.0.js

*/

var Cookie = {
	set: function(name, value, seconds) {
		var expiry = '';
		if (seconds) {
			var d = new Date();
			d.setTime(d.getTime() + (seconds * 1000));
			expiry = '; expires=' + d.toGMTString();
		}
		document.cookie = name + "=" + value + expiry + "; path=/";
	},
	get: function(name) {
		var nameEQ = name + "=", ca = document.cookie.split(';');
		for (var i=0, c; i < ca.length; i++) {
			c = ca[i];
			while (c.charAt(0) == ' ')
				c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0)
				return c.substring(nameEQ.length, c.length);
		}
		return null;
	},
	unset: function(name) {
		Cookie.set(name, '', -1);
	}
}