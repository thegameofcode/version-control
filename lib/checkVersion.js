var debug = require('debug')('version-control:checkInstall');

module.exports = function(settings) {

	function _checkVersion(req, res, cbk){
		if(settings.versionPath === "") {
			return cbk(false);
		}

		var path = String(req.url);

		var exp = settings.versionPath;

		//wildcard
		var check = exp.replace(/\*/g,'.*');

		var match = path.match(check);
		var isVersionPath = (match != null && path == match[0]);
		debug('version path match \''+ path +'\' with \'' + check + '\' : ' + isVersionPath);
		if(isVersionPath) {
			res.send(200);
			return cbk(true);
		}

		cbk(false);
	}

	return _checkVersion
};
