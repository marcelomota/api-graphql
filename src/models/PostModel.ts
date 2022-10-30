import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";
export interface PostAttributes {
    id?: number;
    title?: string;
    content?: string;
    photo?: string;
    author?: number;
    createdAt?:string;
    updatedAt?: string;

}

export interface PostInstance extends Sequelize.Instance<PostAttributes>{}

export interface PostModel extends BaseModelInterface, Sequelize.Model<PostInstance, PostAttributes>{

}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): PostModel => {
    const Post: PostModel = sequelize.define('Post', {
        //id do post
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true

        },//titulo do post
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },//conteúdo do post
        content: {
            type: DataTypes.TEXT,
            allowNull: false

        },//foto do post
        photo: {
            type: DataTypes.BLOB({
                length: 'long'
            }),
            allowNull:false
        }

    }, {
        tableName: 'posts'
    });

    //Post tem um metodo associate porque foi denifinido na BaseModelInterface.
    Post.associate = (models: ModelsInterface): void => {
        //belongsTo é para dizer a quem o post Pertence
        Post.belongsTo(models.User, {
            //o segurndo parametro é para configurar a chave estrangeira
            foreignKey: {
                //allowNull n permiti que a chave seja nula
                //field é o atributo definido em no post attributes desse model
                //name é o nome da chave estrangeira
                allowNull: false,
                field: 'author',
                name: 'author'
                
            }
        });
    };

    return Post;
}; 