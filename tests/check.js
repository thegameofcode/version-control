var assert = require('assert');
var _ = require('lodash');
var versionControl = require(process.cwd() + '/lib/version-control.js');

describe('/version endpoint',function(){

	var defaultSettings = {
		header : "x-app-version",
		platforms : {
			test : {
				link : "http://testLink",
				"1.0" : true
			}
		},
		installPath : '/install',
		errorStatusCode : 409
	};

	it('200 OK', function(done){
		var req = {
			url : '/version',
			header : function(headerKey){
				switch(headerKey){
					case settings.header:
						return 'test/1.0';
				}
			}
		};

		var sendOk = false;
		var res = {
			send : function(statusCode, err){
				assert.equal(statusCode, 200, 'Invalid redirect statusCode');
				assert.equal(err, null, err);
				sendOk = true;
			}
		};
		var next = function(canContinue){
			assert.equal(canContinue, false, 'router must stop');
			assert.equal(sendOk, true, 'send must be called');
			done();
		};

		var settings = _.clone(defaultSettings);
		versionControl(settings)(req, res, next);
	});

	it('40X Bad version', function(done){
		var req = {
			url : '/version',
			header : function(headerKey){
				switch(headerKey){
					case settings.header:
						return 'test/0.1';
				}
			}
		};

		var sendOk = false;
		var res = {
			send : function(statusCode, err){
				assert.equal(statusCode, defaultSettings.errorStatusCode, 'Invalid redirect statusCode');
				assert.deepEqual(err, {
					data: "http://testLink",
					des: "Must update to last application version",
					err: "invalid_version"
				}, err);
				sendOk = true;
			}
		};
		var next = function(canContinue){
			assert.equal(canContinue, false, 'router must stop');
			assert.equal(sendOk, true, 'send must be called');
			done();
		};

		var settings = _.clone(defaultSettings);
		versionControl(settings)(req, res, next);
	});

});
