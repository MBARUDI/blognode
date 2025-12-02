// conexaoBanco.js


import postgres from 'postgres';
import 'dotenv/config'; // Usado para carregar as variáveis do arquivo .env

// O driver 'postgres' usa a variável de ambiente DATABASE_URL por padrão.
// A string de conexão deve ser formatada como:
// postgresql://user:password@host:port/database

const connectionString = process.env.DATABASE_URL;

// Verifica se a variável de ambiente está definida
if (!connectionString) {
    console.error("ERRO: A variável de ambiente DATABASE_URL não está definida.");
    // Encerra o processo se a configuração vital estiver faltando
    process.exit(1);
}

// Cria uma instância de conexão. Por padrão, cria um pool de conexões otimizado.
const sql = postgres(connectionString, {
    // Configurações otimizadas para Serverless (Vercel)
    max: 1,             // 1 conexão por lambda para não estourar o limite do banco
    idle_timeout: 20,   // Fecha conexões ociosas rapidamente
    connect_timeout: 10,
    ssl: 'require'      // Exige SSL (necessário para Supabase/Cloud)
});

// Exemplo de verificação de conexão (opcional)
sql`SELECT 1`.then(() => {
    console.log("Conexão com PostgreSQL estabelecida com sucesso!");
}).catch(err => {
    console.error("ERRO ao conectar ao PostgreSQL:", err.message);
    // Não encerra aqui, pois o pool pode tentar se reconectar
});


// Exporta a instância 'sql' para ser usada para executar consultas em outros arquivos.
export default sql;

