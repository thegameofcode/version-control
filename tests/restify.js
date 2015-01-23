var request = require('request');
var restify = require('restify');
var versionControl = require('../lib/version-control.js');
var assert = require('assert');

describe('compatibility',function(){
    describe('restify', function(){

        it('private',function(done){
            var server = restify.createServer({
                name: 'restify-test-server'
            });

            server.use(versionControl());
            server.get('/private', function(req,res,next){
                res.send(200);
                next();
            });
            server.listen(3000, function(){
                var options = {
                    url: 'http://localhost:3000/private',
                    headers: {
                        'x-app-version': 'all/1.0'
                    },
                    method: 'GET'
                };

                request(options, function (err, res, body) {
                    server.close();
                    assert.equal(err, null);
                    assert.equal(res.statusCode, 200, body);
                    done();
                });
            });
        });

        it('public',function(done){
            var server = restify.createServer({
                name: 'restify-test-server'
            });

            var options = {
                public : [
                    '/public'
                ]
            };

            server.use(versionControl(options));
            server.get('/public', function(req,res,next){
                res.send(200);
                next();
            });
            server.listen(3000, function(){
                var options = {
                    url: 'http://localhost:3000/public',
                    method: 'GET'
                };

                request(options, function (err, res, body) {
                    server.close();
                    assert.equal(err, null);
                    assert.equal(res.statusCode, 200, body);
                    done();
                });
            });
        });
    });
});
