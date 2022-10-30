import * as Sequelize from "sequelize";
import {genSaltSync, hashSync, compareSync} from 'bcryptjs';

import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface UserAttributes {
 id?: number;
 name?: string;
 email?: string;
 password?: string;
 photo?: string;
 createdAt?: string;
 updatedAt?: string;   
}

export interface UserInstance extends Sequelize.Instance <UserAttributes>, UserAttributes{
    //encodedPassword é a senha salva no banco, password é a senha informada pelo usuário
    isPassword(encodedPassword: string, password: string): boolean;
} 
//interface que vai ser para gente trabalhar com os metódos do model em si.
export interface UserModel extends BaseModelInterface, Sequelize.Model<UserInstance, UserAttributes> {

}
//sequelize representa a instância aberta com o banco de dados
//DataTypes é os tipos de dados que a gente pode usar para definir os campos da tabela
export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {
    //User é o nome do model.
    const User: UserModel = sequelize.define('User', {
        //atributos da tabela.
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        photo: {
            type: DataTypes.BLOB({
                length: 'long'
            }),
            allowNull: true,
            defaultValue: null
        }        
    }, {//por padrão ele pegaria o nome do model, colocaria em maiusculo o U e no plural. Definindo assim, isso muda.
        tableName: 'users',
        hooks: {//hook é um gatilho que será executado. 
            //esse before vai ser usado para criptografar a senha do usuário.
            beforeCreate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
                //gera um valor randômico
                const salt = genSaltSync();
                //Gera o hashSync baseado nesse valor de salt com o password. Criptografa...
                user.password = hashSync(user.password, salt);
            }
            
        }
    });
    //Utilizado para realizar associações com outros módulos
    User.associate = (models: ModelsInterface): void =>{};

    User.prototype.isPassword = (encodedPassword: string, password: string): boolean => {
//ele trabalha comparando o password passado pelo User com o criptografado. Retornando true ou false.
        return compareSync(password, encodedPassword);
    }

    return User;
}