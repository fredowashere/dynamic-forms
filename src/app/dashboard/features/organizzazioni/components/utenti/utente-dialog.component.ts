import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ROLES, StateService, User } from '../../../commons/services/state.service';

@Component({
	template: `
		<div class="modal-header">

            <h4 class="modal-title" id="modal-title">
                {{ user ? "Edit" : "Create" }} user
            </h4>

            <button
                type="button"
                class="btn-close" 
                (click)="activeModal.dismiss('Cross click')"
            ></button>
        </div>

        <div class="modal-body">
            <form autocomplete="off" novalidate>

                <div class="flexgrid flexgrid--2">

                    <app-input
                        name="firstName"
                        label="First name"
                        [ngControl]="form.controls.firstName"
                        [floatingLabel]="true"
                    ></app-input>
        
                    <app-input
                        name="lastName"
                        label="Last name"
                        [ngControl]="form.controls.lastName"
                        [floatingLabel]="true"
                    ></app-input>
        
                    <app-input
                        name="username"
                        label="Username *"
                        type="text"
                        [ngControl]="form.controls.username"
                        [floatingLabel]="true"
                    ></app-input>
        
                    <app-input
                        name="password"
                        label="Password *"
                        type="password"
                        [ngControl]="form.controls.password"
                        [floatingLabel]="true"
                    ></app-input>
                </div>

                <div class="flexgrid">
                    <app-input
                        name="roles"
                        label="Roles"
                        type="tagger"
                        [options]="ROLES"
                        [ngControl]="form.controls.roles"
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
export class UtenteDialogComponent implements OnInit {

    @Input("organizationId") organizationId?: number;
    @Input("userId") userId?: number;
    user?: User;

    ROLES = ROLES;

    form = new FormGroup({
        firstName: new FormControl(""),
        lastName: new FormControl(""),
        username: new FormControl("", { nonNullable: true, validators: [ Validators.required ] }),
        password: new FormControl("", { nonNullable: true, validators: [ Validators.required ] }),
        roles: new FormControl<string[]>([], { nonNullable: true }),
    });

	constructor(
        public activeModal: NgbActiveModal,
        private state: StateService,
    ) {}

    ngOnInit() {
        if (this.userId) {

            this.user = this.state.getUserById(this.organizationId!, this.userId);

            if (this.user) {
                this.form.patchValue({ ...this.user });
            }
        }
    }

    save() {
        this.user ? this.update() : this.create();
    }

    create() {

        if (this.form.invalid) return;

        this.state.insertUser(
            this.organizationId!,
            { ...this.form.getRawValue() }
        );

        this.activeModal.close();
    }

    update() {

        if (!this.user || this.form.invalid) return;

        this.state.updateUser(
            this.organizationId!,
            this.user.id!,
            { ...this.form.getRawValue() }
        );

        this.activeModal.close();
    }
}