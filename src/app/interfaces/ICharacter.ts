import { IAncestry } from "./IAncestry";
import { IAttribute } from "./IAttribute";
import { IClass } from "./IClass";
import { IFeature } from "./IFeature";
import { IManeuver } from "./IManeuver";
import { ISkill } from "./ISkill";
import { ISpell } from "./ISpell";
import { ITrade } from "./ITrade";

export interface ICharacter {
    uid: string;
    id: string;
    name: string;
    level: number;
    combatMastery: number;
    dc: number;
    attack: number,
    speed: number;
    healthPoints: number;
    precisionDefense: number;
    areaDefense: number;
    characterClass: IClass | undefined;
    mana: number,
    stamina: number,
    ancestries: IAncestry[];
    attributes: IAttribute[];
    prime: number;
    skills: ISkill[];
    trades: ITrade[];
    spells: ISpell[];
    maneuvers: IManeuver[];
    features: IFeature[];
}