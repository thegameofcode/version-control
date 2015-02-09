var _ = require('lodash');
var debug = require('debug')('version-control');

var defaultSettings = {
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
    var _settings = _.assign({}, defaultSettings, settings);

    var _checkInstall = require('./checkInstall')(_settings);
    var _checkPublic = require('./checkPublic')(_settings.public);
    var _checkVersion = require('./checkVersion')(_settings);

    function check(req, res, next){
        var path = String(req.url);
        debug('version control for path \''+path+'\'');

        _checkInstall(req, res, function(cont){
            if (cont === false) {
                return next(false);
            }

            _checkPublic(req, res, function(isPublic){
                if (isPublic === true) {
                    return next(true);
                }

                _checkVersion(req, res, function(cont){
                    if(cont === false){
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