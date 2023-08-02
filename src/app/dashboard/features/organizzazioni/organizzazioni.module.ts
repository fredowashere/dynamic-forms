import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { OrganizzazioniComponent } from "./components/organizzazioni/organizzazioni.component";
import { UtentiComponent } from "./components/utenti/utenti.component";
import { ProgettiComponent } from "./components/progetti/progetti.component";
import { UtenteDialogComponent } from "./components/utenti/utente-dialog.component";
import { OrganizzazioneDialogComponent } from "./components/organizzazioni/organizzazione-dialog.component";
import { ProgettoDialogComponent } from "./components/progetti/progetto-dialog.component";

const routes: Routes = [
    { 
      path: '',
      component: OrganizzazioniComponent,
    },
  ];

@NgModule({
    declarations: [
      OrganizzazioniComponent,
      OrganizzazioneDialogComponent,
      UtentiComponent,
      UtenteDialogComponent,
      ProgettiComponent,
      ProgettoDialogComponent
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      SharedModule
    ]
})
export class OrganizzazioniModule { }