import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Organization, ROLES, StateService } from '../../../commons/services/state.service';

@Component({
	template: `
		<div class="modal-header">

            <h4 class="modal-title" id="modal-title">
                {{ organization ? "Edit" : "Create" }} organization
            </h4>

            <button
                type="button"
                class="btn-close" 
                (click)="activeModal.dismiss('Cross click')"
            ></button>
        </div>

        <div class="modal-body">
            <form autocomplete="off" novalidate>
                <div class="flexgrid">

                    <app-input
                        name="name"
                        label="Name"
                        [ngControl]="form.controls.name"
                        [floatingLabel]="true"
                    ></app-input>
        
                    <app-input
                        type="textarea"
                        name="description"
                        label="Description"
                        [ngControl]="form.controls.description"
                        [floatingLabel]="true"
                    ></app-input>
                </div>
            </form>
        </div>
        
        <div class="modal-footer">

            <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="activeModal.dismiss('Cancel')"
            >
                Cancel
            </button>

            <button
                type="button"
                class="btn btn-primary"
                [disabled]="form.invalid"
                (click)="save()"
            >
                Save
            </button>
        </div>
	`,
})
export class OrganizzazioneDialogComponent implements OnInit {

    @Input("organizationId") organizationId?: number;
    organization?: Organization;

    ROLES = ROLES;

    form = new FormGroup({
        name: new FormControl("", { nonNullable: true, validators: [ Validators.required ] }),
        description: new FormControl("", { nonNullable: true, validators: [ Validators.required ] }),
    });

	constructor(
        public activeModal: NgbActiveModal,
        private state: StateService,
    ) {}

    ngOnInit() {
        if (this.organizationId) {

            this.organization = this.state.getOrganizationById(this.organizationId!);

            if (this.organization) {
                this.form.patchValue({ ...this.organization });
            }
        }
    }

    save() {
        this.organization ? this.update() : this.create();
    }

    create() {

        if (this.form.invalid) return;

        this.state.insertOrganization(
            {
                ...this.form.getRawValue(),
                users: [],
                projects: []
            }
        );

        this.activeModal.close();
    }

    update() {

        if (!this.organization || this.form.invalid) return;

        this.state.updateOrganization(
            this.organizationId!,
            {
                ...this.form.getRawValue(),
                users: [],
                projects: []
            }
        );

        this.activeModal.close();
    }
}