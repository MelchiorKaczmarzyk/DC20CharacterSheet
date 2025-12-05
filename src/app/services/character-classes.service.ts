import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces/ICharacter';
import { CreateSheetModel } from '../classes/CreateSheetModel';
import { IClass } from '../interfaces/IClass';
import { ITalent } from '../interfaces/ITalent';
import { ITalentOption } from '../interfaces/ITalentOption';


@Injectable({
  providedIn: 'root'
})
export class CharacterClassesService {
constructor(){}

    addFeatures(model: CreateSheetModel, c: IClass){
        //klasowe talenty będą zamieniane w featury na samym końcu, 
        // jak już przejdzie wszystko walidację I WSZYSTKIE OPCJE BĘDĄ WYBRANE
        
    }
    onClassSelected(model: CreateSheetModel, c: IClass){
        //make changes for all talents
        model.hpStart = c.hp;
        //ROGUE
        if(c.name == "Rogue"){
            //Roguish Finesse
            model.skillPointsStart += 1;
            for(let s of model.skills){
                if(s != model.skillForExpertise){
                    model.skillAdeptCost = 2;
                    model.skillAdeptNumberMax = 12;
                    if(s.level==1){
                        model.skillPointSpent -= 1;
                    }
                    if(s.level==2){
                        model.skillPointSpent -= 3;
                    }
                    s.level = 0;
                }
            }
        }
        
    }
    revertClass(model: CreateSheetModel, c: IClass){
        //revert changes for all talents AND OPTIONS
        model.hpStart = 8;
        //ROGUE
        if(c.name == "Rogue"){
            //Roguish Finesse
            model.skillPointsStart -= 1;
            for(let s of model.skills){
                if(s != model.skillForExpertise){
                    model.skillAdeptCost = 3;
                    model.skillAdeptNumberMax = 1;
                    if(s.level==1){
                        model.skillPointSpent -= 1;
                    }
                    if(s.level==2){
                        model.skillPointSpent -= 3;
                    }
                    s.level = 0;
                }
            }
        }
    }

    onClassTalentOptionSelected(model: CreateSheetModel, c: IClass, talent: ITalent, option: ITalentOption){
        //ROGUE
        if(talent.name == "Roguish Finesse"){
            let skillName = option.name.split(" ")[0];
            let skill = model.skills.find(s=>s.name==skillName);
            if(skill != undefined && skill.level == 1){
                skill.level = 2;
            }
            else{
                option.selected = false;
            }
        }

    }

    revertClassTalentOptionSelected(model: CreateSheetModel, c: IClass, talent: ITalent, option: ITalentOption){
        //ROGUE
        if(talent.name == "Roguish Finesse"){
            let skillName = option.name.split(" ")[0];
            let skill = model.skills.find(s=>s.name==skillName);
            if(skill != undefined){
                skill.level = 1;
            }
        }
    }

}