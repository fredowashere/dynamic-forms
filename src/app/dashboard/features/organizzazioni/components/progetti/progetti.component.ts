import { Component, Input } from "@angular/core";
import { Project, StateService } from "../../../commons/services/state.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ProgettoDialogComponent } from "./progetto-dialog.component";

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
    [items]="state.getProjects(organizationId)"
    [searchable]="[ 'name', 'description' ]"
    [paginated]="true"
    [pageSize]="5"
>

    <ng-template #thead>
        <th sortable="name" (sort)="dt.sort($any($event))">Name</th>
        <th sortable="description" (sort)="dt.sort($any($event))">Description</th>
        <th sortable="approvalCount" (sort)="dt.sort($any($event))">Approvals</th>
        <th sortable="participants.length" (sort)="dt.sort($any($event))">Participants</th>
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
            {{ project.status === 'pending' ? 'waiting for approval' : project.status }}
        </td>

        <td>
            <div ngbDropdown container="body">
                <button type="button" class="btn btn-outline-primary" ngbDropdownToggle>Actions</button>
                <div ngbDropdownMenu>
                    <button ngbDropdownItem (click)="update(project)">Edit</button>
                    <button ngbDropdownItem (click)="duplicate(project)">Duplicate</button>
                    <div class="dropdown-divider"></div>
                    <button ngbDropdownItem (click)="delete(project.id)">Delete</button>
                </div>
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
        public state: StateService,
        private modalService: NgbModal,
    ) {}

    async create() {

        const modalRef = this.modalService.open(
            ProgettoDialogComponent,
            { size: "xl", centered: true }
        );
        modalRef.componentInstance.organizationId = this.organizationId;

        await modalRef.result;
    }

    async update(project: Project) {

        const modalRef = this.modalService.open(
            ProgettoDialogComponent,
            { size: "xl", centered: true }
        );
        modalRef.componentInstance.organizationId = this.organizationId;
        modalRef.componentInstance.projectId = project.id;

        await modalRef.result;
    }

    duplicate(project: Project) {
        this.state.insertProject(this.organizationId, project);
    }

    delete(projectId: number) {
        const allowed = confirm("Se sicuro di voler procedere?");
        if (allowed) this.state.deleteProject(this.organizationId, projectId);
    }
}