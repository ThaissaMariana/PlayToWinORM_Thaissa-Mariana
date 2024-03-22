require("dotenv").config();
const conn = require("./db/conn");

conn
.authenticate()
.then(() => {
    console.log("Conectado com sucesso!");
}).catch( (err)=>{
    console.log("Ocorreu um erro: " + err)
});