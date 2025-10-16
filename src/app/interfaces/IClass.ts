import { ITalent } from "./ITalent";

export interface IClass {
    selected: boolean
    name: string;
    armorTraining: string;
    mana: number;
    cantripsKnown: number;
    spellsKnowm: number;
    stamina: number;
    maneuversKnown: number;
    hp: number;
    talents: ITalent[];
}