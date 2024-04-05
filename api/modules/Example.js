let Query = require('../utils/query');

module.exports = {
	'GET>/api/test': async (body, conn) => {
		return 'It works!';
	},
}