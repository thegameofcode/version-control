var debug = require('debug')('version-control:checkPublic');

var _ = require('lodash');

var _publicUrls = [];

function _checkPublic(req, res, cbk){
    var path = String(req.url);

    for(var i = 0; i < _publicUrls.length; i++){
        var exp = _publicUrls[i];

        //wildcard
        var check = exp.replace(/\*/g,'.*');

        var match = path.match(check);
        var isPublic = (match != null && path == match[0]);
        debug('match \''+ path +'\' with \'' + exp + '\' : ' + isPublic);
        if(isPublic) {
            debug('public path \''+path+'\'');
            return cbk(true);
        }
    }
    debug('private path \''+path+'\'');

    cbk(false);
}

module.exports = function(publicUrls) {
    _publicUrls = _.cloneDeep(publicUrls);

    return _checkPublic
};
