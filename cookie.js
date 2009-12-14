/*

Modified version of Cookie module

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
		var cookies = document.cookie.split(/;\s*/);
		var nameEQ = name + "=", c = cookies.find(function(s){return s.startsWith(nameEQ);});
		return c? c.substr(nameEQ.length) : null;
	},
	unset: function(name) {
		Cookie.set(name, '', -1);
	}
}