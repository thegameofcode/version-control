var _ = require('lodash');
var debug = require('debug')('version-control');

var defaultOptions = {
	header : "x-app-version",
	platforms : {
		all : {
			link: "http://test.link",
			"1.0" : true
		}
	},
	public : [],
	installPath : "",
	versionPath: "/version"
};

module.exports = function(settings){
	var options = _.assign({}, defaultOptions, settings);

	var _checkInstall = require('./checkInstall')(options);
	var _checkPublic = require('./checkPublic')(options.public);
	var _checkHeader = require('./checkHeader')(options);
	var _checkVersion = require('./checkVersion')(options);

	function check(req, res, next){
		var path = String(req.url);
		debug('version control for path \''+path+'\'');

		_checkInstall(req, res, function(isInstallPath){
			if (isInstallPath === true) {
				return next(false);
			}

			_checkPublic(req, res, function(isPublic){
				if (isPublic === true) {
					return next(true);
				}

				_checkHeader(req, res, function(canContinue){
					if (canContinue === false) {
						return next(false);
					}

					_checkVersion(req, res, function(isVersionPath){
						if (isVersionPath === true) {
							return next(false);
						}

						return next(true);
					});
				});
			});
		});
	}

	return check;
} ;