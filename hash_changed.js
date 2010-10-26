// inspired by nakajima's http://github.com/nakajima/nakatype/tree/master/src/event_hash_changed.js
// Fires hash:changed event when document.location.hash changes
// oldValue and newValue are passed as properties of event's memo

(function() {
	var loc = document.location, current = loc.hash;
	setInterval(function() {
		if (loc.hash != current) {
			document.fire('hash:changed', { oldValue: current, newValue: loc.hash })
			current = loc.hash;
		}
	}, 200)
})()
