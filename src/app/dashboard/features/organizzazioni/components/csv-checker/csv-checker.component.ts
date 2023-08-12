import { Component } from "@angular/core";
import { fileToCSVToArray } from "src/app/utils/csv";

@Component({
    template: `
        <div class="py-5 my-5 text-center">
            <div>

                <div>Check CSV</div> 

                <input
                    #fileUploadSimple
                    [accept]="'.csv'"
                    type="file"
                    class="file-input"
                    (change)="getArray($event)"
                    hidden="true"
                />

                <button (click)="fileUploadSimple.click()">
                    <ng-container *ngIf="isLoading; else ready">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </ng-container>
                    <ng-template #ready>
                        Import from CSV
                    </ng-template>
                </button>
            </div>
        </div>
    `,
    styles: [`
    `]
})
export class CsvCheckerComponent {

    isLoading = false;

    constructor() {}

    async getArray(event: any) {
        this.isLoading = true;
        const array = await fileToCSVToArray(event);
        this.isLoading = false;
    }
}