var mongoose = require('mongoose');

var installationSchema = new mongoose.Schema({
	installId: String
});

mongoose.model('Installation', installationSchema);
module.exports = installationSchema;