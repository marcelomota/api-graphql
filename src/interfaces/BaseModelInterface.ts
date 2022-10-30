import { ModelsInterface } from "./ModelsInterface";

export interface BaseModelInterface {

    prototype?; //atributo que possibilita criar metodos de instancia do nosso model.
    associate?(models: ModelsInterface): void;//possibilita fazer associações entre os models da API.
}