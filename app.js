import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from './conexaoBanco.js';

const app = express();

// Configuração do __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a porta do servidor WEB
const PORTA_WEB = 3000;

// Middleware para Arquivos Estáticos (CSS, JS)
app.use(express.static('public'));

// Middleware para processar dados de formulário
app.use(express.urlencoded({ extended: true }));

// Configuração do View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- ROTAS ---

// Rota principal: Exibe todos os posts
app.get('/', async (req, res) => {
    try {
        const posts = await sql`SELECT * FROM posts ORDER BY id DESC`;
        res.render('index', { titulo: 'Home', blogs: posts });
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        res.status(500).send(`Erro ao buscar posts: ${error.message}`);
    }
});

// Rota para visualizar um único post pelo ID
app.get('/blogs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await sql`SELECT * FROM posts WHERE id = ${id}`;

        if (result.length === 0) {
            return res.status(404).render('404', { titulo: '404' });
        }

        res.render('detalhes', { blog: result[0], titulo: result[0].titulo });
    } catch (error) {
        console.error('Erro ao buscar post específico:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Rotas estáticas
app.get('/sobre', (req, res) => {
    res.render('sobre', { titulo: 'Sobre' });
});

app.get('/sobrenos', (req, res) => {
    res.redirect('/sobre');
});

// Rota para exibir o formulário de criação
app.get('/blog/criar', (req, res) => {
    res.render('criar', { titulo: 'Criar Post' });
});

// Rota POST para inserir o post no banco de dados
app.post('/blogs', async (req, res) => {
    try {
        const { titulo, conteudo } = req.body;

        await sql`INSERT INTO posts (titulo, conteudo) VALUES (${titulo}, ${conteudo})`;

        res.redirect('/');
    } catch (error) {
        console.error('Erro ao inserir post:', error);
        res.status(500).send('Erro ao criar post');
    }
});

// Middleware 404 (deve ser o último middleware)
app.use((req, res) => {
    res.status(404).render('404', { titulo: '404' });
});

// --- INICIALIZAÇÃO ---

// Apenas inicia o servidor se o arquivo for executado diretamente (não importado pelo Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORTA_WEB, () => {
        console.log(`🚀 Servidor rodando na porta ${PORTA_WEB}`);
        console.log(`Acesse: http://localhost:${PORTA_WEB}`);
    });
}

export default app;