import { Component } from '@angular/core';
import { DynamicFormService, FormEntry } from '../dynamic-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { filter, map, tap } from 'rxjs';
import { AppForm } from '../create/create.component';
import { jsonCopy } from 'src/app/utils/json';

@Component({
  selector: 'app-use',
  templateUrl: './use.component.html',
  styleUrls: ['./use.component.css']
})
export class UseComponent {

  Object = Object;

  formEntry?: FormEntry;
  data: any[] = [];
  props: any[] = [];

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
            this.formEntry = this.dynamicFormService.getForm(name!);
            this.initData(this.formEntry.data);
          }
          catch (e) {
            this.toaster.show("Could not load form.", { classname: "bg-danger text-light" });
          }
        })
      )
      .subscribe();
  }

  initData(data: any[]) {

    this.data = [ ...data ];

    this.props = Object.keys(
      data.reduce((p, r) =>
        (Object.keys(r).forEach(k => p[k] = 1), p),
        {}
      )
    );
  }

  selRow(a: any) {}

  deselRow(a: any) {}

  goToCreate(form: AppForm) {
    this.router.navigate(
      [ "dashboard", "dynamic-form", "create" ],
      { queryParams: { name: form.name } }
    );
  }

  addEntry(formValue: any) {

    const { name } = this.route.snapshot.queryParams;
    const { data } = this.dynamicFormService.getForm(name);
    data.push(jsonCopy(formValue));

    this.initData(data);
  }

}
