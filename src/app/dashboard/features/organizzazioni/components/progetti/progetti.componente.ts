import { Component, Input } from "@angular/core";
import { Project, StateService } from "../../../commons/services/state.service";

@Component({
    selector: "app-progetti",
    template: `
<div class="d-flex gap-2 p-3">
    <button
        type="button"
        class="btn btn-primary"
        (click)="create()"
    >
        <i class="bi bi-plus"></i>
        Add new project
    </button>
</div>

<app-table
    #dt
    [thead]="thead"
    [tbody]="tbody"
    [items]="state.selectOrganizationById(organizationId)?.projects || []"
    [searchable]="[ 'name', 'description' ]"
    [paginated]="true"
    [pageSize]="5"
>

    <ng-template #thead>
        <th sortable="name" (sort)="dt.sort($any($event))">Name</th>
        <th sortable="description" (sort)="dt.sort($any($event))">Description</th>
        <th sortable="approvalCount" (sort)="dt.sort($any($event))">Approvals</th>
        <th sortable="participants.length" (sort)="dt.sort($any($event))">Participants</th>
        <th sortable="datapoints" (sort)="dt.sort($any($event))">Datapoints</th>
        <th sortable="status" (sort)="dt.sort($any($event))">Status</th>
        <th style="width: 10rem"></th>
    </ng-template>

    <ng-template #tbody let-project let-term$="term$">

        <td>
            <ngb-highlight [result]="project.name" [term]="(term$ | async) || ''"></ngb-highlight>
        </td>

        <td style="max-width: 40ch;">
            <ngb-highlight [result]="project.description" [term]="(term$ | async) || ''"></ngb-highlight>
        </td>

        <td>
            {{ project.approvalCount }} / {{ project.reviewsRequired }}
        </td>

        <td>
            {{ project.participants.length }} / {{ project.participantsRequired }}
        </td>

        <td>
            {{ project.datapoints }}
        </td>

        <td>
            {{ project.status === 'pending' ? 'waiting for approval' : project.status }}
        </td>

        <td>
            <div class="d-flex gap-2 justify-content-center">

                <button
                    type="button"
                    class="btn btn-primary"
                    [disabled]="project.status == 'running'"
                    (click)="update(project)"
                >
                    <i class="bi bi-pencil"></i>
                </button>

                <button
                    type="button"
                    class="btn btn-danger"
                    [disabled]="project.status == 'running'"
                    (click)="delete(project)"
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
export class ProgettiComponent {

    @Input("organizationId") organizationId = -1;

    constructor(
        public state: StateService
    ) {}

    create() {

    }

    update(item: Project) {

    }

    delete(item: Project) {

    }
}