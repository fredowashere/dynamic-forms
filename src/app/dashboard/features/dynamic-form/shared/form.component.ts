import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { AppForm } from "../create/create.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-form",
    standalone: true,
    imports: [ CommonModule, SharedModule ],
    template: `
        <form *ngIf="ngForm" novalidate [formGroup]="ngForm">

            <div [ngClass]="'flexgrid flexgrid--' + appForm.columns">
                <app-input
                    *ngFor="let entry of Object.entries(appForm.controls); trackBy: formHasChanged"
                    [name]="entry[0]"
                    [label]="entry[0]"
                    [type]="entry[1].type"
                    [options]="entry[1].options || []"
                    [floatingLabel]="entry[1].floatingLabel || false"
                    [ngControl]="$any(entry[1].ngControl)"
                ></app-input>
            </div>

            <div class="text-end mt-3">
                <button
                    class="btn btn-primary"
                    [disabled]="ngForm.invalid"
                    (click)="onFormSubmit(ngForm.value)"
                >
                    <i class="bi bi-send-fill"></i> Submit
                </button>
            </div>
        </form>
    `
})
export class FormComponent {

    Object = Object;

    _appForm!: AppForm;
    @Input("appForm")
    set appForm(value: AppForm){
        this._appForm = value;
        this.loadForm(value);
    }
    get appForm() {
        return this._appForm
    }

    @Output("formSubmit") formSubmitEmitter = new EventEmitter();
    
    ngForm?: FormGroup;

    loadForm(appForm: AppForm) {

        const entries = Object.entries(appForm.controls);

        // Instantiate the actual FormControls
        for (const [name, cfg] of entries) {

            // Get validators
            const validators = (cfg.validators || [])
                .map(validatorCfg => {

                    if (validatorCfg.type === "requiredTrue") {
                        return Validators.requiredTrue;
                    }

                    if (validatorCfg.type === "pattern" && validatorCfg.pattern) {
                        return Validators.pattern(validatorCfg.pattern);
                    }

                    if (validatorCfg.type === "min" && validatorCfg.min && !isNaN(validatorCfg.min)) {
                        return Validators.min(validatorCfg.min);
                    }

                    if (validatorCfg.type === "max" && validatorCfg.max && !isNaN(validatorCfg.max)) {
                        return Validators.max(validatorCfg.max);
                    }

                    if (validatorCfg.type === "minLength" && validatorCfg.min && !isNaN(validatorCfg.min)) {
                        return Validators.minLength(validatorCfg.min);
                    }

                    if (validatorCfg.type === "maxLength" && validatorCfg.max && !isNaN(validatorCfg.max)) {
                        return Validators.maxLength(validatorCfg.max);
                    }

                    return Validators.required;
                });

            // Add FormControl to the prototype of appForm
            Object.setPrototypeOf(
                appForm.controls[name],
                { ngControl: new FormControl(cfg.default, validators) }
            )
        }

        // Create configuration for the actual FormGroup
        const formCfg = entries
            .reduce((cfg, [name, appControl]) =>
                (cfg[name] = (appControl as any).ngControl, cfg),
                {} as { [key: string]: FormControl }
            );

        this.ngForm = new FormGroup(formCfg);
    }

    onFormSubmit(formValue: any) {
        this.formSubmitEmitter.emit(formValue);
    }

    formHasChanged() {
        return this.ngForm;
    }
}