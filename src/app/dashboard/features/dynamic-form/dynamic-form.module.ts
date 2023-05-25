import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormRoutingModule } from './dynamic-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UseComponent } from './use/use.component';
import { CreateComponent } from './create/create.component';
import { FormComponent } from './shared/form.component';


@NgModule({
  declarations: [
    CreateComponent,
    UseComponent
  ],
  imports: [
    CommonModule,
    DynamicFormRoutingModule,
    SharedModule,
    FormComponent
  ]
})
export class DynamicFormModule { }
