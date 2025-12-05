import { count } from "rxjs";
import { IAncestry } from "../interfaces/IAncestry";
import { IAttribute } from "../interfaces/IAttribute";
import { ICharacter } from "../interfaces/ICharacter";
import { IClass } from "../interfaces/IClass";
import { IFeature } from "../interfaces/IFeature";
import { ISkill } from "../interfaces/ISkill";
import { ITrade } from "../interfaces/ITrade";
import { IArmorProperty } from "../interfaces/IArmorProperty";
import { IManeuver } from "../interfaces/IManeuver";
import { ISpell } from "../interfaces/ISpell";

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

    skills: ISkill[] = [
        { name: "Awarness", attribute: "Prime", level: 0, levelCap: 1 },
        { name: "Athletics", attribute: "Might", level: 0, levelCap: 1  },
        { name: "Intimidation", attribute: "Might", level: 0, levelCap: 1  },
        { name: "Acrobatics", attribute: "Agility", level: 0, levelCap: 1  },
        { name: "Trickery", attribute: "Agility", level: 0, levelCap: 1  },
        { name: "Stealth", attribute: "Agility", level: 0, levelCap: 1  },
        { name: "Animal", attribute: "Charisma", level: 0, levelCap: 1  },
        { name: "Influence", attribute: "Charisma", level: 0, levelCap: 1  },
        { name: "Insight", attribute: "Charisma", level: 0, levelCap: 1  },
        { name: "Investigation", attribute: "Intelligence", level: 0, levelCap: 1  },
        { name: "Medicine", attribute: "Intelligence", level: 0, levelCap: 1  },
        { name: "Survival", attribute: "Intelligence", level: 0, levelCap: 1  },
    ];
    skillAdeptCost = 3;
    skillWhereBoughtAdept : ISkill | undefined;
    skillPointsStart = 5;
    skillPointSpent = 0;
    get skillPoints() : number {
        let intelligenceScore = this.attributes.find(a=>a.name=="Intelligence")?.value ?? 0;
        return this.skillPointsStart + intelligenceScore - this.skillPointSpent;
    }
    get skillAdeptNumber() : number {
        return this.skills.filter(s=>s.level==2).length;
    }
    skillAdeptNumberMax = 1;

    skillForExpertise : ISkill | undefined;

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

    get isAdept() : boolean{
        if(this.isSkillAdept || this.isTradeAdept){
            return true;
        }
        else{
            return false;
        }
    }
    get isSkillAdept(): boolean {
        if (this.skills.some(s => s.level == 2)){
            return true;
        }
        else
            return false;
    }
    get isTradeAdept(): boolean {
        if (this.trades.some(t => t.level == 2)){
            return true;
        }
        else
            return false;
    }

    allowLimitlessAncestries: boolean = false;
    ancestries : IAncestry[] = [];
    ancestryPointsSpent = 0;

    get ancestriesChosenNumber() : number {
        let result = 0;
        result = this.ancestries.filter(a=>a.selected).length;
        return result;
    }

    get ancestryPoints() : number {
        return 5 - this.ancestryPointsSpent;
    }
    features: IFeature[] = [];

    hasTrait(traitName : string): boolean{
    for(let ancestry of this.ancestries){
      for(let trait of ancestry.traits){
        if(trait.name==traitName){
          return true;
        }
      }
    }
    return false;
  }
  /*
    isAttributeIncreaseCorrect : boolean = true;
    isAttributeDecreaseCorrect : boolean = true;
    attributesBelow3 : IAttribute[] = [];
    attributesAboveMinus2 : IAttribute[] = [];
    attributeForIncrease_name: string = ''; //option that has been chosen before, so they can be reversed
    attributeForDecrease_name: string = ''; //option that has been chosen before, so they can be reversed
    
  */

  classes: IClass[] = [];
    currentClass : IClass | undefined
    previousClass : IClass | undefined
    maneuvers : IManeuver[] = [];
    maneuverPointsSpent : number = 0;
    cantrips : ISpell[] = [];
    spells : ISpell[] = [];
    cantripPointsSpent : number = 0;
    spellPointsSpent : number = 0;
    get maneuverPoints() : number {
      return (this.currentClass != undefined)? this.currentClass.maneuversKnown - this.maneuverPointsSpent : 0;
    }
    get cantripPoints() : number {
      return (this.currentClass != undefined)? this.currentClass.cantripsKnown - this.cantripPointsSpent : 0;
    }
    get spellPoints() : number {
      return (this.currentClass != undefined)? this.currentClass.spellsKnown - this.spellPointsSpent : 0;
    }
    get isClassMartial() : boolean{
      if(this.currentClass != undefined && this.currentClass.stamina > 0){
        return true;
      }
      else return false;
    }
    get isClassCaster() : boolean{
      if(this.currentClass != undefined && this.currentClass.mana > 0){
        return true;
      }
      else return false;
    }

    hpStart = 8;
    get hp(){
      let might  = this.attributes.find(a=>a.name=="Might")?.value ?? 0;
      return this.hpStart + might;
    }

    precisionDefenseBonus = 0;
    get precisionDefense() : number{
      let intelligence  = this.attributes.find(a=>a.name=="Intelligence")?.value ?? 0;
      let agility  = this.attributes.find(a=>a.name=="Agility")?.value ?? 0;
      return 8 + intelligence + agility + this.precisionDefenseBonus;
    }
    
    areaDefenseBonus = 0;
    get areaDefense() : number{
      let might  = this.attributes.find(a=>a.name=="Might")?.value ?? 0;
      let charisma  = this.attributes.find(a=>a.name=="Charisma")?.value ?? 0;
      return 8 + might + charisma + this.areaDefenseBonus;
    }

    armorProperties : IArmorProperty[] = [];
    shieldProperties : IArmorProperty[] = [];
    
    isWearingArmor: boolean = false;
    armorPointsStart : number = 2;
    armorPointsSpent : number = 0;
    get armorPoints() : number {
      return this.armorPointsStart - this.armorPointsSpent;
    }

    isWearingShield : boolean = false
    shieldPointsStart : number = 2;
    shieldPointsSpent : number = 0;
    get shieldPoints() : number {
      return this.shieldPointsStart - this.shieldPointsSpent;
    }
    
    selectedArmorType : string = "Light"
    selectedShieldType : string = 'Light'
}