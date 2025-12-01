// app.js

const express = require('express');
const app = express();
const path = require('path');
const conexao = require('./conexaoBanco'); // Importa a conexão do arquivo conexaoBanco.js

// Define a porta do servidor WEB (Express).
const PORTA_WEB = 3000; 

// --- CORREÇÃO 1: Middleware para Arquivos Estáticos (CSS, JS) ---
// Adiciona a pasta 'public' para servir arquivos estáticos, permitindo que o CSS e o JS sejam carregados.
app.use(express.static('public')); 

// Middleware para processar dados de formulário (body-parser)
app.use(express.urlencoded({ extended: true }));

// Tentativa de conexão ao banco de dados
conexao.connect(error => {
    if (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error);
        // Em um projeto real, você pararia o servidor aqui se a conexão falhasse.
    } else {
        console.log("✅ Conectado ao banco de dados!");
    }
});

// Configuração do View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- ROTAS ---

// Rota principal: Exibe todos os blogs
app.get('/', (req, res) => {
    try {
        const sql = "SELECT * FROM blogs ORDER BY id DESC";
        conexao.query(sql, (error, blogs) => {
            if (error) {
                console.error('Erro ao buscar blogs:', error);
                // O erro ER_NO_SUCH_TABLE (1146) será pego aqui.
                return res.status(500).send('Erro ao buscar blogs ou a tabela não existe.');
            }
            res.render('index', { titulo: 'Home', blogs: blogs });
        });
    } catch (e) {
        res.status(500).send('Erro interno do servidor.');
    }
});

// --- Rota Dinâmica (Adicionada para funcionalidade completa do Blog) ---
// Rota para visualizar um único blog pelo ID.
app.get('/blogs/:id', (req, res) => {
    try {
        const id = req.params.id;
        const sql = "SELECT * FROM blogs WHERE id = ?";
        conexao.query(sql, [id], (error, result) => {
            if (error) {
                console.error('Erro ao buscar blog específico:', error);
                return res.status(500).send('Erro ao buscar blog específico.');
            }
            if (result.length === 0) {
                return res.status(404).render('404', { titulo: '404' });
            }
            // Assume que você tem um arquivo views/detalhes.ejs
            res.render('detalhes', { blog: result[0], titulo: result[0].titulo });
        });
    } catch (e) {
        res.status(500).send('Erro interno do servidor.');
    }
});
// -----------------------------------------------------------------------


// Rotas estáticas
app.get('/sobre', (req, res) => {
    res.render('sobre', { titulo: 'Sobre' });
});

app.get('/sobrenos', (req, res) => {
    res.redirect('/sobre');
});

// Rota para exibir o formulário de criação
app.get('/blog/criar', (req, res) => {
    res.render('criar', { titulo: 'Criar Blog' });
});

// Rota POST para inserir o blog no banco de dados
app.post('/blogs', (req, res) => {
    try {
        const { titulo, conteudo } = req.body;
        
        const sql = "INSERT INTO blogs (titulo, conteudo) VALUES (?, ?)";
        
        conexao.query(sql, [titulo, conteudo], (error, result) => {
            if (error) {
                console.error('Erro ao inserir blog:', error);
                return res.status(500).send('Erro ao criar blog');
            }
            res.redirect('/');
        });
    } catch (e) {
        res.status(500).send('Erro interno do servidor.');
    }
});

// Middleware 404 (deve ser o último middleware)
app.use((req, res) => {
    res.status(404).render('404', { titulo: '404' });
});

// --- INICIALIZAÇÃO ---

app.listen(PORTA_WEB, () => {
    console.log(`🚀 Servidor rodando na porta ${PORTA_WEB}`);
    console.log(`Acesse: http://localhost:${PORTA_WEB}`);
});