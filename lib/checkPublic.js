var debug = require('debug')('version-control:checkPublic');

module.exports = function(publicUrls) {

    function _checkPublic(req, res, cbk){
        var path = String(req.url);

        for(var i = 0; i < publicUrls.length; i++){
            var exp = publicUrls[i];

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

    return _checkPublic
};
