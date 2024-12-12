export interface IKeyboard {
    rus: IKey[][];
    en: IKey[][];
    num: IKey[][];
}

export interface IKey {
    code: string;
    key: string;
}
