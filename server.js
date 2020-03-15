const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://victor:Milani12@cluster0-ibnut.mongodb.net/chat?retryWrites=true&w=majority');

const schema = new mongoose.Schema({

    name: String,
    email: String,
    senha: String

});

const usuariosDB = mongoose.model('users', schema);

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public'), {index: false}));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/',(req, res) =>{
    res.render('login');
});

app.post('/chat', (req, res) => {
    let name = req.body.nome_login;
    res.render('chat', {
        name: name
    });
});

app.post('/cadastrar', async (req, res) => {
    //TODO: PEGAR DADOS E JOGAR NA VARIAVEL
    let nome = req.body.nome_cad;
    let email = req.body.email_cad;
    let senha = req.body.senha_cad;

    //CHAMAR O MONGOOSE

    let usuario = new usuariosDB({

        name: nome,
        email: email,
        senha: senha

    });

    usuario = await usuario.save();
    console.log(usuario);

    res.render('login');

});

let messages = [];

io.on('connection', socket =>{
    console.log(`Socket conectado: ${socket.id}`);

    socket.on('sendMessage', data =>{
        console.log(data);
        messages.push(data);
        socket.emit('receivedMessage', data);
        socket.broadcast.emit('receivedMessage', data);
        console.log('emiti on evento');
    });
});

let porta = process.env.PORT || 3000;

server.listen(porta, function() {
    console.log('server iniciado');
});