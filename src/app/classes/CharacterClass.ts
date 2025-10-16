import { IFeature } from "../interfaces/IFeature";
import { Talent } from "./Talent";

export class CharacterClass{
    public selected : boolean = false;
    public name: string = "";
    public armorTraining: string = "";
    public mana: number = 0;
    public cantripsKnown: number = 0;
    public spellsKnowm: number = 0;
    public stamina: number = 0;
    public maneuversKnown: number = 0;
    public hp: number = 0;
    public talents: Talent[] = [];

     /*
        capturing the results from onSelect() of all the talents, merging them and then
        merging them with the results of it's own onSelect method. Returning the merge.
    */
    public onSelect: () => any = (()=>{});

    /*
        capturing the results from onSelect() of all the options, merging them and then
        merging them with the results of it's own onSelect method. Returning the merge.
    */
    public revert: () => any = (()=>{});

}