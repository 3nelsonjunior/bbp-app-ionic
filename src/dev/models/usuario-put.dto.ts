
export class UsuarioPutDTO {
    id: string;
    nome: string;
    apelido: string;
    dtNasc: Date;
    email: string;
    telefone1: string;
    telefone2: string;
    telefone3: string;

    constructor (id?: string, nome?: string, apelido?: string, dtNasc?: Date, email?: string,
        telefone1?: string, telefone2?: string, telefone3?: string) {
        this.id = id;
        this.nome = nome;
        this.apelido = apelido;
        this.dtNasc = dtNasc;
        this.email = email;
        this.telefone1 = telefone1;
        this.telefone2 = telefone2;
        this.telefone3 = telefone3;
    }

    
}