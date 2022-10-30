import { CommentModel } from "../models/CommentModel";
import { PostModel } from "../models/PostModel";
import { UserModel } from "../models/UserModel";

//TODO MODEL QUE FOR CRIADO PRECISA SER IMPORTADO AQUI
export interface ModelsInterface {
    Post: PostModel;
    User: UserModel;
    Comment: CommentModel;

}