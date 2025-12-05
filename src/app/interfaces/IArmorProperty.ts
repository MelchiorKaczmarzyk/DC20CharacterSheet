import { IArmorPropertyOption } from "./IArmorPropertyOption";
import { IArmorPropertySelection } from "./IArmorPropertySelection";

export interface IArmorProperty {
    name : string;
    helperText : string;
    shieldOrArmor : string;
    forLight : boolean;
    forHeavy : boolean;
    cost : number;
    options : IArmorPropertyOption[];
    selection : IArmorPropertySelection;
}