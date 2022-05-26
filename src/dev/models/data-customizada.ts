
export class DataCustomizadaDTO {
    dia: string;
    mes: string;
    ano: string;

    constructor (
        dia?: string, mes?: string, ano?: string
    ) {
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
    }
}