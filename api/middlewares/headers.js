let router = require('express').Router();

function headers() {
	router.use(async (req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		res.header('Content-Type', 'application/json');
		next();
	});

	return router;
}

module.exports = headers;