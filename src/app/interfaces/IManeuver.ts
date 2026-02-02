import { IManeuverEnhancement } from "./IManeuverEnhancement";

export interface IManeuver {
    name : string;
    selected : boolean;
    description : string;
    costAP : number;
    costSP : number;
    duration: number;
    range: number;
    durationUnit: string;
    enhancements : IManeuverEnhancement[];
}