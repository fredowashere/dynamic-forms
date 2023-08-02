import { Component, Input } from "@angular/core";
import { StateService, User } from "../../../commons/services/state.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UtenteDialogComponent } from "./utente-dialog.component";

@Component({
    selector: "app-utenti",
    template: `
<div class="d-flex gap-2 p-3">
    <button
        type="button"
        class="btn btn-primary"
        (click)="create()"
    >
        <i class="bi bi-plus"></i>
        Add new user
    </button>
</div>

<app-table
    #dt
    [thead]="thead"
    [tbody]="tbody"
    [items]="state.selectOrganizationById(organizationId)?.users || []"
    [searchable]="[
        'firstName',
        'lastName',
        'username',
    ]"
    [paginated]="true"
    [pageSize]="5"
>

    <ng-template #thead>
        <th sortable="firstName" (sort)="dt.sort($any($event))">Nome</th>
        <th sortable="lastName" (sort)="dt.sort($any($event))">Cognome</th>
        <th sortable="username" (sort)="dt.sort($any($event))">Username</th>
        <th>Roles</th>
        <th style="width: 10rem"></th>
    </ng-template>

    <ng-template #tbody let-user let-term$="term$">

        <td>
            <ngb-highlight [result]="user.firstName" [term]="(term$ | async) || ''"></ngb-highlight>
        </td>

        <td>
            <ngb-highlight [result]="user.lastName" [term]="(term$ | async) || ''"></ngb-highlight>
        </td>

        <td>
            <ngb-highlight [result]="user.username" [term]="(term$ | async) || ''"></ngb-highlight>
        </td>

        <td style="max-width: 40ch;">
            {{ user.roles.join(", ") }}
        </td>

        <td>
            <div class="d-flex gap-2 justify-content-center">

                <button
                    type="button"
                    class="btn btn-primary"
                    (click)="update(user)"
                >
                    <i class="bi bi-pencil"></i>
                </button>

                <button
                    type="button"
                    class="btn btn-danger"
                    [disabled]="user.roles.includes('manager')"
                    (click)="delete(user)"
                >
                    <i class="bi bi-trash3"></i>
                </button>
            </div>
        </td>
    </ng-template>
</app-table>
    `,
    styles: [`
        
    `]
})
export class UtentiComponent {

    @Input("organizationId") organizationId = -1;

    constructor(
        public state: StateService,
        private modalService: NgbModal
    ) {}

    async create() {

        const modalRef = this.modalService.open(UtenteDialogComponent);
        modalRef.componentInstance.organizationId = this.organizationId;

        await modalRef.result;
    }

    async update(user: User) {

        const modalRef = this.modalService.open(UtenteDialogComponent);
        modalRef.componentInstance.organizationId = this.organizationId;
        modalRef.componentInstance.userId = user.id;

        await modalRef.result;
    }

    delete(user: User) {

    }
}