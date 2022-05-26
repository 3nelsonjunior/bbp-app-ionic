export enum MesEnum {
    JANEIRO = 1,
    FEVEIRO = 2,
    MARCO = 3,
    ABRIL = 4,
    MAIO = 5,
    JUNHO = 6,
    JULHO = 7,
    AGOSTO = 8,
    SETEMBRO = 9,
    OUTUBRO = 10,
    NOVEMBRO = 11,
    DEZEMBRO = 12,
}

export class HorarioEnumFactory {

    private static _lista: string[];
    
    static descricao(tipoLiquidacao: MesEnum) {
        switch (tipoLiquidacao) {
            case MesEnum.JANEIRO:
                return 'Janeiro';
            case MesEnum.FEVEIRO:
                return 'Fevereiro';
            case MesEnum.MARCO:
                return 'Março';
            case MesEnum.ABRIL:
                return 'Abril';
            case MesEnum.JUNHO:
                return 'Junho';
            case MesEnum.JULHO:
                return 'Julho';
            case MesEnum.AGOSTO:
                return 'Agosto';
            case MesEnum.SETEMBRO:
                return 'Setembro';
            case MesEnum.OUTUBRO:
                return 'Outubro';
            case MesEnum.NOVEMBRO:
                return 'Novembro';
            case MesEnum.DEZEMBRO:
                return 'Dezembro';
        }
    }
    
    static lista(comOpcaoTodos?: boolean): string[] {
        if (!this._lista) {
            let itens: string[] = [];
            //itens.push({ label: this.descricao(MesEnum.JANEIRO), value: MesEnum.JANEIRO});
            //itens.push({ label: this.descricao(TipoAntecipacao.ANTECIPACAO_PARCIAL), value: TipoAntecipacao.ANTECIPACAO_PARCIAL});
            this._lista = itens;
        }
        return this._lista;
    }

}