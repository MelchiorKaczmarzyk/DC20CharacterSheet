import { Injectable } from "@angular/core";
import { CreateSheetModel } from "../classes/CreateSheetModel";
import { IManeuver } from "../interfaces/IManeuver";


@Injectable({
  providedIn: 'root'
})
export class ManeuverService {
  constructor(){}
  onManeuverSelected(model : CreateSheetModel, maneuver : IManeuver){
    model.maneuverPointsSpent+=1;
  }
  reverManeuverSelection(model : CreateSheetModel, maneuver : IManeuver){
    model.maneuverPointsSpent-=1;
  }
}