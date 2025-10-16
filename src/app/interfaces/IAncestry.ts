import { IAncestryTrait } from "./IAncestryTrait";

export interface IAncestry {
    name: string;
    selected: boolean;
    traits: IAncestryTrait[];
}