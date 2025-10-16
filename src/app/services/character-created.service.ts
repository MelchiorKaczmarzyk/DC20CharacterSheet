import { Injectable } from '@angular/core';
import { ICharacter } from '../interfaces/ICharacter';

@Injectable({
  providedIn: 'root'
})
export class CharacterCreatedService {
  public character : ICharacter = {
    id: "",
    name: "",
    characterClass: undefined,
    healthPoints: 8,
    mana: 5,
    stamina: 1,
    level: 1,
    combatMastery: 1,
    precisionDefense: 4,
    areaDefense: 4,
    attack: 4,
    dc: 14,
    prime: 3,
    attributes: [
      {
        name:"Might", value:-2, floor:-2, ceiling: 3
      }, {
        name: "Agility", value:-2, floor:-2, ceiling: 3
      },{
        name: "Charisma", value:-2, floor:-2, ceiling: 3
      }, {
        name: "Intelligence", value:-2, floor:-2, ceiling: 3
    }],
    ancestries: [],
    skills: [
    {
      name: "Awarness",
      attribute: "Prime",
      level: 0
    },
    {
      name: "Athletics",
      attribute: "Might",
      level: 0
    },
    {
      name: "Intimidation",
      attribute: "Might",
      level: 0
    },
    {
      name: "Acrobatics",
      attribute: "Agility",
      level: 0
    },
    {
      name: "Trickery",
      attribute: "Agility",
      level: 0
    },
    {
      name: "Stealth",
      attribute: "Agility",
      level: 0
    },
    {
      name: "Animal",
      attribute: "Charisma",
      level: 0
    },
    {
      name: "Influence",
      attribute: "Charisma",
      level: 0
    },
    {
      name: "Insight",
      attribute: "Charisma",
      level: 0
    },
    {
      name: "Investigation",
      attribute: "Intelligence",
      level: 0
    },
    {
      name: "Medicine",
      attribute: "Intelligence",
      level: 0
    },
    {
      name: "Survival",
      attribute: "Intelligence",
      level: 0
    }
    ],
    trades: [
        {name: '', level: 0}, 
        {name: '', level: 0},
        {name: '', level: 0},
        {name: '', level: 0},
        {name: '', level: 0},
        {name: '', level: 0},
        {name: '', level: 0}],
    features: [],
    speed: 5
  };
}
