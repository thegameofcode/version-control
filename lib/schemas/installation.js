var mongoose = require('mongoose');

var installationSchema = new mongoose.Schema({
	installId: String,
	timestamp: {type: Date, default: Date.now}
});

mongoose.model('Installation', installationSchema);
module.exports = installationSchema;