import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelNameClassifier, ModelNameRegressor, ModelObjectiveClassifier, ModelObjectiveRegressor, ModelPenalty, ModelType, Project, ROLES, StateService } from '../../../commons/services/state.service';

@Component({
	template: `
		<div class="modal-header">

            <h4 class="modal-title" id="modal-title">
                {{ project ? "Edit" : "Create" }} project
            </h4>

            <button
                type="button"
                class="btn-close" 
                (click)="activeModal.dismiss('Cross click')"
            ></button>
        </div>

        <div class="modal-body">

            <nav ngbNav #nav="ngbNav" [destroyOnHide]="false" class="wiz">

                <ng-container ngbNavItem>
                    <a ngbNavLink class="wiz__step text-center">
                        <div class="wiz__title d-block d-md-none">Step 1</div>
                        <div class="wiz__descr">Project information</div>
                    </a>
                    <ng-template ngbNavContent>
                        <form autocomplete="off" novalidate>
                            <div class="flexgrid">

                                <app-input
                                    name="name"
                                    label="Name"
                                    [ngControl]="projectInformation.controls.name"
                                    [floatingLabel]="true"
                                ></app-input>
                    
                                <app-input
                                    type="textarea"
                                    name="description"
                                    label="Description"
                                    [ngControl]="projectInformation.controls.description"
                                    [floatingLabel]="true"
                                ></app-input>
                            </div>
                        </form>
                    </ng-template>
                </ng-container>

                <ng-container ngbNavItem>
                    <a ngbNavLink class="wiz__step text-center">
                        <div class="wiz__title d-block d-md-none">Step 2</div>
                        <div class="wiz__descr">Model configuration</div>
                    </a>
                    <ng-template ngbNavContent>
                        <form autocomplete="off" novalidate>

                            <div class="flexgrid flexgrid--2">

                                <app-input
                                    type="select"
                                    name="problemType"
                                    label="Problem type"
                                    [options]="modelTypes"
                                    [ngControl]="modelConfiguration.controls.type"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="select"
                                    name="modelName"
                                    label="Model name"
                                    [options]="modelNames"
                                    [ngControl]="modelConfiguration.controls.name"
                                    [floatingLabel]="true"
                                ></app-input>
                            </div>

                            <div
                                class="flexgrid flexgrid--3"
                                *ngIf="
                                    ModelNameClassifier.XGBoostClassified  === modelConfiguration.value.name
                                 || ModelNameRegressor.XGBoostReg === modelConfiguration.value.name
                                ">

                                <app-input
                                    type="select"
                                    name="modelObjective"
                                    label="Objective"
                                    [options]="modelObjectives"
                                    [ngControl]="modelConfiguration.controls.objective"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="maxDepth"
                                    label="Max depth"
                                    [ngControl]="modelConfiguration.controls.max_depth"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="alpha"
                                    label="Alpha"
                                    [ngControl]="modelConfiguration.controls.alpha"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="gamma"
                                    label="Gamma"
                                    [ngControl]="modelConfiguration.controls.gamma"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="learningRate"
                                    label="Learning rate"
                                    [ngControl]="modelConfiguration.controls.learning_rate"
                                    [floatingLabel]="true"
                                ></app-input>
                            </div>

                            <div
                                class="flexgrid flexgrid--2"
                                *ngIf="ModelNameRegressor.LLR === modelConfiguration.value.name"
                            >

                                <app-input
                                    type="select"
                                    name="penalty"
                                    label="Penalty"
                                    [options]="modelPenalties"
                                    [ngControl]="modelConfiguration.controls.penalty"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="maxIter"
                                    label="Max iter"
                                    [ngControl]="modelConfiguration.controls.max_iter"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="checkbox"
                                    name="fitIntercept"
                                    label="Fit intercept?"
                                    [ngControl]="modelConfiguration.controls.fit_intercept"
                                    [floatingLabel]="true"
                                ></app-input>
                            </div>
                        </form>
                    </ng-template>
                </ng-container>

                <ng-container ngbNavItem>
                    <a ngbNavLink class="wiz__step text-center">
                        <div class="wiz__title d-block d-md-none">Step 3</div>
                        <div class="wiz__descr">Federation configuration</div>
                    </a>
                    <ng-template ngbNavContent>
                        <form autocomplete="off" novalidate>
                            <div class="flexgrid flexgrid--3">

                                <app-input
                                    type="number"
                                    name="numRound"
                                    label="Number of rounds"
                                    [ngControl]="federationConfiguration.controls.num_round"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="minavailableClients"
                                    label="Minimum available clients"
                                    [ngControl]="federationConfiguration.controls.min_available_clients"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="fractionFit"
                                    label="Fraction fit"
                                    [ngControl]="federationConfiguration.controls.fraction_fit"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="minFitClients"
                                    label="Minimum fit clients"
                                    [ngControl]="federationConfiguration.controls.min_fit_clients"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="fractionEvaluate"
                                    label="Fraction evaluate"
                                    [ngControl]="federationConfiguration.controls.fraction_evaluate"
                                    [floatingLabel]="true"
                                ></app-input>

                                <app-input
                                    type="number"
                                    name="minEvaluateClients"
                                    label="Minimum evaluate clients"
                                    [ngControl]="federationConfiguration.controls.min_evaluate_clients"
                                    [floatingLabel]="true"
                                ></app-input>
                            </div>
                        </form>
                    </ng-template>
                </ng-container>

                <ng-container ngbNavItem>
                    <a ngbNavLink class="wiz__step text-center">
                        <div class="wiz__title d-block d-md-none">Step 4</div>
                        <div class="wiz__descr">Dataset modelling</div>
                    </a>
                    <ng-template ngbNavContent>
                        <form autocomplete="off" novalidate>

                        </form>
                    </ng-template>
                </ng-container>
            </nav>

            <div [ngbNavOutlet]="nav" class="my-3" style="min-height: 40vh;"></div>
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
                [disabled]="projectInformation.invalid"
                (click)="save()"
            >
                Save
            </button>
        </div>
	`,
})
export class ProgettoDialogComponent implements OnInit {

