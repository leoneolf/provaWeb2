// Imports.
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

//Conexão com o Banco de dados.
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prova_login'
});

var app = express();


//Arquivos estaticos.
app.use(express.static('public'))
//app.use('/css', express.static(__dirname + 'public/css'))
//app.use('/img', express.static(__dirname + 'public/img'))
//app.use('/fonts', express.static(__dirname + 'public/fonts'))

//Setar as views.
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('', (req, res) => {
    res.render('index')
})

app.get('/home', (req, res) => {
    res.render(__dirname + '/views/home.ejs')
})

//Deixando o Exprees saber que estamos utilizando alguns dos seus pacotes.
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//fazendo a conexão e verificando os dados.
app.post('/auth', function (request, response) {
    var login = request.body.login;
    var senha = request.body.senha;
    if (login && senha) {
        connection.query('SELECT * FROM usuarios WHERE login = ? AND senha = ?', [login, senha], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.login = login;
                response.redirect('/home');
            } else {
                response.send('Login ou Senha incorretos!');
            }
            response.end();
        });
    } else {
        response.send('Por favor, digite o login e senha!');
        response.end();
    }
});

//Caso estaja correto entra, se não aparece o erro.
app.get('/home', function (request, response) {
    if (request.session.loggedin) {
        response.send('Bem vindo, ' + request.session.login + '!');
    } else {
        response.send('Por favor, faça o login para ver a pagina!');
    }
    response.end();
});



app.listen(3000);