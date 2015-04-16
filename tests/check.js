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
		installPath : '/install'
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

		var settings = _.assign({},defaultSettings);
		versionControl(settings)(req, res, next);
	});


});