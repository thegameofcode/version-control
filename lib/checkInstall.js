"use strict";

var debug = require('debug')('version-control:checkInstall');
var mongoose = require('mongoose');
var async = require('async');

require('./schemas/installation.js');
var Installation = mongoose.model('Installation');
var errors = require('./errors');

module.exports = function(settings) {

	function _checkInstall(req, res, cbk){
		if(settings.installPath === "") {
			return cbk(null, false);
		}

		var path = String(req.url);

		var exp = settings.installPath + "/*";

		//wildcard
		var check = exp.replace(/\*/g,'.*');

		var match = path.match(check);
		var isInstallPath = (match != null && path == match[0]);
		debug('install path match \''+ path +'\' with \'' + check + '\' : ' + isInstallPath);
		if(isInstallPath) {
			var platformName = path.substring(settings.installPath.length + 1);
			if(platformName.indexOf('?')>0){
				platformName = platformName.substring(0, platformName.indexOf('?'));
			}

			if (!settings.platforms || !settings.platforms[platformName] || !settings.platforms[platformName].link) {
				res.send(400, errors.invalidPlatform);
				return cbk(errors.invalidPlatform);
			}

			res.header('Location', settings.platforms[platformName].link);
			res.send(302);

			if(!settings.db){
				return cbk(null, true);
			}

			async.series([
				function(done){
					if(mongoose.connection.readyState === 0){
						mongoose.connect(settings.db, function() {
							done();
						});
					} else {
						done();
					}
				},
				function(done){
					var installation = new Installation({});
					if(req.query && req.query.i) {
						installation.installId = req.query.i;
					}

					installation.save(function(){
						done();
					});
				}
			],function(){
				cbk(null, true);
			});

			return;
		}

		cbk(null, false);
	}

	return _checkInstall
};
