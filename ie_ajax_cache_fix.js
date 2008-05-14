// Preventing IE from caching Ajax requests

Ajax.Responders.register({
  onCreate: function(req) {
    req.url += (/\?/.test(req.url) ? '&' : '?') + '_token=' + Date.now();
  }
});