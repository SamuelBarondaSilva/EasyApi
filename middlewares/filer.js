let router = require('express').Router();

function filer(upload) {

	router.post('*', upload.single('file'), (req, res, next) => {
		req.body.file = req.file || '';
		next();
	});

	return router;
}

module.exports = filer;