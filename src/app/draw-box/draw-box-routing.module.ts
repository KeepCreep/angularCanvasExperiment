import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrawBoxComponent } from './draw-box.component';


const routes: Routes = [
  {path: '', component: DrawBoxComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrawBoxRoutingModule { }
