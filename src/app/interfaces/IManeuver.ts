import { IManeuverEnhancement } from "./IManeuverEnhancement";

export interface IManeuver {
    name : string;
    selected : boolean;
    description : string;
    costAP : number;
    costSP : number;
    enhancements : IManeuverEnhancement[];
}