var debug = require('debug')('version-control:checkInstall');

module.exports = function(settings) {

    function _checkInstall(req, res, cbk){
        if(settings.installPath === "") {
            return cbk(false);
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

            res.header('Location', settings.platforms[platformName].link);
            res.send(302);
            return cbk(true);
        }

        cbk(false);
    }

    return _checkInstall
};
