let { requested, responded } = require('./middlewares/logger');
let headers = require('./middlewares/headers');
let routes = require('./middlewares/routes');
let error = require('./middlewares/error');
let filer = require('./middlewares/filer');
let express = require('express');
let multer = require('multer');

let app = express();

let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		let randomName = Math.random().toString(36).substring(7);
		let filename = `${randomName}.${file.originalname.split('.').pop()}`;
		cb(null, filename);
	}
});

let upload = multer({ storage: storage });

globa.port = process.env.PORT || 3000;
global.code = 0;
global.pools = {};
global.colors = {
	red: '\u001b[31;1m',
	green: '\u001b[32;1m',
	blue: '\u001b[36;1m',
	yellow: '\u001b[33;1m',
	clear: '\x1b[0m',
}

app.use(express.json());
app.use(headers());

app.use(filer(upload));
app.use(requested());
app.use(routes());
app.use(error);
app.use(responded());

process.on('SIGINT', () => {
	console.log('')
	console.log('END');
	console.log('Desligando o servidor...');
	process.exit();
});

app.listen(global.port, () => {
	console.log(`Servidor Iniciado na porta ${global.port}`);
	console.log('? [] Query ou método');
	console.log('? -> Chegando no servidor');
	console.log('? <- Saindo do servidor');
	console.log('? !! Avisos');
	console.log('? ?? Debugs');
	console.log(`?${global.colors.blue} AZUL: Requisições recebidas ${global.colors.clear}`);
	console.log(`?${global.colors.green} VERDE: Respostas enviadas ${global.colors.clear}`);
	console.log(`?${global.colors.yellow} AMARELO: Erros 404 ${global.colors.clear}`);
	console.log(`?${global.colors.red} VERMELHO: Erros 500 ${global.colors.clear}`);
	console.log('SRT');
});
