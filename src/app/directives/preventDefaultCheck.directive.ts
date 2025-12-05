import { Directive } from "@angular/core";
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from "@angular/material/checkbox";

@Directive({
  selector: '[preventDefaultCheck]',
  standalone: true,
  providers: [
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } }
  ]
})
export class PreventDefaultCheckDirective {}
