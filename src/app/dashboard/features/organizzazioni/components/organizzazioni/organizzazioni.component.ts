import { Component } from "@angular/core";
import { Organization, StateService } from "../../../commons/services/state.service";
import { OrganizzazioneDialogComponent } from "./organizzazione-dialog.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    template: `
<div class="card col-md-10 my-5 mx-auto shadow">

    <div class="d-flex gap-2 p-3">
        <button
            type="button"
            class="btn btn-primary"
            (click)="create()"
        >
            <i class="bi bi-plus"></i>
            Add new organization
        </button>
    </div>
    
    <app-table
        #dt
        [thead]="thead"
        [tbody]="tbody"
        [items]="state.getOrganizations()"
        [rowExpand]="rowExpand"
        [searchable]="[
            'name',
            'description'
        ]"
        [paginated]="true"
        [pageSize]="5"
    >
    
        <ng-template #thead>
            <th sortable="name" (sort)="dt.sort($any($event))">Name</th>
            <th sortable="description" (sort)="dt.sort($any($event))">Description</th>
            <th sortable="projects.length" (sort)="dt.sort($any($event))">Projects</th>
            <th sortable="users.length" (sort)="dt.sort($any($event))">Users</th>
            <th style="width: 10rem"></th>
        </ng-template>
    
        <ng-template #tbody let-organization let-term$="term$">
    
            <td>
                <ngb-highlight [result]="organization.name" [term]="(term$ | async) || ''"></ngb-highlight>
            </td>

            <td style="max-width: 40ch;">
                <ngb-highlight [result]="organization.description" [term]="(term$ | async) || ''"></ngb-highlight>
            </td>

            <td>{{ organization.projects.length }}</td>
            <td>{{ organization.users.length }}</td>

            <td>
                <div class="d-flex gap-2 justify-content-center">
    
                    <button
                        type="button"
                        class="btn btn-primary"
                        (click)="update(organization)"
                    >
                        <i class="bi bi-pencil"></i>
                    </button>
    
                    <button
                        type="button"
                        class="btn btn-danger"
                        (click)="delete(organization.id)"
                    >
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
            </td>
        </ng-template>

        <ng-template #rowExpand let-organization>
            <div
                class="py-5 px-3 grad"
                *ngIf="{ activeId: 1 } as d"
                [class.yellow-grad]="d.activeId === 1"
                [class.green-grad]="d.activeId === 2"
            >
                <ul ngbNav #nav="ngbNav" [(activeId)]="d.activeId" class="nav-tabs">

                    <li [ngbNavItem]="1">
                        <a ngbNavLink>Progetti ({{ organization.projects.length }})</a>
                        <ng-template ngbNavContent>
                            <app-progetti [organizationId]="organization.id"></app-progetti>
                        </ng-template>
                    </li>

                    <li [ngbNavItem]="2">
                        <a ngbNavLink>Utenti ({{ organization.users.length }})</a>
                        <ng-template ngbNavContent>
                            <app-utenti [organizationId]="organization.id"></app-utenti>
                        </ng-template>
                    </li>
                </ul>

                <div [ngbNavOutlet]="nav" class="bg-white border border-top-0 rounded-bottom"></div>
            </div>
        </ng-template>
    </app-table>
</div>
    `,
    styles: [`

        .grad {
            transition: background 400ms ease;
        }

        .yellow-grad {
            background: linear-gradient(155deg, rgb(225 225 225 / 25%), rgba(135, 90, 25, 0.25))
        }

        .green-grad {
            background: linear-gradient(155deg, rgb(225 225 225 / 25%), rgba(90, 135, 25, 0.25))
        }
    `]
})
export class OrganizzazioniComponent {

    constructor(
        public state: StateService,
        private modalService: NgbModal,
    ) {}

    async create() {

        const modalRef = this.modalService.open(
            OrganizzazioneDialogComponent,
            { size: "lg", centered: true }
        );

        await modalRef.result;
    }

    async update(organization: Organization) {

        const modalRef = this.modalService.open(
            OrganizzazioneDialogComponent,
            { size: "lg", centered: true }
        );
        modalRef.componentInstance.organizationId = organization.id;

        await modalRef.result;
    }

    delete(organizationId: number) {
        const allowed = confirm("Se sicuro di voler procedere?");
        if (allowed) this.state.deleteOrganization(organizationId);
    }
}