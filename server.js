// server.js

// Importa a instância de conexão que configuramos em 'conexaoBanco.js'
import sql from './conexaoBanco.js';

/**
 * Função para buscar e exibir os posts do blog no banco de dados.
 */
async function buscarPosts() {
    try {
        console.log("Tentando buscar posts do banco de dados...");

        // Executa uma consulta SQL (o 'sql`...`' é um template tag específico do módulo 'postgres')
        const posts = await sql`SELECT id, titulo, data_criacao FROM posts ORDER BY data_criacao DESC`;

        // Verifica se há resultados
        if (posts.length === 0) {
            console.log("Nenhum post encontrado na tabela.");
            return;
        }

        // Exibe os resultados
        console.log(`\n✅ Posts Encontrados (${posts.length}):`);
        posts.forEach(post => {
            console.log(`- ID: ${post.id} | Título: ${post.titulo} | Criado em: ${new Date(post.data_criacao).toLocaleDateString()}`);
        });

    } catch (error) {
        console.error("\n❌ Erro ao executar a consulta ou processar os dados:", error.message);
    } finally {
        // É uma boa prática encerrar o pool de conexões quando o script terminar
        // (Isso é mais comum em scripts simples, menos em servidores web em execução contínua)
        // await sql.end();
        // console.log("Conexão com o banco de dados encerrada.");
    }
}

// Chama a função principal
buscarPosts();

// Observação: Em um Servidor Web real (como o que usa o Apache mencionado antes),
// a conexão 'sql' seria mantida aberta para atender a múltiplas requisições HTTP.