// conexaoBanco.js

// 1. Declara a variável mysql (APENAS UMA VEZ)
const mysql = require('mysql2');

// 2. Cria e configura o objeto de conexão
const connection = mysql.createConnection({
    host: 'localhost',
    // Usando a porta 3307, como configurado no my.ini
    port: 3307, 
    user: 'root',
    // Usando a senha que você definiu no MariaDB
    password: 'Mdb0729', 
    database: 'blog' // Substitua pelo nome real do seu banco de dados
});

// 3. Exporta o objeto de conexão para ser usado por outros arquivos
module.exports = connection;