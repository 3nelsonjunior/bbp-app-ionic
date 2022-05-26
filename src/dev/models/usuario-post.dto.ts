export class UsuarioPostDTO {
    id: string;
    nome: string;
    apelido: string;
    senha: string;
    dtNasc: Date;
    email: string;
    telefone1: string;

    constructor (id?: string, nome?: string, apelido?: string, senha?: string, dtNasc?: Date, 
        email?: string, telefone1?: string) {
        this.id = id;
        this.nome = nome;
        this.apelido = apelido;
        this.senha = senha;
        this.dtNasc = dtNasc;
        this.email = email;
        this.telefone1 = telefone1;
    }
    
}