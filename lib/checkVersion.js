var debug = require('debug')('version-control:checkVersion');
var _ = require('lodash');

var errors = require('./errors');

function _checkVersion(req, res, next){
    var path = String(req.url);

    var versionHeaderValue = req.header(_settings.header);
    if (!versionHeaderValue) {
        debug('header \''+_settings.header+'\' not found');
        res.send(400, errors.noVersionHeader);
        return next(false);
    }
    debug('header found \''+_settings.header+' '+versionHeaderValue+'\'');

    var split = versionHeaderValue.split("/");
    if (split.length < 2) {
        debug('invalid header format');
        res.send(400, errors.invalidPlatform);
        return next(false);
    }

    var platform = split[0];
    var platformAvailable = _settings.platforms[platform];
    if (platformAvailable === undefined) {
        debug('invalid platform included in header');
        res.send(400, errors.invalidPlatform);
        return next(false);
    }
    debug('platform found: ' + platform);

    var platformVersion = split[1];
    var platformVersionAvailable = platformAvailable[platformVersion];
    if (platformVersionAvailable === undefined) {
        debug('invalid version in header');

        var err = _.assign({},errors.invalidVersion, {data:platformAvailable.link});
        res.send(400, err);
        return next(false);
    }

    if(platformVersionAvailable === true) {
        debug('valid version');
        return next(true);
    }

    next(false);
}

var _settings = {};

module.exports = function(settings) {
    _settings = _.assign({},settings);

    return _checkVersion
};
