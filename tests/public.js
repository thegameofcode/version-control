var assert = require('assert');
var _ = require('lodash');
var versionControl = require('../lib/version-control.js');

describe('public paths', function(){

    var defaultSettings = {
        "header" : "x-app-version",
        "platforms" : {
            "test" : {
                "link" : "http://testLink",
                "1.0" : true
            }
        },
        "public" : []
    };

    it('no public field in settings', function(done){
        var req = {
            path : '/private/path/4',
            header : function(){
                return undefined
            }
        };
        var res = {
            send : function(status){
            }
        };
        var next = function(canContinue){
            assert.equal(canContinue, false, 'Invalid next call');
            done();
        };

        var settings = _.assign({}, defaultSettings);
        delete(settings.public);

        versionControl(settings)(req, res, next);
    });

    it('array of allowed urls', function(done){
        var req = {
            url : '/public/path/4',
            header : function(){
                return undefined
            }
        };
        var res = {
            send : function(status, err){
                assert.equal(err, null, 'send method should not be called');
                assert.equal(status, 0, 'send method should not be called');
            }
        };
        var next = function(canContinue){
            assert.equal(canContinue, true, 'Invalid next call');
            done();
        };

        var settings = _.assign({}, defaultSettings);
        settings.public.push('/public/path/1');
        settings.public.push('/public/path/2');
        settings.public.push('/public/path/4/not');
        settings.public.push('/public/path/4');

        versionControl(settings)(req, res, next);
    });

    it('wildcard', function(done){
        var req = {
            url : '/public/path/2',
            header : function(){
                return undefined
            }
        };
        var res = {
            send : function(status, err){
                assert.equal(err, null, 'send method should not be called');
                assert.equal(status, 0, 'send method should not be called');
            }
        };
        var next = function(canContinue){
            assert.equal(canContinue, true, 'Invalid next call');
            done();
        };

        var settings = _.assign({}, defaultSettings);
        settings.public.push('/public/*');

        versionControl(settings)(req, res, next);
    });
});