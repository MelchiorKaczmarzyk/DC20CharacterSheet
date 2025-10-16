import { ITalentOption } from "../interfaces/ITalentOption";
import { ClassTalentOption } from "./ClassTalentOption";

export class Talent{
    public selected : boolean = false;
    public className: string = "";
    public talentName: string = "";
    public costAP: number = 0;
    public costSP: number = 0;
    public costMP: number = 0;
    public levelRequirement: number = 0;
    public numberOfOptionsToChoose : number = 0;
    public options: ClassTalentOption[] = [];
    public text: string = "";

    /*
        capturing the results from onSelect() of all the options, merging them and then
        merging them with the results of it's own onSelect method. Returning the merge.
    */
    public onSelect: () => any = (()=>{});
    /*
        capturing the results from onSelect() of all the options, merging them and then
        merging them with the results of it's own onSelect method. Returning the merge.
    */
    public revert: () => any = (()=>{});
}