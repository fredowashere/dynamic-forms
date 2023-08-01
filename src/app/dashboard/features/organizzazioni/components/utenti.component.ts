import { Component, Input } from "@angular/core";
import { StateService, User } from "../../commons/services/state.service";

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
    [searchable]="[ 'username' ]"
    [paginated]="true"
    [pageSize]="5"
>

    <ng-template #thead>
        <th sortable="username" (sort)="dt.sort($any($event))">Username</th>
        <th>Roles</th>
        <th style="width: 10rem"></th>
    </ng-template>

    <ng-template #tbody let-user let-term$="term$">

        <td>
            <ngb-highlight [result]="user.username" [term]="(term$ | async) || ''"></ngb-highlight>
        </td>

        <td>
            {{ user.roles.join() }}
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
        public state: StateService
    ) {}

    create() {

    }

    update(item: User) {

    }

    delete(item: User) {

    }
}