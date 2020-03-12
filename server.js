const express = require('express');
const path = require('path');

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