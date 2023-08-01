import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { OrganizzazioniComponent } from "./components/organizzazioni.component";
import { UtentiComponent } from "./components/utenti.component";
import { ProgettiComponent } from "./components/progetti.componente";

const routes: Routes = [
    { 
      path: '',
      component: OrganizzazioniComponent,
    },
  ];

@NgModule({
    declarations: [
      OrganizzazioniComponent,
      UtentiComponent,
      ProgettiComponent
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      SharedModule
    ]
})
export class OrganizzazioniModule { }