"use strict";

var assert = require('assert');
var _ = require('lodash');
var should = require('chai').should();
var mongoose = require('mongoose');
var shortid = require('shortid');
var versionControl = require('../lib/version-control.js');
var errors = require('../lib/errors.js');

require('../lib/schemas/installation');
var Installation = mongoose.model('Installation');

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

    it('no install path in settings', function(done) {
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

        var settings = _.assign({}, defaultSettings);
        delete(settings.installPath);

        versionControl(settings)(req, res, next);
    });

    it('missing platform on settings', function(done) {
        var req = {
            url : '/install/UNKNOWN',
            header : function() { }
        };

		var sendOk = false;

        var res = {
            header : function(key,value){
                assert.fail('Invalid call to header');
            },
            send : function(statusCode, err) {
				var expectedError = errors.invalidPlatform;
                assert.equal(statusCode, 400, 'It should send error 400 on unknown platform');
                assert.deepEqual(err, expectedError);
                sendOk = true;
            }
        };

        var next = function(canContinue) {
            assert.equal(canContinue, errors.invalidPlatform, 'Invalid next call');
            assert.equal(sendOk, true, 'send should be called');
            done();
        };

        var settings = _.assign({},defaultSettings);

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
        var installationId = shortid.generate();

        var req = {
            url : '/install/test?i=' + installationId,
            header : function() { },
            query : {
                i: installationId
            }
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
            canContinue.should.be.false;
            headerOk.should.be.true;
            sendOk.should.be.true;

            Installation.findOne({installId:installationId}).exec(function(err, installation){
                should.not.exist(err);
                installation.installId.should.be.equal(installationId);
                done();
            });
        };

        var settings = _.clone(defaultSettings);
        settings.db = process.env.MONGO_URI || "mongodb://localhost/versionControl?w=1";

        mongoose.connect(settings.db, function(err){
            should.not.exist(err);
            Installation.remove({}, function(){
                versionControl(settings)(req, res, next);
            });
        });

    });
});
