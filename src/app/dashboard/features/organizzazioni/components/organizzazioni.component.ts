import { Component } from "@angular/core";
import { Organization, StateService } from "../../commons/services/state.service";

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
        [items]="state.organizations"
        [rowExpand]="rowExpand"
        [searchable]="[ 'name', 'description' ]"
        [paginated]="true"
        [pageSize]="5"
    >
    
        <ng-template #thead>
            <th sortable="name" (sort)="dt.sort($any($event))">Name</th>
            <th sortable="description" (sort)="dt.sort($any($event))">Description</th>
            <th style="width: 10rem"></th>
        </ng-template>
    
        <ng-template #tbody let-organization let-term$="term$">
    
            <td>
                <ngb-highlight [result]="organization.name" [term]="(term$ | async) || ''"></ngb-highlight>
            </td>

            <td style="max-width: 40ch;">
                <ngb-highlight [result]="organization.description" [term]="(term$ | async) || ''"></ngb-highlight>
            </td>
    
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
                        (click)="delete(organization)"
                    >
                        <i class="bi bi-trash3"></i>
                    </button>
                </div>
            </td>
        </ng-template>

        <ng-template #rowExpand let-organization>
            <div
                class="py-5 px-3"
                style="background: linear-gradient(180deg, rgb(225 225 225 / 25%), rgba(135, 90, 25, 0.25));"
                *ngIf="{ activeId: 1 } as d"
            >
                <ul ngbNav #nav="ngbNav" [(activeId)]="d.activeId" class="nav-tabs">

                    <li [ngbNavItem]="1">
                        <a ngbNavLink>Progetti</a>
                        <ng-template ngbNavContent>
                            <app-progetti [organizationId]="organization.id"></app-progetti>
                        </ng-template>
                    </li>

                    <li [ngbNavItem]="2">
                        <a ngbNavLink>Utenti</a>
                        <ng-template ngbNavContent>
                            <app-utenti [organizationId]="organization.id"></app-utenti>
                        </ng-template>
                    </li>

                    <li [ngbNavItem]="3">
                        <a ngbNavLink>Modelli</a>
                        <ng-template ngbNavContent>
                            Hello World
                        </ng-template>
                    </li>

                    <li [ngbNavItem]="4">
                        <a ngbNavLink>Dataset</a>
                        <ng-template ngbNavContent>
                            Hello World
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
        
    `]
})
export class OrganizzazioniComponent {

    constructor(
        public state: StateService
    ) {}

    create() {

    }

    update(item: Organization) {

    }

    delete(item: Organization) {

    }
}