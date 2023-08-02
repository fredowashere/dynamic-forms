import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { OrganizzazioniComponent } from "./components/organizzazioni/organizzazioni.component";
import { UtentiComponent } from "./components/utenti/utenti.component";
import { ProgettiComponent } from "./components/progetti/progetti.componente";
import { UtenteDialogComponent } from "./components/utenti/utente-dialog.component";

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
      UtenteDialogComponent,
      ProgettiComponent
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      SharedModule
    ]
})
export class OrganizzazioniModule { }