    @Input("organizationId") organizationId?: number;
    @Input("projectId") projectId?: number;
    project?: Project;

    ROLES = ROLES;
    ModelNameClassifier = ModelNameClassifier;
    ModelNameRegressor = ModelNameRegressor;

    modelTypes = Object.values(ModelType).map(x => ({ text: x, value: x }));
    
    modelNameClassifiers = Object.values(ModelNameClassifier).map(x => ({ text: x, value: x }));
    modelNameRegressors = Object.values(ModelNameRegressor).map(x => ({ text: x, value: x }));
    modelNames: { text: any, value: any }[] = this.modelNameClassifiers;
    
    modelObjectiveClassifiers = Object.values(ModelObjectiveClassifier).map(x => ({ text: x, value: x }));
    modelObjectiveRegressors = Object.values(ModelObjectiveRegressor).map(x => ({ text: x, value: x }));
    modelObjectives: { text: any, value: any }[] = this.modelObjectiveClassifiers;
    
    modelPenalties = Object.values(ModelPenalty).map(x => ({ text: x, value: x }));

    projectInformation = new FormGroup({
        name: new FormControl("", { nonNullable: true, validators: [ Validators.required ] }),
        description: new FormControl("", { nonNullable: true, validators: [ Validators.required ] }),
    });

    modelConfiguration = new FormGroup({

        type: new FormControl<ModelType>(ModelType.classification, { nonNullable: true, validators: [ Validators.required ] }),
        name: new FormControl<ModelNameClassifier | ModelNameRegressor>(ModelNameClassifier.XGBoostClassified, { nonNullable: true, validators: [ Validators.required ] }),

        objective: new FormControl<ModelObjectiveClassifier | ModelObjectiveRegressor>(ModelObjectiveClassifier.binary_logistic),
        learning_rate: new FormControl<number>(0.3),
        max_depth: new FormControl<number>(6),
        alpha: new FormControl<number>(0),
        gamma: new FormControl<number>(0),

        penalty: new FormControl<ModelPenalty>(ModelPenalty.l2),
        max_iter: new FormControl<number>(100),
        fit_intercept: new FormControl<boolean>(true),
    });

