import { ISpellEnhancement } from "./ISpellEnhancement";

export interface ISpell {
    name : string;
    selected : boolean;
    description : string;
    sources: string[];
    schools: string[];
    tags: string[];
    costAP : number;
    costMP : number;
    range: number;
    duration: number;
    durationUnit: string;
    isSustained: boolean;
    enhancements : ISpellEnhancement[];
}