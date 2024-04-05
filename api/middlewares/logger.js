let globalRequestCounter = 0;

function getNewRequestId() {
	return ++globalRequestCounter;
}

let requestedRouter = require('express').Router();
function requested() {
	requestedRouter.use((req, res, next) => {

		req.id = getNewRequestId();

		console.log(`[${req.id}] ${global.colors.blue}-> [${req.method}] ${req.url.split('?')[0]} ${global.colors.clear}`);

		next();
	});

	return requestedRouter;
}

let respondedRouter = require('express').Router();
function responded() {
	respondedRouter.use((req, res, next) => {
		let color;

		switch (res.statusCode) {
			case 404:
			case 304:
				color = global.colors.yellow;
				break;
			case 200:
				color = global.colors.green;
				break;
			default:
				color = global.colors.red;
				break;
		}

		console.log(`[${req.id}] ${color}<- [${req.method}] ${req.url.split('?')[0]} ${global.colors.clear}`);

		console.log();
		console.log({ status: res.statusCode, body: res.statusCode === 200 ? "Sucess" : req.json });
		console.log();

		next();
	});

	return respondedRouter;
}

module.exports = {
	requested,
	responded
};
