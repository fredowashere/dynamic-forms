import { Injectable } from "@angular/core";
import { AppForm } from "./create/create.component";

export interface FormEntry {
    form: AppForm;
    data: { [key: string]: any }[];
}

@Injectable({ providedIn: 'root' })
export class DynamicFormService {

    private forms: { [key: string]: FormEntry } = {
        "Default form": {
            form: {
                name: "Default form",
                columns: 3,
                controls: {
                    "Cognome": {
                        type: "text",
                        default: "Trotta",
                        floatingLabel: true,
                        validators: [
                            {
                                type: "required"
                            }
                        ]
                    },
                    "Nome": {
                        type: "text",
                        default: "Federico",
                        floatingLabel: true,
                        validators: [
                            {
                                type: "required"
                            }
                        ]
                    },
                    "Indirzzo": {
                        type: "text",
                        default: "Via D. Manin 30",
                        floatingLabel: true,
                        validators: [
                            {
                                type: "required"
                            }
                        ]
                    },
                    "Password": {
                        type: "password",
                        default: "aaa",
                        floatingLabel: true,
                        validators: [
                            {
                                type: "required"
                            }
                        ]
                    }
                }
            },
            data: []
        }
    };

	register(form: AppForm) {
		this.forms[form.name] = {
            form,
            data: []
        };
	}

    getForms() {
        return this.forms;
    }

	getForm(key: string) {
		return this.forms[key];
	}
}