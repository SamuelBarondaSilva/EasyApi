let router = require('express').Router();
let mysql = require('mysql2/promise');
let fs = require('fs');

let pool = mysql.createPool({
	connectionLimit: 10,
	host: '127.0.0.1',
	port: '3306',
	user: 'root',
	password: 'root',
	database: 'hcx',
});

let connection;

function asyncHandler(fn) {
	return function (req, res, next) {
		if (connection) {
			connection.rollback();
			connection.release();
		}
		Promise.resolve(fn(req, res, next)).catch(next).then(next);
	};
}

function routes() {

	let modules = {};

	fs.readdirSync('./modules').forEach(file => {
		let apiUrl = file.split('.')[0];
		modules = { ...modules, ...require(`../modules/${apiUrl}`) };
	})

	fs.readdirSync('./modules').forEach(file => {
		let apiUrl = file.split('.')[0];
		let apis = require(`../modules/${apiUrl}`);
		Object.keys(apis).forEach((api) => {
			console.log(`[ROUTE] ${api}`)

			let method = api.split('>')[0];
			let endpoint = api.split('>')[1];

			router.post(`/${api}`, asyncHandler(async (req, res) => {
				let result;
				let { body, query } = req;

				body = { ...body, ...query, params: req.params };

				let paramNames = Object.keys(req.params);
				let apiUrlWithPath = req.url.slice(1); // Remove the leading slash
				paramNames.forEach(param => {
					apiUrlWithPath = apiUrlWithPath.replace(req.params[param], `:${param}`);
				});

				if (!modules[apiUrlWithPath]) { throw { message: `API não encontrada: ${apiUrlWithPath}`, status: 404 }; }

				let apiCall = modules[apiUrlWithPath];

				connection = await pool.getConnection();
				await connection.beginTransaction();

				body.modules = modules;

				result = await apiCall(body, connection);

				if (result === undefined) { throw { message: 'Response was undefined', status: 500 }; };

				req.json = { status: 1, body: result };

				connection.commit();
				connection.release();

				res.send(req.json);
			})
			)
		});
	});

	return router;
}

module.exports = routes;