export interface IAncestryTrait {
    name: string;
    cost: number;
    selected: boolean;
    text: string;
    costAP: number,
    costSP: number,
    costMP: number,
    hasOptions: boolean,
    options: string[],
    optionSelected: string,
    requirementText : string,
    requirementTraitName: string
}