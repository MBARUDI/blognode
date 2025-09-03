const express = require('express');
const app = express();
const path = require('path');
const conexao = require('./conexaoBanco');

// Middleware para processar dados de formulário
app.use(express.urlencoded({ extended: true }));

conexao.connect(error => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        return;
    }
    console.log("Conectado ao banco de dados!");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});

// Rotas existentes...
app.get('/', (req, res) => {
    const sql = "SELECT * FROM blogs ORDER BY id DESC";
    conexao.query(sql, (error, blogs) => {
        if (error) {
            console.error('Erro ao buscar blogs:', error);
            return res.status(500).send('Erro ao buscar blogs');
        }
        res.render('index', { titulo: 'Home', blogs: blogs });
    });
});

app.get('/sobre', (req, res) => {
    res.render('sobre', { titulo: 'Sobre' });
});

app.get('/sobrenos', (req, res) => {
    res.redirect('/sobre');
});

app.get('/blog/criar', (req, res) => {
    res.render('criar', { titulo: 'Criar Blog' });
});

// Nova rota para enviar o blog para o banco de dados
app.post('/blogs', (req, res) => {
    const { titulo, conteudo } = req.body;
    
    const sql = "INSERT INTO blogs (titulo, conteudo) VALUES (?, ?)";
    
    conexao.query(sql, [titulo, conteudo], (error, result) => {
        if (error) {
            console.error('Erro ao inserir blog:', error);
            return res.status(500).send('Erro ao criar blog');
        }
        // Redireciona para a página principal para ver o novo blog
        res.redirect('/');
    });
});

app.use((req, res) => {
    res.status(404).render('404', { titulo: '404' });
});
