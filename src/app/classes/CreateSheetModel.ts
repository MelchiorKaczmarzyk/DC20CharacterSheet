import { IAncestry } from "../interfaces/IAncestry";
import { IAttribute } from "../interfaces/IAttribute";
import { IFeature } from "../interfaces/IFeature";
import { ISkill } from "../interfaces/ISkill";
import { ITrade } from "../interfaces/ITrade";

export class CreateSheetModel{
    constructor(){}
    attributes: IAttribute[] = [
        { name: "Might", value: -2, floor: -2, ceiling: 3 },
        { name: "Agility", value: -2, floor: -2, ceiling: 3 },
        { name: "Charisma", value: -2, floor: -2, ceiling: 3 },
        { name: "Intelligence", value: -2, floor: -2, ceiling: 3 },
    ];
    get attributePoints() : number{
        let mightScore = this.attributes.find(a=>a.name=="Might")?.value ?? 0;
        let agilityScore = this.attributes.find(a=>a.name=="Agility")?.value ?? 0;
        let charismaScore = this.attributes.find(a=>a.name=="Charisma")?.value ?? 0;
        let intelligenceScore = this.attributes.find(a=>a.name=="Intelligence")?.value ?? 0;
        let totalScore = mightScore + agilityScore + charismaScore + intelligenceScore;
        return 4 - totalScore;
    }

    precisionDefense = 4;
    areaDefense = 4;

    skills: ISkill[] = [
        { name: "Awarness", attribute: "Prime", level: 0 },
        { name: "Athletics", attribute: "Might", level: 0 },
        { name: "Intimidation", attribute: "Might", level: 0 },
        { name: "Acrobatics", attribute: "Agility", level: 0 },
        { name: "Trickery", attribute: "Agility", level: 0 },
        { name: "Stealth", attribute: "Agility", level: 0 },
        { name: "Animal", attribute: "Charisma", level: 0 },
        { name: "Influence", attribute: "Charisma", level: 0 },
        { name: "Insight", attribute: "Charisma", level: 0 },
        { name: "Investigation", attribute: "Intelligence", level: 0 },
        { name: "Medicine", attribute: "Intelligence", level: 0 },
        { name: "Survival", attribute: "Intelligence", level: 0 },
    ];
    
    skillPointsStart = 3;
    skillPointSpent = 0;
    get skillPoints() : number {
        let intelligenceScore = this.attributes.find(a=>a.name=="Intelligence")?.value ?? 0;
        return this.skillPointsStart + intelligenceScore - this.skillPointSpent;
    }
  
    trades: ITrade[] = [
        { name: "", level: 0 },
        { name: "", level: 0 },
        { name: "", level: 0 },
        { name: "", level: 0 },
        { name: "", level: 0 },
        { name: "", level: 0 },
        { name: "", level: 0 },
    ];

    tradePointsStart = 3;
    tradePointsSpent = 0;
    get tradePoints() : number {
        return this.tradePointsStart + this.skillPoints*2 - this.tradePointsSpent;
    }

    allowLimitlessAncestries: boolean = false;
    ancestries : IAncestry[] = [];
    ancestryPointsSpent = 0;
    get ancestryPoints() : number {
        return 5 - this.ancestryPointsSpent;
    }
    features: IFeature[] = [];


    isAttributeIncreaseCorrect : boolean = true;
    isAttributeDecreaseCorrect : boolean = true;
    attributesBelow3 : IAttribute[] = [];
    attributesAboveMinus2 : IAttribute[] = [];
    attributeForIncrease_name: string = ''; //option that has been chosen before, so they can be reversed
    attributeForDecrease_name: string = ''; //option that has been chosen before, so they can be reversed
    
    /*
  name = "";
  characterClass : any = undefined;
  healthPoints = 8;
  mana = 5;
  stamina = 1;
  level = 1;
  combatMastery = 1;
  
  attack = 4;
  dc = 14;
  prime = 3;

  

  

  

  

  
  speed = 5;
    */
}