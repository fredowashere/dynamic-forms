import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { DynamicFormService } from '../dynamic-form.service';

export interface AppControlValidator {
  type: "required" | "requiredTrue" | "pattern" | "min" | "max" | "minLength" | "maxLength";
  pattern?: string;
  min?: number;
  max?: number;
}

export interface AppControlOption {
  text: string;
  value: any;
}

export interface AppControl {
  type: "text" | "number" | "password" | "date" | "datetime-local" | "time" | "select" | "radio" | "checkbox";
  options?: AppControlOption[];
  default?: any;
  validators?: AppControlValidator[];
  floatingLabel?: boolean;
  ngControl?: FormControl; // At the level of prototype
}

export interface AppForm {
  name: string;
  columns: number;
  controls: {
    [key: string]: AppControl;
  }
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  Object = Object;
  JSON = JSON;

  appForm?: AppForm;

  constructor(
    public dynamicFormService: DynamicFormService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastService
  ) { }

  ngOnInit() {
    this.route.queryParamMap
      .pipe(
        map(q => q.get("name")),
        filter(name => !!name),
        tap(name => {
          try {
            this.appForm = this.dynamicFormService.getForm(name!).form;
          }
          catch (e) {
            this.toaster.show("Could not load form.", { classname: "bg-danger text-light" });
          }
        })
      )
      .subscribe();
  }

  onFormPreview(stringForm: string) {
    try {
      this.appForm = JSON.parse(stringForm);
    }
    catch(e) {
      this.toaster.show("Invalid JSON.", { classname: "bg-danger text-light" });
      throw e;
    }
  }

  onFormSave(stringForm: string) {
    this.onFormPreview(stringForm);
    if (this.appForm) {
      this.dynamicFormService.register(this.appForm);
      this.openForm(this.appForm);
    }
  }

  openForm(form: AppForm) {
    this.router.navigate(
      [ "." ],
      { queryParams: { name: form.name }, relativeTo: this.route }
    );
  }

  goToUse(form: AppForm) {
    this.router.navigate(
      [ "dashboard", "dynamic-form", "use" ],
      { queryParams: { name: form.name } }
    );
  }

}
