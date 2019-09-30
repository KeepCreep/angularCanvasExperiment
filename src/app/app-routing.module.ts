import { BrickBoxModule } from './brick-box/brick-box.module';
import { EffectBoxModule } from './effect-box/effect-box.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:'', redirectTo:'/draw-box',pathMatch:'full'},
  {path:'draw-box', loadChildren: () => import('./draw-box/draw-box.module').then(mod=>mod.DrawBoxModule)},
  {path:'effect-box', loadChildren: () => import('./effect-box/effect-box.module').then(mod=>mod.EffectBoxModule)},
  {path:'brick-box', loadChildren: () => import('./brick-box/brick-box.module').then(mod=>mod.BrickBoxModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
