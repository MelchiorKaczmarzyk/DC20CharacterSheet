import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces/ICharacter';
import { IconOptions } from '@angular/material/icon';


@Injectable({
  providedIn: 'root'
})
export class ArmorPropertiesService {
constructor(){}
/*
    onSelect(character: ICharacter, property: any){
        //handle selecting of every individual armor or shield property
        let p = property;
        let n = property.name;
        let c = character;
        //tu elsy może powinny być wszędzie
        if(n == 'Precision Defense increase'){
            this.onPDIncrease(c);
        }
        if(n == 'Area Defense increase'){
            this.onADIncrease(c);
        }
        if(n == "Elemental damage reduction"){
            this.onElementalReduction(c,p.shieldOrArmor);
        }
        if(n == "Physical damage reduction"){
            this.onPhysicalReduction(c,p.shieldOrArmor);
        }
        if(n == "Mounted"){
            this.onMounted(c);
        }
        if(n == "Bulky"){
            this.onBulky(c);
        }
        if(n == "Rigid"){
            this.onRigid(c,p.shieldOrArmor);
        }
        if(n == "Grasp"){
            this.onGrasp(c);
        }
        if(n == "Toss"){
            this.onToss(c);
        }
    }
    revert(character: ICharacter, property: any){
        //handle unselecting of every individual armor or shield property
        let p = property;
        let n = property.name;
        let c = character;
        //tu elsy może powinny być wszędzie
        if(n == 'Precision Defense increase'){
            this.revertPDIncrease(c);
        }
        if(n == 'Area Defense increase'){
            this.revertADIncrease(c);
        }
        if(n == "Elemental damage reduction"){
            this.revertElementalReduction(c,p.shieldOrArmor);
        }
        if(n == "Physical damage reduction"){
            this.revertPhysicalReduction(c,p.shieldOrArmor);
        }
        if(n == "Mounted"){
            this.revertMounted(c);
        }
        if(n == "Bulky"){
            this.revertBulky(c,p.shieldOrArmor);
        }
        if(n == "Rigid"){
            this.revertRigid(c,p.shieldOrArmor);
        }
        if(n == "Grasp"){
            this.onGrasp(c);
        }
        if(n == "Toss"){
            this.onToss(c);
        }
    }

    //onSelect methods
    onPDIncrease(character: ICharacter){
        character.precisionDefense += 1;
    }
    onADIncrease(character: ICharacter){
        character.areaDefense += 1;
    }
    onElementalReduction(character: ICharacter, source: string){
        character.features.push({
            name: "Elemental damage reduction",
            source: source,
            text: "You gain Damage Reduction against Fire, Cold, Lightning, Poison and Corrosion damage types."
        });
    }
    onPhysicalReduction(character: ICharacter, source: string){
        character.features.push({
            name: "Elemental damage reduction",
            source: source,
            text: "You gain Damage Reduction against Bludgeoning, Piercing and Slashing damage types."
        });
    }
    onMounted(character: ICharacter){
        character.features.push({
            name: "Mount shield",
            source: "Shield",
            text: "While mounted, your shield appliess its armor bonuses to your mount."
        });
    }
    onBulky(character: ICharacter){
        character.speed -= 1;
    }
    onRigid(character: ICharacter, source:string){
        character.features.push({
            name: "Rigid",
            source: source,
            text: "You gain Damage Reduction against Fire, Cold, Lightning, Poison and Corrosion damage types."
        });
    }
    onToss(character: ICharacter){
        character.features.push({
            name: "Rigid",
            source: 'Shield',
            text: "Your shield can be used to make Ranged Attacks (5/10)."
        });
    }
    onGrasp(character: ICharacter){
        character.features.push({
            name: "Rigid",
            source: 'Shield',
            text: "The hand wielding this shield can be used for grappling, reloading and wielding versatile weapons"
        });
    }
    //revert methods
    revertPDIncrease(character: ICharacter){
        character.precisionDefense -= 1;
    }
    revertADIncrease(character: ICharacter){
        character.areaDefense -= 1;
    }
    revertElementalReduction(character: ICharacter, source:string){
        let featureName = "Elemental damage reduction";
        character.features = character.features.filter(f=>!(f.name==featureName && f.source==source));
    }
    revertPhysicalReduction(character: ICharacter, source:string){
        let featureName = "Physical damage reduction";
        character.features = character.features.filter(f=>!(f.name==featureName && f.source==source));
    }
    revertMounted(character: ICharacter){
        let featureName = "Mounted";
        character.features = character.features.filter(f=>f.name!=featureName);
    }
    revertBulky(character: ICharacter, source:string){
        let featureName = "Bulky";
        character.features = character.features.filter(f=>!(f.name==featureName && f.source==source));
    }
    revertRigid(character: ICharacter, source:string){
        let featureName = "Rigid";
        character.features = character.features.filter(f=>!(f.name==featureName && f.source==source));
    }
    revertToss(character: ICharacter){
        let featureName = "Toss";
        character.features = character.features.filter(f=>f.name!=featureName);
    }
    revertGrasp(character: ICharacter){
        let featureName = "Grasp";
        character.features = character.features.filter(f=>f.name!=featureName);
    }
*/
}