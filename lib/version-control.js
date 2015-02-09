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
    installPath : ""
};

module.exports = function(settings){
    var options = _.assign({}, defaultOptions, settings);

    var _checkInstall = require('./checkInstall')(options);
    var _checkPublic = require('./checkPublic')(options.public);
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

                _checkVersion(req, res, function(canContinue){
                    if(canContinue === false){
                        return next(false)
                    } else {
                        return next(true)
                    }
                });

            });
        });
    }

    return check;
} ;