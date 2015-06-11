var assert = require('assert');
var _ = require('lodash');
var versionControl = require('../lib/version-control.js');

describe('install redirect', function(){

    var defaultSettings = {
        header : "x-app-version",
        platforms : {
            test : {
                link : "http://testLink",
                "1.0" : true
            }
        },
        installPath : '/install'
    };

    it('no install path in settings',function(done) {
        var req = {
            url : '/install/test',
            header : function() { }
        };

        var sendOk = false;
        var res = {
            header : function(key,value){
                assert.fail('Invalid call to header');
            },
            send : function(statusCode, err){
                var expectedError = {
                    "des": "Version header must be included",
                    "err": "no_version_header"
                };

                assert.deepEqual(err, expectedError);
                sendOk = true;
            }
        };
        var next = function(canContinue){
            assert.equal(canContinue, false, 'Invalid next call');
            assert.equal(sendOk, true, 'send not called');
            done();
        };

        var settings = _.assign({},defaultSettings);
        delete(settings.installPath);

        versionControl(settings)(req, res, next);
    });

    it('redirects client', function(done){
        var req = {
            url : '/install/test',
            header : function() { }
        };
        var headerOk = false;
        var sendOk = false;
        var res = {
            header : function(key,value){
                if(key !== 'Location') return;

                assert.equal(value, defaultSettings.platforms.test.link, 'Invalid redirect url');
                headerOk = true;
            },
            send : function(statusCode){
                assert.equal(statusCode, 302, 'Invalid redirect statusCode');
                sendOk = true;
            }
        };
        var next = function(canContinue){
            if(canContinue === false && headerOk && sendOk) done();
        };

        var settings = _.assign({}, defaultSettings);

        versionControl(settings)(req, res, next);
    });

    it('query params', function(done){
        var req = {
            url : '/install/test?i=AbCdEf1J',
            header : function() { }
        };
        var headerOk = false;
        var sendOk = false;
        var res = {
            header : function(key,value){
                if(key !== 'Location') return;

                assert.equal(value, defaultSettings.platforms.test.link, 'Invalid redirect url');
                headerOk = true;
            },
            send : function(statusCode){
                assert.equal(statusCode, 302, 'Invalid redirect statusCode');
                sendOk = true;
            }
        };
        var next = function(canContinue){
            if(canContinue === false && headerOk && sendOk) done();
        };

        var settings = _.assign({}, defaultSettings);

        versionControl(settings)(req, res, next);
    });
});