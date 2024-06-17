// Importações de módulos
require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");
const Jogo = require("./models/Jogo");
const express = require("express");
const exphbs = require("express-handlebars");
const { where } = require("sequelize");

// Instanciação do servidor:
const app = express();

//Vinculação do Handlebars ao Express:
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//Configurações no express para facilitar a captura de dados recebidos de formulários
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll ({ raw: true });

    res.render("usuarios", { usuarios });
});

app.get("/jogos", async (req, res) => {
    const jogos = await Jogo.findAll ({ raw: true });

    res.render("jogos", { jogos });
});

app.get("/usuarios/novo", (req, res) => {
    res.render("formUsuario");
 });

 app.get("/jogos/novo", (req, res) => {
    res.render("formJogo");
});


app.post("/usuarios/novo", async (req, res) => { 
    const dadosUsuario = {
      nickname: req.body.nickname,
      nome: req.body.nome,
    };

    const usuario = await Usuario.create(dadosUsuario);
    res.send("Usuário inserido sob o id " + usuario.id);
});

app.get("/usuarios/:id/update", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formUsuario", { usuario });
});

app.post("/usuarios/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    };

    const retorno = await Usuario.update(dadosUsuario, { where: { id: id }, });

    if(retorno>0){
        res.redirect("/usuarios");
    } else {
        res.send("Erro ao atualizar usuário")
    }
});

app.post("/usuarios/:id/delete", async (req, res) => {
    const id = parseInt(req.params.id);

    const retorno = await Usuario.destroy({ where: { id: id } });

    if (retorno > 0){
        res.redirect("/usuarios");
    } else {
        res.send("Erro ao excluir usuário")
    }
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

app.get("/jogos/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });
  
    res.render("formJogo", { jogo });
  });
  
  app.post("/jogos/:id/update", async (req, res) => {
      const id = parseInt(req.params.id);
  
      const dadosJogo = {
          titulo: req.body.titulo,
          descricao: req.body.descricao,
          precoBase: req.body.precoBase
      };
  
      const retorno = await Jogo.update(dadosJogo, { where: { id: id }, });
  
      if(retorno>0){
          res.redirect("/jogos");
      } else {
          res.send("Erro ao atualizar usuário")
      }
  });
  
  app.post("/jogos/:id/delete", async (req, res) => {
      const id = parseInt(req.params.id);
  
      const retorno = await Jogo.destroy({ where: { id: id } });
  
      if (retorno > 0){
          res.redirect("/jogos");
      } else {
          res.send("Erro ao excluir usuário")
      }
  });


//Rotas para cartoes

//Ver cartões do usuário
app.get("/usuarios/:id/cartoes", async (req, res) =>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });
    
    const cartoes = await Cartao.findAll({
        raw: true,
        where: { UsuarioId: id},
    })

    res.render("cartoes.handlebars", { usuario, cartoes });
});

//Formulário de cadastro de cartões
app.get("/usuarios/:id/novoCartao", async (req, res) =>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });

    res.render("formCartao", { usuario });
});

//Cadastro de cartão
app.get("/usuarios/:id/novoCartao", async (req, res) =>{
    const id = parseInt(req.params.id);
    
    const dadosCartao = {
        numero: req.body.numero,
        nome: req.body.nome,
        codSeguranca: req.body.codSeguranca,
        usuarioId: id,
    };

    await Cartao.create(dadosCartao)

    res.redirect(`/usuarios/${id}/cartoes`);
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