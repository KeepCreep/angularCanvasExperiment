import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EffectBoxComponent } from './effect-box.component';


const routes: Routes = [
  {path: '', component: EffectBoxComponent,pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EffectBoxRoutingModule { }
