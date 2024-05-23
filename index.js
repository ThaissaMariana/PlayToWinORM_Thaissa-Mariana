require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const express = require("express");
const exphbs = require("express-handlebars");

// Instanciação do servidor:
const app = express();

//Vinculação do Handlebars ao Express:
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.get("/usuarios/novo", (req, res) => {
    res.render("formUsuario");
 });

 app.get("/jogos/novo", (req, res) => {
    res.sendFile(`${__dirname}/views/formJogo.html`);
});


app.post("/usuarios/novo", async (req, res) => { 
    const dadosUsuario = {
      nickname: req.body.nickname,
      nome: req.body.nome,
    };

    const usuario = await Usuario.create(dadosUsuario);
    res.send("Usuário inserido sob o id " + usuario.id);
});

app.post("/jogos/novo", async (req, res) => {
    const dadosJogo = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        precoBase: req.body.precoBase,
    };

    const jogo = await Jogo.create(dadosJogo);
    res.send("Jogo inserido sob o id " + jogo.id);
});

app.listen(8000, () => {
    console.log("Server rodando!");
});

conn
.sync()
.then(() => {
    console.log("Conectado com sucesso!");
})
.catch( (err) => {
    console.log("Ocorreu um erro: " + err)
});