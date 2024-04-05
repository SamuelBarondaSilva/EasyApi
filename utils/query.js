
/**
 * 
 * @param {*} conn 
 * @param {*} queryString 
 * @param {*} settings { canBeEmpty: false, isPool: false}
 * @returns 
 */

async function Query(conn, queryString, settings = {}) {
	try {

		let result;
		let { canBeEmpty = false, isPool = false } = settings;

		if (isPool) {
			conn = await conn.getConnection();
			await conn.beginTransaction();
		}

		[result] = await conn.query(queryString);

		if ((result.length === 0 || result.affectedRows === 0) && !canBeEmpty) {
			throw { message: `Nada Encontrado`, status: 404 };
		}


		if (isPool) {
			await conn.commit();
			conn.release();
		}

		return result;
	} catch (err) {
		console.log(err);
		let color = global.colors.red;
		let message = `ERROR`

		if (err.status === 404) {
			color = global.colors.yellow;
			message = `NOT FOUND`;
		}
		throw { message: err.message || `Erro ao executar query: ${err.code}`, status: err.status || 500 };
	}
}
module.exports = Query;