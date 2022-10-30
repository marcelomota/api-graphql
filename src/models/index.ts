import * as fs from 'fs';
import * as path from 'path';
import * as Sequelize from 'sequelize';

import { DbConnection } from '../interfaces/DbConnectionInterface';
//caso a gente mude o nome do arquivo não será problema
const basename: string = path.basename(module.filename);
//para informar o tipo de emabiente de produção, caso n setarmos será escolhido o ambiente de desenvolvimento padrão.
const env: string = process.env.NODE_ENV || 'development';
//cria uma interpolação no caminho. Retornando até o diretório que se encontra o config.json
let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if (!db){

    db = {};
    const operatorsAlias = false;
    //desabilita operadores para evitar erros no sequelize.
    config = Object.assign({operatorsAlias}, config);
    //configurações para o sequelize se comunicar com o mysql
    const sequelize: Sequelize.Sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
    fs.readdirSync(__dirname)
    .filter((file: string) => {
        //ele percorre o vetor e remove o index.js visto que ele não é um MODEL
        //o slice é para capturar apenas as extensões .js
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    }).forEach((file: string) => {
        //importando um model do sequelize para ser utilizado dentro do db mais a cima
        const model = sequelize.import(path.join(__dirname, file));
        db[model['name']] = model;
    });
    //percorrer e realizar as assiações criadas nos models dentro do db
    Object.keys(db).forEach((modelName: string)=> {
        //Se houver um metodo associate no referido model, vai realizar a associação.
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });
    //utiliza para fazer de fato a sincronização com o mysql
    db['sequelize'] = sequelize;

}

export default <DbConnection>db;