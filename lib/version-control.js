var clone = require('clone');
var extend = require('util')._extend;
var debug = require('debug')('version-control');

var defaultSettings = {
    "header" : "x-app-version",
    "platforms" : {
        "all" : {
            "link": "http://test.link",
            "1.0" : true
        }
    },
    "public" : []
};

var errInvalidVersion = {
    err:"invalid_version",
    des:"Must update to last application version"
};

var errNoVersionHeader = {
    err:"no_version_header",
    des:"Version header must be included"
};

var errInvalidPlatform = {
    err:"invalid_version_platform",
    des:"Version header is invalid"
};

function checkVersion(req,res,next){
    var versionHeaderValue = req.header(_settings.header);

    var path = String(req.url);
    debug('version control for path \''+path+'\'');
    for(var i = 0; i < _settings.public.length; i++){
        var exp = _settings.public[i];

        //wildcard
        var check = exp.replace(/\*/g,'.*');

        var match = path.match(check);
        var isPublic = (match != null && path == match[0]);
        debug('match \''+ path +'\' with \'' + exp + '\' : ' + isPublic);
        if(isPublic) {
            debug('public path \''+path+'\'');
            return next();
        }
    }
    debug('private path \''+path+'\'');

    if (!versionHeaderValue) {
        debug('header \''+_settings.header+'\' not found');
        res.send(400, errNoVersionHeader);
        return next(false);
    }
    debug('header found \''+_settings.header+' '+versionHeaderValue+'\'');

    var split = versionHeaderValue.split("/");
    if (split.length < 2) {
        debug('invalid header format');
        res.send(400, errInvalidPlatform);
        return next(false);
    }

    var platform = split[0];
    var platformAvailable = _settings.platforms[platform];
    if (platformAvailable === undefined) {
        debug('invalid platform included in header');
        res.send(400, errInvalidPlatform);
        return next(false);
    }
    debug('platform found: ' + platform);

    var platformVersion = split[1];
    var platformVersionAvailable = platformAvailable[platformVersion];
    if (platformVersionAvailable === undefined) {
        debug('invalid version in header');
        errInvalidVersion.data = platformAvailable.link;
        res.send(400, errInvalidVersion);
        return next(false);
    }

    if(platformVersionAvailable === true) {
        debug('valid version');
        return next();
    }

    next(false);
}

var _settings = {};
module.exports = function(settings){
    _settings = clone(defaultSettings);
    _settings = extend(_settings, settings);

    return checkVersion;
} ;