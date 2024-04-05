async function error(err, req, res, next) {
	if (err.code !== undefined) {
		if (err.response && err.response.data) {
			err = {
				status: 500,
				message: err.response.data
			}
		} else {
			err = {
				status: 500,
				message: err.message
			}
		}
	}

	let { message } = err;

	req.json = message;
	res.status(err.status || 500).send({ status: 0, body: message });
}

module.exports = error;