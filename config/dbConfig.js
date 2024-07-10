// DATABASE CONFIGURATION
const mongoose = require('mongoose');

// GET DATABASE DETAILS
const databaseConfig = require('../secrets/dbSecrets');
const dbUrl = databaseConfig.dbUrl;
const dbName = databaseConfig.dbName;

const db = mongoose.connection;

// REPLACE MONGOOSE PROMISE BY NODE NATIVE PROMISE(RECOMMENDED)
mongoose.Promise = global.Promise

// CREATE CONNECTION
mongoose.connect(dbUrl, { useMongoClient: true }).catch((err) => console.log(`\n Ocorreu algum erro durante a conexão com o ${dbName} database 
\n ERROR :	${err}`));

// SET EVENT LISTENERS
db.on('connected', () => console.log(`\n é conectado com sucesso ao servidor ${dbName} database`))
db.on('disconnected', () => console.log(`\n Banco de dados desconectado ! ! !`));

//END