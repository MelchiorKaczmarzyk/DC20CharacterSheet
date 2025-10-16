import { ISubTalent } from "./ISubTalent";
import { ITalentOption } from "./ITalentOption";

export interface ITalent {
    class: string;
    name: string;
    costAP: number,
    costSP: number,
    costMP: number,
    levelRequirement: number;
    numberOfOptionsToChoose : number;
    options: ITalentOption[];
    //a lot of talents consist of few independent features. It helps display them correctly on the page
    subTalents: ISubTalent[];
    text: string;
}