    federationConfiguration = new FormGroup({
        num_round: new FormControl<number>(5, { nonNullable: true, validators: [ Validators.required ] }),
        min_available_clients: new FormControl<number>(2, { nonNullable: true, validators: [ Validators.required ] }),
        fraction_fit: new FormControl<number>(1, { nonNullable: true, validators: [ Validators.required ] }),
        min_fit_clients: new FormControl<number>(2, { nonNullable: true, validators: [ Validators.required ] }),
        fraction_evaluate: new FormControl<number>(0, { nonNullable: true, validators: [ Validators.required ] }),
        min_evaluate_clients: new FormControl<number>(0, { nonNullable: true, validators: [ Validators.required ] }),
    });

    datasetModelling = new FormGroup({
    });

	constructor(
        public activeModal: NgbActiveModal,
        private state: StateService,
    ) {}

    ngOnInit() {

        this.reactivity();

        if (this.projectId) {

            this.project = this.state.getProjectById(this.organizationId!, this.projectId);

            if (this.project) {
                this.projectInformation.patchValue({ ...this.project });

                if (this.project.model) {
                    this.modelConfiguration.patchValue({ ...this.project.model });
                }
                
                if (this.project.federation) {
                    this.federationConfiguration.patchValue({ ...this.project.federation });
                }
            }
        }
    }

    reactivity() {

        this.modelConfiguration.controls.type.valueChanges
            .subscribe(type => {

                if (type === ModelType.classification) {

                    this.modelNames = this.modelNameClassifiers;

                    this.modelConfiguration.patchValue({
                        name: this.modelNameClassifiers[0].text
                    });
                }

                if (type === ModelType.regression) {

                    this.modelNames = this.modelNameRegressors;

                    this.modelConfiguration.patchValue({
                        name: this.modelNameRegressors[0].text
                    });
                }
            });

        this.modelConfiguration.controls.name.valueChanges
            .subscribe(name => {

                if (name === ModelNameClassifier.XGBoostClassified) {

                    this.modelObjectives = this.modelObjectiveClassifiers;

                    this.modelConfiguration.patchValue({
                        objective: this.modelObjectiveClassifiers[0].text
                    });
                }

                if (name === ModelNameRegressor.XGBoostReg) {

                    this.modelObjectives = this.modelObjectiveRegressors;

                    this.modelConfiguration.patchValue({
                        objective: this.modelObjectiveRegressors[0].text
                    });
                }
            });
    }

    save() {
        this.project ? this.update() : this.create();
    }

    create() {

        if (this.projectInformation.invalid) return;

        this.state.insertProject(
            this.organizationId!,
            {
                ...this.projectInformation.getRawValue(),
                model: { ...this.modelConfiguration.getRawValue() },
                federation: { ...this.federationConfiguration.getRawValue() },
                reviewsRequired: 0,
                approvalCount: 0,
                participantsRequired: 0,
                participants: [],
                datapoints: 0,
                status: "pending"
            }
        );

        this.activeModal.close();
    }

    update() {

        if (!this.project || this.projectInformation.invalid) return;

        this.state.updateProject(
            this.organizationId!,
            this.project.id!,
            {
                ...this.projectInformation.getRawValue(),
                model: { ...this.modelConfiguration.getRawValue() },
                federation: { ...this.federationConfiguration.getRawValue() },
                reviewsRequired: 0,
                approvalCount: 0,
                participantsRequired: 0,
                participants: [],
                datapoints: 0,
                status: "pending"
            }
        );

        this.activeModal.close();
    }
}