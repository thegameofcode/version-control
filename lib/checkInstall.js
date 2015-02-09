var debug = require('debug')('version-control:checkInstall');
var _ = require('lodash');

function _checkInstall(req, res, next){

    if(_settings.installPath === "") {
        return next(true);
    }

    var path = String(req.url);

    var exp = _settings.installPath + "/*";

    //wildcard
    var check = exp.replace(/\*/g,'.*');

    var match = path.match(check);
    var isInstallPath = (match != null && path == match[0]);
    debug('install path match \''+ path +'\' with \'' + check + '\' : ' + isInstallPath);
    if(isInstallPath) {
        var platformName = path.substring(_settings.installPath.length + 1);

        res.header('Location', _settings.platforms[platformName].link);
        res.send(302);
        return next(false);
    }

    next(true);
}

var _settings = {};

module.exports = function(settings) {
    _settings = _.cloneDeep(settings);

    return _checkInstall
};
