import { Component } from "@angular/core";
import { fileToCSVToArray } from "src/app/utils/csv";
import { isNumeric } from "src/app/utils/number";

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

        try {
            
            const datasetConfiguration = [
                {
                    "name": "weight",
                    "isTarget": false,
                    "type": "Number",
                    "min": 30,
                    "max": 200,
                    "enum": []
                },
                {
                    "name": "sex",
                    "isTarget": false,
                    "type": "String",
                    "enum": [ "M", "F" ]
                },
                {
                    "name": "age",
                    "isTarget": false,
                    "type": "Number",
                    "min": 18,
                    "max": 100,
                    "enum": []
                },
                {
                    "name": "height",
                    "isTarget": true,
                    "type": "Number",
                    "min": 50,
                    "max": 240,
                    "enum": []
                }
            ];

            const numOfCols = array[0].length;

            if (numOfCols !== datasetConfiguration.length) {
                const moreOrLess = numOfCols > datasetConfiguration.length ? "more" : "less";
                throw new Error(`Dataset columns are ${moreOrLess} than those required by the project.`);
            }

            for (let i = 1; i < array.length; i++) {

                if (array[i].length !== numOfCols) {
                    const moreOrLess = array[i].length > numOfCols ? "more" : "less";
                    throw new Error(`Row ${i} has ${moreOrLess} features than the heading.`);
                }

                for (let j = 0; j < array[i].length; j++) {

                    let value = array[i][j];
                    const featureShape = datasetConfiguration[j];
                    const type = featureShape.type.toLowerCase();

                    if (type === "number" && !isNumeric(value) || type === "string" && isNumeric(value)) {
                        throw new Error(`Row ${i} column ${j} has a different type than than required by the project.`);
                    }

                    if (isNumeric(value)) {
                        value = parseFloat(value);
                    }

                    if (type === "number" && featureShape.min && value < featureShape.min) {
                        throw new Error(`Row ${i} column ${j} is too small (min is ${featureShape.min}).`);
                    }

                    if (type === "number" && featureShape.min && value > featureShape.max) {
                        throw new Error(`Row ${i} column ${j} is too big (max is ${featureShape.max}).`);
                    }

                    if (featureShape.enum && featureShape.enum.length > 0 && !featureShape.enum.find(v => v === value)) {
                        throw new Error(`Row ${i} column ${j} doesn't belong to enumerated values (enum is ${featureShape.enum.join("")}).`);
                    }
                }
            }

            console.log("The dataset is compliant with the project.");
        }
        finally {
            this.isLoading = false;
        }
    }
}