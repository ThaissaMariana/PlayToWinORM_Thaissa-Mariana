const db = require("../db/conn");
const {DataTypes} = require("sequelize");

const Jogo = db.define("Jogo", {
    titulo: {
        type: DataTypes.STRING,
        required: true,
    },
    descricao: {
        type: DataTypes.STRING,
        required: true,
    },
    precoBase: {
        type: DataTypes.DECIMAL(10, 2),
        required: true,
    },
});

module.exports = Jogo;
